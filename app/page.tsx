"use client";

import {
  AlertTriangle,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardCheck,
  Clock3,
  Copy,
  ExternalLink,
  FileCheck2,
  FileText,
  GraduationCap,
  LayoutDashboard,
  Link2,
  LockKeyhole,
  Menu,
  MessageSquareText,
  Search,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type View = "dashboard" | "course" | "scripts" | "leads" | "payouts" | "documents" | "control";

type TrainingQuestion = {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correct: string;
  explanation: string;
};

type TrainingLesson = {
  id: string;
  title: string;
  duration: string;
  intro: string;
  callout: string;
  points: string[];
  conclusion: string;
  question: TrainingQuestion;
};

type TrainingBlock = {
  id: string;
  title: string;
  description: string;
  lessons: TrainingLesson[];
  finalQuestions: TrainingQuestion[];
};

const question = (id: string, text: string, options: [string, string][], correct: string, explanation: string): TrainingQuestion => ({
  id,
  text,
  options: options.map(([optionId, optionText]) => ({ id: optionId, text: optionText })),
  correct,
  explanation,
});

const lesson = (id: string, title: string, duration: string, intro: string, callout: string, points: string[], conclusion: string, check: TrainingQuestion): TrainingLesson => ({
  id, title, duration, intro, callout, points, conclusion, question: check,
});

const learningBlocks: TrainingBlock[] = [
  {
    id: "company",
    title: "Знакомство с ФИНДРАЙВ",
    description: "Компания, продукт, бизнес-модель и ключевые риски",
    lessons: [
      lesson("company-model", "Компания и бизнес-модель", "12 мин", "ФИНДРАЙВ — микрокредитная компания, работающая с займами под залог автомобилей. Амбассадор должен объяснять модель простыми словами и опираться только на подтверждённые источники.", "Начинайте не с цифр, а с понятного ответа: кто компания, какую задачу решает и где проверить её статус.", ["Проверяйте карточку компании в реестре Банка России.", "Разделяйте продукт для заёмщика и привлечение средств в бизнес.", "Не превращайте данные презентации в обещание результата."], "Доверие начинается с проверяемых фактов, а не с убедительных формулировок.", question("company-model-q", "С чего безопаснее начать рассказ о компании?", [["rate", "С заявленной доходности"], ["facts", "Со статуса, модели работы и проверяемых источников"]], "facts", "Верно: сначала идентификация компании и подтверждённые факты.")),
      lesson("borrower-product", "Продукт для заёмщика", "14 мин", "Основной продукт — заём под залог автомобиля. Решение принимается после идентификации клиента, проверки документов и оценки автомобиля.", "Залог снижает риск, но не исключает просрочку, расходы на взыскание и изменение стоимости автомобиля.", ["Автомобиль может оставаться у заёмщика.", "Условия зависят от проверки и договора.", "Амбассадор не принимает кредитное решение."], "Говорите о процедуре, не обещая одобрение и конкретные условия до проверки.", question("borrower-product-q", "Что вправе обещать амбассадор заёмщику?", [["approval", "Гарантированное одобрение"], ["process", "Передачу заявки и объяснение процедуры"]], "process", "Верно: решение и условия определяет уполномоченный специалист.")),
      lesson("business-funding", "Привлечение средств", "16 мин", "Юридические лица могут быть целевой аудиторией для привлечения средств в бизнес МКК. Для ИП требуется отдельная проверка статуса участника или учредителя компании.", "Не смешивайте договор финансирования бизнеса с банковским вкладом или займом для клиента.", ["Целевая аудитория — юридические лица.", "ИП проверяется как физическое лицо со специальным статусом.", "Условия определяются договором и согласуются специалистом."], "Амбассадор квалифицирует интерес и передаёт контакт, но не заключает договор от имени компании.", question("business-funding-q", "Кого можно сразу отнести к целевой аудитории?", [["individual", "Любое физическое лицо"], ["legal", "Юридическое лицо"]], "legal", "Верно: юридическое лицо — допустимый целевой клиент.")),
      lesson("risk-documents", "Риски и документы", "15 мин", "Показатели презентации помогают понять модель, но требуют подтверждения актуальными документами. Любой вопрос о гарантиях, налогах или договоре передаётся специалисту.", "Формулировка «обеспечено залогом» не равна формулировке «возврат гарантирован».", ["Кредитный риск — возможное нарушение обязательств.", "Ликвидность залога ограничена сроками реализации.", "Юридические и операционные риски раскрываются честно."], "Лучший ответ на сложный вопрос — зафиксировать его и организовать разговор со специалистом.", question("risk-documents-q", "Что делать при вопросе о гарантии возврата?", [["guarantee", "Подтвердить гарантию залогом"], ["escalate", "Раскрыть отсутствие гарантии и передать специалисту"]], "escalate", "Верно: обеспечение снижает риск, но не даёт безусловной гарантии.")),
    ],
    finalQuestions: [
      question("company-final-1", "Где проверяется статус компании?", [["slides", "Только в презентации"], ["cbr", "В реестре Банка России"]], "cbr", "Статус подтверждается официальным реестром."),
      question("company-final-2", "Является ли залог гарантией возврата?", [["yes", "Да"], ["no", "Нет"]], "no", "Залог снижает, но не устраняет риск."),
      question("company-final-3", "Кто согласовывает условия договора?", [["ambassador", "Амбассадор"], ["specialist", "Уполномоченный специалист"]], "specialist", "Амбассадор не принимает договорных решений."),
    ],
  },
  {
    id: "ambassador",
    title: "Роль амбассадора",
    description: "Границы роли, аудитория, рабочий процесс и передача лида",
    lessons: [
      lesson("role-boundaries", "Задачи и границы роли", "12 мин", "Амбассадор знакомит с компанией, выявляет интерес и организует контакт с уполномоченным менеджером.", "Представляйтесь амбассадором и не создавайте впечатление, что вы принимаете решения от имени МКК.", ["Раскрывайте свою роль в первом сообщении.", "Не подписывайте и не толкуйте договоры.", "Эскалируйте юридические и финансовые вопросы."], "Чёткая граница роли защищает клиента, компанию и самого амбассадора.", question("role-boundaries-q", "Может ли амбассадор согласовать ставку?", [["yes", "Да, если клиент готов"], ["no", "Нет, вопрос передаётся специалисту"]], "no", "Верно: условия не согласуются амбассадором.")),
      lesson("target-audience", "Целевая аудитория", "10 мин", "Основная аудитория — руководители и представители юридических лиц, заинтересованные в финансировании бизнеса компании.", "До презентации определите тип клиента и полномочия собеседника.", ["Юридическое лицо — допустимая аудитория.", "ИП — только после проверки статуса участника МКК.", "Обычные физлица не являются целью кампании."], "Квалификация аудитории предшествует любому обсуждению условий.", question("target-audience-q", "Когда можно продолжить разговор с ИП?", [["always", "Всегда"], ["verified", "После подтверждения статуса участника или учредителя"]], "verified", "Верно: статус ИП нужно подтвердить до презентации.")),
      lesson("workflow", "Рабочий процесс", "14 мин", "Последовательность работы: согласие на разговор, квалификация, краткая презентация, фиксация вопроса, передача менеджеру и отражение статуса.", "Каждый шаг должен иметь понятный результат и следующий согласованный шаг.", ["Не отправляйте материалы без согласия.", "Фиксируйте источник и статус контакта.", "Не собирайте лишние персональные данные."], "Хороший процесс — это управляемый маршрут, а не серия случайных сообщений.", question("workflow-q", "Что должно быть до отправки презентации?", [["consent", "Согласие на коммуникацию"], ["payment", "Предварительная оплата"]], "consent", "Верно: сначала согласие и проверка аудитории.")),
      lesson("lead-handoff", "Передача лида", "12 мин", "Лид передаётся менеджеру после подтверждения интереса и согласия клиента на контакт.", "Передавайте только минимально необходимую информацию и зафиксированный вопрос клиента.", ["Укажите источник лида.", "Зафиксируйте согласие и удобный канал связи.", "Не добавляйте собственные обещания в комментарии."], "Качественная передача помогает менеджеру продолжить диалог без повторного допроса клиента.", question("lead-handoff-q", "Что обязательно при передаче лида?", [["consent", "Согласие клиента"], ["passport", "Копия паспорта"]], "consent", "Верно: согласие обязательно, лишние документы амбассадор не собирает.")),
    ],
    finalQuestions: [
      question("ambassador-final-1", "Как амбассадор представляет свою роль?", [["manager", "Как менеджер, принимающий решение"], ["ambassador", "Как амбассадор, организующий контакт"]], "ambassador", "Роль должна быть раскрыта точно."),
      question("ambassador-final-2", "Можно ли отправить материал без согласия?", [["yes", "Да"], ["no", "Нет"]], "no", "Сначала требуется согласие на коммуникацию."),
      question("ambassador-final-3", "Что передаётся менеджеру?", [["minimum", "Минимальные данные, интерес и вопрос клиента"], ["everything", "Все доступные сведения о клиенте"]], "minimum", "Передаются только необходимые сведения."),
    ],
  },
  {
    id: "sales",
    title: "Продажи",
    description: "Десять последовательных уроков по модели из примера",
    lessons: [
      lesson("gratitude-marketing", "Маркетинг благодарности", "18 мин", "Самая устойчивая модель продаж — та, в которой клиент проходит понятный путь и сам принимает решение.", "Не продавайте. Дайте клиенту пройти путь, где следующий шаг становится очевидным.", ["Нет долгого обучения продажам.", "Быстрый цикл коммуникации вместо ожидания.", "Минимум стресса и возражений.", "Высокая конверсия в следующий шаг."], "Маркетинг благодарности — это помощь клиенту в принятии осознанного решения.", question("gratitude-q", "Как проще всего заключить сделку?", [["classic", "Вскрыть потребность → Результат → Оплата"], ["path", "Показал → Убедил → Дожал → Оплата"]], "classic", "Верно: сначала ценность и результат, без давления и «дожима».")),
      lesson("sales-stages", "Этапы продаж", "20 мин", "Продажа состоит из последовательных переходов. Цель каждого этапа — не финальная оплата, а согласованный следующий шаг.", "Диагностируйте текущую готовность клиента по лестнице Ханта и не перепрыгивайте этапы.", ["Не видит задачи.", "Осознаёт задачу.", "Ищет подход.", "Сравнивает решения.", "Готов к действию."], "Лестница Ханта помогает выбрать уместную цель разговора.", question("sales-stages-q", "Что делать, если клиент только осознал задачу?", [["pitch", "Сразу требовать решение"], ["step", "Помочь перейти к поиску вариантов"]], "step", "Верно: один разговор — один реалистичный шаг.")),
      lesson("lead-to-meeting", "Лид → Встреча", "16 мин", "На первом контакте важно получить разрешение продолжить и понять, есть ли релевантная задача.", "Короткое сообщение с раскрытием роли работает лучше длинной презентации без запроса.", ["Представьтесь.", "Объясните причину контакта.", "Задайте один квалифицирующий вопрос.", "Согласуйте время разговора."], "Встреча назначается после подтверждённого интереса, а не вместо него.", question("lead-to-meeting-q", "Главная цель первого контакта?", [["close", "Закрыть сделку"], ["permission", "Получить согласие на следующий разговор"]], "permission", "Верно: сначала разрешение и интерес.")),
      lesson("meeting-to-discovery", "Встреча → Выяснение", "22 мин", "СПИН-продажи заменяют монолог системой вопросов: ситуационных, проблемных, извлекающих и направляющих.", "Не превращайте СПИН в допрос: задавайте только вопросы, которые помогают понять решение.", ["Ситуационные — контекст.", "Проблемные — затруднение.", "Извлекающие — последствия.", "Направляющие — ценность решения."], "Хорошая диагностика позволяет клиенту самому сформулировать значимость задачи.", question("meeting-to-discovery-q", "Какой вопрос является извлекающим?", [["people", "Сколько сотрудников в компании?"], ["impact", "Как нехватка средств влияет на сроки контрактов?"]], "impact", "Верно: извлекающий вопрос раскрывает последствия проблемы.")),
      lesson("discovery-to-payment", "Выяснение → Оплата", "18 мин", "После диагностики менеджер связывает подтверждённую задачу клиента с подходящим решением и документами.", "Амбассадор не закрывает оплату — он передаёт квалифицированный запрос специалисту.", ["Кратко резюмируйте задачу.", "Проверьте понимание клиента.", "Предложите разговор с менеджером.", "Зафиксируйте следующий шаг."], "Переход к договору возможен только после проверки и согласования условий.", question("discovery-to-payment-q", "Кто согласовывает переход к договору?", [["ambassador", "Амбассадор"], ["manager", "Уполномоченный менеджер"]], "manager", "Верно: договорный этап ведёт специалист.")),
      lesson("payment-to-renewal", "Оплата → Пролонгация", "14 мин", "После сделки важно сохранить качество сопровождения: не пропадать, фиксировать вопросы и вовремя передавать их ответственному.", "Лояльность появляется из предсказуемого сервиса, а не из частоты рекламных сообщений.", ["Подтвердите завершение этапа.", "Сообщите канал поддержки.", "Не обещайте будущие условия.", "Возвращайтесь к контакту только по согласованному поводу."], "Пролонгация — результат хорошего опыта, а не давления после оплаты.", question("payment-to-renewal-q", "Что поддерживает лояльность после сделки?", [["spam", "Частые предложения"], ["service", "Предсказуемое сопровождение"]], "service", "Верно: ценность создаёт сервис и соблюдение договорённостей.")),
      lesson("sales-principles", "Важные принципы", "12 мин", "Этичные продажи основаны на ясности, добровольности решения и подтверждённых фактах.", "Ни одна конверсия не оправдывает скрытие риска или давление.", ["Слушайте больше, чем говорите.", "Отделяйте факт от предположения.", "Уважайте отказ.", "Фиксируйте согласованный следующий шаг."], "Доверие — главный актив амбассадора.", question("sales-principles-q", "Что важнее краткосрочной конверсии?", [["trust", "Доверие и добровольность решения"], ["urgency", "Искусственная срочность"]], "trust", "Верно: долгосрочное доверие важнее давления.")),
      lesson("objections", "Ответы на возражения", "20 мин", "Возражение — запрос на ясность. Техника: выслушать, признать, уточнить, ответить фактом и проверить понимание.", "Не спорьте и не обесценивайте сомнение клиента.", ["Отделите причину от отговорки.", "Уточните, что именно вызывает сомнение.", "Ответьте подтверждённым фактом.", "Передайте сложный вопрос специалисту."], "Работа с возражением заканчивается проверкой: стало ли понятнее и нужен ли следующий шаг.", question("objections-q", "Как безопасно отвечать на возражение?", [["argue", "Доказывать, что клиент неправ"], ["clarify", "Признать вопрос, уточнить и ответить фактом"]], "clarify", "Верно: сначала понимание, затем подтверждённый ответ.")),
      lesson("partner-question", "Вопрос Партнёра", "14 мин", "Партнёр может задавать вопросы о доходности, договоре, налогах, обеспечении и сроках. Амбассадор фиксирует вопрос и определяет маршрут ответа.", "Не импровизируйте там, где требуется документ или профессиональная консультация.", ["Факт из утверждённого материала — можно сообщить со ссылкой.", "Условие договора — передать менеджеру.", "Налоговый вопрос — передать профильному специалисту.", "Гарантия результата — остановиться и раскрыть риск."], "Сильный ответ может звучать как честное «уточню и вернусь с подтверждением».", question("partner-question-q", "Что делать с налоговым вопросом партнёра?", [["guess", "Ответить по опыту"], ["expert", "Передать профильному специалисту"]], "expert", "Верно: налоговые вопросы требуют профильного ответа.")),
      lesson("sales-materials", "Доп. материалы", "10 мин", "Перед использованием проверьте статус презентации, скрипта и документа в реестре источников.", "Устаревший материал нельзя отправлять, даже если он выглядит убедительно.", ["Проверьте дату и версию.", "Используйте только утверждённый файл.", "Не редактируйте условия самостоятельно.", "Сохраняйте ссылку на источник."], "Актуальность материала — часть качества и безопасности коммуникации.", question("sales-materials-q", "Можно ли использовать старую презентацию?", [["yes", "Да, если цифры привлекательны"], ["approved", "Только если версия подтверждена как актуальная"]], "approved", "Верно: используется только актуальная утверждённая версия.")),
    ],
    finalQuestions: [
      question("sales-final-1", "На каком этапе уместны извлекающие вопросы СПИН?", [["diagnosis", "При выяснении последствий проблемы"], ["payment", "После оплаты"]], "diagnosis", "Извлекающие вопросы относятся к диагностике."),
      question("sales-final-2", "Первый шаг работы с возражением?", [["listen", "Выслушать"], ["discount", "Предложить скидку"]], "listen", "Сначала нужно понять клиента."),
      question("sales-final-3", "Что завершает каждый этап продажи?", [["next", "Согласованный следующий шаг"], ["pressure", "Усиление давления"]], "next", "Этап завершается понятной договорённостью."),
    ],
  },
  {
    id: "tools",
    title: "Инструменты и мотивация",
    description: "Ссылки, лиды, статусы и расчёт вознаграждения",
    lessons: [
      lesson("personal-link", "Персональная ссылка", "10 мин", "Персональная ссылка связывает обращение с амбассадором и помогает корректно атрибутировать результат.", "Отправляйте ссылку только после согласия и только подходящей аудитории.", ["Не изменяйте код ссылки.", "Не публикуйте её в массовых рассылках.", "Фиксируйте канал и дату отправки."], "Точная атрибуция начинается с корректного использования ссылки.", question("personal-link-q", "Когда отправляется персональная ссылка?", [["mass", "В массовой рассылке"], ["consent", "После согласия целевого клиента"]], "consent", "Верно: ссылка отправляется адресно и с согласия.")),
      lesson("crm-statuses", "CRM и статусы", "14 мин", "Статусы отражают движение лида без раскрытия лишних данных: новый, квалифицирован, передан, на проверке, завершён или дубль.", "Статус — это факт процесса, а не оценка клиента.", ["Обновляйте статус после события.", "Не храните чувствительные документы.", "Дубли не учитываются повторно."], "Чистые статусы дают честную аналитику и справедливую атрибуцию.", question("crm-statuses-q", "Что фиксирует статус лида?", [["process", "Факт этапа процесса"], ["opinion", "Личное мнение амбассадора"]], "process", "Верно: статус отражает событие процесса.")),
      lesson("reward", "Вознаграждение", "15 мин", "Предварительный расчёт помогает ориентироваться, но обязательство к выплате возникает только после подтверждения условий программы.", "Не обещайте себе или клиенту выплату до проверки атрибуции и результата.", ["Проверяется источник лида.", "Исключаются дубли.", "Подтверждается целевое действие.", "Фиксируется итоговая сумма и дата."], "Прозрачный расчёт строится на событиях, а не на ожиданиях.", question("reward-q", "Когда сумма становится подтверждённой?", [["lead", "После создания лида"], ["verified", "После проверки условий программы"]], "verified", "Верно: предварительная сумма не равна подтверждённой.")),
      lesson("reporting", "Отчётность", "10 мин", "Амбассадор видит только необходимые ему данные: источник, статус, ответственного и состояние расчёта.", "Доступ к данным ограничивается ролью и задачей пользователя.", ["Не выгружайте клиентские данные без необходимости.", "Используйте системные отчёты.", "Сообщайте об ошибках атрибуции через поддержку."], "Минимизация данных снижает риск и упрощает работу.", question("reporting-q", "Какие данные нужны амбассадору?", [["all", "Все документы клиента"], ["minimum", "Только необходимые статусы и расчёты"]], "minimum", "Верно: доступ ограничивается необходимым минимумом.")),
    ],
    finalQuestions: [
      question("tools-final-1", "Что обязательно перед отправкой ссылки?", [["consent", "Согласие клиента"], ["public", "Публичная публикация"]], "consent", "Ссылка отправляется после согласия."),
      question("tools-final-2", "Является ли предварительный расчёт обещанием выплаты?", [["yes", "Да"], ["no", "Нет"]], "no", "Он требует проверки и подтверждения."),
      question("tools-final-3", "Какой принцип применяется к данным?", [["minimum", "Необходимый минимум"], ["maximum", "Собирать всё доступное"]], "minimum", "Собираются только нужные данные."),
    ],
  },
  {
    id: "compliance",
    title: "Комплаенс и допуск",
    description: "Допустимые формулировки, согласия и итоговая аттестация",
    lessons: [
      lesson("green-yellow-red", "Можно / нельзя", "15 мин", "Матрица коммуникации делит формулировки на зелёную, жёлтую и красную зоны.", "Красная зона означает остановку диалога и передачу вопроса специалисту.", ["Зелёная: подтверждённые факты и описание роли.", "Жёлтая: цифры и условия только по утверждённому материалу.", "Красная: гарантии, давление и скрытие рисков."], "Перед отправкой сообщения определите его зону.", question("zones-q", "К какой зоне относится гарантия дохода?", [["green", "Зелёная"], ["red", "Красная"]], "red", "Верно: обещание дохода недопустимо.")),
      lesson("ads-consent", "Реклама и согласия", "12 мин", "Рекламная коммуникация начинается после согласия адресата и прекращается после отказа.", "Отказ не нужно преодолевать — его нужно уважать и фиксировать.", ["Не используйте массовый спам.", "Храните подтверждение согласия.", "После отказа не продолжайте рекламный контакт."], "Добровольность контакта — обязательное условие коммуникации.", question("ads-consent-q", "Что делать после отказа?", [["retry", "Продолжить убеждать"], ["stop", "Прекратить рекламную коммуникацию"]], "stop", "Верно: отказ завершает рекламный диалог.")),
      lesson("legal-ip", "Юрлица и ИП", "14 мин", "Юридические лица — целевая аудитория. ИП рассматривается только после подтверждения его статуса учредителя или участника МКК.", "Организационная форма клиента проверяется до обсуждения продукта.", ["Юрлицо — допустимый маршрут.", "ИП — маршрут после проверки статуса.", "Физлицо без статуса — нецелевая аудитория."], "Правильная классификация клиента открывает правильный сценарий работы.", question("legal-ip-q", "Можно ли работать с ИП без проверки статуса?", [["yes", "Да"], ["no", "Нет"]], "no", "Верно: сначала подтверждается специальный статус.")),
      lesson("escalation", "Эскалация вопросов", "10 мин", "Сложные вопросы не остаются без ответа: они фиксируются, получают ответственного и срок возврата к клиенту.", "Эскалация — профессиональный инструмент, а не признак слабости.", ["Запишите вопрос дословно.", "Определите профиль специалиста.", "Сообщите клиенту следующий шаг.", "Вернитесь с подтверждённым ответом."], "Надёжность проявляется в качестве возврата с ответом.", question("escalation-q", "Что сообщить клиенту при эскалации?", [["nothing", "Ничего"], ["next", "Кому передан вопрос и когда вернётесь"]], "next", "Верно: клиенту нужен прозрачный следующий шаг.")),
    ],
    finalQuestions: [
      question("compliance-final-1", "Что делать с обещанием гарантированного дохода?", [["publish", "Использовать в презентации"], ["stop", "Остановить и заменить подтверждённой формулировкой"]], "stop", "Гарантии относятся к красной зоне."),
      question("compliance-final-2", "Что означает отказ клиента?", [["finish", "Коммуникация прекращается"], ["objection", "Нужно усилить давление"]], "finish", "Отказ необходимо уважать."),
      question("compliance-final-3", "Кому адресуется кампания?", [["legal", "Юридическим лицам"], ["everyone", "Всем физическим лицам"]], "legal", "Целевая аудитория — юридические лица."),
    ],
  },
];

const scripts = [
  {
    title: "Первое сообщение знакомому контакту",
    tag: "Первичный контакт",
    goal: "Получить явное согласие продолжить разговор — без давления и массовой рассылки.",
    safe: "Здравствуйте! Я сотрудничаю с ООО МКК «ФИНДРАЙВ» как амбассадор. Могу кратко рассказать о компании и, если тема вам актуальна, связать с уполномоченным менеджером. Удобно обсудить?",
    unsafe: "Есть гарантированные 24% без риска. Нужно успеть сегодня.",
    next: "Продолжать только после явного согласия. При вопросах об условиях — передать менеджеру.",
  },
  {
    title: "Ответ на вопрос о доходности",
    tag: "Инвестиции",
    goal: "Не превратить показатель из презентации в обещание будущего дохода.",
    safe: "В материалах компании указан показатель 24% годовых, но он требует подтверждения условий договора и юридического согласования. Это не банковский вклад и не гарантия дохода. Я передам вопрос специалисту.",
    unsafe: "Компания точно выплатит 24%, доход гарантирован залогом.",
    next: "Остановить презентацию и передать контакт менеджеру после согласия клиента.",
  },
  {
    title: "Корректный ответ на отказ",
    tag: "Этика",
    goal: "Зафиксировать отказ и прекратить рекламную коммуникацию.",
    safe: "Спасибо, понял. Больше не буду обращаться к вам с этим предложением. Хорошего дня.",
    unsafe: "Вы просто не разобрались — давайте я ещё раз всё объясню.",
    next: "Зафиксировать отказ. Повторный контакт без нового запроса клиента запрещён.",
  },
  {
    title: "Запрос о гарантиях",
    tag: "Риски",
    goal: "Честно отделить обеспечение от гарантии возврата.",
    safe: "Залог снижает риск, но сам по себе не исключает просрочку, падение стоимости имущества, расходы на взыскание и другие риски. Гарантии можно обсуждать только по утверждённым документам.",
    unsafe: "100% залоговое покрытие полностью исключает невозврат.",
    next: "Не интерпретировать договор. Эскалировать менеджеру или юристу.",
  },
];

const sources = [
  { fact: "ООО МКК «ФИНДРАЙВ» действует в реестре МФО; запись 2203140009792", source: "Банк России", url: "https://www.cbr.ru/finorg/foinfo/?ogrn=1217800146024", status: "confirmed" },
  { fact: "Займ под залог автомобиля: 50 000–500 000 ₽; ПСК 66–102%", source: "Официальный сайт", url: "https://findrive78.ru/", status: "confirmed" },
  { fact: "МКК не вправе привлекать деньги физлиц и ИП, если они не являются её учредителями", source: "151-ФЗ, ст. 12 ч. 3", url: "https://www.consultant.ru/document/cons_doc_LAW_102112/0737ab7747fb785b896dc6c0ca20a9d2731aae7a/", status: "conflict" },
  { fact: "24% годовых, срок 36 месяцев, заявленный объём 5–30 млн ₽", source: "FINDRIVE_desktop.pdf, слайды 6 и 12", url: "#questions", status: "review" },
  { fact: "Портфель 27,5 млн ₽; рост 66% за 18 месяцев на 01.07.2026", source: "FINDRIVE_desktop.pdf, слайд 3", url: "#questions", status: "review" },
  { fact: "87 договоров, 79 клиентов; активы 31,6 млн ₽; прибыль 1,48 млн ₽", source: "FINDRIVE_desktop.pdf, слайды 4–5", url: "#questions", status: "review" },
  { fact: "«Доходность гарантирована» и одновременно «не является гарантией результата»", source: "FINDRIVE_desktop.pdf, слайд 2", url: "#questions", status: "conflict" },
  { fact: "«100% обеспечение» и «исключение невозврата займа»", source: "Внутренние материалы", url: "#questions", status: "blocked" },
];

const presentationMetrics = [
  { value: "27,5 млн ₽", label: "портфель на 01.07.2026", slide: "слайд 3" },
  { value: "+66%", label: "рост за 18 месяцев", slide: "слайд 3" },
  { value: "87 / 79", label: "договоров / клиентов", slide: "слайд 4" },
  { value: "31,6 млн ₽", label: "активы", slide: "слайд 5" },
  { value: "1,48 млн ₽", label: "чистая прибыль", slide: "слайд 5" },
  { value: "24% / 36 мес.", label: "заявленные условия", slide: "слайды 6, 12" },
];

const leadRows = [
  { id: "FD-0184", created: "02.08.2026", stage: "Квалификация менеджером", owner: "М. Кузнецова", reward: "—" },
  { id: "FD-0178", created: "28.07.2026", stage: "Сделка на проверке", owner: "А. Орлова", reward: "50 000 ₽*" },
  { id: "FD-0162", created: "19.07.2026", stage: "Дубль", owner: "Система", reward: "0 ₽" },
];

const nav = [
  { id: "dashboard" as View, label: "Главная", icon: LayoutDashboard },
  { id: "course" as View, label: "Курс", icon: GraduationCap },
  { id: "scripts" as View, label: "Скрипты", icon: MessageSquareText },
  { id: "leads" as View, label: "Лиды", icon: Users },
  { id: "payouts" as View, label: "Вознаграждения", icon: CircleDollarSign },
  { id: "documents" as View, label: "Документы", icon: FileText },
  { id: "control" as View, label: "Контроль", icon: ShieldCheck },
];

function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: string }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function ProgressRing({ value }: { value: number }) {
  return (
    <div className="progress-ring" style={{ "--progress": `${value * 3.6}deg` } as React.CSSProperties} role="progressbar" aria-label="Прогресс курса" aria-valuemin={0} aria-valuemax={100} aria-valuenow={value}>
      <div><strong>{value}%</strong><span>курса</span></div>
    </div>
  );
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState("");
  const [query, setQuery] = useState("");
  const [scriptIndex, setScriptIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  const filteredScripts = useMemo(() => scripts.filter((item) => `${item.title} ${item.tag} ${item.safe}`.toLowerCase().includes(query.toLowerCase())), [query]);

  const copyText = async (text: string, key: string) => {
    await navigator.clipboard?.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(""), 1800);
  };

  const navigate = (next: View) => {
    setView(next);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${menuOpen ? "sidebar-open" : ""}`} aria-label="Основная навигация">
        <div className="brand">
          <img className="brand-logo" src="/findrive-logo.jpg" alt="ФИНДРАЙВ — займы под залог автомобилей" />
          <span className="brand-academy">АКАДЕМИЯ</span>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Закрыть меню"><X size={20} /></button>
        </div>
        <nav>
          {nav.map((item) => {
            const Icon = item.icon;
            return <button key={item.id} className={view === item.id ? "nav-item active" : "nav-item"} onClick={() => navigate(item.id)}><Icon size={19} /><span>{item.label}</span>{item.id === "documents" && <i>2</i>}</button>;
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="access-card">
            <div className="access-icon"><LockKeyhole size={18} /></div>
            <div><span>Допуск к работе</span><strong>Юридические лица</strong></div>
          </div>
          <button className="user-card" aria-label="Открыть профиль">
            <span className="avatar">АВ</span>
            <span><strong>Алексей Воронов</strong><small>Амбассадор · демо</small></span>
            <Settings2 size={17} />
          </button>
        </div>
      </aside>

      <main>
        <header className="topbar">
          <button className="icon-button menu-button" onClick={() => setMenuOpen(true)} aria-label="Открыть меню"><Menu size={22} /></button>
          <div className="global-search"><Search size={18} /><input aria-label="Поиск по базе знаний" placeholder="Найти в базе знаний" onFocus={() => navigate("scripts")} /></div>
          <div className="top-actions"><Badge tone="demo">Демо-версия</Badge><button className="icon-button notification" aria-label="Уведомления"><Bell size={20} /><i /></button></div>
        </header>

        <div className="content">
          {view === "dashboard" && <Dashboard onNavigate={navigate} onLesson={() => navigate("course")} copied={copied} onCopy={copyText} />}
          {view === "course" && <Course />}
          {view === "scripts" && <Scripts query={query} setQuery={setQuery} filtered={filteredScripts} active={scriptIndex} setActive={setScriptIndex} copied={copied} onCopy={copyText} />}
          {view === "leads" && <Leads />}
          {view === "payouts" && <Payouts />}
          {view === "documents" && <Documents />}
          {view === "control" && <Control quizAnswer={quizAnswer} setQuizAnswer={setQuizAnswer} />}
        </div>
      </main>

    </div>
  );
}

function Dashboard({ onNavigate, onLesson, copied, onCopy }: { onNavigate: (v: View) => void; onLesson: () => void; copied: string; onCopy: (text: string, key: string) => void }) {
  const referral = "findrive78.ru/r/A-1042";
  return <>
    <section className="page-heading">
      <div><Badge tone="date">Вторник, 4 августа</Badge><h1>Добрый день, Алексей</h1><p>Продолжите обучение и проверьте обязательное обновление комплаенса.</p></div>
      <button className="secondary-button" onClick={() => onNavigate("course")}><BookOpen size={18} /> Открыть курс</button>
    </section>

    <section className="legal-alert" role="alert">
      <div className="alert-icon"><ShieldAlert size={23} /></div>
      <div><Badge tone="review">Важное правило аудитории</Badge><h2>Работаем с юридическими лицами</h2><p>Юридические лица — допустимая целевая аудитория. Для ИП нужна проверка: закон относит ИП к физлицам, поэтому привлечение средств возможно, только если ИП является учредителем или участником МКК. Обычные физлица не являются целевой аудиторией.</p><button className="text-button" onClick={() => onNavigate("documents")}>Посмотреть основание <ArrowRight size={16} /></button></div>
      <span className="alert-date">Проверено 04.08.2026</span>
    </section>

    <section className="dashboard-grid">
      <article className="card course-progress-card">
        <div className="card-kicker"><span><GraduationCap size={17} /> Основной курс</span><Badge tone="active">В процессе</Badge></div>
        <div className="course-progress-body"><ProgressRing value={18} /><div><p className="eyebrow">Следующий урок · Модуль 2</p><h2>Продукт и его риски</h2><p>Разберите различия между продуктом для заёмщика и привлечением средств в бизнес компании.</p><div className="lesson-meta"><span><Clock3 size={16} /> 35 минут</span><span><ClipboardCheck size={16} /> Тест: 8 вопросов</span></div></div></div>
        <div className="card-actions"><button className="primary-button" onClick={onLesson}>Продолжить урок <ArrowRight size={17} /></button><span>1 из 13 модулей завершён</span></div>
      </article>

      <article className="card admission-card">
        <div className="card-kicker"><span><Award size={17} /> Допуск к работе</span><Badge tone="active">Юрлица</Badge></div>
        <div className="admission-graphic"><div><ShieldCheck size={26} /></div></div>
        <h2>Маршрут разрешён</h2><p>Работайте с юридическими лицами. Перед контактом с ИП подтвердите его статус участника компании.</p>
        <button className="secondary-button wide" onClick={() => onNavigate("control")}>Проверить аудиторию</button>
      </article>

      <article className="card update-card"><div className="card-kicker"><span><Bell size={17} /> Обязательные обновления</span><Badge tone="danger">1 новое</Badge></div><div className="update-row"><span className="document-icon"><FileCheck2 size={20} /></span><div><h3>Ограничения МКК</h3><p>Версия 2.3 · Юридический отдел</p></div><ChevronRight size={18} /></div><button className="text-button" onClick={() => onNavigate("documents")}>Все обновления <ArrowRight size={15} /></button></article>

      <article className="card quick-card"><div className="card-kicker"><span><Sparkles size={17} /> Быстрый доступ</span></div><div className="quick-grid"><button onClick={() => onNavigate("scripts")}><MessageSquareText size={21} /><span>Скрипты</span></button><button onClick={() => onNavigate("control")}><ShieldCheck size={21} /><span>Можно / нельзя</span></button><button onClick={() => onNavigate("documents")}><FileText size={21} /><span>Документы</span></button><button onClick={() => onNavigate("course")}><BookOpen size={21} /><span>Глоссарий</span></button></div></article>

      <article className="card referral-card"><div className="card-kicker"><span><Link2 size={17} /> Персональная ссылка</span><Badge tone="active">Для юрлиц</Badge></div><label>Код амбассадора: A-1042</label><div className="copy-field"><span>{referral}</span><button title="Копировать ссылку" onClick={() => onCopy(referral, "ref")}>{copied === "ref" ? <Check size={17} /> : <Copy size={17} />}</button></div><p className="audience-note"><ShieldCheck size={14} /> Не передавайте физлицам; ИП — после проверки статуса участника.</p></article>

      <article className="card leads-card"><div className="card-kicker"><span><BarChart3 size={17} /> Лиды за 30 дней</span><Badge tone="demo">Демо-данные</Badge></div><div className="stat-row"><div><strong>12</strong><span>Переходы</span></div><div><strong>4</strong><span>Новые лиды</span></div><div><strong>1</strong><span>На проверке</span></div></div><div className="mini-bars"><i style={{height:"45%"}}/><i style={{height:"68%"}}/><i style={{height:"50%"}}/><i style={{height:"83%"}}/><i style={{height:"62%"}}/><i style={{height:"92%"}}/><i style={{height:"72%"}}/></div><button className="text-button" onClick={() => onNavigate("leads")}>Открыть кабинет <ArrowRight size={15} /></button></article>

      <article className="card payout-card"><div className="card-kicker"><span><CircleDollarSign size={17} /> Вознаграждения</span><Badge tone="demo">Демо-данные</Badge></div><div className="payout-values"><div><span>Предварительно</span><strong>50 000 ₽</strong></div><div><span>Подтверждено</span><strong>0 ₽</strong></div></div><div className="payout-next"><Clock3 size={17} /><span>Ближайшая дата уточнения</span><strong>6 августа</strong></div><button className="text-button" onClick={() => onNavigate("payouts")}>Подробнее о расчёте <ArrowRight size={15} /></button></article>
    </section>
  </>;
}

function Course() {
  const [blockIndex, setBlockIndex] = useState(0);
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [completedBlocks, setCompletedBlocks] = useState<string[]>([]);
  const [lessonAnswer, setLessonAnswer] = useState("");
  const [finalAnswers, setFinalAnswers] = useState<Record<string, string>>({});
  const [videoUrls, setVideoUrls] = useState<Record<string, string>>({});
  const [videoNames, setVideoNames] = useState<Record<string, string>>({});
  const [watchedLessons, setWatchedLessons] = useState<string[]>([]);
  const [videoError, setVideoError] = useState("");

  const block = learningBlocks[blockIndex];
  const isFinalTest = lessonIndex === block.lessons.length;
  const currentLesson = isFinalTest ? null : block.lessons[lessonIndex];
  const finishedInBlock = block.lessons.filter((item) => completedLessons.includes(item.id)).length;
  const allLessonsFinished = finishedInBlock === block.lessons.length;
  const currentBlockCompleted = completedBlocks.includes(block.id);
  const totalSteps = learningBlocks.reduce((sum, item) => sum + item.lessons.length + 1, 0);
  const completedSteps = completedLessons.length + completedBlocks.length;
  const overallProgress = Math.round((completedSteps / totalSteps) * 100);

  const blockUnlocked = (index: number) => index === 0 || learningBlocks.slice(0, index).every((item) => completedBlocks.includes(item.id));
  const lessonUnlocked = (index: number) => index === 0 || block.lessons.slice(0, index).every((item) => completedLessons.includes(item.id));
  const finalPassed = block.finalQuestions.every((item) => finalAnswers[item.id] === item.correct);
  const lessonCompleted = currentLesson ? completedLessons.includes(currentLesson.id) : false;
  const videoWatched = currentLesson ? watchedLessons.includes(currentLesson.id) || lessonCompleted : false;
  const lessonAnswerCorrect = currentLesson ? lessonAnswer === currentLesson.question.correct : false;
  const canContinueLesson = lessonCompleted || lessonAnswerCorrect;

  useEffect(() => {
    setLessonAnswer("");
    setVideoError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [blockIndex, lessonIndex]);

  const openBlock = (index: number) => {
    if (!blockUnlocked(index)) return;
    const selected = learningBlocks[index];
    const nextLesson = selected.lessons.findIndex((item) => !completedLessons.includes(item.id));
    setBlockIndex(index);
    setLessonIndex(nextLesson === -1 ? selected.lessons.length : nextLesson);
    setFinalAnswers({});
  };

  const openLesson = (index: number) => {
    const available = index < block.lessons.length ? lessonUnlocked(index) : allLessonsFinished;
    if (!available) return;
    setLessonIndex(index);
  };

  const uploadVideo = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentLesson) return;
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const isMp4 = file.type === "video/mp4" || file.name.toLowerCase().endsWith(".mp4");
    if (!isMp4) {
      setVideoError("Поддерживается только видео в формате MP4.");
      event.currentTarget.value = "";
      return;
    }
    const previousUrl = videoUrls[currentLesson.id];
    if (previousUrl) URL.revokeObjectURL(previousUrl);
    const nextUrl = URL.createObjectURL(file);
    setVideoUrls((current) => ({ ...current, [currentLesson.id]: nextUrl }));
    setVideoNames((current) => ({ ...current, [currentLesson.id]: file.name }));
    setWatchedLessons((current) => current.filter((id) => id !== currentLesson.id));
    setVideoError("");
  };

  const completeLesson = () => {
    if (!currentLesson || !canContinueLesson) return;
    setCompletedLessons((current) => current.includes(currentLesson.id) ? current : [...current, currentLesson.id]);
    setLessonAnswer("");
    setLessonIndex(Math.min(lessonIndex + 1, block.lessons.length));
  };

  const completeBlock = () => {
    if (!finalPassed && !currentBlockCompleted) return;
    setCompletedBlocks((current) => current.includes(block.id) ? current : [...current, block.id]);
    if (blockIndex < learningBlocks.length - 1) {
      setBlockIndex(blockIndex + 1);
      setLessonIndex(0);
      setFinalAnswers({});
    }
  };

  return <>
    <section className="page-heading learning-heading">
      <div><Badge tone="date">Программа амбассадора</Badge><h1>Последовательное обучение</h1><p>Урок → видео → текст → проверка. Следующий блок откроется только после итогового теста.</p></div>
      <div className="heading-stat"><strong>{overallProgress}%</strong><span>{completedSteps} из {totalSteps} шагов</span></div>
    </section>

    <nav className="learning-blocks" aria-label="Блоки обучения">
      {learningBlocks.map((item, index) => {
        const unlocked = blockUnlocked(index);
        const done = completedBlocks.includes(item.id);
        return <button key={item.id} className={`${index === blockIndex ? "active" : ""} ${done ? "done" : ""}`} disabled={!unlocked} onClick={() => openBlock(index)}>
          <span>{done ? <Check size={16}/> : unlocked ? index + 1 : <LockKeyhole size={14}/>}</span>
          <div><strong>{item.title}</strong><small>{done ? "Блок завершён" : unlocked ? "Доступен" : "Откроется позже"}</small></div>
        </button>;
      })}
    </nav>

    <section className="learning-workspace card">
      <aside className="lesson-sidebar">
        <div className="lesson-sidebar-head"><small>Блок {blockIndex + 1}</small><h2>{block.title}</h2><p>{block.description}</p></div>
        <div className="lesson-nav">
          {block.lessons.map((item, index) => {
            const unlocked = lessonUnlocked(index);
            const done = completedLessons.includes(item.id);
            return <button key={item.id} className={`${lessonIndex === index ? "active" : ""} ${done ? "done" : ""}`} disabled={!unlocked} onClick={() => openLesson(index)}>
              <span>{done ? <Check size={13}/> : unlocked ? index + 1 : <LockKeyhole size={12}/>}</span><strong>{item.title}</strong>
            </button>;
          })}
          <button className={`${isFinalTest ? "active" : ""} ${currentBlockCompleted ? "done" : ""}`} disabled={!allLessonsFinished} onClick={() => openLesson(block.lessons.length)}>
            <span>{currentBlockCompleted ? <Check size={13}/> : allLessonsFinished ? <ClipboardCheck size={13}/> : <LockKeyhole size={12}/>}</span><strong>Итоговый тест блока</strong>
          </button>
        </div>
        <div className="lesson-sidebar-progress"><div><span style={{width:`${Math.round((finishedInBlock / block.lessons.length) * 100)}%`}}/></div><small>Прогресс</small><strong>{finishedInBlock}/{block.lessons.length}</strong></div>
      </aside>

      <div className="lesson-stage">
        {currentLesson ? <>
          <header className="lesson-stage-head"><small>Урок {lessonIndex + 1} из {block.lessons.length}</small><h2>{currentLesson.title}</h2><span><Clock3 size={14}/>{currentLesson.duration}</span></header>

          <section className="video-learning-card" aria-label={`Видео к уроку ${currentLesson.title}`}>
            {videoUrls[currentLesson.id] ? <>
              <video key={videoUrls[currentLesson.id]} controls preload="metadata" onEnded={() => setWatchedLessons((current) => current.includes(currentLesson.id) ? current : [...current, currentLesson.id])}>
                <source src={videoUrls[currentLesson.id]} type="video/mp4" />
                Ваш браузер не поддерживает видео MP4.
              </video>
              <div className="video-meta"><div><strong>{videoNames[currentLesson.id]}</strong><small>{videoWatched ? "Видео просмотрено — текст открыт" : "Досмотрите видео до конца, чтобы открыть текст"}</small></div><label className="video-replace">Заменить MP4<input type="file" accept="video/mp4,.mp4" onChange={uploadVideo}/></label></div>
            </> : <label className="video-upload-zone">
              <span><BookOpen size={28}/></span><strong>Загрузите видео к уроку</strong><small>Одно видео в формате MP4. После просмотра откроется текстовая часть.</small><em>Выбрать MP4</em><input type="file" accept="video/mp4,.mp4" onChange={uploadVideo}/>
            </label>}
            {videoError && <p className="video-error" role="alert">{videoError}</p>}
          </section>

          {!videoWatched ? <section className="lesson-text-gate"><LockKeyhole size={24}/><div><strong>Текст урока пока закрыт</strong><p>Сначала загрузите и досмотрите короткое видео до конца.</p></div></section> : <div className="lesson-reading">
            <p className="lesson-intro">{currentLesson.intro}</p>
            <aside className="green-callout"><CheckCircle2 size={20}/><p>{currentLesson.callout}</p></aside>
            <div className="lesson-points"><h3>Ключевые пункты:</h3><ul>{currentLesson.points.map((point) => <li key={point}><Check size={15}/><span>{point}</span></li>)}</ul></div>
            <aside className="green-callout strong"><CheckCircle2 size={20}/><p>{currentLesson.conclusion}</p></aside>

            <section className="lesson-question-card">
              <h3>{currentLesson.question.text}</h3>
              <div>{currentLesson.question.options.map((option) => <button key={option.id} className={lessonAnswer === option.id ? "selected" : ""} onClick={() => setLessonAnswer(option.id)}><span>{lessonAnswer === option.id ? <Check size={13}/> : null}</span>{option.text}</button>)}</div>
              {lessonAnswer && <p className={lessonAnswerCorrect ? "answer-good" : "answer-bad"}>{lessonAnswerCorrect ? currentLesson.question.explanation : "Пока неверно. Вернитесь к ключевым пунктам и попробуйте ещё раз."}</p>}
            </section>

            <footer className="lesson-next"><button className="primary-button" disabled={!canContinueLesson} onClick={completeLesson}>{lessonIndex === block.lessons.length - 1 ? "Перейти к тесту блока" : "Следующий урок"}<ChevronRight size={17}/></button><small>{lessonIndex < block.lessons.length - 1 ? `Следующий урок: ${block.lessons[lessonIndex + 1].title}` : "После урока откроется итоговый тест блока"}</small></footer>
          </div>}
        </> : <section className="block-final-test">
          <Badge tone={currentBlockCompleted ? "active" : "review"}>{currentBlockCompleted ? "Блок завершён" : "Итоговый тест"}</Badge>
          <h2>{block.title}</h2><p>Ответьте правильно на все вопросы. Только после этого откроется следующий блок.</p>
          <div className="final-question-list">{block.finalQuestions.map((item, index) => {
            const selected = finalAnswers[item.id];
            const correct = selected === item.correct;
            return <article key={item.id}><small>Вопрос {index + 1} из {block.finalQuestions.length}</small><h3>{item.text}</h3><div>{item.options.map((option) => <button key={option.id} className={selected === option.id ? "selected" : ""} onClick={() => setFinalAnswers((current) => ({...current,[item.id]:option.id}))}><span>{selected === option.id ? <Check size={13}/> : null}</span>{option.text}</button>)}</div>{selected && <p className={correct ? "answer-good" : "answer-bad"}>{correct ? item.explanation : "Неверный ответ. Повторите уроки блока и попробуйте ещё раз."}</p>}</article>;
          })}</div>
          {currentBlockCompleted && blockIndex === learningBlocks.length - 1 ? <div className="course-complete"><Award size={28}/><div><strong>Программа завершена</strong><p>Все блоки и тесты пройдены. Доступ к итоговой аттестации открыт.</p></div></div> : <footer className="lesson-next"><button className="primary-button" disabled={!finalPassed && !currentBlockCompleted} onClick={completeBlock}>{blockIndex === learningBlocks.length - 1 ? "Завершить программу" : "Завершить блок и открыть следующий"}<ChevronRight size={17}/></button><small>Проходной результат: 100%</small></footer>}
        </section>}
      </div>
    </section>
  </>;
}

function Scripts({ query, setQuery, filtered, active, setActive, copied, onCopy }: { query: string; setQuery: (v:string)=>void; filtered: typeof scripts; active:number; setActive:(v:number)=>void; copied:string; onCopy:(t:string,k:string)=>void }) {
  const selected = filtered[active] || filtered[0];
  return <><section className="page-heading"><div><Badge tone="date">База знаний</Badge><h1>Безопасные скрипты</h1><p>Используйте формулировки только из актуальной утверждённой версии.</p></div><Badge tone="active">Целевая аудитория: юрлица</Badge></section>
    <div className="scripts-layout"><section className="card script-list"><div className="inner-search"><Search size={17}/><input value={query} onChange={e=>{setQuery(e.target.value);setActive(0)}} placeholder="Найти сценарий" aria-label="Найти сценарий"/></div>{filtered.map((s,i)=><button className={i===active?"script-item active":"script-item"} key={s.title} onClick={()=>setActive(i)}><span><strong>{s.title}</strong><small>{s.tag}</small></span><ChevronRight size={17}/></button>)}{!filtered.length && <p className="empty">Ничего не найдено</p>}</section>
    <section className="card script-detail">{selected ? <><div className="section-head"><div><Badge tone="active">Согласованный шаблон · демо</Badge><h2>{selected.title}</h2></div><button className="icon-button" onClick={()=>onCopy(selected.safe,"script")} aria-label="Копировать скрипт">{copied==="script"?<Check/>:<Copy/>}</button></div><div className="goal-box"><strong>Цель</strong><p>{selected.goal}</p></div><div className="phrase safe"><span><CheckCircle2/>Допустимая формулировка</span><p>«{selected.safe}»</p></div><div className="phrase unsafe"><span><ShieldAlert/>Запрещённая формулировка</span><p>«{selected.unsafe}»</p></div><div className="next-step"><strong>Условие перехода</strong><p>{selected.next}</p></div></>:null}</section></div></>;
}

function Leads() {
  return <><section className="page-heading"><div><Badge tone="demo">Все данные демонстрационные</Badge><h1>Кабинет лидов</h1><p>Только необходимые статусы — без лишних персональных и финансовых данных.</p></div><button className="secondary-button" disabled><LockKeyhole size={17}/> Новый лид</button></section>
  <section className="stats-strip"><div><span>Новые</span><strong>4</strong><small>за 30 дней</small></div><div><span>Квалифицированы</span><strong>2</strong><small>50% конверсия</small></div><div><span>На проверке</span><strong>1</strong><small>обновление 06.08</small></div><div><span>Дубли</span><strong>1</strong><small>25% от лидов</small></div></section>
  <section className="card table-card"><div className="section-head"><div><h2>Последние обращения</h2><p>Обновлено 04.08.2026 в 16:20</p></div><button className="secondary-button compact">Фильтры</button></div><div className="data-table" role="table"><div className="table-row table-head" role="row"><span>ID</span><span>Создан</span><span>Статус</span><span>Ответственный</span><span>Предварительно</span></div>{leadRows.map(row=><div className="table-row" role="row" key={row.id}><strong>{row.id}</strong><span>{row.created}</span><span><Badge tone={row.stage==="Дубль"?"neutral":"active"}>{row.stage}</Badge></span><span>{row.owner}</span><span>{row.reward}</span></div>)}</div><p className="table-note">* Предварительный расчёт не является обязательством к выплате.</p></section></>;
}

function Payouts() {
  const [amount,setAmount]=useState(1000000);
  const gross=amount*0.05;
  return <><section className="page-heading"><div><Badge tone="demo">Расчёт — демонстрация</Badge><h1>Вознаграждения</h1><p>Предварительная сумма отделена от подтверждённой на каждом этапе.</p></div></section><div className="payout-layout"><section className="card calculator"><div className="section-head"><div><h2>Предварительный расчёт</h2><p>Модель из брифа: 5% от суммы привлечённых средств</p></div><Badge tone="review">Требует утверждения</Badge></div><label>База расчёта<input type="number" min="0" step="100000" value={amount} onChange={e=>setAmount(Number(e.target.value))}/><span>₽</span></label><div className="formula"><span>{amount.toLocaleString("ru-RU")} ₽</span><i>×</i><span>5%</span><i>=</i><strong>{gross.toLocaleString("ru-RU")} ₽</strong></div><div className="tax-note"><AlertTriangle size={18}/><p>Сумма до налогов. Статус получателя, налог, договорное основание и срок выплаты подтверждает финансовый сотрудник.</p></div></section><aside className="card payout-summary"><h3>Статус расчёта</h3><div><span>Предварительно</span><strong>{gross.toLocaleString("ru-RU")} ₽</strong></div><div><span>Подтверждено</span><strong>0 ₽</strong></div><div><span>Выплачено</span><strong>0 ₽</strong></div><button className="secondary-button wide">Задать вопрос по расчёту</button></aside></div><section className="card process-card"><div className="section-head"><div><h2>От сделки до выплаты</h2><p>Прозрачная последовательность контроля</p></div></div><div className="process-steps">{["Лид зарегистрирован","Атрибуция проверена","Дубль исключён","Целевое действие","Сделка подтверждена","База рассчитана","Налоговый контроль","Сумма утверждена","Платёж сформирован","Платёж исполнен","Документ доступен"].map((x,i)=><div key={x}><span>{i+1}</span><p>{x}</p></div>)}</div></section></>;
}

function Documents() {
  return <><section className="page-heading"><div><Badge tone="date">Реестр знаний · проверено 04.08.2026</Badge><h1>Источники и противоречия</h1><p>Каждый существенный факт связан с источником, датой и статусом допуска.</p></div><a className="secondary-button" href="https://www.cbr.ru/finorg/foinfo/?ogrn=1217800146024" target="_blank" rel="noreferrer">Карточка Банка России <ExternalLink size={16}/></a></section>
  <section className="legal-alert compact-alert"><div className="alert-icon"><AlertTriangle size={22}/></div><div><Badge tone="review">Разделение аудитории</Badge><h2>Юридические лица — целевая аудитория</h2><p>МКК вправе привлекать средства юридических лиц. Для ИП действует отдельное правило: статья 12 закона № 151-ФЗ допускает средства ИП только когда он является учредителем или участником МКК. Поэтому форма фиксирует тип клиента до передачи менеджеру.</p></div></section>
  <section className="card registry"><div className="section-head"><div><h2>Реестр источников</h2><p>{sources.length} ключевых фактов</p></div><div className="legend"><Badge tone="active">Подтверждено</Badge><Badge tone="review">Проверить</Badge><Badge tone="danger">Стоп</Badge></div></div>{sources.map(s=><div className="source-row" key={s.fact}><span className={`status-dot ${s.status}`}/><div><strong>{s.fact}</strong><small>{s.source} · проверено 04.08.2026</small></div><Badge tone={s.status==="confirmed"?"active":s.status==="review"?"review":"danger"}>{s.status==="confirmed"?"Подтверждено":s.status==="review"?"Требует подтверждения":s.status==="conflict"?"Противоречие":"Не публиковать"}</Badge><a href={s.url} target={s.url.startsWith("http")?"_blank":undefined} rel="noreferrer" aria-label={`Открыть источник: ${s.source}`}><ExternalLink size={17}/></a></div>)}</section>
  <section className="card questions" id="questions"><div className="section-head"><div><h2>Вопросы руководству и юристу</h2><p>Нужны для финальной версии договоров и материалов</p></div><Badge tone="review">8 открытых</Badge></div><ol><li>Какой договор используется при привлечении средств юридического лица?</li><li>Как система подтверждает, что ИП является учредителем или участником МКК?</li><li>Какой диапазон актуален: «от 1 млн ₽» из брифа или 5–30 млн ₽ из презентации?</li><li>Как устранить противоречие слайда 2: «доходность гарантирована» и «не является гарантией результата»?</li><li>Что означает «100% обеспечение» и каким отчётом подтверждается оценка залога?</li><li>Почему презентация указывает займы до 5 млн ₽, а публичный сайт — до 500 000 ₽; к каким категориям относятся лимиты?</li><li>Как рассчитывается 5% мотивации, кто удерживает налоги и когда возможен перерасчёт?</li><li>Есть ли страхование и что именно является объектом страхования?</li></ol></section></>;
}

function Control({ quizAnswer, setQuizAnswer }: { quizAnswer:string|null; setQuizAnswer:(v:string)=>void }) {
  const correct = quizAnswer === "stop";
  return <><section className="page-heading"><div><Badge tone="date">Комплаенс-центр</Badge><h1>Что можно говорить</h1><p>Матрица помогает остановить рискованную коммуникацию до отправки клиенту.</p></div><Badge tone="danger">Для допуска требуется 100%</Badge></section><section className="zone-grid"><article className="zone green"><div><CheckCircle2/><span>Зелёная зона</span></div><h2>Можно использовать</h2><ul><li>Подтверждённые реквизиты и статус</li><li>Ссылка на карточку Банка России</li><li>Описание своей роли</li><li>Нейтральное объяснение процедуры</li><li>Передача уполномоченному менеджеру</li></ul></article><article className="zone yellow"><div><AlertTriangle/><span>Жёлтая зона</span></div><h2>Только по утверждённому</h2><ul><li>Доходность и ставки</li><li>Статистика и отчётность</li><li>Стоимость залога и взыскание</li><li>Страхование и налоги</li><li>Сроки выплат и сравнения</li></ul></article><article className="zone red"><div><ShieldAlert/><span>Красная зона</span></div><h2>Нужно остановиться</h2><ul><li>Гарантия дохода или возврата</li><li>«Это как банковский вклад»</li><li>Срочность, давление, манипуляция</li><li>Контакт без согласия</li><li>Неподтверждённые цифры и кейсы</li></ul></article></section>
  <section className="card quiz-card"><div className="section-head"><div><Badge tone="review">Тренировочный вопрос 1 из 5</Badge><h2>Клиент спрашивает: «А 24% точно выплатят?»</h2></div></div><div className="answer-grid">{[{id:"promise",text:"Да, доход гарантирован залогом."},{id:"soft",text:"Скорее всего да — компания стабильно работает."},{id:"stop",text:"Это не гарантия. Показатель требует подтверждения по договору; передам вопрос специалисту."}].map(a=><button key={a.id} onClick={()=>setQuizAnswer(a.id)} className={quizAnswer===a.id?"answer selected":"answer"}><span>{quizAnswer===a.id?<Check size={16}/>:null}</span>{a.text}</button>)}</div>{quizAnswer && <div className={correct?"feedback good":"feedback bad"}>{correct?<CheckCircle2/>:<ShieldAlert/>}<p><strong>{correct?"Безопасный ответ":"Критическая ошибка"}</strong>{correct?"Вы не превратили цифру в обещание и передали вопрос специалисту.":"Нельзя обещать доходность или подменять подтверждённый факт предположением."}</p></div>}</section>
  <section className="admin-grid"><article className="card"><div className="card-kicker"><span><Settings2/> Панель управления</span><Badge tone="demo">Прототип</Badge></div><div className="admin-list"><span>Пользователи и 7 ролей <strong>128</strong></span><span>Материалы на согласовании <strong>6</strong></span><span>Заблокированные версии <strong>2</strong></span><span>Обязательное переобучение <strong>14</strong></span></div></article><article className="card"><div className="card-kicker"><span><FileCheck2/> Модель данных</span></div><p className="model-copy">users · roles · courses · modules · lessons · progress · attempts · approvals · sources · leads · consents · rewards · audit_log</p><p className="muted">Доступ — по роли и владельцу записи; изменения контента и согласий версионируются.</p></article></section></>;
}

function LessonModal({ onClose }: { onClose:()=>void }) {
  const [tab,setTab]=useState("material");
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="lesson-title"><div className="lesson-modal"><header><div><Badge tone="active">Модуль 2 · 35 минут</Badge><h2 id="lesson-title">Продукт и его риски</h2><p>Цель: научиться различать продукт для заёмщика и допустимые форматы привлечения средств.</p></div><button className="icon-button" onClick={onClose} aria-label="Закрыть урок"><X/></button></header><div className="lesson-tabs"><button className={tab==="material"?"active":""} onClick={()=>setTab("material")}>Материал</button><button className={tab==="practice"?"active":""} onClick={()=>setTab("practice")}>Практика</button><button className={tab==="check"?"active":""} onClick={()=>setTab("check")}>Чек-лист</button></div><div className="lesson-content">{tab==="material"&&<><h3>Два направления — разные правила</h3><div className="compare"><div><Badge tone="active">Для заёмщика</Badge><h4>Микрозаём под залог автомобиля</h4><p>Компания выдаёт заём после оценки клиента и автомобиля. Автомобиль может оставаться в пользовании залогодателя.</p><ul><li>Публичная сумма физлицу: 50 000–500 000 ₽</li><li>ПСК на сайте: 66–102% годовых</li><li>Презентация указывает диапазон до 5 млн ₽ для трёх категорий — нужен раздельный лимит</li><li>Залог снижает риск, но не исключает его</li></ul></div><div><Badge tone="active">Для юридического лица</Badge><h4>Привлечение средств</h4><p>Юридические лица — допустимая аудитория МКК. ИП можно рассматривать только после подтверждения, что он является учредителем или участником компании.</p><ul><li>Презентация: 24% годовых, 36 месяцев, объём 5–30 млн ₽</li><li>24% — условие внутреннего материала, а не гарантия</li><li>Условия должны следовать из договора</li></ul></div></div><h3>Данные презентации на 01.07.2026</h3><div className="risk-grid presentation-facts"><div><strong>27,5 млн ₽</strong><span>портфель; +66% за 18 месяцев</span></div><div><strong>87 / 79</strong><span>договоров / уникальных клиентов</span></div><div><strong>31,6 млн ₽</strong><span>активы</span></div><div><strong>1,48 млн ₽</strong><span>чистая прибыль</span></div></div><p className="lesson-source-note"><FileText size={16}/> Источник: FINDRIVE_desktop.pdf, слайды 3–6. Требует подтверждения отчётностью.</p><h3>Риски, которые нельзя скрывать</h3><div className="risk-grid"><div><strong>Кредитный</strong><span>заёмщик может нарушить обязательства</span></div><div><strong>Ликвидности</strong><span>залог нельзя мгновенно превратить в деньги</span></div><div><strong>Операционный</strong><span>ошибки оценки, документов и процессов</span></div><div><strong>Юридический</strong><span>ограничения закона или оспаривание</span></div></div></>}{tab==="practice"&&<><h3>Ситуационное задание</h3><p>Контакт просит прислать договор и обещать 24% «в сообщении, чтобы зафиксировать». Составьте ответ из трёх частей: раскройте роль, откажитесь от гарантии, предложите разговор с уполномоченным специалистом.</p><textarea aria-label="Ответ на практическое задание" placeholder="Ваш безопасный ответ…"/><button className="primary-button">Отправить наставнику</button></>}{tab==="check"&&<><h3>Перед разговором проверьте</h3><ul className="large-checklist"><li><span><Check/>Контакт представляет юридическое лицо или является ИП-участником</span></li><li><span><Check/>Материал имеет статус «утверждён»</span></li><li><span><Check/>Есть согласие на коммуникацию</span></li><li><span><Check/>Роль амбассадора раскрыта</span></li><li><span><Check/>Нет обещаний дохода и отсутствия риска</span></li></ul></>}</div><footer><span>Проверено 04.08.2026 · <strong>Маршрут: юридические лица</strong></span><button className="primary-button" onClick={onClose}>Сохранить и закрыть</button></footer></div></div>;
}
