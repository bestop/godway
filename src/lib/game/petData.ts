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
      damage: 10
    }
  },
  {
    id: 'skill_pet_attack_fire',
    name: '火焰喷射',
    description: '火焰元素攻击，有概率造成灼伤',
    type: 'attack',
    power: 1.3,
    cooldown: 2,
    effects: {
      damage: 30,
      debuff: {
        stat: 'def',
        value: 15,
        duration: 2
      }
    }
  },
  {
    id: 'skill_pet_attack_ice',
    name: '冰冻术',
    description: '冰元素攻击，有概率减速',
    type: 'attack',
    power: 1.2,
    cooldown: 3,
    effects: {
      damage: 25,
      debuff: {
        stat: 'atk',
        value: 20,
        duration: 2
      }
    }
  },
  {
    id: 'skill_pet_attack_lightning',
    name: '雷霆一击',
    description: '雷电攻击，高伤害',
    type: 'attack',
    power: 1.6,
    cooldown: 3,
    effects: {
      damage: 50
    }
  },
  {
    id: 'skill_pet_attack_dark',
    name: '暗影突袭',
    description: '暗影攻击，无视部分防御',
    type: 'attack',
    power: 1.8,
    cooldown: 4,
    effects: {
      damage: 80
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
        value: 25,
        duration: 3
      }
    }
  },
  {
    id: 'skill_pet_defense_iron',
    name: '铁壁',
    description: '大幅提高防御力',
    type: 'defense',
    power: 1.2,
    cooldown: 5,
    effects: {
      buff: {
        stat: 'def',
        value: 50,
        duration: 4
      }
    }
  },
  {
    id: 'skill_pet_defense_divine',
    name: '神圣庇护',
    description: '神圣护盾，大量提升防御',
    type: 'defense',
    power: 1.6,
    cooldown: 6,
    effects: {
      buff: {
        stat: 'def',
        value: 100,
        duration: 5
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
      heal: 50,
      buff: {
        stat: 'hp',
        value: 30,
        duration: 1
      }
    }
  },
  {
    id: 'skill_pet_support_buff',
    name: '力量祝福',
    description: '提高攻击力',
    type: 'support',
    power: 1.0,
    cooldown: 5,
    effects: {
      buff: {
        stat: 'atk',
        value: 35,
        duration: 3
      }
    }
  },
  {
    id: 'skill_pet_support_blessing',
    name: '神圣祝福',
    description: '全面提升属性',
    type: 'support',
    power: 1.4,
    cooldown: 7,
    effects: {
      buff: {
        stat: 'atk',
        value: 50,
        duration: 4
      },
      heal: 80
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
      damage: 100
    }
  },
  {
    id: 'skill_pet_special_heal_full',
    name: '生命回复',
    description: '完全恢复生命值',
    type: 'special',
    power: 1.8,
    cooldown: 10,
    effects: {
      heal: 200,
      buff: {
        stat: 'hp',
        value: 100,
        duration: 2
      }
    }
  },
  {
    id: 'skill_pet_special_divine_strike',
    name: '神圣审判',
    description: '神圣之力的终极攻击',
    type: 'special',
    power: 3.0,
    cooldown: 12,
    effects: {
      damage: 300
    }
  },
  {
    id: 'skill_pet_special_nova',
    name: '毁灭新星',
    description: '毁灭性的范围攻击',
    type: 'special',
    power: 4.0,
    cooldown: 15,
    effects: {
      damage: 500
    }
  }
];

// 宠物数据
export const PET_DATA: PetData[] = [
  // 普通品质宠物
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
        hp: 50,
        atk: 10,
        def: 5,
        speed: 10
      },
      growthRate: {
        hp: 1.5,
        atk: 0.5,
        def: 0.3,
        speed: 0.4
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!
      ]
    }
  },
  {
    id: 'pet_cat',
    name: '灵猫',
    type: 'beast',
    quality: 'common',
    rarity: 0.1,
    icon: '🐱',
    description: '灵敏的小猫，速度不错',
    config: {
      baseStats: {
        hp: 40,
        atk: 8,
        def: 4,
        speed: 15
      },
      growthRate: {
        hp: 1.2,
        atk: 0.4,
        def: 0.2,
        speed: 0.8
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!
      ]
    }
  },

  // 优秀品质宠物
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
        hp: 80,
        atk: 25,
        def: 10,
        speed: 18
      },
      growthRate: {
        hp: 2.0,
        atk: 1.0,
        def: 0.5,
        speed: 0.8
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_heal')!
      ]
    }
  },
  {
    id: 'pet_eagle',
    name: '神鹰',
    type: 'beast',
    quality: 'uncommon',
    rarity: 0.3,
    icon: '🦅',
    description: '翱翔天际的神鹰，速度极快',
    config: {
      baseStats: {
        hp: 70,
        atk: 22,
        def: 8,
        speed: 25
      },
      growthRate: {
        hp: 1.8,
        atk: 0.9,
        def: 0.4,
        speed: 1.2
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_lightning')!
      ]
    }
  },

  // 稀有品质宠物
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
        hp: 150,
        atk: 50,
        def: 25,
        speed: 20
      },
      growthRate: {
        hp: 3.0,
        atk: 1.8,
        def: 1.0,
        speed: 0.8
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_basic')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!
      ],
      evolutionPath: {
        level: 25,
        petId: 'pet_tiger_king'
      }
    }
  },
  {
    id: 'pet_panther',
    name: '黑豹',
    type: 'beast',
    quality: 'rare',
    rarity: 0.5,
    icon: '🐆',
    description: '暗影中的猎手，致命一击',
    config: {
      baseStats: {
        hp: 120,
        atk: 60,
        def: 15,
        speed: 30
      },
      growthRate: {
        hp: 2.5,
        atk: 2.0,
        def: 0.6,
        speed: 1.5
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_dark')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_basic')!
      ]
    }
  },

  // 史诗品质宠物
  {
    id: 'pet_dragon',
    name: '幼龙',
    type: 'divine',
    quality: 'epic',
    rarity: 0.7,
    icon: '🐉',
    description: '神圣的幼龙，潜力无限',
    config: {
      baseStats: {
        hp: 300,
        atk: 100,
        def: 50,
        speed: 35
      },
      growthRate: {
        hp: 5.0,
        atk: 3.0,
        def: 1.8,
        speed: 1.5
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_iron')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!
      ],
      evolutionPath: {
        level: 35,
        petId: 'pet_elder_dragon'
      }
    }
  },
  {
    id: 'pet_phoenix',
    name: '凤凰',
    type: 'divine',
    quality: 'epic',
    rarity: 0.7,
    icon: '🔥',
    description: '浴火重生的神鸟，不死不灭',
    config: {
      baseStats: {
        hp: 250,
        atk: 120,
        def: 40,
        speed: 40
      },
      growthRate: {
        hp: 4.5,
        atk: 3.5,
        def: 1.5,
        speed: 2.0
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_blessing')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_heal_full')!
      ]
    }
  },
  {
    id: 'pet_thunderbird',
    name: '雷鸟',
    type: 'elemental',
    quality: 'epic',
    rarity: 0.7,
    icon: '⚡',
    description: '掌控雷电的神鸟，一击致命',
    config: {
      baseStats: {
        hp: 200,
        atk: 150,
        def: 30,
        speed: 45
      },
      growthRate: {
        hp: 4.0,
        atk: 4.0,
        def: 1.2,
        speed: 2.2
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_lightning')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!
      ]
    }
  },

  // 传说品质宠物
  {
    id: 'pet_unicorn',
    name: '独角兽',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.9,
    icon: '🦄',
    description: '传说中的独角兽，拥有神圣力量',
    config: {
      baseStats: {
        hp: 800,
        atk: 200,
        def: 150,
        speed: 50
      },
      growthRate: {
        hp: 10.0,
        atk: 5.0,
        def: 4.0,
        speed: 2.5
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_blessing')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_divine')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_heal_full')!
      ]
    }
  },
  {
    id: 'pet_qilin',
    name: '麒麟',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.9,
    icon: '🌟',
    description: '祥瑞之兽，带来好运与力量',
    config: {
      baseStats: {
        hp: 1000,
        atk: 250,
        def: 180,
        speed: 55
      },
      growthRate: {
        hp: 12.0,
        atk: 6.0,
        def: 4.5,
        speed: 2.8
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_lightning')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_blessing')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_divine')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_divine_strike')!
      ]
    }
  },

  // 神话品质宠物（特殊顶级）
  {
    id: 'pet_azure_dragon',
    name: '青龙',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.95,
    icon: '🐲',
    description: '四神兽之青龙，掌控东方木行之力',
    config: {
      baseStats: {
        hp: 3000,
        atk: 600,
        def: 400,
        speed: 80
      },
      growthRate: {
        hp: 25.0,
        atk: 12.0,
        def: 8.0,
        speed: 4.0
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_lightning')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_blessing')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_divine')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_divine_strike')!
      ]
    }
  },
  {
    id: 'pet_vermillion_bird',
    name: '朱雀',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.95,
    icon: '🔥',
    description: '四神兽之朱雀，掌控南方火行之力',
    config: {
      baseStats: {
        hp: 2500,
        atk: 800,
        def: 300,
        speed: 100
      },
      growthRate: {
        hp: 22.0,
        atk: 15.0,
        def: 6.0,
        speed: 5.0
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_heal_full')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_divine_strike')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_nova')!
      ]
    }
  },
  {
    id: 'pet_white_tiger',
    name: '白虎',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.95,
    icon: '🐯',
    description: '四神兽之白虎，掌控西方金行之力',
    config: {
      baseStats: {
        hp: 2800,
        atk: 1000,
        def: 350,
        speed: 90
      },
      growthRate: {
        hp: 24.0,
        atk: 18.0,
        def: 7.0,
        speed: 4.5
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_dark')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_ultimate')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_divine_strike')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_nova')!
      ]
    }
  },
  {
    id: 'pet_black_tortoise',
    name: '玄武',
    type: 'divine',
    quality: 'legendary',
    rarity: 0.95,
    icon: '🐢',
    description: '四神兽之玄武，掌控北方水行之力',
    config: {
      baseStats: {
        hp: 5000,
        atk: 400,
        def: 800,
        speed: 60
      },
      growthRate: {
        hp: 35.0,
        atk: 8.0,
        def: 15.0,
        speed: 3.0
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_divine')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_support_blessing')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_heal_full')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_nova')!
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
        hp: 400,
        atk: 120,
        def: 60,
        speed: 30
      },
      growthRate: {
        hp: 6.0,
        atk: 3.5,
        def: 2.0,
        speed: 1.2
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
        hp: 1500,
        atk: 400,
        def: 250,
        speed: 60
      },
      growthRate: {
        hp: 15.0,
        atk: 8.0,
        def: 5.0,
        speed: 3.0
      },
      skills: [
        PET_SKILLS.find(s => s.id === 'skill_pet_attack_fire')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_defense_divine')!,
        PET_SKILLS.find(s => s.id === 'skill_pet_special_divine_strike')!,
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
    price: 500,
    stock: 999,
    rarity: 'common',
    type: 'beast'
  },
  {
    id: 'shop_pet_cat',
    petId: 'pet_cat',
    price: 600,
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
    id: 'shop_pet_eagle',
    petId: 'pet_eagle',
    price: 3500,
    stock: 500,
    rarity: 'uncommon',
    type: 'beast'
  },
  {
    id: 'shop_pet_tiger',
    petId: 'pet_tiger',
    price: 15000,
    stock: 200,
    rarity: 'rare',
    type: 'beast'
  },
  {
    id: 'shop_pet_panther',
    petId: 'pet_panther',
    price: 18000,
    stock: 200,
    rarity: 'rare',
    type: 'beast'
  },
  {
    id: 'shop_pet_dragon',
    petId: 'pet_dragon',
    price: 80000,
    stock: 50,
    rarity: 'epic',
    type: 'divine'
  },
  {
    id: 'shop_pet_phoenix',
    petId: 'pet_phoenix',
    price: 100000,
    stock: 50,
    rarity: 'epic',
    type: 'divine'
  },
  {
    id: 'shop_pet_thunderbird',
    petId: 'pet_thunderbird',
    price: 90000,
    stock: 50,
    rarity: 'epic',
    type: 'elemental'
  },
  {
    id: 'shop_pet_unicorn',
    petId: 'pet_unicorn',
    price: 500000,
    stock: 10,
    rarity: 'legendary',
    type: 'divine'
  },
  {
    id: 'shop_pet_qilin',
    petId: 'pet_qilin',
    price: 800000,
    stock: 10,
    rarity: 'legendary',
    type: 'divine'
  },
  {
    id: 'shop_pet_azure_dragon',
    petId: 'pet_azure_dragon',
    price: 3000000,
    stock: 3,
    rarity: 'legendary',
    type: 'divine'
  },
  {
    id: 'shop_pet_vermillion_bird',
    petId: 'pet_vermillion_bird',
    price: 3000000,
    stock: 3,
    rarity: 'legendary',
    type: 'divine'
  },
  {
    id: 'shop_pet_white_tiger',
    petId: 'pet_white_tiger',
    price: 3000000,
    stock: 3,
    rarity: 'legendary',
    type: 'divine'
  },
  {
    id: 'shop_pet_black_tortoise',
    petId: 'pet_black_tortoise',
    price: 3000000,
    stock: 3,
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
      hp: Math.floor(pet.stats.hp + growth.hp * 8),
      atk: Math.floor(pet.stats.atk + growth.atk * 3),
      def: Math.floor(pet.stats.def + growth.def * 2),
      speed: Math.floor(pet.stats.speed + growth.speed * 1)
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

// 获取宠物品质背景色
export function getPetQualityBgColor(quality: PetQuality): string {
  const colors: Record<PetQuality, string> = {
    common: 'bg-gray-100',
    uncommon: 'bg-green-100',
    rare: 'bg-blue-100',
    epic: 'bg-purple-100',
    legendary: 'bg-orange-100'
  };
  return colors[quality];
}

// 获取宠物品质边框色
export function getPetQualityBorderColor(quality: PetQuality): string {
  const colors: Record<PetQuality, string> = {
    common: 'border-gray-300',
    uncommon: 'border-green-300',
    rare: 'border-blue-300',
    epic: 'border-purple-300',
    legendary: 'border-orange-300'
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
  const levelBonus = pet.level * 0.15;
  return {
    hp: Math.floor(pet.stats.hp * (1 + levelBonus)),
    atk: Math.floor(pet.stats.atk * (1 + levelBonus)),
    def: Math.floor(pet.stats.def * (1 + levelBonus)),
    speed: Math.floor(pet.stats.speed * (1 + levelBonus * 0.5))
  };
}
