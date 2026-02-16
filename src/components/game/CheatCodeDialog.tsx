'use client';

import { useState, useEffect } from 'react';
import { Character, InventoryItem, ActiveCheatEffect, GameLogEntry } from '@/types/game';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  findCheatCode, 
  executeCheatCode, 
  CHEAT_CODES,
  getRemainingGodModeTime,
  cleanExpiredEffects
} from '@/lib/game/cheatCodes';
import { 
  Terminal, 
  Send, 
  Sparkles, 
  Shield, 
  Coins, 
  Star,
  Heart,
  Zap,
  Clock,
  HelpCircle
} from 'lucide-react';

interface CheatCodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  character: Character;
  inventory: InventoryItem[];
  activeEffects: ActiveCheatEffect[];
  onUpdateCharacter: (character: Character) => void;
  onUpdateInventory: (inventory: InventoryItem[]) => void;
  onUpdateEffects: (effects: ActiveCheatEffect[]) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
}

export function CheatCodeDialog({
  open,
  onOpenChange,
  character,
  inventory,
  activeEffects,
  onUpdateCharacter,
  onUpdateInventory,
  onUpdateEffects,
  addLog
}: CheatCodeDialogProps) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const cleaned = cleanExpiredEffects(activeEffects);
    if (cleaned.length !== activeEffects.length) {
      onUpdateEffects(cleaned);
    }
  }, [open]);

  const handleSubmit = () => {
    if (!input.trim()) return;

    const cheat = findCheatCode(input);
    
    if (!cheat) {
      setResult({ success: false, message: '未知的作弊码，输入"help"查看可用作弊码' });
      if (input.toLowerCase().trim() === 'help') {
        setShowHelp(true);
      }
      return;
    }

    const { result: cheatResult, character: updatedCharacter, inventory: updatedInventory } = 
      executeCheatCode(cheat, character, inventory);

    setResult(cheatResult);
    setInput('');

    if (cheatResult.success) {
      onUpdateCharacter(updatedCharacter);
      onUpdateInventory(updatedInventory);
      
      if (cheatResult.effect) {
        onUpdateEffects([...activeEffects, cheatResult.effect]);
      }
      
      addLog('system', `🎮 使用作弊码：${cheat.name}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const godModeTime = getRemainingGodModeTime(activeEffects);
  const godModeMinutes = Math.floor(godModeTime / 60000);
  const godModeSeconds = Math.floor((godModeTime % 60000) / 1000);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-b from-slate-900 to-slate-800 text-white border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-400">
            <Terminal className="w-5 h-5" />
            控制台
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            输入作弊码获得特殊效果
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {activeEffects.length > 0 && (
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-3">
                <div className="text-sm text-slate-300 mb-2">激活的效果</div>
                <div className="flex flex-wrap gap-2">
                  {activeEffects.map(effect => (
                    <Badge key={effect.id} className="bg-green-600 text-white">
                      <Shield className="w-3 h-3 mr-1" />
                      {effect.type === 'god_mode' && '无敌模式'}
                      {effect.type === 'god_mode' && (
                        <span className="ml-1">
                          {godModeMinutes}:{godModeSeconds.toString().padStart(2, '0')}
                        </span>
                      )}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-mono">
                {'>'}
              </span>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入作弊码..."
                className="pl-7 bg-slate-800 border-slate-600 text-green-400 placeholder-slate-500 font-mono"
              />
            </div>
            <Button 
              onClick={handleSubmit}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          {result && (
            <div className={`p-3 rounded-lg border ${
              result.success 
                ? 'bg-green-900/30 border-green-600 text-green-400' 
                : 'bg-red-900/30 border-red-600 text-red-400'
            }`}>
              {result.message}
            </div>
          )}

          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setShowHelp(!showHelp)}
              className="text-slate-400 hover:text-white"
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              {showHelp ? '隐藏' : '查看'}作弊码列表
            </Button>
          </div>

          {showHelp && (
            <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
              {CHEAT_CODES.map((cheat, index) => (
                <Card key={index} className="bg-slate-800 border-slate-700">
                  <CardContent className="p-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <code className="text-green-400 text-sm">{cheat.code}</code>
                        <div className="text-xs text-slate-400 mt-1">{cheat.description}</div>
                      </div>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {cheat.type === 'gold' && <Coins className="w-3 h-3 mr-1" />}
                        {cheat.type === 'exp' && <Star className="w-3 h-3 mr-1" />}
                        {cheat.type === 'god_mode' && <Shield className="w-3 h-3 mr-1" />}
                        {cheat.type === 'full_hp' && <Heart className="w-3 h-3 mr-1" />}
                        {cheat.type === 'tribulation_pill' && <Zap className="w-3 h-3 mr-1" />}
                        {cheat.type === 'power_up' && <Sparkles className="w-3 h-3 mr-1" />}
                        {cheat.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="text-xs text-slate-500 text-center">
            提示：作弊码不区分大小写
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
