import { notFound } from 'next/navigation'

export default async function ViewDoc({ params }: { params: { id: string } }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/documents/${params.id}`, {
    cache: 'no-store',
  })

  if (!res.ok) return notFound()

  const doc = await res.json()

  if (!doc.isPublic) return notFound()

  return (
    <main className="max-w-2xl mx-auto py-10 px-6">
      <h1 className="text-2xl font-bold mb-4">{doc.title}</h1>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: doc.content }}
      />
    </main>
  )
}
