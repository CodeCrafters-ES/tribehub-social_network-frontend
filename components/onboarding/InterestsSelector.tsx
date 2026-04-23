'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  listInterests,
  getMyInterests,
  setMyInterests,
  listCategories,
} from '@/lib/api/interests';
import { groupInterests } from '@/lib/utils/groupInterests';
import Chip from '@/components/ui/Chip';
import { useRouter } from 'next/navigation';
import Button from '../ui/Button';
import { Category, Interest } from '@/lib/types/interests';
import { ArrowRight, Search } from 'lucide-react';
import Spinner from '../ui/Spinner';

export default function InterestsSelector() {
  const router = useRouter();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const [all, mine, cats] = await Promise.all([
          listInterests(),
          getMyInterests(),
          listCategories(),
        ]);

        setInterests(all);
        setSelectedIds(mine);
        setCategories(cats);
      } catch {
        setError('Error cargando intereses');
      } finally {
        // setLoading(false);
      }
    }
    load();
  }, []);

  function toggle(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  const grouped = useMemo(() => {
    const filtered = interests.filter((i) => {
      const matchesQuery = i.name.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        categoryFilter === 'Todos' || i.category === categoryFilter;
      return matchesQuery && matchesCategory;
    });

    return groupInterests(filtered);
  }, [interests, query, categoryFilter]);

  async function handleSave() {
    if (selectedIds.length < 3) return;

    try {
      setSaving(true);
      await setMyInterests(selectedIds);
      router.push('/feed');
    } catch {
      setError('Error guardando intereses');
    } finally {
      setSaving(false);
    }
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <Spinner size={32} color="violet-900" />
      </div>
    );
  if (error) return <div>{error}</div>;

  return (
    <div className="space-y-4 p-4">
      <div className="relative w-full text-violet-900 focus-within:text-violet-900">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search size={20} strokeWidth={2.5} />
        </div>

        <input
          type="text"
          placeholder="Buscar..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-3 pl-10 rounded-lg bg-violet-100 placeholder-violet-900 text-gray-900 outline-none focus:ring-2 focus:ring-violet-300 transition-all"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto py-2">
        <Chip
          color="indigo"
          label={'Todos'}
          selected={categoryFilter === 'Todos'}
          onClick={() => setCategoryFilter('Todos')}
        />

        {categories.map((cat) => (
          <Chip
            key={cat.id}
            color="indigo"
            label={cat.label}
            selected={categoryFilter === cat.id}
            onClick={() => setCategoryFilter(cat.id)}
          />
        ))}
      </div>

      <h2 className="text-2xl leading-relaxed sm:truncate sm:text-3xl sm:tracking-tight">
        Elige al menos 3 intereses para personalizar tu feed
      </h2>

      <div className="flex flex-wrap gap-2">
        {categories
          .flatMap((cat) => grouped[cat.id] ?? [])
          .map((i) => (
            <Chip
              key={i.id}
              label={i.name}
              selected={selectedIds.includes(i.id)}
              onClick={() => toggle(i.id)}
            />
          ))}
      </div>

      <div className="fixed bottom-0 left-0 w-full flex flex-col gap-2 bg-white p-4">
        <p className="text-sm text-gray-500">
          <span className="font-bold">{selectedIds.length}</span> / 3
          seleccionados
        </p>

        <Button
          onClick={handleSave}
          disabled={selectedIds.length < 3 || saving}
          rightIcon={
            saving ? (
              <Spinner size={5} color="white" />
            ) : (
              <ArrowRight size={18} />
            )
          }
        >
          {saving ? 'Guardando...' : 'Guardar y continuar'}
        </Button>
      </div>
    </div>
  );
}
