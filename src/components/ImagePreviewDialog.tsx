import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { GalleryImage } from "../types";
import { ImageDownloadLink } from "./ImageDownloadLink";

type Props = {
  image: GalleryImage;
  title: string;
  imageIndex: number;
  imageCount: number;
  onMove: (direction: number) => void;
  onClose: () => void;
};

export function ImagePreviewDialog({
  image,
  title,
  imageIndex,
  imageCount,
  onMove,
  onClose,
}: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [originalSize, setOriginalSize] = useState(false);

  useEffect(() => {
    const element = dialog.current!;
    const previousFocus = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => {
      element.close();
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    stage.current?.scrollTo(0, 0);
  }, [image.src, originalSize]);

  function move(direction: number) {
    setOriginalSize(false);
    onMove(direction);
  }

  return (
    <dialog
      ref={dialog}
      className="image-preview-dialog"
      aria-labelledby="image-preview-title"
      onCancel={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }}
      onKeyDown={(event) => {
        if (
          imageCount > 1 &&
          (event.key === "ArrowLeft" || event.key === "ArrowRight")
        ) {
          event.preventDefault();
          event.stopPropagation();
          move(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
    >
      <div className="image-preview-layout">
        <header className="image-preview-header">
          <div className="image-preview-heading">
            <h2 id="image-preview-title">{title} · 全屏预览</h2>
            <p>
              {image.width} × {image.height}
              {imageCount > 1 && ` · ${imageIndex + 1} / ${imageCount}`}
            </p>
          </div>
          <div className="image-preview-tools">
            <button
              className="image-tool"
              onClick={() => setOriginalSize(!originalSize)}
              aria-label={originalSize ? "适应屏幕" : "查看原始尺寸"}
              aria-pressed={originalSize}
            >
              {originalSize ? <ZoomOut size={16} /> : <ZoomIn size={16} />}
              <span>{originalSize ? "适应屏幕" : "原始尺寸"}</span>
            </button>
            <ImageDownloadLink
              image={image}
              title={title}
              imageIndex={imageIndex}
              imageCount={imageCount}
            />
            <button
              className="icon-button image-preview-close"
              aria-label="退出全屏预览"
              onClick={onClose}
              title="退出全屏预览（Esc）"
              autoFocus
            >
              <X size={23} />
            </button>
          </div>
        </header>
        <div className="image-preview-content">
          <div ref={stage} className="image-preview-stage">
            <div
              className="image-preview-canvas"
              style={
                originalSize
                  ? { width: image.width + 48, height: image.height + 48 }
                  : undefined
              }
            >
              <button
                className={
                  originalSize
                    ? "image-preview-trigger is-original"
                    : "image-preview-trigger"
                }
                style={
                  originalSize
                    ? { width: image.width, height: image.height }
                    : undefined
                }
                onClick={() => setOriginalSize(!originalSize)}
                aria-label={
                  originalSize ? "缩回适应屏幕" : "以原始尺寸查看图片"
                }
              >
                <img
                  className="image-preview-full-image"
                  src={image.src}
                  alt={image.alt || title}
                  width={image.width}
                  height={image.height}
                />
              </button>
            </div>
          </div>
          {imageCount > 1 && (
            <>
              <button
                className="icon-button image-preview-previous"
                aria-label="上一张预览图片"
                onClick={() => move(-1)}
              >
                <ArrowLeft size={21} />
              </button>
              <button
                className="icon-button image-preview-next"
                aria-label="下一张预览图片"
                onClick={() => move(1)}
              >
                <ArrowRight size={21} />
              </button>
            </>
          )}
        </div>
        <footer className="image-preview-footer">
          <span>
            {originalSize
              ? "拖动滚动条查看细节，点击图片恢复适应屏幕"
              : "点击图片查看原始尺寸"}
          </span>
          <span>Esc 返回详情{imageCount > 1 && " · ← → 切换图片"}</span>
        </footer>
      </div>
    </dialog>
  );
}
