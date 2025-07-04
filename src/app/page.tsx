import FeaturesGrid from '@/components/home/FeaturesGrid';
import FinalCTA from '@/components/home/FinalCTA';
import HomeHero from '@/components/home/HomeHero';
import LivePreview from '@/components/home/LivePreview';
import UseCases from '@/components/home/UseCases';


export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-zinc-800">
      {/* <h1 className="mb-4 text-4xl font-bold text-teal-300">📄 Real-time Collaboration Tool</h1>
      <p className="mb-8 text-gray-600">Create, edit, and share documents live with your team — fast and secure.</p>

      <div className="flex gap-4">
        <Link href="/auth/login" className="px-6 py-2 text-white rounded bg-black/40 hover:opacity-80">
          Login
        </Link>
        <Link href="/auth/register" className="px-6 py-2 border border-black rounded text-zinc-500 hover:bg-black/60 hover:text-white">
          Register
        </Link>
      </div> */}
      <HomeHero />
      <LivePreview />
      <UseCases />
      <FeaturesGrid />
      <FinalCTA />
    </main>
  );
}
