import { redirect } from 'next/navigation';

import RegisterForm from '@/features/auth/components/RegisterForm';
import { isAuthenticated } from '@/features/auth/server-session';

export default async function RegisterPage() {
  const authenticated = await isAuthenticated();

  if (authenticated) {
    redirect('/onboarding/interests');
  }

  return (
    <main className="grid min-h-screen place-items-center px-6 py-8">
      <RegisterForm />
    </main>
  );
}
