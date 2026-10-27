export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // Fallback for browsers without the Clipboard API or denied permissions.
    const active = document.activeElement as HTMLElement | null;
    const input = document.createElement("textarea");
    input.value = text;
    input.setAttribute("readonly", "");
    input.style.cssText =
      "position:fixed;inset:0;opacity:0;pointer-events:none;";
    const parent = document.querySelector("dialog[open]") ?? document.body;
    parent.append(input);
    input.select();
    const copied = document.execCommand("copy");
    input.remove();
    active?.focus({ preventScroll: true });
    if (!copied) throw new Error("无法访问剪贴板，请选中提示词后手动复制。");
  }
}
