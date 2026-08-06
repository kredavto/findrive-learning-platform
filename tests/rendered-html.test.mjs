import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import test from "node:test";

test("contains the FINDRIVE Academy learning experience", async () => {
  const [page, layout, styles, worker, schema] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../worker/index.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /ФИНДРАЙВ Академия/i);
  assert.match(page, /Лестница Ханта/i);
  assert.match(page, /СПИН/i);
  assert.match(page, /Ситуационные вопросы/i);
  assert.match(page, /Проблемные вопросы/i);
  assert.match(page, /Извлекающие вопросы/i);
  assert.match(page, /Направляющие вопросы/i);
  assert.match(page, /guess.*Действовать наугад/s);
  assert.match(page, /promise.*Сразу дать обещание/s);
  assert.match(page, /Ответы на возражения/i);
  assert.match(page, /Юридические лица/i);
  assert.match(page, /accept="video\/mp4,.mp4"/i);
  assert.match(page, /Текст урока уже доступен ниже/i);
  assert.doesNotMatch(page, /Текст урока пока закрыт/i);
  assert.doesNotMatch(page, /watchedLessons|videoWatched/i);
  assert.match(page, /Регистрация амбассадора/i);
  assert.match(page, /Подтвердите почту/i);
  assert.match(page, /Отправить письмо повторно/i);
  assert.match(page, /Я подтвердил почту/i);
  assert.match(page, /Добрый день, \{firstName\}/i);
  assert.match(page, /"Приветствие"/i);
  assert.match(page, /Демонстрация должности/i);
  for (const topic of [
    "Кто мы — история компании",
    "Миссия и цель компании",
    "Финансовые показатели",
    "Планы развития",
    "Целевые и нецелевые клиенты",
    "Продукты",
    "Средний чек и условия займов",
    "Амбассадор и его роль",
    "Система мотивации амбассадоров",
    "Планы продаж",
    "Отчёты амбассадора",
    "Выплата вознаграждений",
  ]) assert.match(page, new RegExp(topic, "i"));
  assert.match(page, /Завершить и перейти к курсу/i);
  assert.doesNotMatch(page, /Добрый день, Алексей|Алексей Воронов/i);
  assert.match(worker, /oai-authenticated-user-id/i);
  assert.match(worker, /\/api\/profile/i);
  assert.match(worker, /\/api\/verify-email/i);
  assert.match(worker, /\/api\/resend-verification/i);
  assert.match(worker, /Почта успешно подтверждена/i);
  assert.match(worker, /email_verification_token_hash/i);
  assert.match(worker, /\/api\/progress/i);
  assert.match(worker, /\/api\/dashboard/i);
  assert.match(worker, /\/api\/video-card/i);
  assert.match(worker, /Новый пользователь зарегистрировался на курс обучения амбассадоров/i);
  assert.match(worker, /Новый амбассадор успешно прошел курс обучения/i);
  assert.match(worker, /findrive78@yandex\.ru/i);
  assert.match(schema, /registrationCompleted/i);
  assert.match(schema, /emailVerificationTokenHash/i);
  assert.match(schema, /emailVerifiedAt/i);
  assert.match(schema, /lessonProgress/i);
  assert.match(schema, /demoProgress/i);
  assert.match(worker, /demo_progress/i);
  assert.match(worker, /Сначала завершите демонстрацию должности/i);
  assert.match(schema, /videoSubmissions/i);
  assert.match(page, /Видеовизитка/i);
  assert.match(page, /Дашборд обучения/i);
  assert.match(page, /Полезные материалы для работы с клиентами/i);
  assert.match(page, /Учредительные документы компании/i);
  assert.match(page, /Карточка ООО МКК «ФИНДРАЙВ»/i);
  assert.match(page, /findrive-company-card\.docx/i);
  assert.match(page, /Следующий блок откроется только после итогового теста/i);
  assert.match(styles, /green-callout/i);
  assert.match(page, /Детализация прохождения по каждому пользователю/i);
  assert.match(page, /Прохождение каждого урока курса/i);
  assert.match(page, /Итоговый тест не пройден/i);
  assert.match(page, /firstName.*добро пожаловать в Академию ФИНДРАЙВ!/s);
  assert.match(page, /welcome-line.*welcome-description/s);
  assert.match(page, /от знакомства с компанией до выплаты вознаграждения/i);
  assert.doesNotMatch(page, /от знакомства с компанией до отчётности и выплаты вознаграждения/i);
  assert.match(page, /Демонстрация должности &quot;Амбассадор&quot;/i);
  assert.match(styles, /Per-user, per-lesson dashboard detail/i);
  assert.match(layout, /Cormorant_Garamond/i);
  assert.match(layout, /weight: "500", style: "italic"/i);
  assert.match(styles, /font-family:var\(--font-welcome\)/i);
  assert.match(styles, /welcome-line\{[^}]*font-style:italic;font-weight:500/i);
  assert.match(styles, /Refined lesson typography/i);
  assert.match(styles, /lesson-reading>\.lesson-intro:not\(\.welcome-line\).*font-size:15px/i);
  assert.match(page, /--parallax-x/i);
  assert.match(page, /requestAnimationFrame/i);
  assert.match(styles, /Mouse parallax atmosphere/i);
  assert.match(styles, /prefers-reduced-motion:reduce/i);
  assert.match(styles, /Readable locked lesson titles/i);
  assert.match(styles, /lesson-nav button:disabled\{color:#978e80;opacity:1\}/i);
  assert.match(page, /lesson-progress-track/i);
  assert.match(page, /persistLearningProgress\("demo", currentLesson\.id, 25\)/i);
  assert.match(page, /persistLearningProgress\("lesson", currentLesson\.id, 25\)/i);
  assert.match(page, /answerProgress.*90.*70/s);
  assert.match(styles, /lesson-progress-track\{[^}]*margin-right:1cm/i);
  assert.match(styles, /Enlarged FINDRIVE Academy brand/i);
  assert.match(styles, /sidebar \.brand-logo\{width:220px/i);
  assert.match(styles, /sidebar \.brand-academy\{font-size:14px/i);
  assert.match(styles, /FINDRIVE presentation palette/i);
  assert.match(styles, /@media\(max-width:480px\)/i);
  assert.doesNotMatch(page, /Your site is taking shape/i);
  assert.doesNotMatch(page, /эскал|экал/i);

  const materials = [
    "findrive-agent-agreement-template.docx",
    "findrive-loan-agreement-10m-template.docx",
    "findrive-founder-loan-agreement-template.docx",
    "findrive-presentation-desktop.pdf",
    "findrive-presentation-mobile.pdf",
    "findrive-company-card.docx",
  ];
  for (const material of materials) {
    const info = await stat(new URL(`../public/materials/${material}`, import.meta.url));
    assert.ok(info.size > 0, `${material} must not be empty`);
  }
});
