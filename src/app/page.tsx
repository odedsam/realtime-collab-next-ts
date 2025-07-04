import FeaturesGrid from '@/components/home/FeaturesGrid';
import FinalCTA from '@/components/home/FinalCTA';
import HomeHero from '@/components/home/HomeHero';
import LivePreview from '@/components/home/LivePreview';
import UseCases from '@/components/home/UseCases';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center bg-zinc-800">
      <HomeHero />
      <LivePreview />
      <UseCases />
      <FeaturesGrid />
      <FinalCTA />
    </main>
  );
}
