import { redirect } from 'next/navigation';

import RegisterForm from '@/components/auth/RegisterForm';
import { isAuthenticated } from '@/lib/auth/server-session';

export default async function RegisterPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/feed');
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-8">
      <RegisterForm />
    </main>
  );
}
