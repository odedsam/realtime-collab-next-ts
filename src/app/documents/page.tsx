'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type DocumentVisibility = 'PUBLIC' | 'PRIVATE' | 'TEAM';

type Doc = {
  id: string;
  title: string;
  visibility: DocumentVisibility;
};

export default function DocumentsPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDocs = async () => {
      const res = await fetch('/api/documents', { cache: 'no-store' });
      const data = await res.json();
      setDocs(data);
      setLoading(false);
    };

    fetchDocs();
  }, []);

  const handleRename = async (id: string) => {
    const newTitle = prompt('Enter new title:');
    if (!newTitle) return;

    await fetch(`/api/documents/rename/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    setDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, title: newTitle } : doc)));
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm('Are you sure you want to delete this document?');
    if (!confirmDelete) return;

    await fetch(`/api/documents/delete/${id}`, { method: 'DELETE' });

    setDocs((prev) => prev.filter((doc) => doc.id !== id));
  };

  const createNew = async () => {
    const res = await fetch('/api/documents/new', {
      method: 'POST',
      credentials: 'include',
    });

    const data = await res.json();
    router.push(`/dashboard?doc=${data.id}`);
  };

  const toggleShare = async (id: string) => {
    const doc = docs.find((d) => d.id === id);
    const newVisibility: DocumentVisibility = doc?.visibility === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';

    await fetch(`/api/documents/share/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visibility: newVisibility }),
    });

    setDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, visibility: newVisibility } : doc)));

    if (newVisibility === 'PUBLIC') {
      alert(`Link copied:\n${window.location.origin}/view/${id}`);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;

  return (
    <main className="mx-auto min-h-screen max-w-2xl space-y-6 px-6 py-10">
      <h1 className="text-2xl font-bold">Your Documents</h1>

      <button onClick={createNew} className="rounded bg-black px-4 py-2 text-white">
        New Document
      </button>

      <ul className="space-y-2">
        {docs.map((doc) => (
          <li key={doc.id} className="flex items-center justify-between rounded border p-3 hover:bg-gray-100">
            <Link href={`/dashboard?doc=${doc.id}`} className="flex-1 truncate">
              {doc.title || 'Untitled'}
            </Link>

            <div className="ml-4 flex gap-2">
              <button onClick={() => handleRename(doc.id)} className="text-sm text-blue-600 hover:underline">
                Rename
              </button>
              <button onClick={() => handleDelete(doc.id)} className="text-sm text-red-600 hover:underline">
                Delete
              </button>
              <button onClick={() => toggleShare(doc.id)} className="text-sm text-green-600 hover:underline">
                {doc.visibility === 'PUBLIC' ? 'Unshare' : 'Share'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
