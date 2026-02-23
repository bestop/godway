'use client';

import { useState } from 'react';
import { Character, Skill, SKILLS, RealmType } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { 
  Zap, 
  Shield, 
  Heart, 
  Flame, 
  Sparkles,
  Lock,
  CheckCircle2,
  Pill
} from 'lucide-react';

interface SkillPanelProps {
  character: Character;
  inventory?: any[];
  onUnlockSkill?: (skillId: string) => void;
  onUseSkill?: (skillId: string) => void;
  onUpgradeSkill?: (skillId: string, levels?: number) => void;
  onUseItem?: (item: any, quantity?: number) => void;
}

const SkillTypeIcons: Record<string, string> = {
  attack: '⚔️',
  heal: '💚',
  buff: '✨',
  debuff: '💫',
  special: '💥'
};

const SkillTypeNames: Record<string, string> = {
  attack: '攻击',
  heal: '治疗',
  buff: '增益',
  debuff: '减益',
  special: '特殊'
};

const getRealmIndex = (realm: RealmType): number => {
  const realms: RealmType[] = [
    '练气期', '筑基期', '金丹期', '元婴期', 
    '化神期', '合体期', '大乘期', '渡劫期'
  ];
  return realms.indexOf(realm);
};

export function SkillPanel({ character, inventory = [], onUnlockSkill, onUseSkill, onUpgradeSkill, onUseItem }: SkillPanelProps) {
  const characterRealmIndex = getRealmIndex(character.realm);
  const [skillPillDialogOpen, setSkillPillDialogOpen] = useState(false);
  const [selectedSkillPill, setSelectedSkillPill] = useState<any>(null);
  const [pillQuantity, setPillQuantity] = useState(1);
  
  // 获取技能丹药数量
  const getSkillPillCount = () => {
    return inventory
      .filter(i => i.item.type === 'pill' && i.item.effect === 'skill')
      .reduce((sum, item) => sum + item.quantity, 0);
  };
  
  // 获取可用的技能丹药
  const getAvailableSkillPills = () => {
    return inventory.filter(i => i.item.type === 'pill' && i.item.effect === 'skill');
  };
  
  // 使用技能丹药
  const handleUseSkillPill = () => {
    if (selectedSkillPill && onUseItem) {
      onUseItem(selectedSkillPill.item, pillQuantity);
      setSkillPillDialogOpen(false);
      setSelectedSkillPill(null);
      setPillQuantity(1);
    }
  };
  
  const getSkillState = (skill: Skill) => {
    const charSkill = character.skills?.find(s => s.skillId === skill.id);
    const skillRealmIndex = skill.requiredRealm ? getRealmIndex(skill.requiredRealm) : 0;
    const meetsRequirement = characterRealmIndex >= skillRealmIndex && 
                            character.level >= (skill.unlockLevel || 1);
    
    const unlocked = charSkill?.unlocked || false;
    
    return {
      unlocked,
      level: charSkill?.level || 1,
      cooldown: charSkill?.currentCooldown || 0,
      meetsRequirement,
      canUnlock: meetsRequirement && !unlocked
    };
  };
  
  return (
    <div className="space-y-4">
      {/* 角色当前信息 */}
      <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-300 text-white shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-purple-100">技能系统</div>
              <div className="text-sm text-purple-200">
                {character.realm} {character.level}层
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-yellow-200">
                {character.skills?.filter(s => s.unlocked).length || 0}/{SKILLS.length}
              </div>
              <div className="text-xs text-purple-200">已解锁技能</div>
              <div className="text-xs text-purple-200 mt-1">
                技能丹: {getSkillPillCount()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 技能列表 */}
      <Card className="bg-white border-purple-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl font-bold text-purple-600 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              技能列表
            </div>
            {getAvailableSkillPills().length > 0 && onUseItem && (
              <Button
                size="sm"
                onClick={() => setSkillPillDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Pill className="w-4 h-4 mr-1" />
                使用技能丹
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80 pr-4">
            <div className="space-y-3">
              {SKILLS.map(skill => {
                const state = getSkillState(skill);
                
                return (
                  <div 
                    key={skill.id}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${state.unlocked 
                        ? 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-300' 
                        : state.meetsRequirement 
                          ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-300 cursor-pointer hover:scale-[1.01]' 
                          : 'bg-gray-50 border-gray-200 opacity-60'
                      }
                    `}
                  >
                    <div className="flex items-start gap-3">
                      {/* 技能图标 */}
                      <div className={`
                        w-12 h-12 rounded-full flex items-center justify-center text-2xl
                        ${state.unlocked 
                          ? 'bg-gradient-to-br from-purple-500 to-indigo-600' 
                          : state.meetsRequirement 
                            ? 'bg-gradient-to-br from-yellow-400 to-orange-500' 
                            : 'bg-gray-300'
                        }
                        shadow-lg
                      `}>
                        {state.unlocked || state.meetsRequirement ? skill.icon : <Lock className="w-6 h-6 text-white" />}
                      </div>
                      
                      {/* 技能信息 */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg text-slate-800">{skill.name}</span>
                          <Badge 
                            variant="outline" 
                            className={`
                              text-xs font-medium
                              ${skill.type === 'attack' ? 'bg-red-100 text-red-700 border-red-300' : ''}
                              ${skill.type === 'heal' ? 'bg-green-100 text-green-700 border-green-300' : ''}
                              ${skill.type === 'buff' ? 'bg-blue-100 text-blue-700 border-blue-300' : ''}
                              ${skill.type === 'debuff' ? 'bg-purple-100 text-purple-700 border-purple-300' : ''}
                              ${skill.type === 'special' ? 'bg-orange-100 text-orange-700 border-orange-300' : ''}
                            `}
                          >
                            {SkillTypeNames[skill.type]} {SkillTypeIcons[skill.type]}
                          </Badge>
                          {state.unlocked && (
                            <Badge className="bg-purple-500 text-white">
                              Lv.{state.level}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-slate-600 mt-1">{skill.description}</p>
                        
                        <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            💫 灵力消耗: {skill.mpCost}
                          </span>
                          <span className="flex items-center gap-1">
                            ⏱️ 冷却: {skill.cooldown}回合
                          </span>
                        </div>
                        
                        {/* 解锁要求 */}
                        {!state.unlocked && (
                          <div className="mt-2 text-xs">
                            <span className={state.meetsRequirement ? 'text-green-600' : 'text-red-500'}>
                              {state.meetsRequirement ? (
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-4 h-4" />
                                  可解锁
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <Lock className="w-4 h-4" />
                                  需要: {skill.requiredRealm} {skill.unlockLevel}层
                                </span>
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex flex-col gap-2">
                        {state.canUnlock && onUnlockSkill && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                            onClick={() => onUnlockSkill(skill.id)}
                          >
                            解锁
                          </Button>
                        )}
                        
                        {state.unlocked && onUpgradeSkill && (
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                            onClick={() => onUpgradeSkill(skill.id)}
                          >
                            <Sparkles className="w-4 h-4 mr-1" />
                            升级
                          </Button>
                        )}
                        
                        {state.unlocked && !onUpgradeSkill && (
                          <Button
                            size="sm"
                            disabled
                            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white opacity-80 cursor-not-allowed"
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            已解锁
                          </Button>
                        )}
                        
                        {!state.canUnlock && !state.unlocked && (
                          <Button
                            size="sm"
                            disabled
                            className="bg-gray-400 text-white opacity-70 cursor-not-allowed"
                          >
                            <Lock className="w-4 h-4 mr-1" />
                            未解锁
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      
      {/* 技能提示 */}
      <Card className="bg-blue-50 border-blue-200 text-blue-800">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <div className="font-medium">技能系统说明</div>
              <ul className="text-sm text-blue-700 mt-1 space-y-1">
                <li>• 达到对应境界和层数后可解锁新技能</li>
                <li>• 技能需要消耗灵力，并有冷却回合</li>
                <li>• 不同类型的技能有不同的效果</li>
                <li>• 使用技能丹药（悟道丹、通玄丹、天悟丹）可以提升技能等级</li>
                <li>• 技能等级越高，技能效果越强（每级增加10%效果）</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* 技能丹药使用对话框 */}
      <Dialog open={skillPillDialogOpen} onOpenChange={setSkillPillDialogOpen}>
        <DialogContent className="bg-white border-slate-200 text-slate-800">
          <DialogHeader>
            <DialogTitle>使用技能丹药</DialogTitle>
            <DialogDescription className="text-slate-500">
              选择技能丹药来提升技能等级
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3">
              <div className="text-sm font-medium text-slate-600">选择技能丹药:</div>
              <div className="grid grid-cols-3 gap-2">
                {getAvailableSkillPills().map((invItem, index) => (
                  <div
                    key={`${invItem.item.id}-${index}`}
                    className={`
                      p-3 rounded-lg border-2 cursor-pointer transition-all
                      ${selectedSkillPill?.item.id === invItem.item.id
                        ? 'bg-purple-100 border-purple-400 scale-105'
                        : 'bg-slate-50 border-slate-200 hover:border-purple-300 hover:scale-102'
                      }
                    `}
                    onClick={() => setSelectedSkillPill(invItem)}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{invItem.item.icon}</div>
                      <div className="font-bold text-slate-800">{invItem.item.name}</div>
                      <div className="text-xs text-slate-500 mt-1">x{invItem.quantity}</div>
                      <div className="text-xs text-purple-600 font-medium">+{invItem.item.value}级</div>
                    </div>
                  </div>
                ))}
                {getAvailableSkillPills().length === 0 && (
                  <div className="col-span-full text-center text-slate-400 py-8">
                    暂无技能丹药
                  </div>
                )}
              </div>
              
              {selectedSkillPill && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">使用数量:</span>
                    <input
                      type="number"
                      min={1}
                      max={selectedSkillPill.quantity}
                      value={pillQuantity}
                      onChange={(e) => setPillQuantity(Math.min(Math.max(1, parseInt(e.target.value) || 1), selectedSkillPill.quantity))}
                      className="w-20 bg-white border-slate-300 px-3 py-2 rounded-lg"
                    />
                    <span className="text-sm text-slate-500">/ {selectedSkillPill.quantity}</span>
                  </div>
                  <div className="text-sm text-slate-600">
                    将提升 <span className="font-bold text-purple-600">{selectedSkillPill.item.value * pillQuantity}</span> 级
                  </div>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => {
              setSkillPillDialogOpen(false);
              setSelectedSkillPill(null);
              setPillQuantity(1);
            }} className="text-slate-600">
              取消
            </Button>
            <Button 
              onClick={handleUseSkillPill}
              disabled={!selectedSkillPill || !onUseItem}
              className="bg-purple-500 hover:bg-purple-600 text-white"
            >
              <Pill className="w-4 h-4 mr-1" />
              使用
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
