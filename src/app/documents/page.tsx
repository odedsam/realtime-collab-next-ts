import Link from 'next/link'

export default async function DocumentsPage() {
  const res = await fetch('http://localhost:3000/api/documents', {
    cache: 'no-store',
    credentials: 'include',
  })

  const docs = await res.json()

  return (
    <main className="min-h-screen py-10 px-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Your Documents</h1>

      <Link
        href="/documents/new"
        className="inline-block bg-black text-white px-4 py-2 rounded"
      >
        New Document
      </Link>

      <ul className="space-y-2">
        {docs.map((doc: any) => (
          <li key={doc.id}>
            <Link
              href={`/dashboard?doc=${doc.id}`}
              className="block border p-3 rounded hover:bg-gray-100"
            >
              {doc.title || 'Untitled'}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
