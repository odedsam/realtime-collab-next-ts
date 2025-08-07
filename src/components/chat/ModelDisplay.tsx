import { type LucideIcon } from 'lucide-react';

export type ModelConfig = {
  icon: LucideIcon;
  colorClass: string;
};

import { SquareTerminal, Bot, BrainCircuit } from 'lucide-react';

type CurrentModelDisplayProps = {
  modelName: string;
};

const modelConfig: Record<string, ModelConfig> = {
  groq: {
    icon: BrainCircuit,
    colorClass: 'text-fuchsia-400',
  },
  openrouter: {
    icon: Bot,
    colorClass: 'text-sky-400',
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
    <div className="flex items-center justify-center rounded-full bg-gray-800 px-4 py-2 text-white shadow-lg">
      <div className="flex items-center gap-2 text-lg font-bold">
        <span className='font-bold text-shadow-2xs text-blue-500'>Active Model :</span>
        <Icon className={`h-6 w-6 ${config.colorClass}`} />
        <span className={config.colorClass}>{modelName}</span>
      </div>
    </div>
  );
};
