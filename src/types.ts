export type GalleryImage = {
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  alt: string;
};
export type PromptItem = {
  id: string;
  title: string;
  category: string;
  prompt: string;
  tags: string[];
  sourceLabel: string;
  sourceUrl: string;
  images: GalleryImage[];
};
