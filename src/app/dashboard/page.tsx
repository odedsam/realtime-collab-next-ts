'use client';

import { Loading } from '@/components/feedback';
import { useAuthStore } from '@/store/useAuth';

interface DashboardCardProps {
  title: string;
  children: React.ReactNode;
}

const DashboardCard = ({ title, children }: DashboardCardProps) => (
  <div className="rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
    <h2 className="mb-4 text-2xl font-bold text-gray-100">{title}</h2>
    <div className="text-gray-300">{children}</div>
  </div>
);

export default function Dashboard() {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <Loading message={'Loading...'} />;
  }

  return (
    <main className="min-h-screen bg-gray-950 p-8 font-sans text-gray-100 antialiased">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-white md:text-6xl">Welcome back, {user?.name ?? user?.email}!</h1>
          <p className="mt-4 text-lg text-gray-400">Your personalized dashboard awaits.</p>
        </header>

        <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard title="Profile Information">
            <p className="mb-2">
              <strong className="text-gray-100">Email:</strong> {user?.email || 'N/A'}
            </p>
            <p>
              <strong className="text-gray-100">Name:</strong> {user?.name ?? 'N/A'}
            </p>
          </DashboardCard>

          <DashboardCard title="Quick Actions">
            <button
              onClick={() => alert('Logout functionality to be implemented')}
              className="focus:ring-opacity-50 w-full rounded-full bg-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-blue-700 hover:shadow-xl focus:ring-4 focus:ring-blue-500 focus:outline-none">
              Logout
            </button>
          </DashboardCard>

          <DashboardCard title="Status">
            <div className="flex items-center">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="ml-2 text-green-400">Currently Online</span>
            </div>
          </DashboardCard>
        </section>
      </div>
    </main>
  );
}
