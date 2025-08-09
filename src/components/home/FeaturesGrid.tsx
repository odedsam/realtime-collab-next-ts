import { Edit3, MessageSquare, UserCheck, Clock, Cpu } from 'lucide-react';

const features = [
  { text: 'Live typing with collaborators', Icon: Edit3 },
  { text: 'Inline commenting & chat', Icon: MessageSquare },
  { text: 'Guest mode support', Icon: UserCheck },
  { text: 'Document version history', Icon: Clock },
  { text: 'Optional AI assistant', Icon: Cpu },
];

export default function FeaturesGrid() {
  return (
    <section id="features" className="w-full bg-gradient-to-b from-black via-zinc-900 to-zinc-950 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ text, Icon }, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-3xl border border-lime-500/40 bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-800 p-10 shadow-xl transition-transform select-none hover:scale-105 hover:shadow-lime-500/20">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-lime-900/20 shadow-inner">
              <Icon className="h-10 w-10 text-lime-300" />
            </div>
            <p className="max-w-xs text-center text-lg leading-relaxed font-semibold text-lime-200">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
