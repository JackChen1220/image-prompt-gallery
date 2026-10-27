import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUpRight, ChevronDown, Search, X } from "lucide-react";
import type { PromptItem } from "./types";
import { filterPrompts } from "./lib/search.mjs";
import { PromptCard } from "./components/PromptCard";
import { PromptDialog } from "./components/PromptDialog";

const primaryCategories = [
  "摄影与人像",
  "海报与排版",
  "产品与商业",
  "插画与艺术",
  "空间与建筑",
  "图表与信息",
];
const PAGE_SIZE = 36;
const readLocation = (categories: string[]) => {
  const params = new URLSearchParams(window.location.search);
  return {
    query: params.get("q") ?? "",
    category: categories.includes(params.get("category") ?? "")
      ? params.get("category")!
      : "全部",
    id: params.get("prompt"),
  };
};

export function App({ items }: { items: PromptItem[] }) {
  const categories = useMemo(
    () => [
      ...primaryCategories,
      ...Array.from(new Set(items.map((item) => item.category))).filter(
        (name) => !primaryCategories.includes(name),
      ),
    ],
    [items],
  );
  const [location, setLocation] = useState(() => readLocation(categories));
  const [showMoreCategories, setShowMoreCategories] = useState(
    () =>
      !!location.category &&
      !primaryCategories.includes(location.category) &&
      location.category !== "全部",
  );
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [error, setError] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const filtered: PromptItem[] = useMemo(
    () => filterPrompts(items, location.query, location.category),
    [location.query, location.category],
  );
  const selected = items.find((item) => item.id === location.id) ?? null;
  useEffect(() => {
    const onPop = () => {
      setLocation(readLocation(categories));
      setLimit(PAGE_SIZE);
    };
    const shortcut = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (
        event.key === "/" &&
        !selected &&
        !target.matches('input,textarea,[contenteditable="true"]')
      ) {
        event.preventDefault();
        input.current?.focus();
      }
    };
    window.addEventListener("popstate", onPop);
    window.addEventListener("keydown", shortcut);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("keydown", shortcut);
    };
  }, [selected, categories]);
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(""), 5000);
    return () => clearTimeout(timer);
  }, [error]);
  function navigate(changes: Partial<typeof location>, push = false) {
    const next = { ...location, ...changes };
    const params = new URLSearchParams();
    if (next.query) params.set("q", next.query);
    if (next.category !== "全部") params.set("category", next.category);
    if (next.id) params.set("prompt", next.id);
    const url = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    window.history[push ? "pushState" : "replaceState"](null, "", url);
    setLocation(next);
    if ("query" in changes || "category" in changes) setLimit(PAGE_SIZE);
  }
  return (
    <>
      <a className="skip-link" href="#gallery">
        跳到图片
      </a>
      <div className="site-shell">
        <header className="site-header">
          <a className="wordmark" href="/">
            Prompt Gallery<span>.</span>
          </a>
          <p>
            图片与提示词，仅此而已。
            <span className="green-dot" aria-hidden="true" />
          </p>
        </header>
        <main>
          <section className="intro" aria-labelledby="page-title">
            <h1 id="page-title">
              让好图片，
              <br />
              <span>也有迹可循。</span>
            </h1>
            <p>
              浏览图片，发现提示词。
              <br />
              选一张喜欢的，复制灵感的起点。
            </p>
          </section>
          <section className="browse-tools" aria-label="搜索和分类">
            <div className="search-field">
              <Search size={20} aria-hidden="true" />
              <input
                ref={input}
                type="search"
                aria-label="搜索图片、风格或提示词"
                placeholder="搜索图片、风格或提示词…"
                value={location.query}
                onChange={(event) => navigate({ query: event.target.value })}
              />
              {location.query ? (
                <button
                  className="icon-button"
                  aria-label="清空搜索"
                  onClick={() => {
                    navigate({ query: "" });
                    input.current?.focus();
                  }}
                >
                  <X size={17} />
                </button>
              ) : (
                <kbd aria-hidden="true">/</kbd>
              )}
            </div>
            <div className="category-list" aria-label="图片分类">
              {[
                "全部",
                ...(showMoreCategories ? categories : primaryCategories),
              ].map((category) => (
                <button
                  key={category}
                  className={
                    location.category === category
                      ? "category active"
                      : "category"
                  }
                  aria-pressed={location.category === category}
                  onClick={() => navigate({ category })}
                >
                  {category}
                </button>
              ))}
              <button
                className="category more-categories"
                aria-expanded={showMoreCategories}
                onClick={() => setShowMoreCategories(!showMoreCategories)}
              >
                {showMoreCategories ? "收起" : "更多"}
                <ChevronDown
                  size={14}
                  className={showMoreCategories ? "rotated" : ""}
                />
              </button>
            </div>
          </section>
          <section
            id="gallery"
            className="gallery-section"
            aria-label="图片提示词画廊"
          >
            <div className="gallery-heading">
              <h2>
                {location.query
                  ? "搜索结果"
                  : location.category === "全部"
                    ? "全部图片"
                    : location.category}
              </h2>
              <p role="status">
                {filtered.length.toLocaleString("zh-CN")} 组图片
                {location.query && (
                  <span className="result-query"> · “{location.query}”</span>
                )}
              </p>
            </div>
            {filtered.length ? (
              <div className="gallery-grid">
                {filtered.slice(0, limit).map((item, index) => (
                  <PromptCard
                    key={item.id}
                    item={item}
                    index={index}
                    onOpen={(next) => navigate({ id: next.id }, true)}
                    onError={setError}
                  />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Search size={30} strokeWidth={1.2} />
                <h3>还没找到这份灵感</h3>
                <p>换个关键词，或试试其他分类。</p>
                <button
                  className="text-button"
                  onClick={() => navigate({ query: "", category: "全部" })}
                >
                  查看全部图片 <ArrowUpRight size={16} />
                </button>
              </div>
            )}
            {limit < filtered.length && (
              <div className="load-more">
                <button onClick={() => setLimit(limit + PAGE_SIZE)}>
                  再看 {Math.min(PAGE_SIZE, filtered.length - limit)} 组{" "}
                  <ArrowDown size={16} />
                </button>
                <p>
                  已展示 {Math.min(limit, filtered.length)} / {filtered.length}{" "}
                  组
                </p>
              </div>
            )}
          </section>
        </main>
        <footer className="site-footer">
          <p>把喜欢的画面，变成下一次创作的起点。</p>
          <p>图片与提示词版权归原作者所有 · 详情中保留原始来源</p>
        </footer>
      </div>
      <PromptDialog
        item={selected}
        onClose={() => navigate({ id: null })}
        onError={setError}
      />
      {error && (
        <div role="alert" className="toast">
          {error}
          <button
            className="icon-button"
            aria-label="关闭提示"
            onClick={() => setError("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </>
  );
}
