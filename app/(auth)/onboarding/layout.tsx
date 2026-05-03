import { ReactNode } from 'react';

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex">
        <div className="w-full flex flex-col">{children}</div>
      </main>
    </div>
  );
}
