import GuestWorkspace from '@/components/workspace/GuestWorkspace';

export default function LivePreview() {
  return (
    <section className="w-full px-4 py-16 border-y border-cyan-400 bg-zinc-700">
      <div className="max-w-5xl mx-auto overflow-hidden border shadow-xl rounded-xl border-zinc-700">
        <GuestWorkspace />
      </div>
    </section>
  );
}
