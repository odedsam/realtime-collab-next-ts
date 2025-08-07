const cases = [
  { title: '👩‍💻 For Developers', desc: 'Plan product specs & technical docs' },
  { title: '🧠 For Teams', desc: 'Brainstorm and track ideas in real-time' },
  { title: '✍️ For Writers', desc: 'Write and co-edit content together' },
  { title: '📚 For Educators', desc: 'Guide sessions with students live' },
];

export default function UseCases() {
  return (
    <section id="usecases" className="w-full bg-gradient-to-br from-zinc-950 via-zinc-900 to-black py-24 text-lime-200">
      <div className="mx-auto grid max-w-4xl gap-6 px-4 sm:grid-cols-2">
        {cases.map(({ title, desc }) => (
          <div
            key={title}
            className="rounded-xl border border-zinc-700 bg-zinc-800/60 p-6 shadow-md transition-shadow hover:shadow-lime-500/20">
            <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm text-lime-300/90">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
