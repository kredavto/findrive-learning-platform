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
  assert.doesNotMatch(page, /Действовать наугад — порядок и контекст не имеют значения/i);
  assert.doesNotMatch(page, /Сразу дать обещание клиенту без проверки и согласования/i);
  const contextualLearningDistractors = [...page.matchAll(/^\s+"(?!demo-)[^"]+": \[\["[^"]+", "([^"]+)"\], \["[^"]+", "([^"]+)"\]\]/gm)];
  assert.equal(contextualLearningDistractors.length, 41);
  assert.equal(new Set(contextualLearningDistractors.flatMap((match) => [match[1], match[2]])).size, 82);
  assert.match(page, /если стоимость залога выше суммы займа/i);
  assert.match(page, /Какой продукт вас заинтересовал\?/i);
  assert.match(page, /Ответы на возражения/i);
  assert.match(page, /Юридические лица/i);
  assert.match(page, /accept="video\/mp4,.mp4"/i);
  assert.match(page, /Текст урока уже доступен ниже/i);
  assert.doesNotMatch(page, /Текст урока пока закрыт/i);
  assert.doesNotMatch(page, /watchedLessons|videoWatched/i);
  assert.match(page, /Регистрация амбассадора/i);
  assert.match(page, /Компания планирует ежегодно удваивать масштабы своего бизнеса/i);
  assert.match(page, /Амбассадор должен иметь четкое представление о планах развития компании/i);
  assert.match(page, /минимальная сумма привлечения в размере 1 млн ₽, максимальная сумма не ограничена/i);
  assert.match(page, /Кто же такой амбассадор и в чём заключается его основная функция/i);
  assert.match(page, /предсказуемее резких рывков/i);
  assert.match(page, /Ежемесячный доход такого амбассадора \(до вычета налогов\) составляет не менее 500 000 руб/i);
  assert.match(page, /Расчёт вознаграждения по устной договорённости без сверки лида и документов/i);
  assert.match(page, /Ограничиться демонстрацией должности и пропустить учебный курс/i);
  const contextualDemoDistractors = [...page.matchAll(/"demo-[^"]+-q": \[\["[^"]+", "([^"]+)"\], \["[^"]+", "([^"]+)"\]\]/g)];
  assert.equal(contextualDemoDistractors.length, 12);
  assert.equal(new Set(contextualDemoDistractors.flatMap((match) => [match[1], match[2]])).size, 24);
  assert.match(page, /const orderedOptions = shuffleDemoOptions\(id, expandedOptions, correct\)/);
  assert.match(page, /if \(shuffled\[0\]\?\.\[0\] === correct\)/);
  assert.match(page, /Средний чек займа на одного Заемщика, рассчитанный статистическим путем/i);
  assert.match(page, /Добро пожаловать в Академию «ФИНДРАЙВ»!/i);
  assert.doesNotMatch(page, /Добро пожаловать в Академию ООО МКК «ФИНДРАЙВ»!/i);
  assert.match(page, /ООО МКК «ФИНДРАЙВ» — это микрокредитная компания, работающая на рынке займов под залог автомобилей/i);
  assert.match(page, /Наши клиенты — это физические лица, индивидуальные предприниматели и юридические лица/i);
  assert.match(page, /Фактически такие клиенты готовы кредитоваться по ломбардной схеме, оставляя в залог свой автомобиль/i);
  assert.match(page, /кассовых разрывов\."[\s\S]*"Наш целевой сегмент клиентов — это граждане и юридические лица/i);
  assert.match(page, /например, у них уже итак много действующих кредитов/i);
  assert.doesNotMatch(page, /например, у них уже и так много действующих кредитов/i);
  assert.match(page, /courseAdditionalParagraphs\[currentLesson\.id\][\s\S]*course-additional-paragraph/i);
  assert.doesNotMatch(page, /ФИНДРАЙВ — микрокредитная компания, работающая с займами под залог автомобилей/i);
  assert.match(page, /currentLesson\.id === "company-model"[\s\S]*?course-welcome-intro[\s\S]*?course-welcome-copy/i);
  assert.match(styles, /course-welcome-intro>span\{display:block\}/i);
  assert.match(styles, /lesson-reading>\.lesson-intro:not\(\.welcome-line\),\.lesson-reading \.green-callout p,\.lesson-reading \.lesson-points li span,[^{]+\{text-align:justify;text-justify:inter-word;hyphens:auto\}/i);
  assert.match(page, /готовы ли они заключить договор займа непосредственно с учредителем МКК/i);
  assert.match(page, /Сервис регистрации вернул некорректный ответ/i);
  assert.match(page, /readApiJson<\{ verificationRequired\?: boolean; email\?: string; error\?: string \}>/i);
  assert.match(page, /if \(!response\.ok\) throw new Error\(data\.error \|\| "Не удалось завершить регистрацию\."\);[\s\S]*if \(data\.verificationRequired/i);
  assert.match(page, /Подтверди почту/i);
  assert.match(page, /Отправить письмо повторно/i);
  assert.match(page, /Я подтвердил почту/i);
  assert.match(page, /Добрый день, \{firstName\}/i);
  assert.match(page, /lesson\("demo-welcome", "Привет!"/i);
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
  assert.match(page, /История компании ООО МКК «ФИНДРАЙВ» берёт начало в 2021 году с небольшого стартапа/i);
  assert.match(page, /Историю компании рассказываем потенциальным инвесторам через проверяемые факты: статус, специализацию, продукт и этапы развития/i);
  assert.match(page, /Миссия ФИНДРАЙВ — помогать клиентам решать задачу получения быстрого финансирования под залог автомобиля/i);
  assert.match(page, /Цель компании — максимально масштабировать качественный портфель займов без потери контроля над рисками и клиентским сервисом/i);
  assert.match(page, /Мы строим масштабируемый бизнес и стремимся выйти на миллиардные обороты в ближайшие годы, поэтому для нас важно иметь партнеров-профессионалов в привлечении инвестиций/i);
  assert.match(page, /По данным финансовой отчётности компании на 01\.07\.2026 портфель займов составляет 27,5 млн ₽ и вырос на 66% за 18 месяцев/i);
  assert.match(page, /В портфеле компании 87 активных договоров, 79 уникальных клиентов, активы компании 31,6 млн ₽, чистая прибыль 1,48 млн ₽/i);
  assert.match(page, /собственной IT-платформой, передовыми инструментами верификации клиентских заявок/i);
  assert.match(page, /lesson\("demo-forward", "Вперед!"/i);
  assert.match(page, /demo-forward-q/i);
  assert.match(worker, /"demo-rewards", "demo-forward"/i);
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
  assert.match(worker, /Сначала заверши демонстрацию должности/i);
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
  assert.match(page, /Пройди небольшую демонстрацию должности, которая поможет тебе увидеть работу амбассадора от первого знакомства с компанией до выплаты вознаграждения\./i);
  assert.doesNotMatch(page, /от знакомства с компанией до отчётности и выплаты вознаграждения/i);
  assert.match(page, /Демонстрация должности<span className="position-name">&quot;Амбассадор&quot; \/ Партнер по привлечению инвестиций<\/span>/i);
  assert.match(styles, /demo-heading \.position-name\{display:block/i);
  assert.match(page, /Познакомься с компанией, функционалом позиции амбассадор и его ролью\. После этого тебе откроется короткий курс обучения по привлечению инвестиций\./i);
  assert.match(page, /курс амбассадора → заключение Агентского договора → получение презентаций и шаблонов договоров для переговоров с потенциальными клиентами/i);
  assert.match(page, /Изучи демонстрацию должности, краткую информацию о компании и роли амбассадора/i);
  assert.match(page, /затем пройди небольшое обучение особенностям привлечения инвестиций в микрокредитную компанию/i);
  assert.match(page, /Пройденный материал позволит тебе максимально эффективно вести переговоры с потенциальными инвесторами/i);
  assert.match(page, /С какими сложностями вы сталкиваетесь при финансировании роста\?/i);
  assert.doesNotMatch(page, /Сначала поймите результат должности и рабочий маршрут/i);
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
  assert.match(styles, /sidebar \.brand-logo\{width:232px/i);
  assert.match(styles, /lesson-nav button:disabled\{color:#978e80;opacity:1\}/i);
  assert.match(page, /lesson-progress-track/i);
  assert.match(page, /persistLearningProgress\("demo", currentLesson\.id, 25\)/i);
  assert.match(page, /persistLearningProgress\("lesson", currentLesson\.id, 25\)/i);
  assert.match(page, /answerProgress.*90.*70/s);
  assert.match(styles, /lesson-progress-track\{[^}]*margin-right:1cm/i);
  assert.match(styles, /Enlarged FINDRIVE Academy brand/i);
  assert.match(styles, /sidebar \.brand-logo\{width:220px/i);
  assert.match(styles, /sidebar \.brand-academy\{font-size:14px/i);
  assert.match(styles, /Readable payout process labels/i);
  assert.match(styles, /\.process-steps p\{color:#fff\}/i);
  assert.match(page, /const knowledgeMaterials = \[/i);
  assert.match(page, /Презентация ФИНДРАЙВ — desktop/i);
  assert.match(page, /Презентация ФИНДРАЙВ — mobile/i);
  assert.match(page, /Агентский договор ФИНДРАЙВ — амбассадор/i);
  assert.match(page, /Договор займа с учредителем МКК/i);
  assert.match(page, /Договор займа с ООО МКК «ФИНДРАЙВ»/i);
  assert.match(page, /findrive-founder-loan-agreement-template\.docx/i);
  assert.match(page, /findrive-loan-agreement-10m-template\.docx/i);
  assert.match(page, /Если инвестором выступает частное лицо, с ним может заключить Договор займа только учредитель МКК как физическое лицо/i);
  assert.match(page, /Если инвестор дал положительный ответ, только после этого амбассадор может направить в МКК информацию о готовящейся сделке/i);
  assert.match(page, /Презентации и договоры/i);
  assert.match(styles, /FINDRIVE presentation palette/i);
  assert.match(styles, /\.zone>div\{[^}]*font-size:12px/i);
  assert.match(styles, /\.zone h2\{font-size:18px/i);
  assert.match(styles, /\.zone ul\{[^}]*font-size:13px;line-height:1\.45/i);
  assert.match(styles, /Soft compliance zone highlights/i);
  assert.match(styles, /\.zone\.green\{background:linear-gradient\(135deg,rgba\(188,230,199,\.23\),rgba\(151,205,168,\.1\)\),#101511/i);
  assert.match(styles, /\.zone\.yellow\{background:linear-gradient\(135deg,rgba\(255,226,143,\.23\),rgba\(243,199,77,\.1\)\),#17140d/i);
  assert.match(styles, /@media\(max-width:480px\)/i);
  assert.doesNotMatch(page, /Your site is taking shape/i);
  assert.doesNotMatch(page, /эскал|экал/i);

  assert.match(await readFile(new URL("../next.config.ts", import.meta.url), "utf8"), /findrive-academy\.kredavto\.chatgpt\.site/i);

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
