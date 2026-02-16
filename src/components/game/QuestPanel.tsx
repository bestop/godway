'use client';

import { useState, useEffect } from 'react';
import { Character, Quest, QuestProgress, GameLogEntry } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { QUESTS, getAvailableQuests } from '@/lib/game/gameFeatures';
import { getItemById } from '@/lib/game/gameData';
import { 
  Scroll, 
  CheckCircle2, 
  Clock, 
  Gift,
  Star,
  Target
} from 'lucide-react';

interface QuestPanelProps {
  character: Character;
  questProgress: QuestProgress[];
  onUpdateProgress: (progress: QuestProgress[]) => void;
  addLog: (type: GameLogEntry['type'], message: string) => void;
  onReward: (exp: number, gold: number, items: string[]) => void;
}

export function QuestPanel({ character, questProgress, onUpdateProgress, addLog, onReward }: QuestPanelProps) {
  const [activeTab, setActiveTab] = useState<'available' | 'in_progress' | 'completed'>('available');

  const availableQuests = getAvailableQuests(character.realm);
  
  const dailyQuests = availableQuests.filter(q => q.isDaily);
  const mainQuests = availableQuests.filter(q => !q.isDaily);

  const getQuestProgress = (questId: string): QuestProgress | undefined => {
    return questProgress.find(p => p.questId === questId);
  };

  const getQuestStatus = (quest: Quest): 'not_started' | 'in_progress' | 'completed' | 'claimed' => {
    const progress = getQuestProgress(quest.id);
    if (!progress) return 'not_started';
    if (progress.claimed) return 'claimed';
    if (progress.completed) return 'completed';
    return 'in_progress';
  };

  const startQuest = (quest: Quest) => {
    const existing = getQuestProgress(quest.id);
    if (existing) return;
    
    const newProgress: QuestProgress = {
      questId: quest.id,
      currentCount: 0,
      completed: false,
      claimed: false
    };
    
    onUpdateProgress([...questProgress, newProgress]);
    addLog('quest', `开始任务：${quest.name}`);
  };

  const claimReward = (quest: Quest) => {
    const progress = getQuestProgress(quest.id);
    if (!progress || !progress.completed || progress.claimed) return;
    
    const updatedProgress = questProgress.map(p => 
      p.questId === quest.id ? { ...p, claimed: true } : p
    );
    
    onUpdateProgress(updatedProgress);
    
    const rewards = quest.rewards;
    onReward(rewards.exp || 0, rewards.gold || 0, rewards.items || []);
    addLog('quest', `完成任务：${quest.name}，获得 ${rewards.exp || 0} 经验，${rewards.gold || 0} 金币`);
  };

  const renderQuestCard = (quest: Quest) => {
    const status = getQuestStatus(quest);
    const progress = getQuestProgress(quest.id);
    const progressPercent = progress ? Math.min(100, (progress.currentCount / quest.requiredCount) * 100) : 0;

    return (
      <Card key={quest.id} className={`mb-2 ${
        status === 'claimed' ? 'bg-green-50 border-green-200' :
        status === 'completed' ? 'bg-yellow-50 border-yellow-200' :
        status === 'in_progress' ? 'bg-blue-50 border-blue-200' :
        'bg-white border-slate-200'
      }`}>
        <CardContent className="p-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800">{quest.name}</span>
                {quest.isDaily && (
                  <Badge variant="outline" className="text-orange-500 border-orange-300">每日</Badge>
                )}
                {status === 'claimed' && (
                  <Badge className="bg-green-500 text-white">已领取</Badge>
                )}
              </div>
              <p className="text-sm text-slate-600 mt-1">{quest.description}</p>
              
              {status !== 'not_started' && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span>进度</span>
                    <span>{progress?.currentCount || 0}/{quest.requiredCount}</span>
                  </div>
                  <Progress value={progressPercent} className="h-2" />
                </div>
              )}
              
              <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                {quest.rewards.exp && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-amber-500" />
                    {quest.rewards.exp} 经验
                  </span>
                )}
                {quest.rewards.gold && (
                  <span className="flex items-center gap-1">
                    💰 {quest.rewards.gold} 金币
                  </span>
                )}
                {quest.rewards.items && quest.rewards.items.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Gift className="w-3 h-3 text-purple-500" />
                    {quest.rewards.items.length} 件物品
                  </span>
                )}
              </div>
            </div>
            
            <div className="ml-3">
              {status === 'not_started' && (
                <Button 
                  size="sm" 
                  onClick={() => startQuest(quest)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  接受
                </Button>
              )}
              {status === 'completed' && (
                <Button 
                  size="sm" 
                  onClick={() => claimReward(quest)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  领取
                </Button>
              )}
              {status === 'in_progress' && (
                <Badge variant="outline" className="text-blue-500 border-blue-300">
                  进行中
                </Badge>
              )}
              {status === 'claimed' && (
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const inProgressQuests = mainQuests.filter(q => {
    const status = getQuestStatus(q);
    return status === 'in_progress' || status === 'completed';
  });

  const completedQuests = mainQuests.filter(q => getQuestStatus(q) === 'claimed');

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Scroll className="w-8 h-8" />
              <div>
                <div className="text-lg font-bold">任务系统</div>
                <div className="text-sm text-purple-100">
                  进行中: {inProgressQuests.length} | 已完成: {completedQuests.length}
                </div>
              </div>
            </div>
            <Target className="w-6 h-6 text-purple-200" />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button 
          variant={activeTab === 'available' ? 'default' : 'outline'}
          onClick={() => setActiveTab('available')}
          className={activeTab === 'available' ? 'bg-purple-500 hover:bg-purple-600' : ''}
        >
          可接任务
        </Button>
        <Button 
          variant={activeTab === 'in_progress' ? 'default' : 'outline'}
          onClick={() => setActiveTab('in_progress')}
          className={activeTab === 'in_progress' ? 'bg-purple-500 hover:bg-purple-600' : ''}
        >
          进行中 ({inProgressQuests.length})
        </Button>
        <Button 
          variant={activeTab === 'completed' ? 'default' : 'outline'}
          onClick={() => setActiveTab('completed')}
          className={activeTab === 'completed' ? 'bg-purple-500 hover:bg-purple-600' : ''}
        >
          已完成
        </Button>
      </div>

      <Card className="bg-white border-slate-200 shadow-md">
        <CardContent className="p-4">
          <ScrollArea className="h-80">
            {activeTab === 'available' && (
              <div>
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-500" />
                  每日任务
                </h4>
                <div className="mb-4">
                  {dailyQuests.map(quest => renderQuestCard(quest))}
                </div>
                
                <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                  <Scroll className="w-4 h-4 text-purple-500" />
                  主线任务
                </h4>
                <div>
                  {mainQuests.filter(q => getQuestStatus(q) === 'not_started').map(quest => renderQuestCard(quest))}
                </div>
              </div>
            )}
            
            {activeTab === 'in_progress' && (
              <div>
                {inProgressQuests.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <Scroll className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <div>暂无进行中的任务</div>
                  </div>
                ) : (
                  inProgressQuests.map(quest => renderQuestCard(quest))
                )}
              </div>
            )}
            
            {activeTab === 'completed' && (
              <div>
                {completedQuests.length === 0 ? (
                  <div className="text-center text-slate-400 py-8">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                    <div>暂无已完成的任务</div>
                  </div>
                ) : (
                  completedQuests.map(quest => renderQuestCard(quest))
                )}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
