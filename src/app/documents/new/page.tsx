import { redirect } from 'next/navigation';

export default async function NewDocPage() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/documents/new`, {
    method: 'POST',
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Failed to create new document');
  }

  const { id } = await res.json();

  redirect(`/dashboard?doc=${id}`);
}
