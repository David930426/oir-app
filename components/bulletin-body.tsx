// The bulletin body is authored as plain text (a textarea on the create/edit
// page), so we render it with paragraphs, preserved line breaks, and auto-linked
// URLs. NOTE: if rich authoring is added later, swap this for a lightweight
// markdown renderer.
const URL_PATTERN = /(https?:\/\/[^\s]+)/g;

export function BulletinBody({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div
      className={`space-y-4 text-[15px] leading-relaxed text-slate-700 ${className}`}
    >
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="whitespace-pre-line">
          {linkify(paragraph)}
        </p>
      ))}
    </div>
  );
}

function linkify(text: string) {
  return text.split(URL_PATTERN).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a
        key={i}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline underline-offset-2 hover:opacity-80"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );
}
