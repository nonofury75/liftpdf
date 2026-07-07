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
  acceptedImageTypes?: string[];
  addMoreAriaLabel?: string;
  invalidFileMessage?: string;
  uploadButtonLabel?: string;
  uploadDescription?: string;
  uploadTitle?: string;
};

export function ImageToPdfPage({
  title,
  intro,
  seoText,
  downloadFileName,
  faq,
  currentHref,
  acceptedImageTypes,
  addMoreAriaLabel,
  invalidFileMessage,
  uploadButtonLabel,
  uploadDescription,
  uploadTitle,
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
      <ImageToPdfTool
        acceptedImageTypes={acceptedImageTypes}
        addMoreAriaLabel={addMoreAriaLabel}
        downloadFileName={downloadFileName}
        invalidFileMessage={invalidFileMessage}
        uploadButtonLabel={uploadButtonLabel}
        uploadDescription={uploadDescription}
        uploadTitle={uploadTitle}
      />
    </ToolPageShell>
  );
}
