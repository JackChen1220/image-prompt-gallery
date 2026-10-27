import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { copyText } from "../lib/clipboard";

type Props = {
  text: string;
  title: string;
  compact?: boolean;
  onError: (message: string) => void;
};
export function CopyButton({ text, title, compact = false, onError }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    setCopied(false);
    clearTimeout(timer.current);
  }, [text]);
  async function copy() {
    try {
      await copyText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "复制失败，请手动复制提示词。",
      );
    }
  }
  return (
    <button
      className={compact ? "copy-button compact" : "copy-button primary"}
      type="button"
      onClick={copy}
      aria-label={copied ? "提示词已复制" : `复制提示词：${title}`}
      title={copied ? "已复制" : "复制提示词"}
    >
      {copied ? (
        <Check size={compact ? 17 : 18} />
      ) : (
        <Copy size={compact ? 17 : 18} />
      )}
      {!compact && <span>{copied ? "提示词已复制" : "复制完整提示词"}</span>}
      {compact && (
        <span className="sr-only" role="status">
          {copied ? "已复制" : ""}
        </span>
      )}
    </button>
  );
}
