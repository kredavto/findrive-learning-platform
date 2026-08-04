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
import { useMemo, useState } from "react";

type View = "dashboard" | "course" | "scripts" | "leads" | "payouts" | "documents" | "control";

const modules = [
  { n: 1, title: "О компании", time: "22 мин", status: "done", note: "Реквизиты и проверка в реестре" },
  { n: 2, title: "Продукт и его риски", time: "35 мин", status: "active", note: "Займы, привлечение средств, ограничения МКК" },
  { n: 3, title: "Кейсы клиентов", time: "18 мин", status: "locked", note: "Только подтверждённые и обезличенные данные" },
  { n: 4, title: "Роль амбассадора", time: "20 мин", status: "locked", note: "Полномочия, границы, эскалация" },
  { n: 5, title: "Рабочий процесс", time: "28 мин", status: "locked", note: "От контакта до фиксации результата" },
  { n: 6, title: "Система мотивации", time: "24 мин", status: "locked", note: "Предварительный и подтверждённый расчёт" },
  { n: 7, title: "Нормативы", time: "16 мин", status: "locked", note: "Качество вместо давления и спама" },
  { n: 8, title: "Работа с клиентами", time: "45 мин", status: "locked", note: "Лестница Ханта, СПИН, этика и согласия" },
  { n: 9, title: "Скрипты и возражения", time: "48 мин", status: "locked", note: "15 сценариев и техника «услышать — уточнить — ответить»" },
  { n: 10, title: "Можно / нельзя", time: "25 мин", status: "locked", note: "Зелёная, жёлтая и красная зоны" },
  { n: 11, title: "Персональные ссылки", time: "20 мин", status: "locked", note: "Согласия, UTM, журнал отправок" },
  { n: 12, title: "Результаты и лиды", time: "18 мин", status: "locked", note: "Статусы без лишних персональных данных" },
  { n: 13, title: "Вознаграждение", time: "20 мин", status: "locked", note: "11 шагов от атрибуции до выплаты" },
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
  const [lessonOpen, setLessonOpen] = useState(false);

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
          {view === "dashboard" && <Dashboard onNavigate={navigate} onLesson={() => setLessonOpen(true)} copied={copied} onCopy={copyText} />}
          {view === "course" && <Course onLesson={() => setLessonOpen(true)} />}
          {view === "scripts" && <Scripts query={query} setQuery={setQuery} filtered={filteredScripts} active={scriptIndex} setActive={setScriptIndex} copied={copied} onCopy={copyText} />}
          {view === "leads" && <Leads />}
          {view === "payouts" && <Payouts />}
          {view === "documents" && <Documents />}
          {view === "control" && <Control quizAnswer={quizAnswer} setQuizAnswer={setQuizAnswer} />}
        </div>
      </main>

      {lessonOpen && <LessonModal onClose={() => setLessonOpen(false)} />}
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

function Course({ onLesson }: { onLesson: () => void }) {
  return <><section className="page-heading"><div><Badge tone="date">Курс · 1 из 13</Badge><h1>Амбассадор / Партнёр</h1><p>Последовательная программа с практикой, тестами и обязательным комплаенсом.</p></div><div className="heading-stat"><strong>18%</strong><span>2 ч 42 мин осталось</span></div></section>
    <div className="course-layout"><div className="course-main-column"><section className="card course-list"><div className="section-head"><div><h2>Архитектура курса</h2><p>Каждый модуль открывается после предыдущего</p></div><Badge tone="neutral">≈ 5 ч 45 мин</Badge></div>{modules.map((m) => <button key={m.n} className={`module-row ${m.status}`} onClick={m.status === "active" ? onLesson : undefined} disabled={m.status === "locked"}><span className="module-number">{m.status === "done" ? <Check size={18}/> : m.status === "locked" ? <LockKeyhole size={15}/> : m.n}</span><span className="module-copy"><strong>{m.title}</strong><small>{m.note}</small></span><span className="module-time"><Clock3 size={14}/>{m.time}</span><ChevronRight size={18}/></button>)}</section><SalesLab /></div>
    <aside className="course-aside"><article className="card"><h3>Итоговая аттестация</h3><div className="score"><strong>80%</strong><span>проходной балл</span></div><ul className="check-list"><li><CheckCircle2/>Не менее 25 вопросов</li><li><CheckCircle2/>Комплаенс — 100%</li><li><CheckCircle2/>Симуляция диалога</li></ul></article><article className="card"><h3>Путь к допуску</h3><ol className="timeline"><li className="done">Основы компании</li><li className="active">Продукт и риски</li><li>Практические задания</li><li>Аттестация</li><li>Принятие правил</li></ol></article><article className="card presentation-card"><div className="card-kicker"><span><FileText/> Данные презентации</span><Badge tone="review">Внутренний источник</Badge></div><div className="presentation-metrics">{presentationMetrics.map(m=><div key={m.label}><strong>{m.value}</strong><span>{m.label}</span><small>{m.slide}</small></div>)}</div><p>Цифры включены как заявленные компанией и не используются как обещания без подтверждающих документов.</p></article></aside></div></>;
}

function SalesLab() {
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const tests = {
    hunt: { correct: "step", options: [{id:"pitch",text:"Сразу отправить презентацию с условиями"},{id:"step",text:"Помочь сделать следующий шаг: от осознания задачи к поиску решения"},{id:"pressure",text:"Создать срочность и добиться встречи"}] },
    spin: { correct: "implication", options: [{id:"situation",text:"Сколько сотрудников работает в компании?"},{id:"implication",text:"Как нехватка оборотного капитала влияет на сроки и контракты?"},{id:"offer",text:"Готовы подписать договор сегодня?"}] },
    objection: { correct: "clarify", options: [{id:"argue",text:"Доказывать, что возражение неверно"},{id:"discount",text:"Сразу предложить уступку"},{id:"clarify",text:"Признать вопрос, уточнить причину и ответить подтверждённым фактом"}] },
  };
  const quiz = (key: keyof typeof tests, question: string) => <div className="micro-quiz"><strong>{question}</strong><div>{tests[key].options.map(o=><button key={o.id} className={answers[key]===o.id?"selected":""} onClick={()=>setAnswers({...answers,[key]:o.id})}>{o.text}</button>)}</div>{answers[key] && <p className={answers[key]===tests[key].correct?"quiz-ok":"quiz-no"}>{answers[key]===tests[key].correct?"Верно. Такой ответ сохраняет этику и ведёт клиента по его готовности.":"Попробуйте ещё раз: давление и преждевременная презентация снижают доверие."}</p>}</div>;
  return <section className="card sales-lab"><div className="section-head"><div><Badge tone="date">Практикум продаж</Badge><h2>Техники без давления</h2><p>Инструменты адаптированы для финансовой сферы и работы с юрлицами</p></div><Badge tone="active">3 мини-теста</Badge></div>
    <article className="sales-section"><div className="sales-title"><span>01</span><div><h3>Лестница Ханта</h3><p>Коммуникация должна соответствовать уровню готовности клиента.</p></div></div><div className="hunt-steps">{["Не видит задачи","Осознаёт задачу","Ищет подход","Сравнивает решения","Готов к действию"].map((x,i)=><div key={x}><span>{i+1}</span><small>{x}</small></div>)}</div><p className="theory-note">Не пытайтесь перепрыгнуть лестницу. На первом контакте цель — не «закрыть сделку», а понять текущий этап и помочь перейти на один шаг дальше.</p>{quiz("hunt","Что делать, если контакт только начал осознавать потребность?")}</article>
    <article className="sales-section"><div className="sales-title"><span>02</span><div><h3>СПИН-продажи</h3><p>Диагностика через вопросы вместо монолога о продукте.</p></div></div><div className="spin-grid"><div><b>С</b><strong>Ситуационные</strong><small>Кратко понять контекст</small></div><div><b>П</b><strong>Проблемные</strong><small>Выявить затруднение</small></div><div><b>И</b><strong>Извлекающие</strong><small>Понять последствия</small></div><div><b>Н</b><strong>Направляющие</strong><small>Уточнить ценность решения</small></div></div><p className="theory-note">Не задавайте вопросы, ответы на которые можно получить заранее. Не превращайте СПИН в допрос и не подводите клиента к обещаниям результата.</p>{quiz("spin","Какой вопрос относится к извлекающим?")}</article>
    <article className="sales-section"><div className="sales-title"><span>03</span><div><h3>Работа с возражениями</h3><p>Возражение — запрос на ясность, а не приглашение спорить.</p></div></div><div className="objection-flow">{["Выслушать","Признать","Уточнить","Ответить фактом","Проверить понимание"].map((x,i)=><div key={x}><span>{i+1}</span><strong>{x}</strong></div>)}</div><ul className="sales-skills"><li>Отделяйте реальную причину от вежливой отговорки.</li><li>Используйте только проверенные доказательства и документы.</li><li>На юридическом, налоговом или риск-вопросе передавайте специалисту.</li><li>После отказа прекращайте рекламную коммуникацию.</li></ul>{quiz("objection","Как безопасно отвечать на возражение?")}</article>
  </section>;
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
