import GuestWorkspace from '@/components/workspace/GuestWorkspace';

export default function LivePreview() {
  return (
    <section id="demo" className="w-full px-4 py-16 border-cyan-400 border-y bg-zinc-700">
      <div className="max-w-5xl mx-auto overflow-hidden border shadow-xl rounded-xl border-zinc-700">
        <GuestWorkspace />
      </div>
    </section>
  );
}
