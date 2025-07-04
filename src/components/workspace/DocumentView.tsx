'use client';

interface Props {
  content: string;
}

export default function DocumentView({ content }: Props) {
  return (
    <section className="max-h-[45vh] flex-shrink-0 overflow-auto rounded-tl-2xl rounded-tr-2xl border-b border-zinc-700 bg-zinc-800 p-8 text-sm leading-relaxed whitespace-pre-wrap text-gray-300">
      {content}
    </section>
  );
}
