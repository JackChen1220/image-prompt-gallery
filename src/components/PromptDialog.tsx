import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Maximize2,
  X,
} from "lucide-react";
import type { PromptItem } from "../types";
import { CopyButton } from "./CopyButton";
import { ImageDownloadLink } from "./ImageDownloadLink";
import { ImagePreviewDialog } from "./ImagePreviewDialog";

type Props = {
  item: PromptItem | null;
  onClose: () => void;
  onError: (message: string) => void;
};
export function PromptDialog({ item, onClose, onError }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  useEffect(() => {
    if (!item) return;
    setImageIndex(0);
    setPreviewOpen(false);
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    element.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element.close();
      document.body.style.overflow = oldOverflow;
      previousFocus?.focus({ preventScroll: true });
    };
  }, [item]);
  if (!item) return null;
  const image = item.images[imageIndex] ?? item.images[0];
  const move = (direction: number) =>
    setImageIndex(
      (current) =>
        (current + direction + item.images.length) % item.images.length,
    );
  return (
    <dialog
      ref={dialog}
      className="prompt-dialog"
      aria-labelledby="prompt-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="dialog-layout">
        <button
          className="dialog-close icon-button"
          onClick={onClose}
          aria-label="关闭详情"
          autoFocus
        >
          <X size={21} />
        </button>
        <div className="dialog-media">
          <button
            className="detail-image-trigger"
            aria-label={`全屏预览：${item.title}`}
            onClick={() => setPreviewOpen(true)}
            title="点击全屏预览"
          >
            <img
              className="full-image"
              src={image.src}
              alt={image.alt || item.title}
              width={image.width}
              height={image.height}
            />
          </button>
          <div className="dialog-media-tools">
            <button className="image-tool" onClick={() => setPreviewOpen(true)}>
              <Maximize2 size={15} aria-hidden="true" />
              <span>全屏预览</span>
            </button>
            <ImageDownloadLink
              image={image}
              title={item.title}
              imageIndex={imageIndex}
              imageCount={item.images.length}
            />
          </div>
          {item.images.length > 1 && (
            <div className="image-pagination">
              <button
                className="icon-button"
                onClick={() => move(-1)}
                aria-label="上一张图片"
              >
                <ArrowLeft size={18} />
              </button>
              <span>
                {imageIndex + 1} / {item.images.length}
              </span>
              <button
                className="icon-button"
                onClick={() => move(1)}
                aria-label="下一张图片"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
        <div className="dialog-content">
          <div className="dialog-heading">
            <span className="category-label">{item.category}</span>
            <h2 id="prompt-title">{item.title}</h2>
          </div>
          <div className="prompt-label">
            <h3>图片提示词</h3>
            <span>{item.prompt.length.toLocaleString("zh-CN")} 字符</span>
          </div>
          <div className="prompt-text" tabIndex={0} aria-label="完整提示词">
            {item.prompt}
          </div>
          <div className="dialog-actions">
            <CopyButton
              text={item.prompt}
              title={item.title}
              onError={onError}
            />
            {item.sourceUrl && (
              <a
                className="source-link"
                href={item.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                来源：{item.sourceLabel || "原作者"} <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </div>
      {previewOpen && (
        <ImagePreviewDialog
          image={image}
          title={item.title}
          imageIndex={imageIndex}
          imageCount={item.images.length}
          onMove={move}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </dialog>
  );
}
