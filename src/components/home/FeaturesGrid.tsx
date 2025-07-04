const features = [
  'Live typing with collaborators',
  'Inline commenting & chat',
  'Guest mode support',
  'Document version history',
  'Optional AI assistant',
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="px-6 py-16 text-teal-300 bg-zinc-900">
      <div className="grid max-w-3xl gap-4 mx-auto">
        {features.map((feat, i) => (
          <div
            key={i}
            className="p-4 text-sm border rounded-lg bg-zinc-800 border-zinc-700 sm:text-base"
          >
            ✅ {feat}
          </div>
        ))}
      </div>
    </section>
  );
}
