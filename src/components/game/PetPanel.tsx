'use client';

import { useState } from 'react';
import { Character, PlayerPet, PetSkill } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  PawPrint, 
  Star, 
  Shield, 
  Sword, 
  Heart, 
  Zap, 
  Sparkles, 
  Crown, 
  Edit, 
  Power, 
  TrendingUp,
  Award,
  Flame,
  Snowflake,
  Wind,
  CloudLightning,
  Sparkles as SparklesIcon
} from 'lucide-react';
import {
  getPetQualityColor,
  getPetTypeLabel,
  getPetQualityBgColor,
  getPetQualityBorderColor
} from '@/lib/game/petData';

interface PetPanelProps {
  character: Character;
  onActivatePet: (petId: string) => void;
  onDeactivatePet: (petId: string) => void;
  onRenamePet: (petId: string, nickname: string) => void;
  onEvolvePet: (petId: string) => void;
  onLevelUpPet: (petId: string, exp: number) => void;
  addLog: (type: 'battle' | 'level_up' | 'tribulation' | 'item' | 'market' | 'system' | 'quest' | 'achievement' | 'event' | 'pet', message: string) => void;
}

export function PetPanel({ 
  character, 
  onActivatePet, 
  onDeactivatePet, 
  onRenamePet, 
  onEvolvePet,
  onLevelUpPet,
  addLog 
}: PetPanelProps) {
  const [selectedPet, setSelectedPet] = useState<PlayerPet | null>(null);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [newNickname, setNewNickname] = useState('');

  const handleRename = () => {
    if (selectedPet && newNickname.trim()) {
      onRenamePet(selectedPet.pet.id, newNickname.trim());
      setRenameDialogOpen(false);
      setNewNickname('');
    }
  };

  const getSkillIcon = (skill: PetSkill) => {
    switch (skill.type) {
      case 'attack':
        return <Sword className="w-4 h-4" />;
      case 'defense':
        return <Shield className="w-4 h-4" />;
      case 'support':
        return <Heart className="w-4 h-4" />;
      case 'special':
        return <SparklesIcon className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getSkillColor = (skill: PetSkill) => {
    switch (skill.type) {
      case 'attack':
        return 'text-red-500';
      case 'defense':
        return 'text-blue-500';
      case 'support':
        return 'text-green-500';
      case 'special':
        return 'text-purple-500';
      default:
        return 'text-yellow-500';
    }
  };

  const getPetTypeIcon = (type: string) => {
    switch (type) {
      case 'beast':
        return <PawPrint className="w-5 h-5" />;
      case 'spirit':
        return <Sparkles className="w-5 h-5" />;
      case 'elemental':
        return <Zap className="w-5 h-5" />;
      case 'divine':
        return <Crown className="w-5 h-5" />;
      case 'demonic':
        return <Flame className="w-5 h-5" />;
      default:
        return <PawPrint className="w-5 h-5" />;
    }
  };

  const getBattleStats = (pet: PlayerPet) => {
    const levelBonus = pet.pet.level * 0.1;
    return {
      hp: Math.floor(pet.pet.stats.hp * (1 + levelBonus)),
      atk: Math.floor(pet.pet.stats.atk * (1 + levelBonus)),
      def: Math.floor(pet.pet.stats.def * (1 + levelBonus)),
      speed: Math.floor(pet.pet.stats.speed * (1 + levelBonus * 0.5))
    };
  };

  const winRate = (pet: PlayerPet) => {
    if (pet.battleCount === 0) return 0;
    return Math.round((pet.winCount / pet.battleCount) * 100);
  };

  return (
    <div className="space-y-4">
      {/* 宠物面板标题 */}
      <Card className="bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PawPrint className="w-6 h-6" />
              宠物系统
            </CardTitle>
            <Badge className="bg-white text-orange-600 border-0">
              已拥有: {(character.pets || []).length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-amber-100">
            宠物可以陪伴你战斗，提供属性加成和特殊技能
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 宠物列表 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <PawPrint className="w-5 h-5" />
              我的宠物
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(character.pets || []).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <PawPrint className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div>还没有宠物</div>
                <div className="text-sm mt-2">去市场购买宠物吧</div>
              </div>
            ) : (
              <ScrollArea className="max-h-80">
                <div className="space-y-2">
                  {(character.pets || []).map((pet) => {
                    const qualityColor = getPetQualityColor(pet.pet.quality);
                    const qualityBgColor = getPetQualityBgColor(pet.pet.quality);
                    const qualityBorderColor = getPetQualityBorderColor(pet.pet.quality);
                    const battleStats = getBattleStats(pet);
                    const isLegendary = pet.pet.quality === 'legendary';
                    return (
                      <Card 
                        key={pet.pet.id}
                        className={`cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] ${
                          pet.isActive ? 'ring-2 ring-green-500 shadow-green-200' : ''
                        } ${qualityBgColor} border-2 ${qualityBorderColor}`}
                        onClick={() => setSelectedPet(pet)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`text-4xl ${isLegendary ? 'animate-pulse' : ''}`}>
                                {pet.pet.icon}
                              </div>
                              <div>
                                <div className="flex items-center gap-1">
                                  <span className={`font-bold ${qualityColor} ${isLegendary ? 'text-lg' : ''}`}>
                                    {pet.nickname || pet.pet.name}
                                  </span>
                                  {pet.isActive && (
                                    <Badge className="bg-green-500 text-white animate-pulse">出战中</Badge>
                                  )}
                                  {isLegendary && (
                                    <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">传说</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-slate-600">
                                  <Badge variant="outline" className={qualityColor}>
                                    {pet.pet.level}级
                                  </Badge>
                                  <Badge variant="outline" className={qualityColor}>
                                    {getPetTypeLabel(pet.pet.type)}
                                  </Badge>
                                  <Badge variant="outline" className={qualityColor}>
                                    {pet.pet.quality === 'common' && '普通'}
                                    {pet.pet.quality === 'uncommon' && '优秀'}
                                    {pet.pet.quality === 'rare' && '稀有'}
                                    {pet.pet.quality === 'epic' && '史诗'}
                                    {pet.pet.quality === 'legendary' && '传说'}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-red-500">
                                ❤️ {battleStats.hp}
                              </div>
                              <div className="text-xs text-orange-500">
                                ⚔️ {battleStats.atk}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* 宠物详情 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-600">
              <Star className="w-5 h-5" />
              {selectedPet ? (selectedPet.nickname || selectedPet.pet.name) : '宠物详情'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPet ? (
              <div className="space-y-4">
                {/* 基础信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`text-5xl ${selectedPet.pet.quality === 'legendary' ? 'animate-pulse' : ''}`}>
                      {selectedPet.pet.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xl font-bold ${getPetQualityColor(selectedPet.pet.quality)} ${
                          selectedPet.pet.quality === 'legendary' ? 'text-2xl' : ''
                        }`}>
                          {selectedPet.nickname || selectedPet.pet.name}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameDialogOpen(true);
                            setNewNickname(selectedPet.nickname || '');
                          }}
                          className="text-slate-500 hover:text-blue-500"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          重命名
                        </Button>
                        {selectedPet.pet.quality === 'legendary' && (
                          <Badge className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white animate-pulse">传说</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={`${getPetQualityColor(selectedPet.pet.quality)} border-0`}>
                          {selectedPet.pet.quality === 'common' && '普通'}
                          {selectedPet.pet.quality === 'uncommon' && '优秀'}
                          {selectedPet.pet.quality === 'rare' && '稀有'}
                          {selectedPet.pet.quality === 'epic' && '史诗'}
                          {selectedPet.pet.quality === 'legendary' && '传说'}
                        </Badge>
                        <Badge variant="outline">
                          {getPetTypeLabel(selectedPet.pet.type)}
                        </Badge>
                        <Badge variant="outline" className="text-purple-500">
                          {selectedPet.pet.level}级
                        </Badge>
                      </div>
                      <div className="text-sm text-slate-600 mt-1">
                        {selectedPet.pet.description}
                      </div>
                    </div>
                  </div>

                  {/* 战斗状态 */}
                  <Card className={`bg-slate-50 ${selectedPet.pet.quality === 'legendary' ? 'border-orange-300 border-2' : ''}`}>
                    <CardContent className="p-3">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="text-center">
                          <div className="text-sm text-slate-500">战斗次数</div>
                          <div className="font-bold">{selectedPet.battleCount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-500">胜利次数</div>
                          <div className="font-bold text-green-500">{selectedPet.winCount}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-slate-500">胜率</div>
                          <div className="font-bold text-blue-500">{winRate(selectedPet)}%</div>
                        </div>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>忠诚度</span>
                          <span>{selectedPet.pet.loyalty}/100</span>
                        </div>
                        <Progress value={selectedPet.pet.loyalty} className="h-2 bg-amber-100 [&>div]:bg-amber-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* 经验条 */}
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-amber-600">经验</span>
                    <span>{selectedPet.pet.exp}/{selectedPet.pet.maxExp}</span>
                  </div>
                  <Progress 
                    value={(selectedPet.pet.exp / selectedPet.pet.maxExp) * 100} 
                    className="h-2 bg-amber-100 [&>div]:bg-gradient-to-r [&>div]:from-amber-400 [&>div]:to-amber-600" 
                  />
                </div>

                {/* 属性 */}
                <Card className={`bg-gradient-to-r ${
                  selectedPet.pet.quality === 'legendary' 
                    ? 'from-orange-50 via-yellow-50 to-orange-50 border-orange-300 border-2' 
                    : 'from-amber-50 to-orange-50 border-amber-200'
                }`}>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex flex-col items-center">
                        <Heart className="w-5 h-5 text-red-500 mb-1" />
                        <div className="text-sm text-slate-500">气血</div>
                        <div className={`font-bold ${selectedPet.pet.quality === 'legendary' ? 'text-xl text-red-600' : ''}`}>
                          {selectedPet.pet.stats.hp}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Sword className="w-5 h-5 text-orange-500 mb-1" />
                        <div className="text-sm text-slate-500">攻击</div>
                        <div className={`font-bold ${selectedPet.pet.quality === 'legendary' ? 'text-xl text-orange-600' : ''}`}>
                          {selectedPet.pet.stats.atk}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Shield className="w-5 h-5 text-blue-500 mb-1" />
                        <div className="text-sm text-slate-500">防御</div>
                        <div className={`font-bold ${selectedPet.pet.quality === 'legendary' ? 'text-xl text-blue-600' : ''}`}>
                          {selectedPet.pet.stats.def}
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <Zap className="w-5 h-5 text-yellow-500 mb-1" />
                        <div className="text-sm text-slate-500">速度</div>
                        <div className={`font-bold ${selectedPet.pet.quality === 'legendary' ? 'text-xl text-yellow-600' : ''}`}>
                          {selectedPet.pet.stats.speed}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* 技能 */}
                <div>
                  <div className="text-sm font-medium text-amber-600 mb-2 flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    技能
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {selectedPet.pet.skills.map((skill) => (
                      <Card key={skill.id} className="bg-slate-50">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="font-medium flex items-center gap-1">
                                {getSkillIcon(skill)}
                                {skill.name}
                              </div>
                              <div className="text-xs text-slate-600 mt-1">
                                {skill.description}
                              </div>
                            </div>
                            <Badge className={getSkillColor(skill)}>
                              {skill.type === 'attack' && '攻击'}
                              {skill.type === 'defense' && '防御'}
                              {skill.type === 'support' && '辅助'}
                              {skill.type === 'special' && '特殊'}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-2">
                  {selectedPet.isActive ? (
                    <>
                      <Button 
                        variant="ghost"
                        onClick={() => onDeactivatePet(selectedPet.pet.id)}
                      >
                        <Power className="w-4 h-4 mr-1" />
                        休息
                      </Button>
                      <Button 
                        variant="ghost"
                        disabled
                        className="text-green-600 cursor-not-allowed opacity-60"
                      >
                        <Sword className="w-4 h-4 mr-1" />
                        已出战
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        onClick={() => onActivatePet(selectedPet.pet.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Sword className="w-4 h-4 mr-1" />
                        出战
                      </Button>
                      <Button 
                        variant="ghost"
                        disabled
                        className="text-slate-400 cursor-not-allowed opacity-60"
                      >
                        <Power className="w-4 h-4 mr-1" />
                        休息中
                      </Button>
                    </>
                  )}
                  
                  {selectedPet.pet.canEvolve && selectedPet.pet.level >= (selectedPet.pet.evolutionLevel || 20) && (
                    <Button 
                      onClick={() => onEvolvePet(selectedPet.pet.id)}
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <TrendingUp className="w-4 h-4 mr-1" />
                      进化
                    </Button>
                  )}
                </div>

                {/* 进化提示 */}
                {selectedPet.pet.canEvolve && selectedPet.pet.level < (selectedPet.pet.evolutionLevel || 20) && (
                  <div className="text-sm text-purple-600 bg-purple-50 p-2 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-1">
                      <Crown className="w-4 h-4" />
                      进化提示
                    </div>
                    <div className="mt-1">
                      达到 {selectedPet.pet.evolutionLevel || 20} 级可进化
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <div>选择一个宠物查看详情</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 宠物技能效果说明 */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-700">
            技能效果说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-600 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <Sword className="w-4 h-4 text-red-500" />
            <span>攻击技能：造成伤害</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-500" />
            <span>防御技能：提高防御</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-green-500" />
            <span>辅助技能：治疗或增益</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>特殊技能：强大效果</span>
          </div>
        </CardContent>
      </Card>

      {/* 重命名对话框 */}
      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>重命名宠物</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              placeholder="输入新昵称"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleRename} disabled={!newNickname.trim()}>
              确认
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
