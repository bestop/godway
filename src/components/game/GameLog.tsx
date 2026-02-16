'use client';

import { GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  ScrollText,
  Swords,
  TrendingUp,
  Zap,
  Package,
  Store,
  Info
} from 'lucide-react';

interface GameLogProps {
  logs: GameLogEntry[];
}

export function GameLog({ logs }: GameLogProps) {
  const getLogIcon = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'battle': return <Swords className="w-4 h-4 text-red-500" />;
      case 'level_up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'tribulation': return <Zap className="w-4 h-4 text-purple-500" />;
      case 'item': return <Package className="w-4 h-4 text-blue-500" />;
      case 'market': return <Store className="w-4 h-4 text-amber-500" />;
      case 'system': return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getLogColor = (type: GameLogEntry['type']) => {
    switch (type) {
      case 'battle': return 'text-red-600';
      case 'level_up': return 'text-green-600';
      case 'tribulation': return 'text-purple-600';
      case 'item': return 'text-blue-600';
      case 'market': return 'text-amber-600';
      case 'system': return 'text-slate-600';
    }
  };

  const getTypeName = (type: GameLogEntry['type']) => {
    const names: Record<GameLogEntry['type'], string> = {
      battle: '战斗',
      level_up: '升级',
      tribulation: '渡劫',
      item: '物品',
      market: '市场',
      system: '系统'
    };
    return names[type];
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Card className="bg-white border-slate-200 text-slate-800 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
          <ScrollText className="w-4 h-4" />
          游戏日志
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          {logs.length === 0 ? (
            <div className="text-center text-slate-400 py-8">
              <ScrollText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <div>暂无日志记录</div>
            </div>
          ) : (
            <div className="space-y-1 pr-4">
              {logs.slice().reverse().map(log => (
                <div 
                  key={log.id}
                  className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-slate-50 transition-colors"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`text-[10px] ${getLogColor(log.type)} border-current py-0 px-1`}
                      >
                        {getTypeName(log.type)}
                      </Badge>
                      <span className="text-slate-400 text-xs">
                        {formatTime(log.timestamp)}
                      </span>
                    </div>
                    <p className={`text-sm mt-0.5 ${getLogColor(log.type)}`}>
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
