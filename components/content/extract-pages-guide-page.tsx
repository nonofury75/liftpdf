import { EditorialArticlePage } from "@/components/content/editorial-article-page";
import type { ExtractPagesGuide } from "@/data/extract-pages-cluster";

type ExtractPagesGuidePageProps = {
  guide: ExtractPagesGuide;
};

export function ExtractPagesGuidePage({ guide }: ExtractPagesGuidePageProps) {
  return (
    <EditorialArticlePage
      guide={guide}
      label="Extract PDF Pages"
      toolHref="/extract-pages"
      toolTitle="Extract pages now"
      toolDescription="Use the visual page picker to save selected pages into a new PDF."
      secondaryHref="/organize-pdf"
      secondaryLabel="Browse organize tools"
      trustItems={["No upload required", "Private by design", "PDF quality preserved"]}
      faqHeading="Questions about this workflow"
    />
  );
}
