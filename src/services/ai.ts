import { API } from "./api";

export async function sendToAI(messages: { role: 'user' | 'assistant'; content: string }[]) {
  const res = await fetch(`${API}/api/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}

// usage
/* const answer = await sendToAI([
  { role: 'user', content: 'Some Meesage From the Ai ' }
]);
 */
