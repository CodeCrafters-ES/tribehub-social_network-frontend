import { redirect } from 'next/navigation';

import LoginForm from '@/features/auth/components/LoginForm';
import { isAuthenticated } from '@/features/auth/server-session';

export default async function LoginPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/feed');
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-8">
      <LoginForm />
    </main>
  );
}
