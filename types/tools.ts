export type ToolCategory = "Convert" | "Images" | "Organize" | "Edit" | "Security";

export type ToolIcon =
  | "fileText"
  | "image"
  | "merge"
  | "split"
  | "compress"
  | "rotate"
  | "hash"
  | "stamp"
  | "lock"
  | "unlock"
  | "signature"
  | "crop"
  | "trash"
  | "layers"
  | "text";

export type ToolCard = {
  title: string;
  href: string;
  description: string;
  category: ToolCategory;
  keywords: string[];
  available: boolean;
  comingSoon: boolean;
  related: string[];
  icon: ToolIcon;
};
