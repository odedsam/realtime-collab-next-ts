import { type LucideIcon } from 'lucide-react';
import { SquareTerminal, Bot, BrainCircuit } from 'lucide-react';

export type ModelConfig = {
  icon: LucideIcon;
  colorClass: string;
};

type CurrentModelDisplayProps = {
  modelName: string;
};

const modelConfig: Record<string, ModelConfig> = {
  groq: {
    icon: BrainCircuit,
    colorClass: 'text-lime-400',
  },
  openrouter: {
    icon: Bot,
    colorClass: 'text-cyan-400',
  },
  default: {
    icon: SquareTerminal,
    colorClass: 'text-yellow-400',
  },
};

export const CurrentModelDisplay: React.FC<CurrentModelDisplayProps> = ({ modelName }) => {
  const config = modelConfig[modelName.toLowerCase()] || modelConfig.default;
  const Icon = config.icon;

  return (
    <div className="flex w-fit items-center gap-3 rounded-md border border-gray-700 bg-[#1a2533] px-4 py-2 shadow-sm">
      <Icon className={`h-5 w-5 ${config.colorClass}`} />
      <span className="text-sm text-gray-200">Model:</span>
      <span className={`text-sm font-semibold ${config.colorClass}`}>{modelName}</span>
    </div>
  );
};
