'use client';

import { useState } from 'react';
import { Character, MarketListing, GameItem, EquipmentItem } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QualityNames, QualityColors } from '@/types/game';
import { 
  Store, 
  Coins,
  ShoppingBag,
  User,
  Clock,
  Shield,
  Gem,
  Sword
} from 'lucide-react';
import { WEAPONS, ARMORS, ACCESSORIES, PILLS, TRIBULATION_PILLS, MATERIALS } from '@/lib/game/gameData';

interface MarketProps {
  character: Character;
  market: MarketListing[];
  playerId: string;
  onBuy: (listingId: string) => void;
  onBuyNpcItem?: (item: GameItem, price: number) => void;
}

// NPC商店物品 - 装备价格计算
const getItemPrice = (item: EquipmentItem): number => {
  const qualityMultiplier: Record<string, number> = {
    'common': 1,
    'fine': 2,
    'rare': 4,
    'epic': 8,
    'legendary': 16
  };
  
  const realmMultiplier: Record<string, number> = {
    '练气期': 1,
    '筑基期': 3,
    '金丹期': 10,
    '元婴期': 30,
    '化神期': 100,
    '合体期': 300,
    '大乘期': 1000
  };
  
  const basePrice = 100;
  const quality = qualityMultiplier[item.quality] || 1;
  const realm = realmMultiplier[item.requiredRealm || '练气期'] || 1;
  
  return Math.floor(basePrice * quality * realm);
};

export function Market({ character, market, playerId, onBuy, onBuyNpcItem }: MarketProps) {
  const [activeTab, setActiveTab] = useState('npc');

  // 分类市场物品
  const categorizedMarket = {
    all: market,
    pill: market.filter(l => l.item.type === 'pill' || l.item.type === 'tribulation_pill'),
    equipment: market.filter(l => l.item.type === 'equipment'),
    material: market.filter(l => l.item.type === 'material')
  };

  // NPC商店物品 - 根据玩家境界筛选可购买的装备
  const getAvailableWeapons = () => {
    const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
    const currentIndex = realmOrder.indexOf(character.realm);
    
    // 如果找不到角色境界，就显示所有装备
    if (currentIndex === -1) {
      return WEAPONS;
    }
    
    return WEAPONS.filter(weapon => {
      const requiredIndex = realmOrder.indexOf(weapon.requiredRealm || '练气期');
      // 可以购买当前境界及以下境界的装备
      return requiredIndex <= currentIndex;
    });
  };

  const getAvailableArmors = () => {
    const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
    const currentIndex = realmOrder.indexOf(character.realm);
    
    // 如果找不到角色境界，就显示所有装备
    if (currentIndex === -1) {
      return ARMORS;
    }
    
    return ARMORS.filter(armor => {
      const requiredIndex = realmOrder.indexOf(armor.requiredRealm || '练气期');
      return requiredIndex <= currentIndex;
    });
  };

  const getAvailableAccessories = () => {
    const realmOrder = ['练气期', '筑基期', '金丹期', '元婴期', '化神期', '合体期', '大乘期', '渡劫期'];
    const currentIndex = realmOrder.indexOf(character.realm);
    
    // 如果找不到角色境界，就显示所有装备
    if (currentIndex === -1) {
      return ACCESSORIES;
    }
    
    return ACCESSORIES.filter(accessory => {
      const requiredIndex = realmOrder.indexOf(accessory.requiredRealm || '练气期');
      return requiredIndex <= currentIndex;
    });
  };

  const getPillsForSale = () => {
    // 只返回普通丹药（恢复类和经验类）
    return PILLS.filter(pill => 
      pill.effect === 'hp' || pill.effect === 'mp' || pill.effect === 'exp'
    );
  };

  // 永久提升丹药
  const getPermanentPillsForSale = () => {
    return PILLS.filter(pill => 
      pill.effect === 'maxHp' || pill.effect === 'maxMp'
    );
  };

  const getItemQualityColor = (item: GameItem) => {
    if (item.type === 'equipment') {
      return QualityColors[(item as EquipmentItem).quality];
    }
    if (item.type === 'material') {
      return QualityColors[(item as any).rarity];
    }
    return 'text-slate-800';
  };

  const formatTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}天前`;
    if (hours > 0) return `${hours}小时前`;
    if (minutes > 0) return `${minutes}分钟前`;
    return '刚刚';
  };

  const handleBuyNpcItem = (item: GameItem, price: number) => {
    if (character.gold < price) {
      return;
    }
    if (onBuyNpcItem) {
      onBuyNpcItem(item, price);
    }
  };

  return (
    <div className="space-y-4">
      {/* 市场信息 */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 text-slate-800 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="w-8 h-8 text-amber-500" />
              <div>
                <div className="text-lg font-bold text-amber-600">交易市场</div>
                <div className="text-sm text-slate-500">
                  当前有 {market.length} 件玩家商品在售
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-amber-200">
              <Coins className="w-5 h-5 text-amber-500" />
              <span className="font-bold text-amber-600">{character.gold.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 商品列表 */}
      <Card className="bg-white border-amber-200 text-slate-800 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-bold text-amber-600 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            商品列表
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-5 bg-slate-100">
              <TabsTrigger value="npc" className="text-xs data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">NPC商店</TabsTrigger>
              <TabsTrigger value="all" className="text-xs data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700">全部</TabsTrigger>
              <TabsTrigger value="pill" className="text-xs data-[state=active]:bg-green-100 data-[state=active]:text-green-700">丹药</TabsTrigger>
              <TabsTrigger value="equipment" className="text-xs data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700">装备</TabsTrigger>
              <TabsTrigger value="material" className="text-xs data-[state=active]:bg-cyan-100 data-[state=active]:text-cyan-700">材料</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-80 mt-3">
              {/* NPC商店 */}
              <TabsContent value="npc" className="mt-0">
                <div className="space-y-4 pr-4">
                  {/* 丹药 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">💊</span> 丹药
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getPillsForSale().map(pill => {
                        const price = Math.floor((pill.value || 50) * 2);
                        const canAfford = character.gold >= price;
                        return (
                          <div key={pill.id} className="p-3 rounded-lg border bg-green-50 border-green-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{pill.icon}</span>
                                <div>
                                  <div className="font-bold text-slate-800">{pill.name}</div>
                                  <div className="text-xs text-slate-500">{pill.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(pill, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-green-500 hover:bg-green-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 永久提升丹药 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">⭐</span> 永久提升丹药
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getPermanentPillsForSale().map(pill => {
                        // 永久提升丹药价格更高
                        const price = Math.floor((pill.value || 50) * 15);
                        const canAfford = character.gold >= price;
                        return (
                          <div key={pill.id} className="p-3 rounded-lg border bg-amber-50 border-amber-300">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{pill.icon}</span>
                                <div>
                                  <div className="font-bold text-amber-700">{pill.name}</div>
                                  <div className="text-xs text-slate-500">{pill.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price.toLocaleString()}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(pill, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-amber-500 hover:bg-amber-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 武器 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Sword className="w-4 h-4 text-red-500" /> 武器
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getAvailableWeapons().map(weapon => {
                        const price = getItemPrice(weapon);
                        const canAfford = character.gold >= price;
                        return (
                          <div key={weapon.id} className="p-3 rounded-lg border bg-red-50 border-red-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{weapon.icon}</span>
                                <div>
                                  <div className={`font-bold ${QualityColors[weapon.quality]}`}>{weapon.name}</div>
                                  <div className="text-xs text-slate-500">
                                    攻击+{weapon.stats.atk} {weapon.stats.hp ? `气血+${weapon.stats.hp}` : ''}
                                  </div>
                                  <div className="text-xs text-slate-400">{weapon.requiredRealm}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price.toLocaleString()}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(weapon, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-red-500 hover:bg-red-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 防具 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-blue-500" /> 防具
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getAvailableArmors().map(armor => {
                        const price = getItemPrice(armor);
                        const canAfford = character.gold >= price;
                        return (
                          <div key={armor.id} className="p-3 rounded-lg border bg-blue-50 border-blue-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{armor.icon}</span>
                                <div>
                                  <div className={`font-bold ${QualityColors[armor.quality]}`}>{armor.name}</div>
                                  <div className="text-xs text-slate-500">
                                    防御+{armor.stats.def} {armor.stats.hp ? `气血+${armor.stats.hp}` : ''}
                                  </div>
                                  <div className="text-xs text-slate-400">{armor.requiredRealm}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price.toLocaleString()}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(armor, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-blue-500 hover:bg-blue-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 饰品 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <Gem className="w-4 h-4 text-purple-500" /> 饰品
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {getAvailableAccessories().map(accessory => {
                        const price = getItemPrice(accessory);
                        const canAfford = character.gold >= price;
                        return (
                          <div key={accessory.id} className="p-3 rounded-lg border bg-purple-50 border-purple-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{accessory.icon}</span>
                                <div>
                                  <div className={`font-bold ${QualityColors[accessory.quality]}`}>{accessory.name}</div>
                                  <div className="text-xs text-slate-500">
                                    {accessory.stats.hp ? `气血+${accessory.stats.hp}` : ''} {accessory.stats.mp ? `灵力+${accessory.stats.mp}` : ''}
                                  </div>
                                  <div className="text-xs text-slate-400">{accessory.requiredRealm}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price.toLocaleString()}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(accessory, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-purple-500 hover:bg-purple-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 渡劫丹 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">🔮</span> 渡劫丹
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {TRIBULATION_PILLS.map(pill => {
                        const price = 500;
                        const canAfford = character.gold >= price;
                        return (
                          <div key={pill.id} className="p-3 rounded-lg border bg-amber-50 border-amber-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{pill.icon}</span>
                                <div>
                                  <div className="font-bold text-slate-800">{pill.name}</div>
                                  <div className="text-xs text-slate-500">{pill.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(pill, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-amber-500 hover:bg-amber-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 材料 */}
                  <div>
                    <h4 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                      <span className="text-lg">🪨</span> 材料
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {MATERIALS.map(material => {
                        const rarityMultiplier: Record<string, number> = {
                          'common': 1,
                          'fine': 3,
                          'rare': 10,
                          'epic': 50,
                          'legendary': 200
                        };
                        const price = 100 * (rarityMultiplier[material.rarity] || 1);
                        const canAfford = character.gold >= price;
                        return (
                          <div key={material.id} className="p-3 rounded-lg border bg-cyan-50 border-cyan-200">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl">{material.icon}</span>
                                <div>
                                  <div className={`font-bold ${QualityColors[material.rarity]}`}>{material.name}</div>
                                  <div className="text-xs text-slate-500">{material.description}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-amber-600 font-bold">{price.toLocaleString()}</div>
                                <Button 
                                  size="sm"
                                  onClick={() => handleBuyNpcItem(material, price)}
                                  disabled={!canAfford}
                                  className={`mt-1 text-white text-xs ${canAfford 
                                    ? 'bg-cyan-500 hover:bg-cyan-600' 
                                    : 'bg-slate-300 cursor-not-allowed'
                                  }`}
                                >
                                  购买
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* 玩家市场 */}
              {(['all', 'pill', 'equipment', 'material'] as const).map(tab => (
                <TabsContent key={tab} value={tab} className="mt-0">
                  {categorizedMarket[tab].length === 0 ? (
                    <div className="text-center text-slate-400 py-12 font-medium">
                      <Store className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                      <div>暂无商品</div>
                    </div>
                  ) : (
                    <div className="space-y-2 pr-4">
                      {categorizedMarket[tab].map(listing => {
                        const isOwnListing = listing.sellerId === playerId;
                        const canAfford = character.gold >= listing.price;
                        
                        return (
                          <div 
                            key={listing.id}
                            className={`
                              p-4 rounded-lg border transition-all
                              ${isOwnListing 
                                ? 'bg-blue-50 border-blue-200' 
                                : 'bg-slate-50 border-slate-200 hover:border-amber-300'
                              }
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{listing.item.icon}</span>
                                <div>
                                  <div className={`font-bold ${getItemQualityColor(listing.item)}`}>
                                    {listing.item.name}
                                  </div>
                                  <div className="text-xs text-slate-500 mt-1">
                                    {listing.item.description}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2 text-xs">
                                    <Badge variant="outline" className="border-slate-200 text-slate-600">
                                      <User className="w-3 h-3 mr-1" />
                                      {isOwnListing ? '我的商品' : listing.sellerName}
                                    </Badge>
                                    <Badge variant="outline" className="border-slate-200 text-slate-600">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {formatTime(listing.listedAt)}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="text-right">
                                <div className="flex items-center gap-1 text-amber-600 font-bold text-lg">
                                  <Coins className="w-4 h-4" />
                                  {listing.price.toLocaleString()}
                                </div>
                                {isOwnListing ? (
                                  <Badge className="mt-2 bg-blue-500 text-white">等待出售</Badge>
                                ) : (
                                  <Button 
                                    size="sm"
                                    onClick={() => onBuy(listing.id)}
                                    disabled={!canAfford}
                                    className={`mt-2 text-white ${canAfford 
                                      ? 'bg-amber-500 hover:bg-amber-600' 
                                      : 'bg-slate-300 cursor-not-allowed'
                                    }`}
                                  >
                                    {canAfford ? '购买' : '金币不足'}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        </CardContent>
      </Card>

      {/* 市场说明 */}
      <Card className="bg-slate-50 border-slate-200 text-slate-700 shadow-md">
        <CardContent className="p-4">
          <div className="text-sm text-slate-600">
            <div className="font-bold text-slate-800 mb-2">💡 市场说明</div>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>NPC商店提供丹药、武器、防具、饰品等商品</li>
              <li>在背包中可以将物品上架出售到玩家市场</li>
              <li>购买其他玩家出售的物品需要消耗金币</li>
              <li>自己的商品无法重复购买</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
