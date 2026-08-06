/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  MEDIA: R2Bucket;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

type RegistrationPayload = {
  firstName?: unknown;
  lastName?: unknown;
  phone?: unknown;
  email?: unknown;
};

type ProgressPayload = {
  kind?: unknown;
  id?: unknown;
  percent?: unknown;
};

const ADMIN_EMAIL = "kredavto@gmail.com";
const LESSON_IDS = new Set([
  "company-model", "borrower-product", "business-funding", "risk-documents",
  "role-boundaries", "target-audience", "workflow", "lead-handoff",
  "gratitude-marketing", "sales-stages", "lead-to-meeting", "meeting-to-discovery",
  "discovery-to-payment", "payment-to-renewal", "sales-principles", "objections",
  "partner-question", "sales-materials", "personal-link", "crm-statuses", "reward",
  "reporting", "green-yellow-red", "ads-consent", "legal-ip", "escalation",
]);
const DEMO_SEQUENCE = [
  "demo-welcome", "demo-company-history", "demo-mission", "demo-financials", "demo-development",
  "demo-audience", "demo-products", "demo-average-ticket", "demo-ambassador-role", "demo-motivation",
  "demo-sales-plans", "demo-reports", "demo-rewards", "demo-forward",
] as const;
const DEMO_IDS = new Set<string>(DEMO_SEQUENCE);
const BLOCK_IDS = new Set(["company", "ambassador", "sales", "tools", "compliance"]);
const TOTAL_TRACKED_STEPS = LESSON_IDS.size + BLOCK_IDS.size + 1;
const NOTIFICATION_EMAIL = "findrive78@yandex.ru";

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

const getAuth = (request: Request) => ({
  userId: request.headers.get("oai-authenticated-user-id"),
  email: request.headers.get("oai-authenticated-user-email"),
});

async function isAdmin(request: Request, env: Env): Promise<boolean> {
  const { userId, email } = getAuth(request);
  if (!userId || !email) return false;
  if (email.toLowerCase() === ADMIN_EMAIL) return true;
  const row = await env.DB.prepare("SELECT role FROM users WHERE id = ?").bind(userId).first<{ role?: string }>();
  return row?.role === "admin";
}

async function sendNotification(env: Env, userId: string, eventType: "registration" | "course_completed", text: string, questionnaireUrl?: string): Promise<void> {
  const existing = await env.DB.prepare("SELECT status FROM email_notifications WHERE user_id = ? AND event_type = ?").bind(userId, eventType).first<{ status?: string }>();
  if (existing?.status === "sent") return;
  await env.DB.prepare(`
    INSERT INTO email_notifications (user_id, event_type, recipient, status, created_at)
    VALUES (?, ?, ?, 'pending', CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, event_type) DO UPDATE SET status = 'pending', error_message = NULL
  `).bind(userId, eventType, NOTIFICATION_EMAIL).run();

  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) {
    await env.DB.prepare("UPDATE email_notifications SET status = 'configuration_required', error_message = ? WHERE user_id = ? AND event_type = ?")
      .bind("RESEND_API_KEY or EMAIL_FROM is missing", userId, eventType).run();
    return;
  }

  const html = questionnaireUrl
    ? `<p>${text}</p><p><a href="${questionnaireUrl}">Открыть анкету пользователя</a></p>`
    : `<p>${text}</p>`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
        "idempotency-key": `findrive-${eventType}-${userId}`,
      },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [NOTIFICATION_EMAIL], subject: text, html }),
    });
    const result = await response.json().catch(() => ({})) as { id?: string; message?: string };
    if (!response.ok) throw new Error(result.message || `Email provider returned ${response.status}`);
    await env.DB.prepare("UPDATE email_notifications SET status = 'sent', provider_message_id = ?, sent_at = CURRENT_TIMESTAMP WHERE user_id = ? AND event_type = ?")
      .bind(result.id || null, userId, eventType).run();
  } catch (reason) {
    await env.DB.prepare("UPDATE email_notifications SET status = 'failed', error_message = ? WHERE user_id = ? AND event_type = ?")
      .bind(reason instanceof Error ? reason.message.slice(0, 500) : "Unknown email error", userId, eventType).run();
  }
}

async function retryNotificationIfQueued(env: Env, userId: string, eventType: "registration" | "course_completed", text: string, questionnaireUrl?: string): Promise<void> {
  const existing = await env.DB.prepare("SELECT status FROM email_notifications WHERE user_id = ? AND event_type = ?").bind(userId, eventType).first<{ status?: string }>();
  if (existing && existing.status !== "sent") await sendNotification(env, userId, eventType, text, questionnaireUrl);
}

const hashVerificationToken = async (token: string) => {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

async function sendTransactionalEmail(env: Env, to: string, subject: string, html: string, idempotencyKey: string): Promise<{ sent: boolean; error?: string }> {
  if (!env.RESEND_API_KEY || !env.EMAIL_FROM) return { sent: false, error: "Почтовый сервис ещё не настроен администратором." };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json", "idempotency-key": idempotencyKey },
      body: JSON.stringify({ from: env.EMAIL_FROM, to: [to], subject, html }),
    });
    const result = await response.json().catch(() => ({})) as { message?: string };
    if (!response.ok) return { sent: false, error: result.message || `Почтовый сервис вернул ошибку ${response.status}.` };
    return { sent: true };
  } catch (reason) {
    return { sent: false, error: reason instanceof Error ? reason.message : "Не удалось связаться с почтовым сервисом." };
  }
}

async function issueEmailVerification(env: Env, userId: string, contactEmail: string, origin: string): Promise<{ sent: boolean; error?: string }> {
  const token = Array.from(crypto.getRandomValues(new Uint8Array(32))).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  const tokenHash = await hashVerificationToken(token);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await env.DB.prepare(`UPDATE users SET email_verified = 0, email_verified_at = NULL,
    email_verification_token_hash = ?, email_verification_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`)
    .bind(tokenHash, expiresAt, userId).run();
  const verificationUrl = `${origin}/api/verify-email?token=${token}`;
  const html = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;color:#1b2430"><h1 style="color:#111">Подтвердите адрес электронной почты</h1><p>Вы указали этот адрес при регистрации в Академии ФИНДРАЙВ.</p><p><a href="${verificationUrl}" style="display:inline-block;background:#111;color:#f0c75e;text-decoration:none;padding:13px 20px;border-radius:8px;font-weight:700">Подтвердить адрес</a></p><p style="color:#68778a;font-size:13px">Ссылка действует 24 часа и может быть использована только один раз. Если вы не регистрировались, просто проигнорируйте письмо.</p></div>`;
  return sendTransactionalEmail(env, contactEmail, "Подтвердите адрес электронной почты — ФИНДРАЙВ Академия", html, `findrive-verify-${userId}-${tokenHash.slice(0, 16)}`);
}

const verificationPage = (success: boolean, title: string, message: string) => new Response(`<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title></head><body style="margin:0;background:#050505;color:#fff;font-family:Arial,sans-serif;min-height:100vh;display:grid;place-items:center;padding:20px"><main style="max-width:560px;text-align:center;background:#15130f;border:1px solid #5c4722;border-radius:18px;padding:38px"><div style="font-size:38px;color:${success ? "#70d895" : "#ff9aa1"}">${success ? "✓" : "!"}</div><h1 style="color:#f3d47e">${title}</h1><p style="color:#bdb3a2;line-height:1.6">${message}</p><a href="/" style="display:inline-block;background:linear-gradient(135deg,#f0d16f,#b97b24);color:#090704;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700;margin-top:8px">Вернуться в Академию</a></main></body></html>`, { status: success ? 200 : 400, headers: { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" } });

async function handleEmailVerification(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  if (request.method !== "GET") return json({ error: "Метод не поддерживается." }, 405);
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!/^[a-f0-9]{64}$/.test(token)) return verificationPage(false, "Ссылка недействительна", "Запросите новое письмо на странице регистрации.");
  const tokenHash = await hashVerificationToken(token);
  const user = await env.DB.prepare(`SELECT id, contact_email AS contactEmail, email_verification_expires_at AS expiresAt
    FROM users WHERE email_verification_token_hash = ? AND email_verified = 0`).bind(tokenHash).first<{ id: string; contactEmail: string; expiresAt?: string }>();
  if (!user || !user.expiresAt || new Date(user.expiresAt).getTime() < Date.now()) return verificationPage(false, "Срок ссылки истёк", "Вернитесь в Академию и запросите новое письмо для подтверждения адреса.");
  await env.DB.prepare(`UPDATE users SET email_verified = 1, email_verified_at = CURRENT_TIMESTAMP,
    email_verification_token_hash = NULL, email_verification_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`).bind(user.id).run();
  const confirmationHtml = `<div style="font-family:Arial,sans-serif;max-width:560px;margin:auto"><h1>Электронная почта успешно подтверждена</h1><p>Теперь вам доступна демонстрация должности и последующий курс амбассадора ФИНДРАЙВ.</p><p><a href="${new URL(request.url).origin}/">Открыть Академию</a></p></div>`;
  ctx.waitUntil(Promise.all([
    sendTransactionalEmail(env, user.contactEmail, "Почта успешно подтверждена — ФИНДРАЙВ Академия", confirmationHtml, `findrive-verified-${user.id}`),
    sendNotification(env, user.id, "registration", "Новый пользователь зарегистрировался на курс обучения амбассадоров"),
  ]));
  return verificationPage(true, "Почта подтверждена", "Адрес электронной почты успешно подтверждён. Теперь можно перейти к демонстрации должности.");
}

async function handleResendVerification(request: Request, env: Env): Promise<Response> {
  if (request.method !== "POST") return json({ error: "Метод не поддерживается." }, 405);
  const { userId } = getAuth(request);
  if (!userId) return json({ error: "Требуется вход в систему." }, 401);
  const user = await env.DB.prepare("SELECT contact_email AS contactEmail, email_verified AS emailVerified FROM users WHERE id = ? AND registration_completed = 1").bind(userId).first<{ contactEmail?: string; emailVerified?: number }>();
  if (!user?.contactEmail) return json({ error: "Сначала заполните карточку регистрации." }, 404);
  if (Number(user.emailVerified) === 1) return json({ verified: true });
  const result = await issueEmailVerification(env, userId, user.contactEmail, new URL(request.url).origin);
  if (!result.sent) return json({ error: result.error || "Не удалось отправить письмо." }, 503);
  return json({ sent: true, email: user.contactEmail });
}

async function handleProfile(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const { userId, email: authenticatedEmail } = getAuth(request);
  if (!userId || !authenticatedEmail) {
    return json({ error: "Требуется вход в систему." }, 401);
  }

  if (request.method === "GET") {
    const profile = await env.DB.prepare(`
      SELECT first_name AS firstName, last_name AS lastName, phone,
             contact_email AS email, role, registered_at AS registeredAt, email_verified AS emailVerified
      FROM users
      WHERE id = ? AND registration_completed = 1
    `).bind(userId).first();

    if (profile && Number(profile.emailVerified) !== 1) return json({ registered: false, verificationRequired: true, email: profile.email }, 409);
    if (profile && authenticatedEmail.toLowerCase() === ADMIN_EMAIL) profile.role = "admin";
    if (profile) {
      ctx.waitUntil(retryNotificationIfQueued(env, userId, "registration", "Новый пользователь зарегистрировался на курс обучения амбассадоров"));
      return json({ registered: true, profile });
    }
    return json({ registered: false, email: authenticatedEmail }, 404);
  }

  if (request.method !== "POST") {
    return json({ error: "Метод не поддерживается." }, 405);
  }

  let body: RegistrationPayload;
  try {
    body = await request.json() as RegistrationPayload;
  } catch {
    return json({ error: "Проверьте данные формы." }, 400);
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const contactEmail = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const validName = (value: string) => value.length >= 2 && value.length <= 80 && /^[\p{L}\s'-]+$/u.test(value);
  const phoneDigits = phone.replace(/\D/g, "");
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail) && contactEmail.length <= 254;

  if (!validName(firstName) || !validName(lastName)) {
    return json({ error: "Укажите имя и фамилию без цифр." }, 400);
  }
  if (phoneDigits.length < 10 || phoneDigits.length > 15 || phone.length > 24) {
    return json({ error: "Укажите корректный номер телефона." }, 400);
  }
  if (!validEmail) {
    return json({ error: "Укажите корректную электронную почту." }, 400);
  }

  const displayName = `${firstName} ${lastName}`;
  const role = authenticatedEmail.toLowerCase() === ADMIN_EMAIL ? "admin" : "ambassador";
  await env.DB.prepare(`
    INSERT INTO users (
      id, email, display_name, first_name, last_name, phone,
      contact_email, registration_completed, registered_at, email_verified, role, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, 0, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      phone = excluded.phone,
      contact_email = excluded.contact_email,
      registration_completed = 1,
      registered_at = COALESCE(users.registered_at, CURRENT_TIMESTAMP),
      email_verified = CASE WHEN users.contact_email = excluded.contact_email THEN users.email_verified ELSE 0 END,
      email_verified_at = CASE WHEN users.contact_email = excluded.contact_email THEN users.email_verified_at ELSE NULL END,
      role = excluded.role,
      updated_at = CURRENT_TIMESTAMP
  `).bind(userId, authenticatedEmail, displayName, firstName, lastName, phone, contactEmail, role).run();
  const verification = await issueEmailVerification(env, userId, contactEmail, new URL(request.url).origin);
  if (!verification.sent) return json({ verificationRequired: true, email: contactEmail, error: verification.error }, 503);
  return json({ verificationRequired: true, email: contactEmail }, 202);
}

async function handleProgress(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const { userId } = getAuth(request);
  if (!userId) return json({ error: "Требуется вход в систему." }, 401);
  const verified = await env.DB.prepare("SELECT email_verified AS emailVerified FROM users WHERE id = ? AND registration_completed = 1").bind(userId).first<{ emailVerified?: number }>();
  if (Number(verified?.emailVerified) !== 1) return json({ error: "Сначала подтвердите адрес электронной почты." }, 403);

  if (request.method === "GET") {
    const [demosResult, lessonsResult, blocksResult, video] = await Promise.all([
      env.DB.prepare("SELECT demo_id AS id, completion_percent AS percent, completed_at AS completedAt FROM demo_progress WHERE user_id = ? ORDER BY completed_at").bind(userId).all(),
      env.DB.prepare("SELECT lesson_id AS id, completion_percent AS percent, completed_at AS completedAt FROM lesson_progress WHERE user_id = ? ORDER BY completed_at").bind(userId).all(),
      env.DB.prepare("SELECT block_id AS id, completed_at AS completedAt FROM block_progress WHERE user_id = ? ORDER BY completed_at").bind(userId).all(),
      env.DB.prepare("SELECT submitted_at AS submittedAt FROM video_submissions WHERE user_id = ?").bind(userId).first(),
    ]);
    if (video) {
      const questionnaireUrl = `${new URL(request.url).origin}/?dashboard_user=${encodeURIComponent(userId)}`;
      ctx.waitUntil(retryNotificationIfQueued(env, userId, "course_completed", "Новый амбассадор успешно прошел курс обучения", questionnaireUrl));
    }
    return json({ demos: demosResult.results, lessons: lessonsResult.results, blocks: blocksResult.results, videoSubmitted: Boolean(video), video });
  }

  if (request.method !== "POST") return json({ error: "Метод не поддерживается." }, 405);
  let body: ProgressPayload;
  try {
    body = await request.json() as ProgressPayload;
  } catch {
    return json({ error: "Проверьте данные прогресса." }, 400);
  }
  const kind = body.kind === "demo" || body.kind === "lesson" || body.kind === "block" ? body.kind : "";
  const id = typeof body.id === "string" ? body.id : "";
  if (kind === "demo" && DEMO_IDS.has(id)) {
    const demoOrder = DEMO_SEQUENCE.indexOf(id as typeof DEMO_SEQUENCE[number]);
    const completedEarlier = await env.DB.prepare("SELECT COUNT(*) AS count FROM demo_progress WHERE user_id = ? AND completion_percent >= 100").bind(userId).first<{ count: number }>();
    if (Number(completedEarlier?.count || 0) < demoOrder) return json({ error: "Сначала завершите предыдущую тему демонстрации должности." }, 403);
    const percent = typeof body.percent === "number" ? Math.max(0, Math.min(100, Math.round(body.percent))) : 100;
    await env.DB.prepare(`
      INSERT INTO demo_progress (user_id, demo_id, completion_percent, completed_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, demo_id) DO UPDATE SET
        completion_percent = MAX(demo_progress.completion_percent, excluded.completion_percent),
        completed_at = CASE WHEN excluded.completion_percent >= 100 THEN CURRENT_TIMESTAMP ELSE demo_progress.completed_at END,
        updated_at = CURRENT_TIMESTAMP
    `).bind(userId, id, percent).run();
    return json({ saved: true, kind, id, percent });
  }
  if (kind === "lesson" || kind === "block") {
    const completedDemo = await env.DB.prepare("SELECT COUNT(*) AS count FROM demo_progress WHERE user_id = ? AND completion_percent >= 100").bind(userId).first<{ count: number }>();
    if (Number(completedDemo?.count || 0) < DEMO_IDS.size) return json({ error: "Сначала завершите демонстрацию должности." }, 403);
  }
  if (kind === "lesson" && LESSON_IDS.has(id)) {
    const percent = typeof body.percent === "number" ? Math.max(0, Math.min(100, Math.round(body.percent))) : 100;
    await env.DB.prepare(`
      INSERT INTO lesson_progress (user_id, lesson_id, completion_percent, completed_at, updated_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, lesson_id) DO UPDATE SET
        completion_percent = MAX(lesson_progress.completion_percent, excluded.completion_percent),
        completed_at = CASE WHEN excluded.completion_percent >= 100 THEN CURRENT_TIMESTAMP ELSE lesson_progress.completed_at END,
        updated_at = CURRENT_TIMESTAMP
    `).bind(userId, id, percent).run();
    return json({ saved: true, kind, id, percent });
  }
  if (kind === "block" && BLOCK_IDS.has(id)) {
    await env.DB.prepare(`
      INSERT INTO block_progress (user_id, block_id, completed_at)
      VALUES (?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, block_id) DO NOTHING
    `).bind(userId, id).run();
    return json({ saved: true, kind, id, percent: 100 });
  }
  return json({ error: "Неизвестный шаг курса." }, 400);
}

async function handleDashboard(request: Request, env: Env): Promise<Response> {
  if (request.method !== "GET") return json({ error: "Метод не поддерживается." }, 405);
  if (!(await isAdmin(request, env))) return json({ error: "Доступ разрешён только администратору." }, 403);

  const [usersResult, demosResult, lessonsResult, blocksResult, videosResult] = await Promise.all([
    env.DB.prepare(`SELECT id, first_name AS firstName, last_name AS lastName,
      phone, contact_email AS email, registered_at AS registeredAt, created_at AS createdAt
      FROM users WHERE registration_completed = 1 ORDER BY COALESCE(registered_at, created_at) DESC`).all(),
    env.DB.prepare("SELECT user_id AS userId, demo_id AS id, completion_percent AS percent, completed_at AS completedAt FROM demo_progress ORDER BY completed_at").all(),
    env.DB.prepare("SELECT user_id AS userId, lesson_id AS id, completion_percent AS percent, completed_at AS completedAt FROM lesson_progress ORDER BY completed_at").all(),
    env.DB.prepare("SELECT user_id AS userId, block_id AS id, completed_at AS completedAt FROM block_progress ORDER BY completed_at").all(),
    env.DB.prepare("SELECT user_id AS userId, submitted_at AS submittedAt FROM video_submissions").all(),
  ]);

  const demos = demosResult.results as Array<Record<string, unknown>>;
  const lessons = lessonsResult.results as Array<Record<string, unknown>>;
  const blocks = blocksResult.results as Array<Record<string, unknown>>;
  const videos = videosResult.results as Array<Record<string, unknown>>;
  const users = (usersResult.results as Array<Record<string, unknown>>).map((user) => {
    const userDemos = demos.filter((item) => item.userId === user.id);
    const userLessons = lessons.filter((item) => item.userId === user.id);
    const userBlocks = blocks.filter((item) => item.userId === user.id);
    const video = videos.find((item) => item.userId === user.id) || null;
    const completedSteps = userLessons.filter((item) => Number(item.percent) >= 100).length + userBlocks.length + (video ? 1 : 0);
    const completedDemoSteps = userDemos.filter((item) => Number(item.percent) >= 100).length;
    return { ...user, demos: userDemos, lessons: userLessons, blocks: userBlocks, video, demoProgressPercent: Math.round((completedDemoSteps / DEMO_IDS.size) * 100), progressPercent: Math.round((completedSteps / TOTAL_TRACKED_STEPS) * 100) };
  });
  return json({ users, totalSteps: TOTAL_TRACKED_STEPS, refreshedAt: new Date().toISOString(), emailConfigured: Boolean(env.RESEND_API_KEY && env.EMAIL_FROM) });
}

async function userStorageKey(userId: string): Promise<string> {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(userId));
  return Array.from(new Uint8Array(hash)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function handleVideoCard(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const { userId } = getAuth(request);
  if (!userId) return json({ error: "Требуется вход в систему." }, 401);
  const verified = await env.DB.prepare("SELECT email_verified AS emailVerified FROM users WHERE id = ? AND registration_completed = 1").bind(userId).first<{ emailVerified?: number }>();
  if (Number(verified?.emailVerified) !== 1) return json({ error: "Сначала подтвердите адрес электронной почты." }, 403);
  if (request.method !== "POST") return json({ error: "Метод не поддерживается." }, 405);

  const completedBlocks = await env.DB.prepare("SELECT COUNT(*) AS count FROM block_progress WHERE user_id = ?").bind(userId).first<{ count: number }>();
  if (Number(completedBlocks?.count || 0) < BLOCK_IDS.size) return json({ error: "Сначала завершите все блоки курса." }, 403);

  const form = await request.formData();
  const video = form.get("video");
  const durationSeconds = Math.round(Number(form.get("durationSeconds") || 0));
  if (!(video instanceof File) || !video.type.startsWith("video/")) return json({ error: "Выберите видеофайл." }, 400);
  if (video.size > 100 * 1024 * 1024) return json({ error: "Размер видео не должен превышать 100 МБ." }, 413);
  if (durationSeconds < 60 || durationSeconds > 130) return json({ error: "Длительность видеовизитки должна быть от 1 до 2 минут 10 секунд." }, 400);

  const previous = await env.DB.prepare("SELECT object_key AS objectKey FROM video_submissions WHERE user_id = ?").bind(userId).first<{ objectKey?: string }>();
  const extension = video.name.toLowerCase().match(/\.(mp4|mov|webm)$/)?.[1] || "mp4";
  const key = `video-cards/${await userStorageKey(userId)}/${Date.now()}.${extension}`;
  await env.MEDIA.put(key, video.stream(), { httpMetadata: { contentType: video.type }, customMetadata: { originalName: video.name } });
  await env.DB.prepare(`
    INSERT INTO video_submissions (user_id, object_key, filename, size_bytes, content_type, duration_seconds, submitted_at)
    VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id) DO UPDATE SET
      object_key = excluded.object_key,
      filename = excluded.filename,
      size_bytes = excluded.size_bytes,
      content_type = excluded.content_type,
      duration_seconds = excluded.duration_seconds,
      submitted_at = CURRENT_TIMESTAMP
  `).bind(userId, key, video.name, video.size, video.type, durationSeconds).run();
  if (previous?.objectKey && previous.objectKey !== key) await env.MEDIA.delete(previous.objectKey);
  const questionnaireUrl = `${new URL(request.url).origin}/?dashboard_user=${encodeURIComponent(userId)}`;
  ctx.waitUntil(sendNotification(env, userId, "course_completed", "Новый амбассадор успешно прошел курс обучения", questionnaireUrl));
  return json({ submitted: true, submittedAt: new Date().toISOString() }, 201);
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    if (url.pathname === "/api/profile") {
      return handleProfile(request, env, ctx);
    }

    if (url.pathname === "/api/verify-email") {
      return handleEmailVerification(request, env, ctx);
    }

    if (url.pathname === "/api/resend-verification") {
      return handleResendVerification(request, env);
    }

    if (url.pathname === "/api/progress") {
      return handleProgress(request, env, ctx);
    }

    if (url.pathname === "/api/dashboard") {
      return handleDashboard(request, env);
    }

    if (url.pathname === "/api/video-card") {
      return handleVideoCard(request, env, ctx);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
