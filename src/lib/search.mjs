export function normalizeSearch(value) {
  return value
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function filterPrompts(items, query, category) {
  const words = normalizeSearch(query).split(" ").filter(Boolean);
  return items.filter((item) => {
    if (category !== "全部" && item.category !== category) return false;
    if (!words.length) return true;
    const text = normalizeSearch(
      [item.title, item.category, item.prompt, ...item.tags].join(" "),
    );
    return words.every((word) => text.includes(word));
  });
}
