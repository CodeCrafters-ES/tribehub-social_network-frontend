import InterestsSelector from '@/components/onboarding/InterestsSelector';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  return (
    <>
      <header className="p-4 sticky top-0 w-full bg-white flex gap-2 z-1 border-b border-slate-200">
        <ArrowLeft className="text-slate-700" />
        <span className="font-semibold text-slate-800">
          Seleccionar intereses
        </span>
      </header>
      <InterestsSelector />
    </>
  );
}
