import { Download } from "lucide-react";
import type { GalleryImage } from "../types";

type Props = {
  image: GalleryImage;
  title: string;
  imageIndex: number;
  imageCount: number;
  className?: string;
};

export function ImageDownloadLink({
  image,
  title,
  imageIndex,
  imageCount,
  className = "image-tool",
}: Props) {
  const extension = image.src.split(".").pop() ?? "png";
  const safeTitle = title.replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_");
  const suffix = imageCount > 1 ? `-${imageIndex + 1}` : "";

  return (
    <a
      className={className}
      href={image.src}
      download={`${safeTitle}${suffix}.${extension}`}
      aria-label={`下载原图：${title}${imageCount > 1 ? `（第 ${imageIndex + 1} 张）` : ""}`}
    >
      <Download size={16} aria-hidden="true" />
      <span>下载原图</span>
    </a>
  );
}
