import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, CircleAlert, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LearningResourceCard } from "@/components/learn/learning-resource-card";
import type { LearningGuide, LearningTopic } from "@/data/learning-center";

type LearningTopicPageProps = {
  topic: LearningTopic;
  guides: LearningGuide[];
  relatedTopics: LearningTopic[];
};

export function LearningTopicPage({
  topic,
  guides,
  relatedTopics,
}: LearningTopicPageProps) {
  const startGuide = guides.find((guide) => guide.slug === topic.startGuideSlug);

  return (
    <main className="bg-background">
      <section className="border-b border-border bg-muted/35">
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              {topic.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-normal text-foreground sm:text-5xl">
              {topic.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-muted-foreground">
              {topic.description}
            </p>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              {topic.intro}
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {startGuide ? (
                <Button asChild size="lg">
                  <Link href={startGuide.href}>
                    Start with this guide
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
              <Button asChild variant="outline" size="lg">
                <Link href="/pdf-tools">Use a PDF tool</Link>
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-3 shadow-sm">
            <Image
              src={topic.image.src}
              alt={topic.image.alt}
              width={topic.image.width}
              height={topic.image.height}
              priority
              className="h-auto w-full rounded-2xl"
              sizes="(min-width: 1024px) 620px, 100vw"
            />
          </div>
        </div>
      </section>

      <section className="py-14" aria-labelledby="topic-guides">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-normal text-primary">
                Recommended path
              </p>
              <h2 id="topic-guides" className="mt-2 text-3xl font-bold">
                Guides for {topic.title.toLowerCase()}
              </h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                {guides.map((guide, index) => (
                  <LearningResourceCard
                    key={guide.href}
                    guide={guide}
                    priority={index < 2}
                  />
                ))}
              </div>
            </div>

            <aside className="space-y-5">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-center gap-2">
                  <Compass className="size-5 text-primary" aria-hidden="true" />
                  <h2 className="text-lg font-bold">Use the tool</h2>
                </div>
                <div className="mt-4 grid gap-3">
                  {topic.toolLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                    >
                      <span className="font-semibold text-foreground">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                        {link.text}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="bg-muted/35 py-14" aria-labelledby="choose-tool">
        <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              How to choose
            </p>
            <h2 id="choose-tool" className="mt-2 text-2xl font-bold">
              Choose the smallest workflow that solves the task
            </h2>
            <ul className="mt-6 grid gap-4">
              {topic.tasks.map((task) => (
                <li key={task} className="flex gap-3">
                  <CheckCircle2
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-6 text-muted-foreground">
                    {task}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-background p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              Common mistakes
            </p>
            <h2 className="mt-2 text-2xl font-bold">Avoid these traps</h2>
            <ul className="mt-6 grid gap-4">
              {topic.commonMistakes.map((mistake) => (
                <li key={mistake} className="flex gap-3">
                  <CircleAlert
                    className="mt-0.5 size-5 shrink-0 text-primary"
                    aria-hidden="true"
                  />
                  <span className="text-sm leading-6 text-muted-foreground">
                    {mistake}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-14" aria-labelledby="topic-faq">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-normal text-primary">
              FAQ
            </p>
            <h2 id="topic-faq" className="mt-2 text-3xl font-bold">
              Questions about {topic.title.toLowerCase()}
            </h2>
            <div className="mt-6 divide-y divide-border rounded-3xl border border-border bg-card shadow-sm">
              {topic.faq.map((item) => (
                <details key={item.question} className="p-5">
                  <summary className="cursor-pointer list-none font-semibold">
                    {item.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>

          <nav
            aria-label="Related learning topics"
            className="rounded-3xl border border-border bg-card p-5 shadow-sm lg:h-fit"
          >
            <h2 className="text-lg font-bold">Related topics</h2>
            <div className="mt-4 grid gap-3">
              {relatedTopics.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="font-semibold">{item.title}</span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {item.description}
                  </span>
                </Link>
              ))}
            </div>
          </nav>
        </div>
      </section>
    </main>
  );
}
