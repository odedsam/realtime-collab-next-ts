import GuestWorkspace from '@/components/workspace/GuestWorkspace';

export default function LivePreview() {
  return (
    <section id="#demo" className="w-full border-y border-lime-500/30 bg-gradient-to-br from-zinc-900 to-zinc-800 px-4 py-16">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-2xl">
        <GuestWorkspace />
      </div>
    </section>
  );
}
