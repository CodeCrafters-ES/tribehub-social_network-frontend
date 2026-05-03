'use client';

import InterestsSelector from '@/components/onboarding/InterestsSelector';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <>
      <header className="p-4 sticky top-0 w-full bg-white flex gap-2 z-1 border-b border-slate-200">
        <button
          onClick={() => router.back()}
          className="text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft />
        </button>
        <span className="font-semibold text-slate-800">
          Seleccionar intereses
        </span>
      </header>
      <InterestsSelector />
    </>
  );
}
