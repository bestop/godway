import { 
  Pet, 
  PetType, 
  PetQuality, 
  PetSkill, 
  PetData,
  PlayerPet
} from '@/types/game';
import { generateId } from './gameEngine';

// 宠物技能
export const PET_SKILLS: PetSkill[] = [
  // 攻击技能
  {
    id: 'skill_pet_attack_basic',
    name: '撕咬',
    description: '基础物理攻击',
    type: 'attack',
    power: 1.0,
    cooldown: 0,
    effects: {
      damage: 15
    }
  },
  {
    id: 'skill_pet_attack_fire',
    name: '火焰喷射',
    description: '火焰元素攻击，有概率造成灼伤',
    type: 'attack',
    power: 1.2,
    cooldown: 2,
    effects: {
      damage: 25,
      debuff: {
        stat: 'def',
        value: 10,
        duration: 2
      }
    }
  },
  {
    id: 'skill_pet_attack_ice',
    name: '冰冻术',
    description: '冰元素攻击，有概率减速',
    type: 'attack',
    power: 1.1,
    cooldown: 3,
    effects: {
      damage: 20,
      debuff: {
        stat: 'atk',
        value: 15,
        duration: 2
      }
    }
  },
  
  // 防御技能
  {
    id: 'skill_pet_defense_basic',
    name: '护盾',
    description: '创建基础护盾',
    type: 'defense',
    power: 0.8,
    cooldown: 4,
    effects: {
      buff: {
        stat: 'def',
        value: 20,
        duration: 3
      }
    }
  },
  {
    id: 'skill_pet_defense_iron',
    name: '铁壁',
    description: '提高防御力',
    type: 'defense',
    power: 1.0,
    cooldown: 5,
    effects: {
      buff: {
        stat: 'def',
        value: 30,
        duration: 4
      }
    }
  },
  
  // 辅助技能
  {
    id: 'skill_pet_support_heal',
    name: '治愈术',
    description: '治愈主人和宠物',
    type: 'support',
    power: 1.0,
    cooldown: 6,
    effects: {
      heal: 30,
      buff: {
        stat: 'hp',
        value: 20,
        duration: 1
      }
    }
  },
  {
    id: 'skill_pet_support_buff',
    name: '力量祝福',
    description: '提高攻击力',
    type: 'support',
    power: 0.9,
    cooldown: 5,
    effects: {
      buff: {
        stat: 'atk',
        value: 25,
        duration: 3
      }
    }
  },
  
  // 特殊技能
  {
    id: 'skill_pet_special_ultimate',
    name: '终极冲击',
    description: '强力攻击，消耗大量能量',
    type: 'special',
    power: 2.0,
    cooldown: 8,
    effects: {
      damage: 50
    }
  },
  {
    id: 'skill_pet_special_heal_full',
    name: '生命回复',
    description: '完全恢复生命值',
    type: 'special',
    power: 1.5,
    cooldown: 10,
    effects: {
      heal: 100,
      buff: {
        stat: 'hp',
        value: 50,
        duration: 2
      }
    }
  }
];

// 宠物数据
export const PET_DATA: PetData[] = [
  // 普通宠物
  {
    id: 'pet_wolf',
    name: '野狼',
    type: 'beast',
    quality: 'common',
    rarity: 0.1,
    icon: '🐺',
    description: '普通的野狼，忠诚可靠',
    config: {
      baseStats: {
        hp: 60,
        atk: 15,
        def: 8,
        speed: 12
      },
      growthRate: {
        hp: 2.0,
        atk: 0.8,
        def: 0.4,
        speed: 0.6
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_basic')!
      ]
    }
  },
  {
    id: 'pet_fox',
    name: '灵狐',
    type: 'spirit',
    quality: 'uncommon',
    rarity: 0.3,
    icon: '🦊',
    description: '有灵性的狐狸，擅长魔法攻击',
    config: {
      baseStats: {
        hp: 50,
        atk: 20,
        def: 6,
        speed: 15
      },
      growthRate: {
        hp: 1.8,
        atk: 1.0,
        def: 0.3,
        speed: 0.8
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_heal')!
      ]
    }
  },
  {
    id: 'pet_tiger',
    name: '猛虎',
    type: 'beast',
    quality: 'rare',
    rarity: 0.5,
    icon: '🐯',
    description: '凶猛的老虎，攻击力强大',
    config: {
      baseStats: {
        hp: 80,
        atk: 25,
        def: 12,
        speed: 10
      },
      growthRate: {
        hp: 2.5,
        atk: 1.2,
        def: 0.6,
        speed: 0.5
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!
      ],
      evolutionPath: {
        level: 20,
        petId: 'pet_tiger_king'
      }
    }
  },
  {
    id: 'pet_dragon',
    name: '幼龙',
    type: 'divine',
    quality: 'epic',
    rarity: 0.8,
    icon: '🐉',
    description: '神圣的幼龙，潜力无限',
    config: {
      baseStats: {
        hp: 100,
        atk: 30,
        def: 15,
        speed: 18
      },
      growthRate: {
        hp: 3.0,
        atk: 1.5,
        def: 0.8,
        speed: 1.0
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_iron')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!
      ],
      evolutionPath: {
        level: 30,
        petId: 'pet_elder_dragon'
      }
    }
  },
  {
    id: 'pet_unicorn',
    name: '独角兽',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.95,
    icon: '🦄',
    description: '传说中的独角兽，拥有神圣力量',
    config: {
      baseStats: {
        hp: 120,
        atk: 35,
        def: 20,
        speed: 20
      },
      growthRate: {
        hp: 3.5,
        atk: 1.8,
        def: 1.0,
        speed: 1.2
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_heal')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_heal_full')!
      ]
    }
  },
  
  // 进化后的宠物
  {
    id: 'pet_tiger_king',
    name: '虎王',
    type: 'beast',
    quality: 'epic',
    rarity: 0.7,
    icon: '👑🐯',
    description: '进化后的虎王，威风凛凛',
    config: {
      baseStats: {
        hp: 120,
        atk: 35,
        def: 18,
        speed: 14
      },
      growthRate: {
        hp: 3.0,
        atk: 1.5,
        def: 0.8,
        speed: 0.7
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_iron')!
      ]
    }
  },
  {
    id: 'pet_elder_dragon',
    name: '古龙',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.9,
    icon: '🐉✨',
    description: '进化后的古龙，威力无穷',
    config: {
      baseStats: {
        hp: 150,
        atk: 45,
        def: 25,
        speed: 22
      },
      growthRate: {
        hp: 4.0,
        atk: 2.0,
        def: 1.2,
        speed: 1.4
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_iron')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_heal_full')!
      ]
    }
  }
];

// 宠物商店
export const PET_SHOP_ITEMS = [
  {
    id: 'shop_pet_wolf',
    petId: 'pet_wolf',
    price: 1000,
    stock: 999,
    rarity: 'common',
    type: 'beast'
  },
  {
    id: 'shop_pet_fox',
    petId: 'pet_fox',
    price: 3000,
    stock: 500,
    rarity: 'uncommon',
    type: 'spirit'
  },
  {
    id: 'shop_pet_tiger',
    petId: 'pet_tiger',
    price: 8000,
    stock: 200,
    rarity: 'rare',
    type: 'beast'
  },
  {
    id: 'shop_pet_dragon',
    petId: 'pet_dragon',
    price: 20000,
    stock: 50,
    rarity: 'epic',
    type: 'divine'
  },
  {
    id: 'shop_pet_unicorn',
    petId: 'pet_unicorn',
    price: 50000,
    stock: 10,
    rarity: 'legendary',
    type: 'divine'
  }
];

// 获取宠物数据
export function getPetById(id: string): PetData | undefined {
  return PET_DATA.find(pet => pet.id === id);
}

// 创建新宠物
export function createPet(petData: PetData): Pet {
  return {
    id: generateId(),
    name: petData.name,
    type: petData.type,
    quality: petData.quality,
    level: 1,
    exp: 0,
    maxExp: 100,
    rarity: petData.rarity,
    stats: { ...petData.config.baseStats },
    skills: petData.config.skills,
    loyalty: 70,
    affection: 50,
    icon: petData.icon,
    description: petData.description,
    obtainedAt: Date.now(),
    canEvolve: !!petData.config.evolutionPath,
    evolutionLevel: petData.config.evolutionPath?.level,
    evolutionPet: petData.config.evolutionPath?.petId
  };
}

// 创建玩家宠物
export function createPlayerPet(petData: PetData): PlayerPet {
  return {
    pet: createPet(petData),
    isActive: false,
    battleCount: 0,
    winCount: 0,
    skillsLearned: petData.config.skills.map(skill => skill.id)
  };
}

// 升级宠物
export function levelUpPet(pet: Pet): Pet {
  const newLevel = pet.level + 1;
  const petData = PET_DATA.find(p => p.id === pet.evolvedFrom || p.id === pet.id);
  
  if (!petData) return pet;
  
  const growth = petData.config.growthRate;
  
  return {
    ...pet,
    level: newLevel,
    exp: 0,
    maxExp: Math.floor(pet.maxExp * 1.2),
    stats: {
      hp: Math.floor(pet.stats.hp + growth.hp * 5),
      atk: Math.floor(pet.stats.atk + growth.atk * 2),
      def: Math.floor(pet.stats.def + growth.def * 1),
      speed: Math.floor(pet.stats.speed + growth.speed * 0.5)
    }
  };
}

// 进化宠物
export function evolvePet(pet: Pet): Pet | null {
  if (!pet.canEvolve || !pet.evolutionPet) return null;
  
  const evolutionData = PET_DATA.find(p => p.id === pet.evolutionPet);
  if (!evolutionData) return null;
  
  return {
    ...createPet(evolutionData),
    level: Math.floor(pet.level * 0.8),
    exp: 0,
    maxExp: Math.floor(pet.maxExp * 0.9),
    loyalty: Math.min(100, pet.loyalty + 20),
    affection: Math.min(100, pet.affection + 30),
    evolvedFrom: pet.id,
    obtainedAt: Date.now()
  };
}

// 获取宠物品质颜色
export function getPetQualityColor(quality: PetQuality): string {
  const colors: Record<PetQuality, string> = {
    common: 'text-gray-500',
    uncommon: 'text-green-500',
    rare: 'text-blue-500',
    epic: 'text-purple-500',
    legendary: 'text-orange-500'
  };
  return colors[quality];
}

// 获取宠物类型标签
export function getPetTypeLabel(type: PetType): string {
  const labels: Record<PetType, string> = {
    beast: '野兽',
    spirit: '精灵',
    elemental: '元素',
    divine: '神圣',
    demonic: '恶魔'
  };
  return labels[type];
}

// 计算宠物战斗属性
export function calculatePetBattleStats(pet: Pet) {
  const levelBonus = pet.level * 0.1;
  return {
    hp: Math.floor(pet.stats.hp * (1 + levelBonus)),
    atk: Math.floor(pet.stats.atk * (1 + levelBonus)),
    def: Math.floor(pet.stats.def * (1 + levelBonus)),
    speed: Math.floor(pet.stats.speed * (1 + levelBonus * 0.5))
  };
}
