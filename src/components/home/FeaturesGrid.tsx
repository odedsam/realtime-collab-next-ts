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
    <section className="w-full py-20 bg-zinc-900/5">
      <div className="grid max-w-6xl grid-cols-1 gap-12 px-6 mx-auto sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ text, Icon }, i) => (
          <div
            key={i}
            className="flex flex-col items-center p-10 transition-transform border border-teal-600 shadow-lg cursor-default select-none rounded-3xl bg-gradient-to-tr from-zinc-800 via-zinc-900 to-zinc-800 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-teal-900 rounded-full shadow-lg drop-shadow-md">
              <Icon className="w-10 h-10 text-teal-300" />
            </div>
            <p className="max-w-xs text-lg font-semibold leading-relaxed text-center text-teal-300">
              {text}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
