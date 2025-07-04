export default function HomeHero() {
  return (
    <section className="px-6 py-20 text-center text-teal-300 bg-zinc-800">
      <h1 className="mb-4 text-4xl font-bold sm:text-6xl">
        Collaborate Live. No Signup Needed.
      </h1>
      <p className="max-w-xl mx-auto mb-8 text-lg text-teal-200 sm:text-xl">
        Create documents, brainstorm ideas, and chat – together, in real-time.
      </p>
      <div className="flex justify-center gap-4">
        <button className="px-6 py-2 text-sm font-medium text-white bg-teal-600 shadow hover:bg-teal-700 rounded-xl">
          Try as Guest
        </button>
        <button className="px-6 py-2 text-sm font-medium text-white border bg-zinc-700 hover:bg-zinc-600 border-zinc-600 rounded-xl">
          Sign Up
        </button>
      </div>
    </section>
  );
}
