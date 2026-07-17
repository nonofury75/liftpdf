import { ImageToPdfTool } from "@/components/tools/image-to-pdf-tool";
import { ToolPageShell } from "@/components/tools/tool-page-shell";
import type { PremiumToolContentData } from "@/components/tools/premium-tool-content";

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
  allowIndividualRotation?: boolean;
  compactHero?: boolean;
  compactRelatedTools?: boolean;
  invalidFileMessage?: string;
  presentation?: "standard" | "showcase";
  premiumContent?: PremiumToolContentData;
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
  allowIndividualRotation,
  compactHero,
  compactRelatedTools,
  invalidFileMessage,
  presentation,
  premiumContent,
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
      compactHero={compactHero}
      compactRelatedTools={compactRelatedTools}
      premiumContent={premiumContent}
    >
      <ImageToPdfTool
        acceptedImageTypes={acceptedImageTypes}
        addMoreAriaLabel={addMoreAriaLabel}
        allowIndividualRotation={allowIndividualRotation}
        downloadFileName={downloadFileName}
        invalidFileMessage={invalidFileMessage}
        presentation={presentation}
        uploadButtonLabel={uploadButtonLabel}
        uploadDescription={uploadDescription}
        uploadTitle={uploadTitle}
      />
    </ToolPageShell>
  );
}
