import { ImageToPdfTool } from "@/components/tools/image-to-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";

type FaqItem = {
  question: string;
  answer: string;
};

type ImageToPdfPageProps = {
  title: string;
  intro: string;
  seoText: string;
  downloadFileName: string;
  faq: FaqItem[];
  currentHref: string;
};

export function ImageToPdfPage({
  title,
  intro,
  seoText,
  downloadFileName,
  faq,
  currentHref,
}: ImageToPdfPageProps) {
  return (
    <ToolPageShell
      title={title}
      description={intro}
      seoTitle="Convert images to PDF online"
      seoText={seoText}
      faq={faq}
      currentHref={currentHref}
    >
      <ImageToPdfTool downloadFileName={downloadFileName} />
    </ToolPageShell>
  );
}
