import AppHeader from './AppHeader';
import AppFooter from './AppFooter';
import TanstackProvider from '@/providers/Tanstack';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/providers/AuthProvider';

type Props = {
  children: React.ReactNode;
  user: any;
};

export default function AppShell({ children, user }: Props) {
  return (
    <body className="flex h-screen flex-col antialiased">
      <AuthProvider user={user}>
        <AppHeader />
        <main className="flex-grow">
          <TanstackProvider>{children}</TanstackProvider>
        </main>
        <AppFooter />
        <Toaster />
      </AuthProvider>
    </body>
  );
}
