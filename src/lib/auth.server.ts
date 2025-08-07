import { API } from '@/services';
import { cookies } from 'next/headers';

export async function getUser() {
  const cookiesList = cookies();
  const session = (await cookiesList).get('rtc_session');

  console.log(session);
  if (!session) return null;

  const res = await fetch(`${API}/auth/me`, {
    method: 'GET',
    headers: {
      Cookie: `rtc_session=${session.value}`,
    },
    credentials: 'include',
    cache: 'no-store',
  });

  // if (!res.ok) {
  //   console.log("res is not okay ")
  //   return null;
  // };

  return res.json();
}
