import { ReactNode } from 'react';
import { redirect } from 'next/navigation';

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuth = true; // TODO: Esperar al mr de Jimmy para reemplazar esto por una verificación real

  if (!isAuth) redirect('/login');

  return (
    <div className="min-h-screen flex flex-col">
      <main>
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}
