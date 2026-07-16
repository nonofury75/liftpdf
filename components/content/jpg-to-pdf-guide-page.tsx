import { EditorialArticlePage } from "@/components/content/editorial-article-page";
import type { JpgToPdfGuide } from "@/data/jpg-to-pdf-cluster";

type JpgToPdfGuidePageProps = {
  guide: JpgToPdfGuide;
};

export function JpgToPdfGuidePage({ guide }: JpgToPdfGuidePageProps) {
  return (
    <EditorialArticlePage
      guide={guide}
      label="JPG to PDF"
      toolHref="/jpg-to-pdf"
      toolTitle="Convert JPGs now"
      toolDescription="Turn JPG images into a clean PDF with live layout preview."
      secondaryHref="/pdf-image-tools"
      secondaryLabel="Browse image tools"
      trustItems={["Works in your browser", "Private by design", "Layout preview"]}
      faqHeading="Questions about JPG to PDF"
    />
  );
}
