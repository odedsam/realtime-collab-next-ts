'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Doc = {
  id: string
  title: string
}

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('/api/documents', { cache: 'no-store' })
      const data = await res.json()
      setDocs(data)
      setLoading(false)
    }

    fetchDocs()
  }, [])

  const handleRename = async (id: string) => {
    const newTitle = prompt('Enter new title:')
    if (!newTitle) return

    await fetch(`/api/documents/rename/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ title: newTitle }),
    })

    setDocs(prev =>
      prev.map(doc => (doc.id === id ? { ...doc, title: newTitle } : doc))
    )
  }

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this document?')
    if (!confirmDelete) return

    await fetch(`/api/documents/delete/${id}`, { method: 'DELETE' })

    setDocs(prev => prev.filter(doc => doc.id !== id))
  }

  const createNew = async () => {
    const res = await fetch('/api/documents/new', {
      method: 'POST',
      credentials: 'include',
    })

    const data = await res.json()
    router.push(`/dashboard?doc=${data.id}`)
  }

  if (loading) return <p className="p-10 text-center">Loading...</p>

  return (
    <main className="min-h-screen py-10 px-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold"> Your Documents</h1>

      <button
        onClick={createNew}
        className="bg-black text-white px-4 py-2 rounded"
      >
         New Document
      </button>

      <ul className="space-y-2">
        {docs.map(doc => (
          <li
            key={doc.id}
            className="flex items-center justify-between border p-3 rounded hover:bg-gray-100"
          >
            <Link href={`/dashboard?doc=${doc.id}`} className="flex-1 truncate">
              {doc.title || 'Untitled'}
            </Link>

            <div className="ml-4 flex gap-2">
              <button
                onClick={() => handleRename(doc.id)}
                className="text-sm text-blue-600 hover:underline"
              >
                 Rename
              </button>
              <button
                onClick={() => handleDelete(doc.id)}
                className="text-sm text-red-600 hover:underline"
              >
                 Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  )
}
