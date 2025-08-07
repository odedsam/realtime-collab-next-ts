import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { API } from '@/services';

export async function getUser() {
  const token = (await cookies()).get('rtc_session')?.value;
  if (!token) return null;

  const res = await fetch(`${API}/auth/me`, {
    headers: { Cookie: `token=${token}` },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) return null;
  return res.json();
}


export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  console.log(user);

  if (!user) {
    redirect('/auth/login');
  }

  return <>{children}</>;
}
