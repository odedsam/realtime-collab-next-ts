const cases = [
  { title: '👩‍💻 For Developers', desc: 'Plan product specs & technical docs' },
  { title: '🧠 For Teams', desc: 'Brainstorm and track ideas in real-time' },
  { title: '✍️ For Writers', desc: 'Write and co-edit content together' },
  { title: '📚 For Educators', desc: 'Guide sessions with students live' },
];

export default function UseCases() {
  return (
    <section id="usecases" className="px-6 py-16 text-teal-300 bg-zinc-900">
      <div className="grid max-w-4xl gap-6 mx-auto sm:grid-cols-2">
        {cases.map(({ title, desc }) => (
          <div key={title} className="p-6 border rounded-xl border-zinc-700 bg-zinc-800">
            <h3 className="mb-2 text-xl font-semibold text-white">{title}</h3>
            <p className="text-sm text-teal-300">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
