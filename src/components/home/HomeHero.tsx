export default function HomeHero() {
  return (
    <section className="px-6 py-20 text-center text-teal-300 bg-zinc-800">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl">RealTime Collaoration . Collaborate Live.</h1>
      <p className="max-w-xl mx-auto mb-8 text-lg text-teal-200 sm:text-xl">
        Create documents, brainstorm ideas, and chat – together, in real-time.
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-2 text-sm font-medium text-white bg-teal-600 shadow rounded-xl hover:bg-teal-700">Try as Guest</button>
        <button className="px-6 py-2 text-sm font-medium text-white border rounded-xl border-zinc-600 bg-zinc-700 hover:bg-zinc-600">
          Sign Up
        </button>
      </div>
    </section>
  );
}
