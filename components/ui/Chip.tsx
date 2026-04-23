const CHIP_COLORS = {
  violet: {
    selected: 'bg-violet-300 text-purple-900',
    normal: 'bg-violet-100 text-violet-900',
  },
  indigo: {
    selected: 'bg-indigo-500 text-white',
    normal: 'bg-violet-100 text-violet-900',
  },
} as const;

type ChipColor = keyof typeof CHIP_COLORS;

export default function Chip({
  label,
  selected = false,
  onClick,
  color = 'violet',
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  color?: ChipColor;
}) {
  const scheme = CHIP_COLORS[color] ?? CHIP_COLORS.violet;
  const styleClass = selected ? scheme.selected : scheme.normal;

  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 rounded-full transition font-medium text-nowrap ${styleClass}`}
    >
      {label}
    </button>
  );
}
