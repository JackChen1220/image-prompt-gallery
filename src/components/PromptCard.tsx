import type { PromptItem } from "../types";
import { CopyButton } from "./CopyButton";

type Props = {
  item: PromptItem;
  index: number;
  onOpen: (item: PromptItem) => void;
  onError: (message: string) => void;
};
export function PromptCard({ item, index, onOpen, onError }: Props) {
  const cover = item.images[0];
  return (
    <article className="prompt-card">
      <button
        className="image-button"
        aria-label={`查看提示词：${item.title}`}
        onClick={() => onOpen(item)}
      >
        <img
          src={cover.thumbnail}
          width={cover.width}
          height={cover.height}
          alt={cover.alt || item.title}
          loading={index < 8 ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="image-hint">
          查看提示词 <span aria-hidden="true">↗</span>
        </span>
        {item.images.length > 1 && (
          <span className="image-count">{item.images.length} 张</span>
        )}
      </button>
      <div className="card-caption">
        <div className="card-description">
          <button className="title-button" onClick={() => onOpen(item)}>
            {item.title}
          </button>
          <p>{item.category}</p>
        </div>
        <CopyButton
          compact
          text={item.prompt}
          title={item.title}
          onError={onError}
        />
      </div>
    </article>
  );
}
