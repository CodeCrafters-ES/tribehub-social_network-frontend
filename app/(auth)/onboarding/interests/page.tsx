import InterestsSelector from '@/components/onboarding/InterestsSelector';
import { ArrowLeft } from 'lucide-react';

export default async function Page() {
  return (
    <>
      <header className="p-4 sticky top-0 w-full bg-white flex gap-2 z-1">
        <ArrowLeft className="text-violet-900" />
        <span className="font-semibold">Seleccionar intereses</span>
      </header>
      <InterestsSelector />
    </>
  );
}
