'use client';

import { useState } from 'react';
import { Character, RandomEvent, RandomEventChoice, RandomEventOutcome, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { getItemById } from '@/lib/game/gameData';
import { 
  Sparkles, 
  AlertTriangle,
  Gift,
  HelpCircle
} from 'lucide-react';

interface RandomEventModalProps {
  event: RandomEvent | null;
  character: Character;
  onClose: () => void;
  onChoose: (choice: RandomEventChoice, outcome: RandomEventOutcome) => void;
}

export function RandomEventModal({ event, character, onClose, onChoose }: RandomEventModalProps) {
  const [selectedOutcome, setSelectedOutcome] = useState<RandomEventOutcome | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!event) return null;

  const handleChoice = (choice: RandomEventChoice) => {
    const roll = Math.random();
    let cumulative = 0;
    let selectedOutcome: RandomEventOutcome | null = null;

    for (const outcome of choice.outcomes) {
      cumulative += outcome.probability;
      if (roll <= cumulative) {
        selectedOutcome = outcome;
        break;
      }
    }

    if (selectedOutcome) {
      setIsProcessing(true);
      setTimeout(() => {
        onChoose(choice, selectedOutcome!);
        setIsProcessing(false);
      }, 500);
    }
  };

  const canChoose = (choice: RandomEventChoice): boolean => {
    if (!choice.requirements) return true;
    const req = choice.requirements;
    if (req.minHp && character.stats.hp < req.minHp) return false;
    if (req.minMp && character.stats.mp < req.minMp) return false;
    if (req.minGold && character.gold < req.minGold) return false;
    return true;
  };

  const typeColors: Record<string, string> = {
    treasure: 'from-amber-500 to-yellow-500',
    danger: 'from-red-500 to-orange-500',
    opportunity: 'from-green-500 to-emerald-500',
    mystery: 'from-purple-500 to-indigo-500'
  };

  const typeIcons: Record<string, React.ReactNode> = {
    treasure: <Gift className="w-8 h-8" />,
    danger: <AlertTriangle className="w-8 h-8" />,
    opportunity: <Sparkles className="w-8 h-8" />,
    mystery: <HelpCircle className="w-8 h-8" />
  };

  return (
    <Dialog open={!!event} onOpenChange={() => !isProcessing && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className={`w-full h-24 rounded-t-lg bg-gradient-to-r ${typeColors[event.type]} flex items-center justify-center text-white mb-4`}>
            <div className="text-center">
              <div className="text-4xl mb-1">{event.icon}</div>
              <DialogTitle className="text-xl font-bold">{event.name}</DialogTitle>
            </div>
          </div>
          <DialogDescription className="text-center text-slate-600">
            {event.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 mt-4">
          {event.choices.map((choice, index) => {
            const enabled = canChoose(choice);
            return (
              <Button
                key={choice.id}
                onClick={() => handleChoice(choice)}
                disabled={!enabled || isProcessing}
                className={`w-full h-auto py-3 px-4 flex flex-col items-start ${
                  enabled 
                    ? 'bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-800' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                }`}
                variant="outline"
              >
                <span className="font-bold">{choice.text}</span>
                {choice.requirements && (
                  <div className="flex flex-wrap gap-1 mt-1">
                    {choice.requirements.minHp && (
                      <Badge variant="outline" className={`text-xs ${character.stats.hp >= choice.requirements.minHp ? 'text-green-500' : 'text-red-500'}`}>
                        需要气血: {choice.requirements.minHp}
                      </Badge>
                    )}
                    {choice.requirements.minMp && (
                      <Badge variant="outline" className={`text-xs ${character.stats.mp >= choice.requirements.minMp ? 'text-green-500' : 'text-red-500'}`}>
                        需要灵力: {choice.requirements.minMp}
                      </Badge>
                    )}
                    {choice.requirements.minGold && (
                      <Badge variant="outline" className={`text-xs ${character.gold >= choice.requirements.minGold ? 'text-green-500' : 'text-red-500'}`}>
                        需要金币: {choice.requirements.minGold}
                      </Badge>
                    )}
                  </div>
                )}
              </Button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface EventResultModalProps {
  outcome: RandomEventOutcome | null;
  onClose: () => void;
}

export function EventResultModal({ outcome, onClose }: EventResultModalProps) {
  if (!outcome) return null;

  const effects = outcome.effects;
  const hasPositiveEffect = (effects.gold && effects.gold > 0) || 
                           (effects.exp && effects.exp > 0) || 
                           effects.item;
  const hasNegativeEffect = (effects.hp && effects.hp < 0) || 
                           (effects.mp && effects.mp < 0) || 
                           (effects.gold && effects.gold < 0);

  return (
    <Dialog open={!!outcome} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className={`text-center ${hasPositiveEffect && !hasNegativeEffect ? 'text-green-500' : hasNegativeEffect && !hasPositiveEffect ? 'text-red-500' : 'text-amber-500'}`}>
            {hasPositiveEffect && !hasNegativeEffect ? '🎉 好运降临！' : 
             hasNegativeEffect && !hasPositiveEffect ? '😢 不幸发生...' : 
             '✨ 事件结果'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="text-center py-4">
          <p className="text-lg text-slate-700 mb-4">{effects.message}</p>
          
          <div className="flex flex-wrap justify-center gap-2">
            {effects.hp && (
              <Badge className={`${effects.hp > 0 ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                气血 {effects.hp > 0 ? '+' : ''}{effects.hp}
              </Badge>
            )}
            {effects.mp && (
              <Badge className={`${effects.mp > 0 ? 'bg-blue-500' : 'bg-red-500'} text-white`}>
                灵力 {effects.mp > 0 ? '+' : ''}{effects.mp}
              </Badge>
            )}
            {effects.gold && (
              <Badge className={`${effects.gold > 0 ? 'bg-amber-500' : 'bg-red-500'} text-white`}>
                金币 {effects.gold > 0 ? '+' : ''}{effects.gold}
              </Badge>
            )}
            {effects.exp && (
              <Badge className="bg-purple-500 text-white">
                经验 +{effects.exp}
              </Badge>
            )}
            {effects.item && (
              <Badge className="bg-indigo-500 text-white">
                获得物品
              </Badge>
            )}
          </div>
        </div>

        <Button onClick={onClose} className="w-full bg-slate-500 hover:bg-slate-600 text-white">
          确定
        </Button>
      </DialogContent>
    </Dialog>
  );
}
