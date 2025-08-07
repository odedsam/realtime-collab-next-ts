import { Button } from "../ui/Buttons";

export default function FinalCTA() {
  return (
    <section className="w-full bg-gradient-to-b from-zinc-950 via-zinc-900 to-black px-6 py-20 text-center text-lime-200">
      <h2 className="mb-4 text-3xl font-bold text-white sm:text-5xl">Start collaborating in seconds</h2>
      <p className="mb-6 text-lime-300">No install. No signup. Just your team and your ideas.</p>
      <Button href="/chatroom" className="rounded-xl bg-lime-400 px-8 py-3 text-base font-medium text-black shadow-lg hover:bg-lime-500">
        Start as Guest
      </Button>
    </section>
  );
}
