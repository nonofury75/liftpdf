import { EditorialArticlePage } from "@/components/content/editorial-article-page";
import type { MergePdfGuide } from "@/data/merge-pdf-cluster";

type MergePdfGuidePageProps = {
  guide: MergePdfGuide;
};

export function MergePdfGuidePage({ guide }: MergePdfGuidePageProps) {
  return (
    <EditorialArticlePage
      guide={guide}
      label="Merge PDF"
      toolHref="/merge-pdf"
      toolTitle="Merge PDFs now"
      toolDescription="Combine files in the order you choose and download one PDF."
      secondaryHref="/organize-pdf"
      secondaryLabel="Browse organize tools"
      trustItems={["No upload required", "Private by design", "Order preserved"]}
      faqHeading="Questions about merging PDFs"
    />
  );
}
