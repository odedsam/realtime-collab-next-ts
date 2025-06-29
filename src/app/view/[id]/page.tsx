import { notFound } from 'next/navigation';

interface Doc {
  id: string;
  title: string;
  content: string;
  isPublic: boolean;
}

export default async function ViewDoc({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/documents/${params.id}`, {
    cache: 'no-store',
    next: { tags: ['document'] },
  });

  if (!res.ok) return notFound();

  const doc: Doc = await res.json();

  if (!doc || !doc.isPublic) return notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-4 text-2xl font-bold">{doc.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: doc.content }} />
    </main>
  );
}
