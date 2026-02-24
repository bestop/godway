'use client';

import { useState } from 'react';
import { Character } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ShoppingBag, 
  Coins, 
  Star, 
  PawPrint, 
  Crown,
  Shield,
  Sword,
  Heart,
  Zap
} from 'lucide-react';
import {
  getPetQualityColor,
  getPetTypeLabel,
  PET_SHOP_ITEMS,
  getPetById
} from '@/lib/game/petData';

interface PetShopProps {
  character: Character;
  onBuyPet: (petId: string, price: number) => void;
  addLog: (type: 'battle' | 'level_up' | 'tribulation' | 'item' | 'market' | 'system' | 'quest' | 'achievement' | 'event' | 'pet', message: string) => void;
}

export function PetShop({ character, onBuyPet, addLog }: PetShopProps) {
  const [selectedTab, setSelectedTab] = useState('all');

  const filteredPets = selectedTab === 'all' 
    ? PET_SHOP_ITEMS 
    : PET_SHOP_ITEMS.filter(item => item.type === selectedTab);

  return (
    <div className="space-y-4">
      {/* 商店标题 */}
      <Card className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="w-6 h-6" />
              宠物商店
            </CardTitle>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4" />
              <span>{character.gold.toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-purple-100">
            购买可爱的宠物陪伴你冒险
          </div>
        </CardContent>
      </Card>

      {/* 分类标签 */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedTab === 'all' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('all')}
          className={selectedTab === 'all' ? 'bg-purple-500 hover:bg-purple-600' : ''}
        >
          全部
        </Button>
        <Button 
          variant={selectedTab === 'beast' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('beast')}
          className={selectedTab === 'beast' ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          野兽
        </Button>
        <Button 
          variant={selectedTab === 'spirit' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('spirit')}
          className={selectedTab === 'spirit' ? 'bg-blue-500 hover:bg-blue-600' : ''}
        >
          精灵
        </Button>
        <Button 
          variant={selectedTab === 'divine' ? 'default' : 'ghost'}
          onClick={() => setSelectedTab('divine')}
          className={selectedTab === 'divine' ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
        >
          神圣
        </Button>
      </div>

      {/* 宠物列表 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-600">
            <PawPrint className="w-5 h-5" />
            可购买的宠物
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-4">
              {filteredPets.map((shopItem) => {
                const petData = getPetById(shopItem.petId);
                if (!petData) return null;

                const qualityColor = getPetQualityColor(petData.quality);
                const canAfford = character.gold >= shopItem.price;

                return (
                  <Card 
                    key={shopItem.id}
                    className={`transition-all hover:shadow-md ${!canAfford ? 'opacity-70' : 'hover:scale-[1.02]'}`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="text-5xl">{petData.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1">
                                <span className={`font-bold ${qualityColor}`}>
                                  {petData.name}
                                </span>
                                {petData.quality === 'legendary' && (
                                  <Crown className="w-4 h-4 text-yellow-500" />
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-xs mt-1">
                                <Badge variant="outline" className={qualityColor}>
                                  {petData.quality === 'common' && '普通'}
                                  {petData.quality === 'uncommon' && '优秀'}
                                  {petData.quality === 'rare' && '稀有'}
                                  {petData.quality === 'epic' && '史诗'}
                                  {petData.quality === 'legendary' && '传说'}
                                </Badge>
                                <Badge variant="outline">
                                  {getPetTypeLabel(petData.type)}
                                </Badge>
                              </div>
                              <div className="text-sm text-slate-600 mt-2">
                                {petData.description}
                              </div>
                            </div>
                            <Badge className="bg-amber-100 text-amber-700 border-0">
                              <Coins className="w-3 h-3 mr-1" />
                              {shopItem.price.toLocaleString()}
                            </Badge>
                          </div>

                          {/* 宠物属性预览 */}
                          <div className="grid grid-cols-4 gap-2 mt-3 text-xs">
                            <div className="flex flex-col items-center">
                              <Heart className="w-3 h-3 text-red-500 mb-1" />
                              <span>{petData.config.baseStats.hp}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <Sword className="w-3 h-3 text-orange-500 mb-1" />
                              <span>{petData.config.baseStats.atk}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <Shield className="w-3 h-3 text-blue-500 mb-1" />
                              <span>{petData.config.baseStats.def}</span>
                            </div>
                            <div className="flex flex-col items-center">
                              <Zap className="w-3 h-3 text-yellow-500 mb-1" />
                              <span>{petData.config.baseStats.speed}</span>
                            </div>
                          </div>

                          {/* 技能预览 */}
                          <div className="mt-3">
                            <div className="text-xs text-slate-500 mb-1">技能：</div>
                            <div className="flex flex-wrap gap-1">
                              {petData.config.skills.slice(0, 3).map((skill) => (
                                <Badge key={skill.id} variant="outline" className="text-xs">
                                  {skill.name}
                                </Badge>
                              ))}
                              {petData.config.skills.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{petData.config.skills.length - 3}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* 购买按钮 */}
                          <div className="mt-3">
                            <Button 
                              onClick={() => {
                                if (canAfford) {
                                  onBuyPet(shopItem.petId, shopItem.price);
                                } else {
                                  addLog('pet', '金币不足，无法购买宠物！');
                                }
                              }}
                              disabled={!canAfford}
                              className={canAfford 
                                ? 'w-full bg-purple-500 hover:bg-purple-600' 
                                : 'w-full bg-slate-300 cursor-not-allowed'}
                            >
                              {canAfford ? '购买' : '金币不足'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* 商店说明 */}
      <Card className="bg-slate-50 border-slate-200">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-slate-700">
            购买说明
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-slate-600">
          <ul className="list-disc list-inside space-y-1">
            <li>宠物可以陪伴你战斗，提供属性加成</li>
            <li>高品质宠物拥有更强大的技能和成长潜力</li>
            <li>部分宠物可以进化为更强大的形态</li>
            <li>每个宠物都有独特的技能组合</li>
            <li>出战中的宠物会在战斗中自动使用技能</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
