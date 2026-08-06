import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
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
  assert.match(page, /Ответы на возражения/i);
  assert.match(page, /Юридические лица/i);
  assert.match(page, /accept="video\/mp4,.mp4"/i);
  assert.match(page, /Текст урока уже доступен ниже/i);
  assert.doesNotMatch(page, /Текст урока пока закрыт/i);
  assert.doesNotMatch(page, /watchedLessons|videoWatched/i);
  assert.match(page, /Регистрация амбассадора/i);
  assert.match(page, /Добрый день, \{firstName\}/i);
  assert.match(page, /"Приветствие"/i);
  assert.doesNotMatch(page, /Добрый день, Алексей|Алексей Воронов/i);
  assert.match(worker, /oai-authenticated-user-id/i);
  assert.match(worker, /\/api\/profile/i);
  assert.match(schema, /registrationCompleted/i);
  assert.match(page, /Следующий блок откроется только после итогового теста/i);
  assert.match(styles, /green-callout/i);
  assert.match(styles, /FINDRIVE presentation palette/i);
  assert.doesNotMatch(page, /Your site is taking shape/i);
});
