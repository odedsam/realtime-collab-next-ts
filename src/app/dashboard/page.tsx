import { cookies } from 'next/headers'
import { verifyToken } from '../utils/jwt'

export default async function Dashboard() {
  const token = (await cookies()).get('token')?.value
  const user = token ? verifyToken(token) : null

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <h1 className="text-2xl font-bold">Welcome {user?.userId ?? 'Guest'} 👋</h1>
    </div>
  )
}
