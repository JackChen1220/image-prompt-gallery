import { test } from "node:test";
import assert from "node:assert/strict";
import { filterPrompts, normalizeSearch } from "./search.mjs";

const items = [
  {
    id: "1",
    title: "雨夜人像",
    category: "摄影与人像",
    prompt: "Blue rainy cinematic portrait",
    tags: ["胶片"],
  },
  {
    id: "2",
    title: "花园海报",
    category: "海报与排版",
    prompt: "Blue floral poster",
    tags: ["植物"],
  },
  {
    id: "3",
    title: "黄昏人像",
    category: "摄影与人像",
    prompt: "Warm cinematic portrait",
    tags: [],
  },
];
test("search includes prompt text and tags, is case insensitive, and supports multiple words", () => {
  assert.deepEqual(
    filterPrompts(items, " BLUE  cinematic ", "全部").map((item) => item.id),
    ["1"],
  );
  assert.deepEqual(
    filterPrompts(items, "胶片", "全部").map((item) => item.id),
    ["1"],
  );
});
test("category and search are applied together, without discarding valid category items", () => {
  assert.deepEqual(
    filterPrompts(items, "blue", "摄影与人像").map((item) => item.id),
    ["1"],
  );
  assert.equal(filterPrompts(items, "", "摄影与人像").length, 2);
  assert.equal(filterPrompts(items, "", "全部").length, 3);
  assert.equal(filterPrompts(items, "不存在的提示词", "全部").length, 0);
});
test("full-width input and whitespace normalize consistently", () => {
  assert.equal(normalizeSearch(" ＢＬＵＥ\n PORTRAIT "), "blue portrait");
});
