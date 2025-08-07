import { API } from '@/services';
import { cookies } from 'next/headers';

export  async function getUser() {
  const cookiesList =  cookies();
  const token = (await cookiesList).get("rtc_token");

  console.log(token);
  if (!token) return null;

  const res = await fetch(`http://localhost:4000/auth/me`, {
    method:'GET',
    credentials: 'include',
    cache: 'no-store',
  });

  // if (!res.ok) {
  //   console.log("res is not okay ")
  //   return null;
  // };

  return res.json()
}
