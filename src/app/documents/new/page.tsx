import { redirect } from 'next/navigation'

export default async function NewDocPage() {
  const res = await fetch('http://localhost:3000/api/documents/new', {
    method: 'POST',
    credentials: 'include',
  })

  const data = await res.json()

  redirect(`/dashboard?doc=${data.id}`)
}
