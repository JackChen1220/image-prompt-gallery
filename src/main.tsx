import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import dataUrl from "./data/prompts.json?url";
import type { PromptItem } from "./types";
import "./styles.css";

const root = createRoot(document.getElementById("root")!);
root.render(
  <main className="loading-state" role="status">
    正在加载图片与提示词…
  </main>,
);

async function loadGallery() {
  try {
    const response = await fetch(dataUrl);
    if (!response.ok) throw new Error("Content unavailable");
    const items: PromptItem[] = await response.json();
    root.render(
      <StrictMode>
        <App items={items} />
      </StrictMode>,
    );
  } catch {
    root.render(
      <main className="loading-state" role="alert">
        <h1>暂时没能加载图片</h1>
        <p>检查网络后，再试一次。</p>
        <button
          className="text-button"
          onClick={() => window.location.reload()}
        >
          重新加载
        </button>
      </main>,
    );
  }
}
void loadGallery();
