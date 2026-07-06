type ToolSeoBlockProps = {
  title: string;
  text: string;
};

export function ToolSeoBlock({ title, text }: ToolSeoBlockProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-normal text-foreground">
        {title}
      </h2>
      <p className="mt-4 leading-7 text-muted-foreground">{text}</p>
    </div>
  );
}
