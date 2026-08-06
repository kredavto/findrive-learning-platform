/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
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

const json = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

async function handleProfile(request: Request, env: Env): Promise<Response> {
  const userId = request.headers.get("oai-authenticated-user-id");
  const authenticatedEmail = request.headers.get("oai-authenticated-user-email");
  if (!userId || !authenticatedEmail) {
    return json({ error: "Требуется вход в систему." }, 401);
  }

  if (request.method === "GET") {
    const profile = await env.DB.prepare(`
      SELECT first_name AS firstName, last_name AS lastName, phone,
             contact_email AS email
      FROM users
      WHERE id = ? AND registration_completed = 1
    `).bind(userId).first();

    return profile
      ? json({ registered: true, profile })
      : json({ registered: false, email: authenticatedEmail }, 404);
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
  await env.DB.prepare(`
    INSERT INTO users (
      id, email, display_name, first_name, last_name, phone,
      contact_email, registration_completed, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      first_name = excluded.first_name,
      last_name = excluded.last_name,
      phone = excluded.phone,
      contact_email = excluded.contact_email,
      registration_completed = 1,
      updated_at = CURRENT_TIMESTAMP
  `).bind(userId, authenticatedEmail, displayName, firstName, lastName, phone, contactEmail).run();

  return json({ registered: true, profile: { firstName, lastName, phone, email: contactEmail } }, 201);
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
      return handleProfile(request, env);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
