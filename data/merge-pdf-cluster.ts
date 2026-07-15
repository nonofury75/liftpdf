import type {
  GuideFaqItem,
  GuideLink,
  GuideSection,
} from "@/data/extract-pages-cluster";

export type MergePdfGuide = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  intent: "guide" | "problem" | "comparison" | "faq";
  primaryKeyword: string;
  secondaryKeywords: string[];
  summary: string;
  ctaLabel: string;
  canonical: string;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  quickSteps: string[];
  sections: GuideSection[];
  faq: GuideFaqItem[];
  relatedLinks: GuideLink[];
};

const mergeToolLink = {
  label: "Merge PDF",
  href: "/merge-pdf",
  text: "Combine PDF files in the order you choose.",
} satisfies GuideLink;

const organizeLinks = [
  {
    label: "Split PDF",
    href: "/split-pdf",
    text: "Split a PDF into ranges or one file per page.",
  },
  {
    label: "Delete Pages",
    href: "/delete-pages",
    text: "Remove pages before merging documents together.",
  },
  {
    label: "Extract Pages",
    href: "/extract-pages",
    text: "Save selected PDF pages into a new PDF.",
  },
  {
    label: "Reorder Pages",
    href: "/reorder-pages",
    text: "Move pages into the right sequence after merging.",
  },
  {
    label: "Compress PDF",
    href: "/compress-pdf",
    text: "Rebuild the final merged PDF with safe compression.",
  },
] satisfies GuideLink[];

const workflowImage = {
  src: "/images/seo/merge-pdf/merge-pdf-workflow.webp",
  alt: "LiftPDF Merge PDF workflow with upload, preview and download steps",
  width: 1280,
  height: 860,
};

const beforeImage = {
  src: "/images/seo/merge-pdf/merge-pdf-before.webp",
  alt: "LiftPDF Merge PDF before export with selected PDF files",
  width: 1280,
  height: 860,
};

const afterImage = {
  src: "/images/seo/merge-pdf/merge-pdf-after.webp",
  alt: "LiftPDF Merge PDF success state after creating a merged document",
  width: 1280,
  height: 860,
};

export const mergePdfOgImage = {
  src: "/images/seo/merge-pdf/merge-pdf-og.webp",
  alt: "LiftPDF Merge PDF browser-based workflow preview",
  width: 1200,
  height: 630,
};

const privacySection = {
  heading: "Privacy and browser processing",
  body: [
    "LiftPDF merges PDFs in your browser for supported files. The pages are copied locally into a new document, so the workflow does not require a document upload API.",
    "That matters for contracts, invoices, reports and personal records. You still need to use good judgment with sensitive files, but avoiding a server upload is a practical privacy advantage.",
  ],
} satisfies GuideSection;

const orderSection = {
  heading: "The file order controls the final PDF",
  body: [
    "The most important part of merging PDFs is sequence. The first file becomes the first section of the final PDF, the second file follows it, and so on.",
    "Before you click Merge PDF, check the preview list and move files up or down until the cover page, main document, appendices and attachments are in the right order.",
  ],
} satisfies GuideSection;

const commonFaq = [
  {
    question: "Can I merge PDF files for free?",
    answer:
      "Yes. LiftPDF lets you merge PDF files for free in your browser.",
  },
  {
    question: "Are my PDFs uploaded to a server?",
    answer:
      "For supported files, the merge runs locally in your browser. LiftPDF does not need a backend upload API to combine the pages.",
  },
  {
    question: "Will PDF quality change after merging?",
    answer:
      "No. LiftPDF copies the original PDF pages into a new document instead of converting them into images.",
  },
  {
    question: "Can I change the order before merging?",
    answer:
      "Yes. Reorder the PDF files in the list before exporting. The final PDF follows that order.",
  },
] satisfies GuideFaqItem[];

function guide(input: Omit<MergePdfGuide, "canonical" | "relatedLinks"> & {
  relatedLinks?: GuideLink[];
}): MergePdfGuide {
  return {
    ...input,
    canonical: `/guides/${input.slug}`,
    relatedLinks: input.relatedLinks || [mergeToolLink, ...organizeLinks],
  };
}

export const mergePdfGuides: MergePdfGuide[] = [
  guide({
    slug: "how-to-merge-pdf",
    title: "How to Merge PDF Files Online | LiftPDF",
    description:
      "Learn how to merge PDF files into one document online while keeping the right order, page quality and privacy.",
    h1: "How to Merge PDF Files",
    intent: "guide",
    primaryKeyword: "how to merge pdf",
    secondaryKeywords: [
      "merge pdf files",
      "combine pdf files",
      "join pdf documents",
    ],
    summary:
      "Merging PDFs means combining two or more PDF documents into one file. The key is to upload the files, check their order, merge them, and download a single PDF that keeps every page in sequence.",
    ctaLabel: "Merge PDF files",
    image: workflowImage,
    quickSteps: [
      "Open the Merge PDF tool.",
      "Drop your PDF files into the upload area.",
      "Check the file names, page counts and order.",
      "Move files up or down if the sequence is wrong.",
      "Click Merge PDF and download the combined file.",
    ],
    sections: [
      {
        heading: "When merging PDFs is the right workflow",
        body: [
          "Use Merge PDF when related documents should be delivered as a single file. Common examples include a signed form plus supporting pages, multiple invoice PDFs, report chapters, scanned packets, application documents or contract attachments.",
          "A single PDF is easier to email, archive and review than a group of separate attachments. It also prevents recipients from opening files in the wrong order.",
        ],
      },
      orderSection,
      {
        heading: "What happens to the original PDFs",
        body: [
          "The original files are not overwritten. LiftPDF creates a new merged PDF from copies of the pages in your selected files.",
          "If one PDF contains pages that should not be included, remove them first with Delete Pages or save only the pages you need with Extract Pages.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I merge more than two PDFs?",
        answer:
          "Yes. You can add multiple PDF files and merge them into one document.",
      },
      {
        question: "What should I do before merging PDFs?",
        answer:
          "Check page order, remove unnecessary pages and unlock password-protected files if you have the correct password.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-online",
    title: "Merge PDF Online Free | LiftPDF",
    description:
      "Merge PDF files online for free with a browser-based workflow. Combine files, reorder them and download one PDF.",
    h1: "Merge PDF Online",
    intent: "guide",
    primaryKeyword: "merge pdf online",
    secondaryKeywords: [
      "online pdf merger",
      "combine pdf online",
      "free pdf merger",
    ],
    summary:
      "An online PDF merger should be quick, clear and safe. LiftPDF lets you choose files, preview the list, reorder them and create one merged PDF directly in your browser.",
    ctaLabel: "Open online PDF merger",
    image: beforeImage,
    quickSteps: [
      "Choose PDF files from your device.",
      "Wait for LiftPDF to read page counts and previews.",
      "Confirm the order of the files.",
      "Merge the PDFs locally in the browser.",
      "Download the new merged PDF.",
    ],
    sections: [
      {
        heading: "What to expect from a good online PDF merger",
        body: [
          "A good online merger should make file order obvious, show enough details to avoid mistakes and give a clear download once the merge is complete.",
          "LiftPDF focuses on that simple workflow instead of adding cloud drives, accounts or unrelated editing steps.",
        ],
      },
      orderSection,
      {
        heading: "Online does not have to mean uploaded",
        body: [
          "Many online converters send your documents to a remote server. LiftPDF is built differently for supported files: the browser reads the PDFs and creates the merged file locally.",
          "This is especially useful when you want the convenience of an online tool without adding an unnecessary upload step.",
        ],
      },
      {
        heading: "When to use another tool first",
        body: [
          "Use Compress PDF after merging if the combined file is too large. Use Reorder Pages if the page order inside a PDF is wrong. Use Delete Pages if the source files include blank or duplicate pages.",
        ],
      },
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does Merge PDF work in Chrome, Edge, Firefox and Safari?",
        answer:
          "Yes. The tool is designed for modern browsers on desktop and mobile devices.",
      },
      {
        question: "Can I merge PDFs without creating an account?",
        answer:
          "Yes. LiftPDF does not require an account for the current Merge PDF workflow.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-without-adobe",
    title: "Merge PDF Without Adobe Acrobat | LiftPDF",
    description:
      "Learn how to merge PDF files without Adobe Acrobat using a private browser-based workflow.",
    h1: "How to Merge PDF Files Without Adobe",
    intent: "guide",
    primaryKeyword: "merge pdf without adobe",
    secondaryKeywords: [
      "merge pdf without acrobat",
      "adobe alternative merge pdf",
      "combine pdf without adobe",
    ],
    summary:
      "You do not need Adobe Acrobat for a basic PDF merge. If your files are readable PDFs, LiftPDF can combine them in the browser and download one merged document.",
    ctaLabel: "Merge without Adobe",
    image: workflowImage,
    quickSteps: [
      "Open LiftPDF Merge PDF.",
      "Upload the PDF files you want to combine.",
      "Reorder files into the final sequence.",
      "Click Merge PDF.",
      "Download the merged PDF.",
    ],
    sections: [
      {
        heading: "What you can do without Acrobat",
        body: [
          "For everyday merging, you usually only need to copy the pages from several PDFs into one new PDF. LiftPDF handles that task without requiring a desktop installation.",
          "This is enough for invoices, reports, packets, scans, forms and attachments where the page content should stay unchanged.",
        ],
      },
      {
        heading: "When Adobe may still be useful",
        body: [
          "Adobe Acrobat is still useful for advanced workflows such as redaction, complex form editing, prepress review, enterprise document controls and deeply integrated cloud workflows.",
          "LiftPDF is best when the task is focused: combine files, keep the order clear and download one PDF privately.",
        ],
      },
      privacySection,
      {
        heading: "How to avoid common merge mistakes",
        body: [
          "Rename files before uploading if their names are confusing. Put cover pages first, then the main document, then attachments. Remove duplicates before merging so the final PDF stays clean.",
        ],
      },
    ],
    faq: [
      ...commonFaq,
      {
        question: "Is LiftPDF a full Adobe Acrobat replacement?",
        answer:
          "No. LiftPDF is a focused browser suite for common PDF tasks. It is useful for merging PDFs without installing Acrobat.",
      },
      {
        question: "Can I merge PDFs without a subscription?",
        answer:
          "Yes. The current LiftPDF Merge PDF tool is free and does not require a subscription.",
      },
    ],
  }),
  guide({
    slug: "merge-two-pdf-files",
    title: "Merge Two PDF Files Into One | LiftPDF",
    description:
      "Merge two PDF files into one document, keep the correct order and download a clean combined PDF.",
    h1: "How to Merge Two PDF Files",
    intent: "guide",
    primaryKeyword: "merge two pdf files",
    secondaryKeywords: [
      "combine two pdf files",
      "join two pdf documents",
      "two pdfs into one",
    ],
    summary:
      "To merge two PDFs, upload both files, place the first document above the second, and export one combined PDF. The final file follows the order shown in the list.",
    ctaLabel: "Merge two PDFs",
    image: beforeImage,
    quickSteps: [
      "Upload the first PDF.",
      "Upload the second PDF.",
      "Move the files until the order is correct.",
      "Click Merge PDF.",
      "Download the combined file.",
    ],
    sections: [
      {
        heading: "The simplest merge case",
        body: [
          "Merging two PDFs is common when you have a main document and one attachment: a contract and signature page, an invoice and receipt, a form and ID scan, or a report and appendix.",
          "The first PDF in the list becomes the first part of the final document. The second PDF follows it.",
        ],
      },
      orderSection,
      {
        heading: "Before merging two files",
        body: [
          "Open each PDF if you are unsure what it contains. If either file includes pages that do not belong, clean it first with Delete Pages or Extract Pages.",
          "If the final file is too large, merge first and then use Compress PDF on the combined document.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I put the second PDF first?",
        answer:
          "Yes. Move the second file above the first before merging. The exported PDF follows the order you choose.",
      },
      {
        question: "Will both PDFs stay unchanged?",
        answer:
          "The original files remain unchanged. LiftPDF creates a new PDF from copies of their pages.",
      },
    ],
  }),
  guide({
    slug: "merge-multiple-pdf-files",
    title: "Merge Multiple PDF Files Into One | LiftPDF",
    description:
      "Combine several PDF files into one organized document with page order, file checks and privacy tips.",
    h1: "How to Merge Multiple PDF Files",
    intent: "guide",
    primaryKeyword: "merge multiple pdf files",
    secondaryKeywords: [
      "combine multiple pdfs",
      "merge several pdf files",
      "multiple pdfs into one",
    ],
    summary:
      "When merging several PDFs, the challenge is not the button. The challenge is keeping the final document organized. Use file order, page counts and previews to confirm the sequence before export.",
    ctaLabel: "Merge multiple PDFs",
    image: workflowImage,
    quickSteps: [
      "Add every PDF that belongs in the final document.",
      "Review file names, page counts and sizes.",
      "Move files into the final sequence.",
      "Remove duplicates or incorrect files.",
      "Merge and download one PDF.",
    ],
    sections: [
      {
        heading: "A clean multi-file merge workflow",
        body: [
          "Start with the final reading order: cover page, primary document, supporting files, appendices, exhibits and reference material. Then upload files in that order or rearrange them before merging.",
          "For large packets, page counts are useful. They help confirm that the file list matches the expected final document length.",
        ],
      },
      {
        heading: "When to split or delete before merging",
        body: [
          "If one source PDF contains extra pages, remove them first. If only a few pages are needed from a larger source, extract those pages first and merge the extracted result.",
          "This keeps the final PDF shorter and reduces the chance of sending unnecessary pages.",
        ],
      },
      {
        heading: "After merging",
        body: [
          "Check the downloaded PDF before sending it. If the file is too large for email, use Compress PDF. If a section is in the wrong order, use Reorder Pages on the merged file.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Is there a best order for multiple PDFs?",
        answer:
          "Use the order the recipient should read: cover pages first, core document next, supporting documents last.",
      },
      {
        question: "Can I remove one file before merging?",
        answer:
          "Yes. Remove any file from the list before clicking Merge PDF.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-on-windows",
    title: "How to Merge PDF Files on Windows | LiftPDF",
    description:
      "Merge PDFs on Windows 10 or Windows 11 from a browser without installing desktop PDF software.",
    h1: "How to Merge PDF Files on Windows",
    intent: "guide",
    primaryKeyword: "merge pdf on windows",
    secondaryKeywords: [
      "merge pdf windows 11",
      "combine pdf files windows",
      "merge pdf in edge",
    ],
    summary:
      "On Windows, you can merge PDFs from a modern browser such as Edge, Chrome or Firefox. Upload the files, set their order and download one combined PDF.",
    ctaLabel: "Merge PDFs on Windows",
    image: beforeImage,
    quickSteps: [
      "Open LiftPDF in Edge, Chrome or Firefox.",
      "Choose the PDF files from File Explorer.",
      "Review the order in the file list.",
      "Merge the files.",
      "Save the downloaded PDF from your browser.",
    ],
    sections: [
      {
        heading: "Why use a browser on Windows",
        body: [
          "Windows can open PDFs in Edge, but combining files usually requires another tool. LiftPDF handles the merge from the browser, so you do not need to install a separate desktop PDF editor for a simple merge.",
          "This is useful on work computers where installing software is restricted or when you only need a quick one-time merge.",
        ],
      },
      orderSection,
      {
        heading: "Where the downloaded file goes",
        body: [
          "Most Windows browsers save the merged PDF to your Downloads folder unless you choose another location. The file name is readable, so it is easier to find after export.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does this work on Windows 11?",
        answer:
          "Yes. Use a modern browser such as Edge, Chrome or Firefox.",
      },
      {
        question: "Do I need Microsoft Word or Adobe Acrobat?",
        answer:
          "No. For basic PDF merging, LiftPDF works directly in the browser.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-on-mac",
    title: "How to Merge PDF Files on Mac | LiftPDF",
    description:
      "Merge PDF files on macOS from Safari, Chrome or Firefox while keeping documents local in the browser.",
    h1: "How to Merge PDF Files on Mac",
    intent: "guide",
    primaryKeyword: "merge pdf on mac",
    secondaryKeywords: [
      "combine pdf files mac",
      "merge pdf safari",
      "merge pdf without preview",
    ],
    summary:
      "Mac users can merge PDFs in the browser with LiftPDF. Choose files, check their order and download one combined PDF without a desktop app workflow.",
    ctaLabel: "Merge PDFs on Mac",
    image: workflowImage,
    quickSteps: [
      "Open LiftPDF in Safari, Chrome or Firefox.",
      "Choose PDFs from Finder.",
      "Drag or move files into the correct order.",
      "Click Merge PDF.",
      "Find the merged file in Downloads.",
    ],
    sections: [
      {
        heading: "Browser merging vs Preview",
        body: [
          "Preview is useful for many Mac PDF tasks, but browser merging can be faster when you want the same workflow across Mac, Windows and mobile.",
          "LiftPDF shows the files, page counts and order in one place before creating the final PDF.",
        ],
      },
      orderSection,
      {
        heading: "Safari compatibility",
        body: [
          "LiftPDF is designed for modern browsers, including Safari. Advanced PDF workflows use browser APIs, so keeping Safari updated gives the best result.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I merge PDFs on Mac without Preview?",
        answer:
          "Yes. LiftPDF works in a browser and does not require Preview for the merge operation.",
      },
      {
        question: "Does it work in Safari?",
        answer:
          "Yes, use a recent version of Safari for the best browser support.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-on-iphone",
    title: "How to Merge PDF Files on iPhone | LiftPDF",
    description:
      "Merge PDF files on iPhone from the browser, reorder files and download one combined PDF.",
    h1: "How to Merge PDF Files on iPhone",
    intent: "guide",
    primaryKeyword: "merge pdf on iphone",
    secondaryKeywords: [
      "combine pdf iphone",
      "merge pdf ios",
      "merge pdf in safari iphone",
    ],
    summary:
      "On iPhone, use Safari or another modern browser to choose PDFs from Files, arrange them and download one merged PDF.",
    ctaLabel: "Merge PDFs on iPhone",
    image: beforeImage,
    quickSteps: [
      "Open LiftPDF on your iPhone.",
      "Tap Choose PDF files.",
      "Select PDFs from the Files app.",
      "Use the move buttons to adjust order.",
      "Merge and save the downloaded PDF.",
    ],
    sections: [
      {
        heading: "Mobile merging is mostly about order",
        body: [
          "On smaller screens, drag and drop may be less comfortable than buttons. LiftPDF keeps move controls available so you can still put files in the correct order before merging.",
          "Use clear file names in the Files app when possible. That makes it easier to identify the right sequence on mobile.",
        ],
      },
      {
        heading: "Where the result is saved",
        body: [
          "Your browser controls where downloads go. On iPhone, the merged PDF is typically available through the Downloads folder in Files, depending on your Safari settings.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I merge PDFs from the iPhone Files app?",
        answer:
          "Yes. Tap the upload button and choose files from the Files app.",
      },
      {
        question: "Can I reorder files on iPhone?",
        answer:
          "Yes. Use the move buttons in the file list before merging.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-on-android",
    title: "How to Merge PDF Files on Android | LiftPDF",
    description:
      "Merge PDF files on Android using Chrome or another modern browser without installing a PDF app.",
    h1: "How to Merge PDF Files on Android",
    intent: "guide",
    primaryKeyword: "merge pdf on android",
    secondaryKeywords: [
      "combine pdf android",
      "merge pdf chrome android",
      "merge pdf on phone",
    ],
    summary:
      "Android users can merge PDFs from Chrome or another modern browser. Choose files, arrange them, merge locally and download the combined PDF.",
    ctaLabel: "Merge PDFs on Android",
    image: workflowImage,
    quickSteps: [
      "Open LiftPDF in Chrome on Android.",
      "Choose PDF files from your device.",
      "Review the selected files.",
      "Use move controls to set the final order.",
      "Merge and download the PDF.",
    ],
    sections: [
      {
        heading: "Using Chrome on Android",
        body: [
          "Chrome on Android supports the browser APIs needed for LiftPDF's PDF workflow. Use the upload button to choose local files, then review the selected PDF list before exporting.",
          "If your PDFs are stored in a cloud app, save them locally first when possible. Local files are easier for the browser to process reliably.",
        ],
      },
      orderSection,
      {
        heading: "Mobile file-size tips",
        body: [
          "Very large PDFs can use more memory on phones. If a merge fails on mobile, try fewer files at once or use a desktop browser for the largest packets.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does Merge PDF work on Android phones?",
        answer:
          "Yes. Use a modern browser such as Chrome for Android.",
      },
      {
        question: "What if a PDF is too large on mobile?",
        answer:
          "Try merging fewer files at once or use a desktop device for very large packets.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-free",
    title: "Merge PDF Free Online | LiftPDF",
    description:
      "Use a free PDF merger to combine files in your browser with no account, no trial wall and no document upload API.",
    h1: "Merge PDF Free",
    intent: "guide",
    primaryKeyword: "merge pdf free",
    secondaryKeywords: [
      "free pdf merger",
      "combine pdf free",
      "free online pdf merger",
    ],
    summary:
      "A free PDF merger should be direct: choose files, order them, merge and download. LiftPDF keeps the workflow free for current tools and avoids adding watermarks to the output.",
    ctaLabel: "Use free PDF merger",
    image: afterImage,
    quickSteps: [
      "Open the free Merge PDF tool.",
      "Add the PDFs you want to combine.",
      "Check the order and page counts.",
      "Merge the files.",
      "Download the finished PDF.",
    ],
    sections: [
      {
        heading: "What free should mean",
        body: [
          "For this task, free should mean no account requirement, no trial wall before download and no watermark added to the merged PDF.",
          "LiftPDF is designed around that straightforward model for the current tools.",
        ],
      },
      privacySection,
      {
        heading: "Limits to understand",
        body: [
          "Browser-side merging depends on your device memory and browser support. Very large PDFs can take longer or fail on older devices.",
          "Password-protected PDFs need to be unlocked first with the correct password. LiftPDF will not bypass encryption or create a broken merged file.",
        ],
      },
      {
        heading: "Make the final file easier to share",
        body: [
          "After merging, open the PDF once to confirm the page order. If the file is too large for email or a portal upload, use Compress PDF on the merged output.",
        ],
      },
    ],
    faq: [
      ...commonFaq,
      {
        question: "Does LiftPDF add a watermark?",
        answer:
          "No. Merge PDF does not add a LiftPDF watermark to your output.",
      },
      {
        question: "Do I need to sign in?",
        answer:
          "No. You can use the current Merge PDF tool without creating an account.",
      },
    ],
  }),
  guide({
    slug: "why-cant-i-merge-pdf-files",
    title: "Why Can't I Merge PDF Files? | LiftPDF",
    description:
      "Understand why PDF merging can fail and how to fix invalid files, protected PDFs, large files and browser issues.",
    h1: "Why Can't I Merge PDF Files?",
    intent: "problem",
    primaryKeyword: "why can't i merge pdf files",
    secondaryKeywords: [
      "pdf merge not working",
      "cannot combine pdf files",
      "merge pdf failed",
    ],
    summary:
      "PDF merging usually fails for a practical reason: the file is protected, damaged, too large for the device, not really a PDF, or blocked by browser limits.",
    ctaLabel: "Try Merge PDF again",
    image: beforeImage,
    quickSteps: [
      "Confirm every selected file is a real PDF.",
      "Open each PDF in a viewer to check it is readable.",
      "Unlock protected PDFs if you know the password.",
      "Remove damaged or empty files from the list.",
      "Try again with fewer files if the packet is very large.",
    ],
    sections: [
      {
        heading: "Common reasons PDF merging fails",
        body: [
          "The most common causes are encrypted PDFs, damaged files, files with a .pdf extension that are not valid PDFs, browser memory limits and source PDFs that cannot be parsed.",
          "A good merge tool should show a clear error instead of producing a corrupt output. LiftPDF blocks the merge when a selected PDF cannot be read safely.",
        ],
      },
      {
        heading: "How to isolate the bad file",
        body: [
          "Try opening each file separately. If one PDF asks for a password, unlock it first. If one file cannot open in a normal viewer, replace it with a clean copy.",
          "For large batches, merge two or three files first. Add more files once you know the first group works.",
        ],
      },
      {
        heading: "When the browser is the limit",
        body: [
          "Browser-side tools use your device memory. Very large scans or long image-heavy PDFs can be harder to process on phones and older laptops.",
          "If a merge fails on mobile, try the same files on a desktop browser or reduce the batch size.",
        ],
      },
      privacySection,
    ],
    faq: [
      {
        question: "Why does my PDF merge fail?",
        answer:
          "A selected PDF may be protected, damaged, invalid or too large for the browser to process comfortably.",
      },
      {
        question: "Can password-protected PDFs be merged?",
        answer:
          "Only after they are unlocked with the correct password. LiftPDF does not bypass PDF encryption.",
      },
      {
        question: "Can a renamed file cause merge errors?",
        answer:
          "Yes. A file ending in .pdf still needs to contain valid PDF data.",
      },
      {
        question: "Should I try fewer files?",
        answer:
          "Yes. Smaller batches can help identify one problematic PDF or avoid device memory limits.",
      },
    ],
  }),
  guide({
    slug: "why-is-my-merged-pdf-too-large",
    title: "Why Is My Merged PDF Too Large? | LiftPDF",
    description:
      "Learn why merged PDFs become large and how to reduce file size without pretending every PDF can shrink dramatically.",
    h1: "Why Is My Merged PDF Too Large?",
    intent: "problem",
    primaryKeyword: "merged pdf too large",
    secondaryKeywords: [
      "why is my pdf too large after merging",
      "reduce merged pdf size",
      "merged pdf file size",
    ],
    summary:
      "A merged PDF is usually large because the source files contain high-resolution scans, photos, embedded images, duplicate pages or already-large PDFs.",
    ctaLabel: "Merge then compress PDF",
    image: afterImage,
    quickSteps: [
      "Remove pages that do not belong before merging.",
      "Avoid adding duplicate scans or repeated attachments.",
      "Merge the cleaned PDFs.",
      "Open the merged file once to verify order.",
      "Use Compress PDF if the final file is too large.",
    ],
    sections: [
      {
        heading: "Why merging increases file size",
        body: [
          "Merging does not magically shrink the source documents. If you combine five large PDFs, the final PDF will usually be close to the total size of those files.",
          "Image-heavy scans, photos and high-resolution exports are the most common reason a merged PDF becomes too large for email or upload portals.",
        ],
      },
      {
        heading: "Best fixes before compression",
        body: [
          "Delete blank pages, remove duplicates and extract only needed pages before merging. This reduces the amount of content that needs to be carried into the final PDF.",
          "If your source files are image PDFs made from photos, consider whether every image page is necessary.",
        ],
      },
      {
        heading: "What compression can and cannot do",
        body: [
          "LiftPDF's compression is safe and browser-side. It can rebuild a PDF and remove metadata where possible, but it does not promise extreme server-side image recompression.",
          "If the file is already optimized, the final size may not shrink much. Honest compression messaging is better than fake levels that do not change the result.",
        ],
      },
      privacySection,
    ],
    faq: [
      {
        question: "Why did my merged PDF become huge?",
        answer:
          "The merged file includes the content of every source PDF. Large scans and images make the final PDF large.",
      },
      {
        question: "Can I compress a merged PDF?",
        answer:
          "Yes. Use Compress PDF after merging if the final document is too large.",
      },
      {
        question: "Should I delete pages before merging?",
        answer:
          "Yes. Removing unnecessary pages before merging is often the cleanest file-size fix.",
      },
      {
        question: "Can every PDF be made much smaller?",
        answer:
          "No. Some PDFs are already optimized or contain content that cannot shrink safely in a browser workflow.",
      },
    ],
    relatedLinks: [
      mergeToolLink,
      {
        label: "Compress PDF",
        href: "/compress-pdf",
        text: "Reduce the final merged file when possible.",
      },
      ...organizeLinks,
    ],
  }),
  guide({
    slug: "why-does-merge-pdf-fail",
    title: "Why Does Merge PDF Fail? | LiftPDF",
    description:
      "Troubleshoot failed PDF merges caused by invalid files, protected documents, browser limits or damaged PDFs.",
    h1: "Why Does Merge PDF Fail?",
    intent: "problem",
    primaryKeyword: "why does merge pdf fail",
    secondaryKeywords: [
      "merge pdf failed",
      "pdf merger error",
      "pdf files could not be merged",
    ],
    summary:
      "A merge failure is usually a file-read problem, not a mystery. The safest fix is to identify the file that cannot be read and replace, unlock or simplify it.",
    ctaLabel: "Open Merge PDF",
    image: beforeImage,
    quickSteps: [
      "Check whether every file opens normally.",
      "Remove any file that shows an error in LiftPDF.",
      "Unlock encrypted PDFs with the correct password.",
      "Try a smaller batch.",
      "Merge again and confirm the downloaded result.",
    ],
    sections: [
      {
        heading: "Failed merge vs bad output",
        body: [
          "A failed merge means the tool could not safely create the output. A bad output means the PDF was created but the order or content is not what you expected.",
          "LiftPDF tries to fail clearly when a file cannot be read, because downloading a broken PDF would be worse than showing an error.",
        ],
      },
      {
        heading: "Check the source files",
        body: [
          "Open each source file in a normal PDF viewer. If one file fails there, it will probably fail during merging too.",
          "If a file asks for a password, use Unlock PDF first if you have the correct password and permission to unlock it.",
        ],
      },
      {
        heading: "Check size and device limits",
        body: [
          "Very large PDFs may require more memory than a mobile browser can comfortably provide. Try the same files in a desktop browser or merge fewer files at once.",
        ],
      },
      privacySection,
    ],
    faq: [
      {
        question: "What is the fastest way to find the file causing failure?",
        answer:
          "Merge files in smaller groups. When one group fails, test the files in that group individually.",
      },
      {
        question: "Can damaged PDFs be repaired by merging?",
        answer:
          "Not reliably. Replace the damaged PDF with a clean export before merging.",
      },
      {
        question: "Can browser extensions affect merging?",
        answer:
          "Rarely, but if a tool behaves unexpectedly, try a private window or another browser.",
      },
      {
        question: "Does LiftPDF upload files to fix merge errors?",
        answer:
          "No. The workflow is designed to process supported files locally in your browser.",
      },
    ],
  }),
  guide({
    slug: "why-cant-i-merge-protected-pdfs",
    title: "Why Can't I Merge Protected PDFs? | LiftPDF",
    description:
      "Learn why password-protected PDFs must be unlocked before merging and how to handle encrypted files safely.",
    h1: "Why Can't I Merge Protected PDFs?",
    intent: "problem",
    primaryKeyword: "merge protected pdfs",
    secondaryKeywords: [
      "merge password protected pdf",
      "cannot merge encrypted pdf",
      "unlock pdf before merging",
    ],
    summary:
      "Protected PDFs are encrypted so tools cannot read their pages without the correct password. To merge them, unlock the file first if you are authorized.",
    ctaLabel: "Unlock then merge",
    image: afterImage,
    quickSteps: [
      "Confirm you have permission to open the protected PDF.",
      "Use Unlock PDF with the correct password.",
      "Download the unlocked copy.",
      "Add the unlocked PDF to Merge PDF.",
      "Merge and optionally protect the final PDF again.",
    ],
    sections: [
      {
        heading: "Why encryption blocks merging",
        body: [
          "Merging requires reading and copying pages. If a PDF is encrypted, the page content cannot be copied until the correct password is provided.",
          "LiftPDF does not bypass passwords. It should never pretend to merge files it cannot legally or technically read.",
        ],
      },
      {
        heading: "The safe workflow",
        body: [
          "Unlock the PDF first with the correct password. Then merge the unlocked copy with your other documents. If the final merged PDF is sensitive, protect it again with a new password.",
        ],
      },
      {
        heading: "Permissions and responsibility",
        body: [
          "Only unlock and merge protected PDFs you own or are allowed to use. Password removal is a convenience for authorized workflows, not a password recovery feature.",
        ],
      },
      privacySection,
    ],
    faq: [
      {
        question: "Can LiftPDF merge a PDF if I do not know the password?",
        answer:
          "No. You need the correct password or an unlocked copy of the PDF.",
      },
      {
        question: "Can I protect the merged PDF again?",
        answer:
          "Yes. After merging, use Protect PDF to add password encryption to the final document.",
      },
      {
        question: "Does Unlock PDF recover lost passwords?",
        answer:
          "No. Unlock PDF only works when you provide the correct password.",
      },
      {
        question: "Are passwords uploaded?",
        answer:
          "No. LiftPDF's unlock and protect workflows are designed to run locally in the browser with QPDF WASM.",
      },
    ],
    relatedLinks: [
      {
        label: "Unlock PDF",
        href: "/unlock-pdf",
        text: "Remove password protection when you have the correct password.",
      },
      mergeToolLink,
      {
        label: "Protect PDF",
        href: "/protect-pdf",
        text: "Encrypt the final merged PDF after combining files.",
      },
      ...organizeLinks,
    ],
  }),
  guide({
    slug: "merge-pdf-vs-combine-pdf",
    title: "Merge PDF vs Combine PDF | LiftPDF",
    description:
      "Understand whether merge PDF and combine PDF mean the same thing and which workflow to use.",
    h1: "Merge PDF vs Combine PDF",
    intent: "comparison",
    primaryKeyword: "merge pdf vs combine pdf",
    secondaryKeywords: [
      "merge or combine pdf",
      "join pdf vs combine pdf",
      "combine pdf meaning",
    ],
    summary:
      "For most users, merge PDF and combine PDF mean the same task: put multiple PDFs into one file. The important decision is file order and whether pages should be removed first.",
    ctaLabel: "Merge or combine PDFs",
    image: workflowImage,
    quickSteps: [
      "Collect the PDF files.",
      "Decide the final reading order.",
      "Remove pages that should not be included.",
      "Combine the PDFs into one file.",
      "Review the merged PDF before sharing.",
    ],
    sections: [
      {
        heading: "Do merge and combine mean the same thing?",
        body: [
          "In everyday PDF tools, yes. Merge PDF, Combine PDF and Join PDF usually describe the same operation: create one PDF from multiple PDFs.",
          "Some software uses combine for broader workflows that may include images or Office files. LiftPDF's Merge PDF tool is specifically for combining PDF files.",
        ],
      },
      {
        heading: "When wording matters",
        body: [
          "If you need to combine JPG or PNG images into a PDF, use Images to PDF instead. If you need to combine existing PDF documents, use Merge PDF.",
          "If you need to rearrange pages inside one PDF, use Reorder Pages. If you need to remove pages, use Delete Pages.",
        ],
      },
      orderSection,
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Is Join PDF another name for Merge PDF?",
        answer:
          "Usually yes. Join, merge and combine often refer to creating one PDF from multiple PDF files.",
      },
      {
        question: "Can Merge PDF combine images too?",
        answer:
          "Merge PDF is for PDF files. Use Images to PDF for JPG, PNG or WEBP files.",
      },
    ],
  }),
  guide({
    slug: "merge-pdf-vs-adobe",
    title: "LiftPDF Merge PDF vs Adobe Acrobat | LiftPDF",
    description:
      "Compare LiftPDF and Adobe Acrobat for merging PDFs, including privacy, installation, accounts and advanced workflows.",
    h1: "Merge PDF: LiftPDF vs Adobe Acrobat",
    intent: "comparison",
    primaryKeyword: "merge pdf vs adobe",
    secondaryKeywords: [
      "adobe merge pdf alternative",
      "merge pdf without acrobat",
      "liftpdf vs adobe merge pdf",
    ],
    summary:
      "Adobe Acrobat is a powerful PDF platform. LiftPDF is a focused browser tool for quick PDF merging without account friction or unnecessary upload workflows.",
    ctaLabel: "Try LiftPDF Merge PDF",
    image: afterImage,
    quickSteps: [
      "Use Adobe when you need a full professional PDF suite.",
      "Use LiftPDF when you need a quick browser merge.",
      "Upload files to LiftPDF only through the local browser picker.",
      "Check order and page counts.",
      "Download one merged PDF.",
    ],
    sections: [
      {
        heading: "Where Adobe is stronger",
        body: [
          "Adobe has deep PDF authority, desktop tools and enterprise workflows. It is the stronger choice for advanced editing, redaction, form work, signatures and complex document management.",
          "If your organization already uses Adobe Acrobat, it may be the natural place to manage heavy PDF workflows.",
        ],
      },
      {
        heading: "Where LiftPDF is simpler",
        body: [
          "LiftPDF is built for common browser tasks. For merging PDFs, the workflow is direct: add files, order them and download one result.",
          "The main advantage is privacy-oriented browser processing for supported files. You do not need a desktop app just to combine everyday PDFs.",
        ],
      },
      {
        heading: "Which one should you use?",
        body: [
          "Choose Adobe for enterprise-grade PDF editing and broader document control. Choose LiftPDF when the job is simply to merge PDFs quickly, privately and without extra product surface.",
        ],
      },
      privacySection,
    ],
    faq: [
      {
        question: "Is LiftPDF better than Adobe?",
        answer:
          "Not for every PDF task. Adobe is broader. LiftPDF is simpler for quick browser-side merging.",
      },
      {
        question: "Can LiftPDF replace Acrobat for merging?",
        answer:
          "For basic merging, yes. For advanced PDF editing, Acrobat may still be the better tool.",
      },
      {
        question: "Does LiftPDF require installation?",
        answer:
          "No. Merge PDF runs in a modern browser.",
      },
      ...commonFaq.slice(1, 3),
    ],
  }),
  guide({
    slug: "merge-pdf-vs-smallpdf",
    title: "LiftPDF Merge PDF vs Smallpdf | LiftPDF",
    description:
      "Compare LiftPDF and Smallpdf for merging PDF files, including workflow simplicity, privacy and tool breadth.",
    h1: "Merge PDF: LiftPDF vs Smallpdf",
    intent: "comparison",
    primaryKeyword: "merge pdf vs smallpdf",
    secondaryKeywords: [
      "smallpdf merge pdf alternative",
      "liftpdf vs smallpdf",
      "private pdf merger",
    ],
    summary:
      "Smallpdf offers a broad PDF platform. LiftPDF focuses on a privacy-first browser workflow for common PDF tasks like merging, organizing and converting.",
    ctaLabel: "Try LiftPDF Merge PDF",
    image: workflowImage,
    quickSteps: [
      "Choose Smallpdf if you need its broader platform features.",
      "Choose LiftPDF for a direct browser-side merge.",
      "Add PDFs to LiftPDF.",
      "Confirm file order.",
      "Download the merged PDF.",
    ],
    sections: [
      {
        heading: "Where Smallpdf is stronger",
        body: [
          "Smallpdf has a wide product ecosystem and many conversion workflows. It is a familiar choice for users who want a large cloud-based PDF platform.",
          "Its breadth is useful when you need tools beyond LiftPDF's current V1 set.",
        ],
      },
      {
        heading: "Where LiftPDF is stronger",
        body: [
          "LiftPDF's advantage is focus. The Merge PDF workflow is direct, free for current use and built around local browser processing for supported files.",
          "That makes it a good choice when you want to combine PDFs without adding account, cloud storage or upload assumptions to a simple task.",
        ],
      },
      privacySection,
      {
        heading: "The practical choice",
        body: [
          "Use the product that matches the job. If the task is just to combine files in order, LiftPDF keeps the workflow light. If you need a larger business PDF platform, Smallpdf may cover more surrounding needs.",
        ],
      },
    ],
    faq: [
      {
        question: "Is LiftPDF a Smallpdf clone?",
        answer:
          "No. LiftPDF uses its own privacy-first browser workflow and focuses on common tools without copying competitor content or design.",
      },
      {
        question: "Does LiftPDF upload PDFs like many online tools?",
        answer:
          "For supported files, LiftPDF merges locally in the browser instead of requiring a document upload API.",
      },
      ...commonFaq,
    ],
  }),
  guide({
    slug: "merge-pdf-vs-ilovepdf",
    title: "LiftPDF Merge PDF vs iLovePDF | LiftPDF",
    description:
      "Compare LiftPDF and iLovePDF for merging PDF files, with a focus on workflow, privacy and simplicity.",
    h1: "Merge PDF: LiftPDF vs iLovePDF",
    intent: "comparison",
    primaryKeyword: "merge pdf vs ilovepdf",
    secondaryKeywords: [
      "ilovepdf merge alternative",
      "liftpdf vs ilovepdf",
      "browser pdf merger",
    ],
    summary:
      "iLovePDF is a well-known PDF tool suite. LiftPDF's Merge PDF tool aims to be quieter, privacy-focused and direct for users who want a clean browser merge.",
    ctaLabel: "Try LiftPDF Merge PDF",
    image: afterImage,
    quickSteps: [
      "Use iLovePDF if you prefer its established suite.",
      "Use LiftPDF if you want browser-side processing for a simple merge.",
      "Add your PDFs.",
      "Check the file order.",
      "Merge and download the result.",
    ],
    sections: [
      {
        heading: "Where iLovePDF is stronger",
        body: [
          "iLovePDF has a broad, mature tool set and very strong search visibility. Many users already know its PDF workflows.",
          "Its scale is an advantage for users who need many PDF actions in one established platform.",
        ],
      },
      {
        heading: "Where LiftPDF is different",
        body: [
          "LiftPDF keeps the Merge PDF workflow deliberately simple: upload files, order them, merge and download.",
          "The core positioning is privacy by design. For supported files, the browser performs the operation locally rather than relying on a backend upload step.",
        ],
      },
      {
        heading: "What LiftPDF should not copy",
        body: [
          "A good alternative does not need to copy another product's interface, wording or imagery. LiftPDF should compete by being clear, fast, honest and private.",
        ],
      },
      privacySection,
    ],
    faq: [
      {
        question: "Is LiftPDF affiliated with iLovePDF?",
        answer:
          "No. LiftPDF is independent and does not copy iLovePDF content or design.",
      },
      {
        question: "Why use LiftPDF instead?",
        answer:
          "Use LiftPDF when you want a simple no-account merge workflow designed around local browser processing.",
      },
      ...commonFaq,
    ],
  }),
  guide({
    slug: "merge-pdf-faq",
    title: "Merge PDF FAQ | LiftPDF",
    description:
      "Answers to common Merge PDF questions about file order, privacy, quality, protected PDFs, mobile use and file size.",
    h1: "Merge PDF FAQ",
    intent: "faq",
    primaryKeyword: "merge pdf faq",
    secondaryKeywords: [
      "merge pdf questions",
      "pdf merger help",
      "combine pdf help",
    ],
    summary:
      "This FAQ answers the questions users usually have before combining PDF files: order, quality, privacy, protected files, file size and mobile support.",
    ctaLabel: "Open Merge PDF",
    image: workflowImage,
    quickSteps: [
      "Open Merge PDF.",
      "Add the files you want to combine.",
      "Check order, page counts and file names.",
      "Merge the files.",
      "Download and review the final PDF.",
    ],
    sections: [
      {
        heading: "The short answer",
        body: [
          "Merge PDF creates one document from multiple PDF files. The final order follows the order shown in the file list.",
          "For supported files, LiftPDF performs the merge locally in your browser and downloads the result to your device.",
        ],
      },
      {
        heading: "Before you merge",
        body: [
          "Remove pages that do not belong, unlock protected PDFs if you know the password, and rename confusing files before upload.",
          "If the merged PDF needs page numbers or a watermark, merge first and add those finishing touches after the document is in its final order.",
        ],
      },
      {
        heading: "After you merge",
        body: [
          "Open the merged PDF before sending it. Confirm that the order, page count and content are correct. Use Compress PDF if the combined file is too large.",
        ],
      },
      privacySection,
    ],
    faq: [
      ...commonFaq,
      {
        question: "Can I merge PDFs on a phone?",
        answer:
          "Yes. On mobile, use the move buttons to adjust file order before merging.",
      },
      {
        question: "Can I merge scanned PDFs?",
        answer:
          "Yes, if they are valid readable PDFs. Image-heavy scans may create a larger final file.",
      },
      {
        question: "Can I merge PDFs and images together?",
        answer:
          "Merge PDF accepts PDF files. Convert images with Images to PDF first, then merge the resulting PDF if needed.",
      },
      {
        question: "Why is the merged PDF large?",
        answer:
          "The final file contains the pages from every source PDF. Scans and photos often make the merged file larger.",
      },
      {
        question: "Can I add page numbers after merging?",
        answer:
          "Yes. Merge first, then use Add Page Numbers on the final document.",
      },
      {
        question: "Can I protect the merged PDF?",
        answer:
          "Yes. Use Protect PDF after merging if the final document should require a password.",
      },
    ],
  }),
];

export function getMergePdfGuide(slug: string) {
  return mergePdfGuides.find((guideItem) => guideItem.slug === slug);
}
