export module PropertyConfig {
    /**单位BUFF名称 */
    export const UNIT_PROPERTY_BUFF_NAME = "modifier_property";
    /**英雄BUFF名称 */
    export const HERO_PROPERTY_BUFF_NAME = "modifier_hero_property";
    /**最大血量 */
    export const MAX_HEALTH = 2147483000;
    /**最大蓝量 */
    export const MAX_MANA = 2 ^ 16 - 1;
    /**最大怒气 */
    export const MAX_ENERGY = 2100000000;
    /**最小攻速 */
    export const MINIMUM_ATTACK_SPEED = 20;
    /**最大攻速 */
    export const MAXIMUM_ATTACK_SPEED = 500;
    /**减伤 = FACTOR x 护甲 / ( 1 + (FACTOR  x |护甲|)) */
    export const PHYSICAL_ARMOR_FACTOR = 0.06;
    export const MAGICAL_ARMOR_FACTOR = 0.06;
    /**每点主属性提供攻击力 */
    export const ATTRIBUTE_PRIMARY_ATTACK_DAMAGE = 1;
    /**每点力量提供气血 */
    export const ATTRIBUTE_STRENGTH_HP_BONUS = 20;
    /**每点力量提供气血恢复加成 */
    export const ATTRIBUTE_STRENGTH_HEALTH_REGEN_CONSTANT = 0.09;
    /**主属性加成，每点力量提供状态抗性 */
    export const ATTRIBUTE_STRENGTH_STATUS_RESISTANCE = 0.15;
    /**每点力量提供最终伤害上限 */
    // export const ATTRIBUTE_STRENGTH_ALL_DAMAGE_MAX = 200;
    /**每点敏捷提供攻击速度 */
    export const ATTRIBUTE_AGILITY_ATTACK_SPEED = 1;
    /**每点敏捷提供物理护甲 */
    export const ATTRIBUTE_AGILITY_PHYSICAL_ARMOR_BASE = 0.16;
    /**每点敏捷提供攻击速度上限 */
    export const ATTRIBUTE_AGILITY_MAX_ATTACK_SPEED = 0.28;
    /**每点智力提供蓝量上限 */
    export const ATTRIBUTE_INTELLECT_MANA = 5;
    /**每点智力提供技能增强 */
    export const ATTRIBUTE_INTELLECT_SPELL_AMPLIFY = 0.05;
    /**每点智力提供蓝量恢复 */
    export const ATTRIBUTE_INTELLECT_MANA_REGEN = 0.05;
    /**每点智力提供冷却缩减 */
    export const ATTRIBUTE_INTELLECT_COOLDOWN_REDUCTION = 0.02;
    /**智力提供的冷却缩减上限 */
    export const ATTRIBUTE_INTELLECT_MAX_CD = 70;
    /**基础攻击暴击概率 */
    export const BASE_ATTACK_CRITICALSTRIKE_CHANCE = 5;
    /**基础攻击暴击伤害百分比 */
    export const BASE_ATTACK_CRITICALSTRIKE_DAMAGE = 150;
    /**基础技能暴击概率 */
    export const BASE_SPELL_CRITICALSTRIKE_CHANCE = 5;
    /**基础技能暴击伤害百分比 */
    export const BASE_SPELL_CRITICALSTRIKE_DAMAGE = 200;
    /**单条血条最大多少 */
    export const MAX_ONE_BAR_HEALTH = 100000000;
    /**最大毒层数 */
    export const MAX_POISON_STACK = 2100000000
    /**毒伤害buff的伤害间隔 */
    export const POISON_DAMAGE_INTERVAL = 1;
    /**毒伤害buff的持续时间 */
    export const POISON_DURATION = 10;
    /**
     *属性枚举统计标记
     */
    export enum EMODIFIER_PROPERTY {
        /**
         * Method Name: `GetModifierPreAttack_BonusDamage`
         */
        PREATTACK_BONUS_DAMAGE = modifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE,
        /**
         * Method Name: `GetModifierPreAttack_BonusDamage_Target`
         */
        PREATTACK_BONUS_DAMAGE_TARGET = modifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_TARGET,
        /**
         * Method Name: `GetModifierPreAttack_BonusDamage_Proc`
         */
        PREATTACK_BONUS_DAMAGE_PROC = modifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_PROC,
        /**
         * Method Name: `GetModifierPreAttack_BonusDamagePostCrit`
         */
        PREATTACK_BONUS_DAMAGE_POST_CRIT = modifierfunction.MODIFIER_PROPERTY_PREATTACK_BONUS_DAMAGE_POST_CRIT,
        /**
         * Method Name: `GetModifierBaseAttack_BonusDamage`
         *
         * 额外基础攻击力(白字)
         */
        BASEATTACK_BONUSDAMAGE = modifierfunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE,
        /**
         * Method Name: `GetModifierProcAttack_BonusDamage_Physical`
         */
        PROCATTACK_BONUS_DAMAGE_PHYSICAL = modifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PHYSICAL,
        /**
         * Method Name: `GetModifierProcAttack_BonusDamage_Magical`
         */
        PROCATTACK_BONUS_DAMAGE_MAGICAL = modifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_MAGICAL,
        /**
         * Method Name: `GetModifierProcAttack_BonusDamage_Pure`
         */
        PROCATTACK_BONUS_DAMAGE_PURE = modifierfunction.MODIFIER_PROPERTY_PROCATTACK_BONUS_DAMAGE_PURE,
        /**
         * Method Name: `GetModifierProcAttack_Feedback`
         */
        PROCATTACK_FEEDBACK = modifierfunction.MODIFIER_PROPERTY_PROCATTACK_FEEDBACK,
        /**
         * Method Name: `GetModifierOverrideAttackDamage`
         */
        OVERRIDE_ATTACK_DAMAGE = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ATTACK_DAMAGE,
        /**
         * Method Name: `GetModifierPreAttack`
         */
        PRE_ATTACK = modifierfunction.MODIFIER_PROPERTY_PRE_ATTACK,
        /**
         * Method Name: `GetModifierInvisibilityLevel`
         */
        INVISIBILITY_LEVEL = modifierfunction.MODIFIER_PROPERTY_INVISIBILITY_LEVEL,
        /**
         * Method Name: `GetModifierInvisibilityAttackBehaviorException`
         */
        INVISIBILITY_ATTACK_BEHAVIOR_EXCEPTION = modifierfunction.MODIFIER_PROPERTY_INVISIBILITY_ATTACK_BEHAVIOR_EXCEPTION,
        /**
         * Method Name: `GetModifierPersistentInvisibility`
         */
        PERSISTENT_INVISIBILITY = modifierfunction.MODIFIER_PROPERTY_PERSISTENT_INVISIBILITY,
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Constant`
         */
        MOVESPEED_BONUS_CONSTANT = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT,
        /**
         * Method Name: `GetModifierMoveSpeedOverride`
         */
        MOVESPEED_BASE_OVERRIDE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BASE_OVERRIDE,
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Percentage`
         */
        MOVESPEED_BONUS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE,
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Percentage_Unique`
         */
        MOVESPEED_BONUS_PERCENTAGE_UNIQUE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_PERCENTAGE_UNIQUE,

        /**
         * Method Name: `GetModifierMoveSpeedBonus_Special_Boots`
         */
        MOVESPEED_BONUS_UNIQUE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE,
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Special_Boots_2`
         */
        MOVESPEED_BONUS_UNIQUE_2 = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_UNIQUE_2,
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Constant_Unique`
         */
        MOVESPEED_BONUS_CONSTANT_UNIQUE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE,
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Constant_Unique_2`
         */
        MOVESPEED_BONUS_CONSTANT_UNIQUE_2 = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_BONUS_CONSTANT_UNIQUE_2,
        /**
         * Method Name: `GetModifierMoveSpeed_Absolute`
         */
        MOVESPEED_ABSOLUTE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE,
        /**
         * Method Name: `GetModifierMoveSpeed_AbsoluteMin`
         */
        MOVESPEED_ABSOLUTE_MIN = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MIN,
        /**
         * Method Name: `GetModifierMoveSpeed_AbsoluteMax`
         */
        MOVESPEED_ABSOLUTE_MAX = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_ABSOLUTE_MAX,
        /**
         * Method Name: `GetModifierIgnoreMovespeedLimit`
         */
        IGNORE_MOVESPEED_LIMIT = modifierfunction.MODIFIER_PROPERTY_IGNORE_MOVESPEED_LIMIT,
        /**
         * Method Name: `GetModifierMoveSpeed_Limit`
         */
        MOVESPEED_LIMIT = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_LIMIT,
        /**
         * Method Name: `GetModifierAttackSpeedBaseOverride`
         */
        ATTACKSPEED_BASE_OVERRIDE = modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE,
        /**
         * Method Name: `GetModifierFixedAttackRate`
         */
        FIXED_ATTACK_RATE = modifierfunction.MODIFIER_PROPERTY_FIXED_ATTACK_RATE,
        /**
         * Method Name: `GetModifierAttackSpeedBonus_Constant`
         */
        ATTACKSPEED_BONUS_CONSTANT = modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
        /**
         * Method Name: `GetModifierAttackSpeed_Limit`
         */
        IGNORE_ATTACKSPEED_LIMIT = modifierfunction.MODIFIER_PROPERTY_IGNORE_ATTACKSPEED_LIMIT,
        /**
         * Method Name: `GetModifierCooldownReduction_Constant`
         */
        COOLDOWN_REDUCTION_CONSTANT = modifierfunction.MODIFIER_PROPERTY_COOLDOWN_REDUCTION_CONSTANT,
        /**
         * Method Name: `GetModifierManacostReduction_Constant`
         */
        MANACOST_REDUCTION_CONSTANT = modifierfunction.MODIFIER_PROPERTY_MANACOST_REDUCTION_CONSTANT,
        /**
         * Method Name: `GetModifierBaseAttackTimeConstant`
         */
        BASE_ATTACK_TIME_CONSTANT = modifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT,
        /**
         * Method Name: `GetModifierBaseAttackTimeConstant_Adjust`
         */
        BASE_ATTACK_TIME_CONSTANT_ADJUST = modifierfunction.MODIFIER_PROPERTY_BASE_ATTACK_TIME_CONSTANT_ADJUST,
        /**
         * Method Name: `GetModifierAttackPointConstant`
         */
        ATTACK_POINT_CONSTANT = modifierfunction.MODIFIER_PROPERTY_ATTACK_POINT_CONSTANT,
        /**
         * Method Name: `GetModifierBonusDamageOutgoing_Percentage`
         */
        BONUSDAMAGEOUTGOING_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_BONUSDAMAGEOUTGOING_PERCENTAGE,
        /**
         * Method Name: `GetModifierDamageOutgoing_Percentage`
         */
        DAMAGEOUTGOING_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,
        /**
         * Method Name: `GetModifierDamageOutgoing_Percentage_Illusion`
         */
        DAMAGEOUTGOING_PERCENTAGE_ILLUSION = modifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION,
        /**
         * Method Name: `GetModifierDamageOutgoing_Percentage_Illusion_Amplify`
         */
        DAMAGEOUTGOING_PERCENTAGE_ILLUSION_AMPLIFY = modifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE_ILLUSION_AMPLIFY,
        /**
         * Method Name: `GetModifierTotalDamageOutgoing_Percentage`
         */
        TOTALDAMAGEOUTGOING_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE,
        /**
         * Method Name: `GetModifierSpellAmplify_PercentageCreep`
         */
        SPELL_AMPLIFY_PERCENTAGE_CREEP = modifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_CREEP,
        /**
         * Method Name: `GetModifierSpellAmplify_Percentage`
         */
        SPELL_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
        /**
         * Method Name: `GetModifierSpellAmplify_PercentageUnique`
         */
        SPELL_AMPLIFY_PERCENTAGE_UNIQUE = modifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
        /**
         * Method Name: `GetModifierHealAmplify_PercentageSource`
         */
        HEAL_AMPLIFY_PERCENTAGE_SOURCE = modifierfunction.MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_SOURCE,
        /**
         * Method Name: `GetModifierHealAmplify_PercentageTarget`
         */
        HEAL_AMPLIFY_PERCENTAGE_TARGET = modifierfunction.MODIFIER_PROPERTY_HEAL_AMPLIFY_PERCENTAGE_TARGET,
        /**
         * Method Name: `GetModifierHPRegenAmplify_Percentage`
         */
        HP_REGEN_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_HP_REGEN_AMPLIFY_PERCENTAGE,
        /**
         * Method Name: `GetModifierLifestealRegenAmplify_Percentage`
         */
        LIFESTEAL_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_LIFESTEAL_AMPLIFY_PERCENTAGE,
        /**
         * Method Name: `GetModifierSpellLifestealRegenAmplify_Percentage`
         */
        SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE,
        /**
         * Method Name: `GetModifierMPRegenAmplify_Percentage`
         */
        MP_REGEN_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MP_REGEN_AMPLIFY_PERCENTAGE,
        /**
         * Method Name: `GetModifierManaDrainAmplify_Percentage`
         */
        MANA_DRAIN_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MANA_DRAIN_AMPLIFY_PERCENTAGE,
        /**
         * Total amplify value is clamped to 0.
         *
         *
         *
         * Method Name: `GetModifierMPRestoreAmplify_Percentage`.
         */
        MP_RESTORE_AMPLIFY_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MP_RESTORE_AMPLIFY_PERCENTAGE,
        /**
         * Method Name: `GetModifierBaseDamageOutgoing_Percentage`
         */
        BASEDAMAGEOUTGOING_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE,
        /**
         * Method Name: `GetModifierBaseDamageOutgoing_PercentageUnique`
         */
        BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE = modifierfunction.MODIFIER_PROPERTY_BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE,
        /**
         * Method Name: `GetModifierIncomingDamage_Percentage`
         */
        INCOMING_DAMAGE_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,
        /**
         * Method Name: `GetModifierIncomingPhysicalDamage_Percentage`
         */
        INCOMING_PHYSICAL_DAMAGE_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_PERCENTAGE,
        /**
         * Method Name: `GetModifierIncomingPhysicalDamageConstant`
         */
        INCOMING_PHYSICAL_DAMAGE_CONSTANT = modifierfunction.MODIFIER_PROPERTY_INCOMING_PHYSICAL_DAMAGE_CONSTANT,
        /**
         * Method Name: `GetModifierIncomingSpellDamageConstant`
         */
        INCOMING_SPELL_DAMAGE_CONSTANT = modifierfunction.MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT,
        /**
         * Method Name: `GetModifierEvasion_Constant`
         */
        EVASION_CONSTANT = modifierfunction.MODIFIER_PROPERTY_EVASION_CONSTANT,
        /**
         * Method Name: `GetModifierNegativeEvasion_Constant`
         */
        NEGATIVE_EVASION_CONSTANT = modifierfunction.MODIFIER_PROPERTY_NEGATIVE_EVASION_CONSTANT,
        /**
         * Method Name: `GetModifierStatusResistance`
         */
        STATUS_RESISTANCE = modifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE,
        /**
         * Method Name: `GetModifierStatusResistanceStacking`
         */
        STATUS_RESISTANCE_STACKING = modifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_STACKING,
        /**
         * Method Name: `GetModifierStatusResistanceCaster`
         * 状态加深，用于施法者抵消状态抗性
         */
        STATUS_RESISTANCE_CASTER = modifierfunction.MODIFIER_PROPERTY_STATUS_RESISTANCE_CASTER,
        /**
         * Method Name: `GetModifierAvoidDamage`
         */
        AVOID_DAMAGE = modifierfunction.MODIFIER_PROPERTY_AVOID_DAMAGE,
        /**
         * Method Name: `GetModifierAvoidSpell`
         */
        AVOID_SPELL = modifierfunction.MODIFIER_PROPERTY_AVOID_SPELL,
        /**
         * Method Name: `GetModifierMiss_Percentage`
         */
        MISS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MISS_PERCENTAGE,
        /**
         * Values above 100% are ignored.
         *
         *
         *
         * Method Name: `GetModifierPhysicalArmorBase_Percentage`.
         */
        PHYSICAL_ARMOR_BASE_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BASE_PERCENTAGE,
        /**
         * Method Name: `GetModifierPhysicalArmorTotal_Percentage`
         */
        PHYSICAL_ARMOR_TOTAL_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_TOTAL_PERCENTAGE,
        /**
         * Method Name: `GetModifierPhysicalArmorBonus`
         */
        PHYSICAL_ARMOR_BONUS = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS,
        /**
         * Method Name: `GetModifierPhysicalArmorBonusUnique`
         */
        PHYSICAL_ARMOR_BONUS_UNIQUE = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE,
        /**
         * Method Name: `GetModifierPhysicalArmorBonusUniqueActive`
         */
        PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE,
        /**
         * Method Name: `GetModifierIgnorePhysicalArmor`
         */
        IGNORE_PHYSICAL_ARMOR = modifierfunction.MODIFIER_PROPERTY_IGNORE_PHYSICAL_ARMOR,
        /**
         * Method Name: `GetModifierMagicalResistanceBaseReduction`
         */
        MAGICAL_RESISTANCE_BASE_REDUCTION = modifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BASE_REDUCTION,
        /**
         * Method Name: `GetModifierMagicalResistanceDirectModification`
         */
        MAGICAL_RESISTANCE_DIRECT_MODIFICATION = modifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DIRECT_MODIFICATION,
        /**
         * Method Name: `GetModifierMagicalResistanceBonus`
         */
        MAGICAL_RESISTANCE_BONUS = modifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS,
        /**
         * Method Name: `GetModifierMagicalResistanceBonusIllusions`
         */
        MAGICAL_RESISTANCE_BONUS_ILLUSIONS = modifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_BONUS_ILLUSIONS,
        /**
         * Method Name: `GetModifierMagicalResistanceDecrepifyUnique`
         */
        MAGICAL_RESISTANCE_DECREPIFY_UNIQUE = modifierfunction.MODIFIER_PROPERTY_MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
        /**
         * Method Name: `GetModifierBaseRegen`
         */
        BASE_MANA_REGEN = modifierfunction.MODIFIER_PROPERTY_BASE_MANA_REGEN,
        /**
         * Method Name: `GetModifierConstantManaRegen`
         */
        MANA_REGEN_CONSTANT = modifierfunction.MODIFIER_PROPERTY_MANA_REGEN_CONSTANT,
        /**
         * Method Name: `GetModifierConstantManaRegenUnique`
         */
        MANA_REGEN_CONSTANT_UNIQUE = modifierfunction.MODIFIER_PROPERTY_MANA_REGEN_CONSTANT_UNIQUE,
        /**
         * Method Name: `GetModifierTotalPercentageManaRegen`
         */
        MANA_REGEN_TOTAL_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MANA_REGEN_TOTAL_PERCENTAGE,
        /**
         * Method Name: `GetModifierConstantHealthRegen`
         * 气血回复
         */
        HEALTH_REGEN_CONSTANT = modifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
        /**
         * Method Name: `GetModifierHealthRegenPercentage`
         */
        HEALTH_REGEN_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE,
        /**
         * Method Name: `GetModifierHealthRegenPercentageUnique`
         */
        HEALTH_REGEN_PERCENTAGE_UNIQUE = modifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_PERCENTAGE_UNIQUE,
        /**
         * Method Name: `GetModifierHealthBonus`
         * @deprecated
         */
        HEALTH_BONUS = modifierfunction.MODIFIER_PROPERTY_HEALTH_BONUS,
        /**
         * Method Name: `GetModifierManaBonus`
         */
        MANA_BONUS = modifierfunction.MODIFIER_PROPERTY_MANA_BONUS,
        /**
         * Method Name: `GetModifierExtraStrengthBonus`
         */
        EXTRA_STRENGTH_BONUS = modifierfunction.MODIFIER_PROPERTY_EXTRA_STRENGTH_BONUS,
        /**
         * Method Name: `GetModifierExtraHealthBonus`
         * @deprecated
         */
        EXTRA_HEALTH_BONUS = modifierfunction.MODIFIER_PROPERTY_EXTRA_HEALTH_BONUS,
        /**
         * Method Name: `GetModifierExtraManaBonus`
         */
        EXTRA_MANA_BONUS = modifierfunction.MODIFIER_PROPERTY_EXTRA_MANA_BONUS,
        /**
         * Method Name: `GetModifierExtraHealthPercentage`
         * @deprecated
         */
        EXTRA_HEALTH_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_EXTRA_HEALTH_PERCENTAGE,
        /**
         * Method Name: `GetModifierExtraManaPercentage`
         */
        EXTRA_MANA_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_EXTRA_MANA_PERCENTAGE,
        /**
         * Method Name: `GetModifierBonusStats_Strength`
         */
        STATS_STRENGTH_BONUS = modifierfunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS,
        /**
         * Method Name: `GetModifierBonusStats_Agility`
         */
        STATS_AGILITY_BONUS = modifierfunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS,
        /**
         * Method Name: `GetModifierBonusStats_Intellect`
         */
        STATS_INTELLECT_BONUS = modifierfunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS,
        /**
         * Method Name: `GetModifierBonusStats_Strength_Percentage`
         */
        STATS_STRENGTH_BONUS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_STATS_STRENGTH_BONUS_PERCENTAGE,
        /**
         * Method Name: `GetModifierBonusStats_Agility_Percentage`
         */
        STATS_AGILITY_BONUS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_STATS_AGILITY_BONUS_PERCENTAGE,
        /**
         * Method Name: `GetModifierBonusStats_Intellect_Percentage`
         */
        STATS_INTELLECT_BONUS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_STATS_INTELLECT_BONUS_PERCENTAGE,
        /**
         * Method Name: `GetModifierCastRangeBonus`
         */
        CAST_RANGE_BONUS = modifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS,
        /**
         * Method Name: `GetModifierCastRangeBonusTarget`
         */
        CAST_RANGE_BONUS_TARGET = modifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_TARGET,
        /**
         * Method Name: `GetModifierCastRangeBonusStacking`
         */
        CAST_RANGE_BONUS_STACKING = modifierfunction.MODIFIER_PROPERTY_CAST_RANGE_BONUS_STACKING,
        /**
         * Method Name: `GetModifierAttackRangeOverride`
         */
        ATTACK_RANGE_BASE_OVERRIDE = modifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BASE_OVERRIDE,
        /**
         * Method Name: `GetModifierAttackRangeBonus`
         */
        ATTACK_RANGE_BONUS = modifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS,
        /**
         * Method Name: `GetModifierAttackRangeBonusUnique`
         */
        ATTACK_RANGE_BONUS_UNIQUE = modifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_UNIQUE,
        /**
         * Method Name: `GetModifierAttackRangeBonusPercentage`
         */
        ATTACK_RANGE_BONUS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_ATTACK_RANGE_BONUS_PERCENTAGE,
        /**
         * Method Name: `GetModifierMaxAttackRange`
         */
        MAX_ATTACK_RANGE = modifierfunction.MODIFIER_PROPERTY_MAX_ATTACK_RANGE,
        /**
         * Method Name: `GetModifierProjectileSpeedBonus`
         */
        PROJECTILE_SPEED_BONUS = modifierfunction.MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS,
        /**
         * Method Name: `GetModifierProjectileSpeedBonusPercentage`
         */
        PROJECTILE_SPEED_BONUS_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_PROJECTILE_SPEED_BONUS_PERCENTAGE,
        /**
         * Method Name: `GetModifierProjectileName`
         */
        PROJECTILE_NAME = modifierfunction.MODIFIER_PROPERTY_PROJECTILE_NAME,
        /**
         * Method Name: `ReincarnateTime`
         */
        REINCARNATION = modifierfunction.MODIFIER_PROPERTY_REINCARNATION,
        /**
         * Method Name: `GetModifierConstantRespawnTime`
         */
        RESPAWNTIME = modifierfunction.MODIFIER_PROPERTY_RESPAWNTIME,
        /**
         * Method Name: `GetModifierPercentageRespawnTime`
         */
        RESPAWNTIME_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_RESPAWNTIME_PERCENTAGE,
        /**
         * Method Name: `GetModifierStackingRespawnTime`
         */
        RESPAWNTIME_STACKING = modifierfunction.MODIFIER_PROPERTY_RESPAWNTIME_STACKING,
        /**
         * Method Name: `GetModifierPercentageCooldown`
         */
        COOLDOWN_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE,
        /**
         * Method Name: `GetModifierPercentageCooldownOngoing`
         */
        COOLDOWN_PERCENTAGE_ONGOING = modifierfunction.MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_ONGOING,
        /**
         * Method Name: `GetModifierPercentageCasttime`
         */
        CASTTIME_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_CASTTIME_PERCENTAGE,
        /**
         * Method Name: `GetModifierPercentageAttackAnimTime`
         */
        ATTACK_ANIM_TIME_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_ATTACK_ANIM_TIME_PERCENTAGE,
        /**
         * Method Name: `GetModifierPercentageManacost`
         */
        MANACOST_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE,
        /**
         * Method Name: `GetModifierPercentageManacostStacking`
         */
        MANACOST_PERCENTAGE_STACKING = modifierfunction.MODIFIER_PROPERTY_MANACOST_PERCENTAGE_STACKING,
        /**
         * Method Name: `GetModifierConstantDeathGoldCost`
         */
        DEATHGOLDCOST = modifierfunction.MODIFIER_PROPERTY_DEATHGOLDCOST,
        /**
         * Method Name: `GetModifierPercentageExpRateBoost`
         */
        EXP_RATE_BOOST = modifierfunction.MODIFIER_PROPERTY_EXP_RATE_BOOST,
        /**
         * Method Name: `GetModifierPreAttack_CriticalStrike`
         */
        PREATTACK_CRITICALSTRIKE = modifierfunction.MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE,
        /**
         * Method Name: `GetModifierPreAttack_Target_CriticalStrike`
         * 自己受击时发生暴击概率
         */
        PREATTACK_TARGET_CRITICALSTRIKE = modifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,
        /**
         * Method Name: `GetModifierMagical_ConstantBlock`
         */
        MAGICAL_CONSTANT_BLOCK = modifierfunction.MODIFIER_PROPERTY_MAGICAL_CONSTANT_BLOCK,
        /**
         * Method Name: `GetModifierPhysical_ConstantBlock`
         */
        PHYSICAL_CONSTANT_BLOCK = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK,
        /**
         * Method Name: `GetModifierPhysical_ConstantBlockSpecial`
         */
        PHYSICAL_CONSTANT_BLOCK_SPECIAL = modifierfunction.MODIFIER_PROPERTY_PHYSICAL_CONSTANT_BLOCK_SPECIAL,
        /**
         * Method Name: `GetModifierPhysical_ConstantBlockUnavoidablePreArmor`
         */
        TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR = modifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR,
        /**
         * Method Name: `GetModifierTotal_ConstantBlock`
         */
        TOTAL_CONSTANT_BLOCK = modifierfunction.MODIFIER_PROPERTY_TOTAL_CONSTANT_BLOCK,
        /**
         * Method Name: `GetOverrideAnimation`
         */
        OVERRIDE_ANIMATION = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ANIMATION,
        /**
         * Method Name: `GetOverrideAnimationWeight`
         */
        OVERRIDE_ANIMATION_WEIGHT = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ANIMATION_WEIGHT,
        /**
         * Method Name: `GetOverrideAnimationRate`
         */
        OVERRIDE_ANIMATION_RATE = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ANIMATION_RATE,
        /**
         * Method Name: `GetAbsorbSpell`
         */
        ABSORB_SPELL = modifierfunction.MODIFIER_PROPERTY_ABSORB_SPELL,
        /**
         * Method Name: `GetReflectSpell`
         */
        REFLECT_SPELL = modifierfunction.MODIFIER_PROPERTY_REFLECT_SPELL,
        /**
         * Method Name: `GetDisableAutoAttack`
         */
        DISABLE_AUTOATTACK = modifierfunction.MODIFIER_PROPERTY_DISABLE_AUTOATTACK,
        /**
         * Method Name: `GetBonusDayVision`
         */
        BONUS_DAY_VISION = modifierfunction.MODIFIER_PROPERTY_BONUS_DAY_VISION,
        /**
         * Method Name: `GetBonusNightVision`
         */
        BONUS_NIGHT_VISION = modifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION,
        /**
         * Method Name: `GetBonusNightVisionUnique`
         */
        BONUS_NIGHT_VISION_UNIQUE = modifierfunction.MODIFIER_PROPERTY_BONUS_NIGHT_VISION_UNIQUE,
        /**
         * Method Name: `GetBonusVisionPercentage`
         */
        BONUS_VISION_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_BONUS_VISION_PERCENTAGE,
        /**
         * Method Name: `GetFixedDayVision`
         */
        FIXED_DAY_VISION = modifierfunction.MODIFIER_PROPERTY_FIXED_DAY_VISION,
        /**
         * Method Name: `GetFixedNightVision`
         */
        FIXED_NIGHT_VISION = modifierfunction.MODIFIER_PROPERTY_FIXED_NIGHT_VISION,
        /**
         * Method Name: `GetMinHealth`
         *  最小生命，在此接口中计算最大生命值
         */
        MIN_HEALTH = modifierfunction.MODIFIER_PROPERTY_MIN_HEALTH,
        /**
         * Method Name: `GetAbsoluteNoDamagePhysical`
         */
        ABSOLUTE_NO_DAMAGE_PHYSICAL = modifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PHYSICAL,
        /**
         * Method Name: `GetAbsoluteNoDamageMagical`
         */
        ABSOLUTE_NO_DAMAGE_MAGICAL = modifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_MAGICAL,
        /**
         * Method Name: `GetAbsoluteNoDamagePure`
         */
        ABSOLUTE_NO_DAMAGE_PURE = modifierfunction.MODIFIER_PROPERTY_ABSOLUTE_NO_DAMAGE_PURE,
        /**
         * Method Name: `GetIsIllusion`
         */
        IS_ILLUSION = modifierfunction.MODIFIER_PROPERTY_IS_ILLUSION,
        /**
         * Method Name: `GetModifierIllusionLabel`
         */
        ILLUSION_LABEL = modifierfunction.MODIFIER_PROPERTY_ILLUSION_LABEL,
        /**
         * Method Name: `GetModifierStrongIllusion`
         */
        STRONG_ILLUSION = modifierfunction.MODIFIER_PROPERTY_STRONG_ILLUSION,
        /**
         * Method Name: `GetModifierSuperIllusion`
         */
        SUPER_ILLUSION = modifierfunction.MODIFIER_PROPERTY_SUPER_ILLUSION,
        /**
         * Method Name: `GetModifierSuperIllusionWithUltimate`
         */
        SUPER_ILLUSION_WITH_ULTIMATE = modifierfunction.MODIFIER_PROPERTY_SUPER_ILLUSION_WITH_ULTIMATE,
        /**
         * Method Name: `GetModifierXPDuringDeath`
         */
        XP_DURING_DEATH = modifierfunction.MODIFIER_PROPERTY_XP_DURING_DEATH,
        /**
         * Method Name: `GetModifierTurnRate_Percentage`
         */
        TURN_RATE_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_TURN_RATE_PERCENTAGE,
        /**
         * Method Name: `GetModifierTurnRate_Override`
         */
        TURN_RATE_OVERRIDE = modifierfunction.MODIFIER_PROPERTY_TURN_RATE_OVERRIDE,
        /**
         * Method Name: `GetDisableHealing`
         */
        DISABLE_HEALING = modifierfunction.MODIFIER_PROPERTY_DISABLE_HEALING,
        /**
         * Method Name: `GetAlwaysAllowAttack`
         */
        ALWAYS_ALLOW_ATTACK = modifierfunction.MODIFIER_PROPERTY_ALWAYS_ALLOW_ATTACK,
        /**
         * Method Name: `GetAllowEtherealAttack`
         */
        ALWAYS_ETHEREAL_ATTACK = modifierfunction.MODIFIER_PROPERTY_ALWAYS_ETHEREAL_ATTACK,
        /**
         * Method Name: `GetOverrideAttackMagical`
         */
        OVERRIDE_ATTACK_MAGICAL = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ATTACK_MAGICAL,
        /**
         * Method Name: `GetModifierUnitStatsNeedsRefresh`
         */
        UNIT_STATS_NEEDS_REFRESH = modifierfunction.MODIFIER_PROPERTY_UNIT_STATS_NEEDS_REFRESH,
        BOUNTY_CREEP_MULTIPLIER = modifierfunction.MODIFIER_PROPERTY_BOUNTY_CREEP_MULTIPLIER,
        BOUNTY_OTHER_MULTIPLIER = modifierfunction.MODIFIER_PROPERTY_BOUNTY_OTHER_MULTIPLIER,
        /**
         * Method Name: `GetModifierUnitDisllowUpgrading`
         */
        UNIT_DISALLOW_UPGRADING = modifierfunction.MODIFIER_PROPERTY_UNIT_DISALLOW_UPGRADING,
        /**
         * Method Name: `GetModifierDodgeProjectile`
         */
        DODGE_PROJECTILE = modifierfunction.MODIFIER_PROPERTY_DODGE_PROJECTILE,
        /**
         * Method Name: `GetTriggerCosmeticAndEndAttack`
         */
        TRIGGER_COSMETIC_AND_END_ATTACK = modifierfunction.MODIFIER_PROPERTY_TRIGGER_COSMETIC_AND_END_ATTACK,
        /**
         * Method Name: `GetModifierMaxDebuffDuration`
         */
        MAX_DEBUFF_DURATION = modifierfunction.MODIFIER_PROPERTY_MAX_DEBUFF_DURATION,
        /**
         * Method Name: `GetPrimaryStatDamageMultiplier`
         */
        PRIMARY_STAT_DAMAGE_MULTIPLIER = modifierfunction.MODIFIER_PROPERTY_PRIMARY_STAT_DAMAGE_MULTIPLIER,
        /**
         * Method Name: `GetModifierPreAttack_DeadlyBlow`
         */
        PREATTACK_DEADLY_BLOW = modifierfunction.MODIFIER_PROPERTY_PREATTACK_DEADLY_BLOW,
        /**
         * Method Name: `GetAlwaysAutoAttackWhileHoldPosition`
         */
        ALWAYS_AUTOATTACK_WHILE_HOLD_POSITION = modifierfunction.MODIFIER_PROPERTY_ALWAYS_AUTOATTACK_WHILE_HOLD_POSITION,
        /**
         * Method Name: `OnTooltip`
         */
        TOOLTIP = modifierfunction.MODIFIER_PROPERTY_TOOLTIP,
        /**
         * Method Name: `GetModifierModelChange`
         */
        MODEL_CHANGE = modifierfunction.MODIFIER_PROPERTY_MODEL_CHANGE,
        /**
         * Method Name: `GetModifierModelScale`
         */
        MODEL_SCALE = modifierfunction.MODIFIER_PROPERTY_MODEL_SCALE,
        /**
         * Always applies scepter when this property is active
         *
         *
         *
         * Method Name: `GetModifierScepter`.
         */
        IS_SCEPTER = modifierfunction.MODIFIER_PROPERTY_IS_SCEPTER,
        /**
         * Method Name: `GetModifierShard`
         */
        IS_SHARD = modifierfunction.MODIFIER_PROPERTY_IS_SHARD,
        /**
         * Method Name: `GetModifierRadarCooldownReduction`
         */
        RADAR_COOLDOWN_REDUCTION = modifierfunction.MODIFIER_PROPERTY_RADAR_COOLDOWN_REDUCTION,
        /**
         * Method Name: `GetActivityTranslationModifiers`
         */
        TRANSLATE_ACTIVITY_MODIFIERS = modifierfunction.MODIFIER_PROPERTY_TRANSLATE_ACTIVITY_MODIFIERS,
        /**
         * Method Name: `GetAttackSound`
         */
        TRANSLATE_ATTACK_SOUND = modifierfunction.MODIFIER_PROPERTY_TRANSLATE_ATTACK_SOUND,
        /**
         * Method Name: `GetUnitLifetimeFraction`
         */
        LIFETIME_FRACTION = modifierfunction.MODIFIER_PROPERTY_LIFETIME_FRACTION,
        /**
         * Method Name: `GetModifierProvidesFOWVision`
         */
        PROVIDES_FOW_POSITION = modifierfunction.MODIFIER_PROPERTY_PROVIDES_FOW_POSITION,
        /**
         * Method Name: `GetModifierSpellsRequireHP`
         */
        SPELLS_REQUIRE_HP = modifierfunction.MODIFIER_PROPERTY_SPELLS_REQUIRE_HP,
        /**
         * Method Name: `GetForceDrawOnMinimap`
         */
        FORCE_DRAW_MINIMAP = modifierfunction.MODIFIER_PROPERTY_FORCE_DRAW_MINIMAP,
        /**
         * Method Name: `GetModifierDisableTurning`
         */
        DISABLE_TURNING = modifierfunction.MODIFIER_PROPERTY_DISABLE_TURNING,
        /**
         * Method Name: `GetModifierIgnoreCastAngle`
         */
        IGNORE_CAST_ANGLE = modifierfunction.MODIFIER_PROPERTY_IGNORE_CAST_ANGLE,
        /**
         * Method Name: `GetModifierChangeAbilityValue`
         */
        CHANGE_ABILITY_VALUE = modifierfunction.MODIFIER_PROPERTY_CHANGE_ABILITY_VALUE,
        /**
         * Method Name: `GetModifierOverrideAbilitySpecial`
         */
        OVERRIDE_ABILITY_SPECIAL = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL,
        /**
         * Method Name: `GetModifierOverrideAbilitySpecialValue`
         */
        OVERRIDE_ABILITY_SPECIAL_VALUE = modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL_VALUE,
        /**
         * Method Name: `GetModifierAbilityLayout`
         */
        ABILITY_LAYOUT = modifierfunction.MODIFIER_PROPERTY_ABILITY_LAYOUT,
        TEMPEST_DOUBLE = modifierfunction.MODIFIER_PROPERTY_TEMPEST_DOUBLE,
        /**
         * Method Name: `PreserveParticlesOnModelChanged`
         */
        PRESERVE_PARTICLES_ON_MODEL_CHANGE = modifierfunction.MODIFIER_PROPERTY_PRESERVE_PARTICLES_ON_MODEL_CHANGE,
        /**
         * Method Name: `GetModifierIgnoreCooldown`
         */
        IGNORE_COOLDOWN = modifierfunction.MODIFIER_PROPERTY_IGNORE_COOLDOWN,
        /**
         * Method Name: `GetModifierCanAttackTrees`
         */
        CAN_ATTACK_TREES = modifierfunction.MODIFIER_PROPERTY_CAN_ATTACK_TREES,
        /**
         * Method Name: `GetVisualZDelta`
         */
        VISUAL_Z_DELTA = modifierfunction.MODIFIER_PROPERTY_VISUAL_Z_DELTA,
        INCOMING_DAMAGE_ILLUSION = modifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_ILLUSION,
        /**
         * Method Name: `GetModifierNoVisionOfAttacker`
         */
        DONT_GIVE_VISION_OF_ATTACKER = modifierfunction.MODIFIER_PROPERTY_DONT_GIVE_VISION_OF_ATTACKER,
        /**
         * Method Name: `OnTooltip2`
         */
        TOOLTIP2 = modifierfunction.MODIFIER_PROPERTY_TOOLTIP2,
        /**
         * Method Name: `GetSuppressTeleport`
         */
        SUPPRESS_TELEPORT = modifierfunction.MODIFIER_PROPERTY_SUPPRESS_TELEPORT,
        SUPPRESS_CLEAVE = modifierfunction.MODIFIER_PROPERTY_SUPPRESS_CLEAVE,
        /**
         * Method Name: `BotAttackScoreBonus`
         */
        BOT_ATTACK_SCORE_BONUS = modifierfunction.MODIFIER_PROPERTY_BOT_ATTACK_SCORE_BONUS,
        /**
         * Method Name: `GetModifierAttackSpeedReductionPercentage`
         */
        ATTACKSPEED_REDUCTION_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_REDUCTION_PERCENTAGE,
        /**
         * Method Name: `GetModifierMoveSpeedReductionPercentage`
         */
        MOVESPEED_REDUCTION_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_MOVESPEED_REDUCTION_PERCENTAGE,
        ATTACK_WHILE_MOVING_TARGET = modifierfunction.MODIFIER_PROPERTY_ATTACK_WHILE_MOVING_TARGET,
        /**
         * Method Name: `GetModifierAttackSpeedPercentage`
         */
        ATTACKSPEED_PERCENTAGE = modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_PERCENTAGE,

        COOLDOWN_PERCENTAGE_STACKING = modifierfunction.MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE_STACKING,

        //#region 自定义属性
        /**属性开始 */
        CUSTOM_PROPS_START = modifierfunction.MODIFIER_FUNCTION_INVALID + 1000,
        STATS_STRENGTH_BASE,
        STATS_STRENGTH_BASE_PERCENTAGE,
        STATS_STRENGTH_BONUS_CONSTANT,
        STATS_STRENGTH_PERCENTAGE,
        STATS_STRENGTH_BONUS_NO_PERCENTAGE,
        STATS_AGILITY_BASE,
        STATS_AGILITY_BASE_PERCENTAGE,
        STATS_AGILITY_BONUS_CONSTANT,
        STATS_AGILITY_PERCENTAGE,
        STATS_AGILITY_BONUS_NO_PERCENTAGE,
        STATS_INTELLECT_BASE,
        STATS_INTELLECT_BASE_PERCENTAGE,
        STATS_INTELLECT_BONUS_CONSTANT,
        STATS_INTELLECT_PERCENTAGE,
        STATS_INTELLECT_BONUS_NO_PERCENTAGE,
        STATS_ALL_BASE,
        STATS_ALL_BONUS,
        STATS_ALL_PERCENTAGE,
        STATS_PRIMARY_BASE,
        STATS_PRIMARY_BONUS,
        STATS_PRIMARY_PERCENTAGE,
        STATS_NO_ALL_ARMOR,
        STATUS_RESISTANCE_FORCE,
        /**额外攻击力,绿字部分 */
        ATTACK_DAMAGE_BONUS,
        /**额外攻击力百分比 */
        ATTACK_DAMAGE_BONUS_PERCENTAGE,
        /**基础攻击力百分比 */
        ATTACK_DAMAGE_BASE_PERCENTAGE,
        /**最终攻击力百分比 */
        ATTACK_DAMAGE_PERCENTAGE,
        /**基础生命值 */
        HP_BASE,
        HP_BONUS,
        /**额外生命百分比  */
        HP_BONUS_PERCENTAGE,
        /**最终生命百分比  */
        HP_PERCENTAGE,
        HP_PERCENT_ENEMY,

        MANA_PERCENTAGE,
        MANA_REGEN_AMPLIFY_PERCENTAGE,
        ENERGY_BONUS,
        ENERGY_BONUS_PERCENTAGE,
        ENERGY_REGEN_CONSTANT,
        ENERGY_REGEN_PERCENTAGE,

        PHYSICAL_ARMOR_BASE,
        MAGICAL_ARMOR_BASE,
        MAGICAL_ARMOR_BASE_PERCENTAGE,
        MAGICAL_ARMOR_BONUS,
        MAGICAL_ARMOR_PERCENTAGE,

        IGNORE_PHYSICAL_ARMOR_CONSTANT,
        IGNORE_MAGICAL_ARMOR_CONSTANT,
        IGNORE_PHYSICAL_ARMOR_UNIQUE,
        IGNORE_PHYSICAL_ARMOR_PERCENTAGE,
        IGNORE_PHYSICAL_ARMOR_PERCENTAGE_TARGET,
        IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE,
        IGNORE_MAGICAL_ARMOR,
        IGNORE_MAGICAL_ARMOR_UNIQUE,
        IGNORE_MAGICAL_ARMOR_PERCENTAGE,
        IGNORE_MAGICAL_ARMOR_PERCENTAGE_TARGET,
        IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE,

        CRITICALSTRIKE,
        CRITICALSTRIKE_CHANCE,
        // 普攻暴击伤害
        CRITICALSTRIKE_DAMAGE,
        SPELL_AMPLIFY_BASE,
        SPELL_AMPLIFY_BONUS,
        SPELL_AMPLIFY_BONUS_UNIQUE,
        SPELL_CRITICALSTRIKE,
        SPELL_CRITICALSTRIKE_CHANCE,
        SPELL_CRITICALSTRIKE_CHANCE_TARGET,
        SPELL_CRITICALSTRIKE_DAMAGE,
        MAX_ATTACKSPEED_BONUS_UNABLE,
        MAX_ATTACKSPEED_BONUS,
        BASE_ATTACK_TIME_ADJUST,
        BASE_ATTACK_TIME_PERCENTAGE,
        SPELL_EVASION_CONSTANT,
        // 状态抗性
        STATUS_RESISTANCE_BONUS,
        OUTGOING_DAMAGE_PERCENTAGE,
        OUTGOING_ALL_DAMAGE_PERCENTAGE,
        OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE,
        OUTGOING_MAGICAL_DAMAGE_PERCENTAGE,
        OUTGOING_PURE_DAMAGE_PERCENTAGE,
        OUTGOING_ATTACK_DAMAGE_PERCENTAGE,
        OUTGOING_SPELL_DAMAGE_PERCENTAGE,
        INCOMING_MAGICAL_DAMAGE_PERCENTAGE,
        INCOMING_PURE_DAMAGE_PERCENTAGE,
        INCOMING_ATTACK_DAMAGE_PERCENTAGE,
        INCOMING_SPELL_DAMAGE_PERCENTAGE,
        /**--------毒相关--------- */
        /**受到毒伤害加深 */
        INCOMING_POISON_DAMAGE_PERCENTAGE,
        OUTGOING_POISON_COUNT_PERCENTAGE,
        INCOMING_POISON_COUNT_PERCENTAGE,
        /**中毒触发时间间隔  */
        POISON_ACTIVE_TIME_PERCENTAGE,
        POISON_ACTIVE_INCREASE_PERCENTAGE,
        /**毒素免疫 */
        POISON_IMMUNE,

        /**额外召唤物召唤时间 */
        SUMMON_DURATION_BONUS,
        SUMMON_DURATION_PECT,
        /**流血相关 */
        INCOMING_BLEED_DAMAGE_PERCENTAGE,
        OUTGOING_BLEED_DAMAGE_PERCENTAGE,
        /**触电伤害 */
        INCOMING_SHOCK_DAMAGE_PERCENTAGE,
        INCOMING_SHOCK_COUNT_PERCENTAGE,
        OUTGOING_SHOCK_COUNT_PERCENTAGE,
        OUTGOING_MAGICAL_DAMAGE_CONSTANT,
        OUTGOING_DAMAGE_PERCENTAGE_SPECIAL,
        OUTGOING_PURE_DAMAGE_CONSTANT,
        /**持续性伤害加深 */
        INCOMING_DOT_DAMAGE_PERCENTAGE,
        INCOMING_SHOCK_DAMAGE_PERCENTAG,
        INCOMING_CRITICALSTRIKE_PERCENT,
        OUTGOING_PHYSICAL_DAMAGE_CONSTANT,
        INCOMING_DAMAGE_PERCENTAGE_ENEMY,
        TARGET_CRITICALSTRIKE,

        SPELL_CRITICALSTRIKE_MIX_PERCENT,
        SPELL_CRITICALSTRIKE_DAMAGE_TOTAL,
        INCOMING_SPELL_CRITICALSTRIKE_DAMAGE_CONSTANT,
        NO_SPELL_CRITICALSTRIKE,
        CRITICALSTRIKE_MIX_PERCENT,
        INCOMING_CRITICALSTRIKE_DAMAGE_CONSTANT,
        NO_CRITICALSTRIKE,
        MAX_COOLDOWN_PERCENTAGE,
        CRITICALSTRIKE_DAMAGE_TOTAL,

        SPELL_EVASION,
        //#endregion
    }

    /**
     * 属性枚举函数
     */
    export enum EMODIFIER_PROPERTY_FUNC {
        /**
         * Method Name: `GetModifierPreAttack_BonusDamage`
         */
        PREATTACK_BONUS_DAMAGE = "GetModifierPreAttack_BonusDamage",
        /**
         * Method Name: `GetModifierPreAttack_BonusDamage_Target`
         */
        PREATTACK_BONUS_DAMAGE_TARGET = "GetModifierPreAttack_BonusDamage_Target",
        /**
         * Method Name: `GetModifierPreAttack_BonusDamage_Proc`
         */
        PREATTACK_BONUS_DAMAGE_PROC = "GetModifierPreAttack_BonusDamage_Proc",
        /**
         * Method Name: `GetModifierPreAttack_BonusDamagePostCrit`
         */
        PREATTACK_BONUS_DAMAGE_POST_CRIT = "GetModifierPreAttack_BonusDamagePostCrit",
        /**
         * Method Name: `GetModifierBaseAttack_BonusDamage`
         * 额外基础攻击力(白字)
         */
        BASEATTACK_BONUSDAMAGE = "GetModifierBaseAttack_BonusDamage",
        /**
         * Method Name: `GetModifierProcAttack_BonusDamage_Physical`
         */
        PROCATTACK_BONUS_DAMAGE_PHYSICAL = "GetModifierProcAttack_BonusDamage_Physical",
        /**
         * Method Name: `GetModifierProcAttack_BonusDamage_Magical`
         */
        PROCATTACK_BONUS_DAMAGE_MAGICAL = "GetModifierProcAttack_BonusDamage_Magical",
        /**
         * Method Name: `GetModifierProcAttack_BonusDamage_Pure`
         */
        PROCATTACK_BONUS_DAMAGE_PURE = "GetModifierProcAttack_BonusDamage_Pure",
        /**
         * Method Name: `GetModifierProcAttack_Feedback`
         */
        PROCATTACK_FEEDBACK = "GetModifierProcAttack_Feedback",
        /**
         * Method Name: `GetModifierOverrideAttackDamage`
         */
        OVERRIDE_ATTACK_DAMAGE = "GetModifierOverrideAttackDamage",
        /**
         * Method Name: `GetModifierPreAttack`
         */
        PRE_ATTACK = "GetModifierPreAttack",
        /**
         * Method Name: `GetModifierInvisibilityLevel`
         */
        INVISIBILITY_LEVEL = "GetModifierInvisibilityLevel",
        /**
         * Method Name: `GetModifierInvisibilityAttackBehaviorException`
         */
        INVISIBILITY_ATTACK_BEHAVIOR_EXCEPTION = "GetModifierInvisibilityAttackBehaviorException",
        /**
         * Method Name: `GetModifierPersistentInvisibility`
         */
        PERSISTENT_INVISIBILITY = "GetModifierPersistentInvisibility",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Constant`
         */
        MOVESPEED_BONUS_CONSTANT = "GetModifierMoveSpeedBonus_Constant",
        /**
         * Method Name: `GetModifierMoveSpeedOverride`
         */
        MOVESPEED_BASE_OVERRIDE = "GetModifierMoveSpeedOverride",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Percentage`
         */
        MOVESPEED_BONUS_PERCENTAGE = "GetModifierMoveSpeedBonus_Percentage",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Percentage_Unique`
         */
        MOVESPEED_BONUS_PERCENTAGE_UNIQUE = "GetModifierMoveSpeedBonus_Percentage_Unique",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Percentage_Unique_2`
         */
        MOVESPEED_BONUS_PERCENTAGE_UNIQUE_2 = "GetModifierMoveSpeedBonus_Percentage_Unique_2",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Special_Boots`
         */
        MOVESPEED_BONUS_UNIQUE = "GetModifierMoveSpeedBonus_Special_Boots",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Special_Boots_2`
         */
        MOVESPEED_BONUS_UNIQUE_2 = "GetModifierMoveSpeedBonus_Special_Boots_2",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Constant_Unique`
         */
        MOVESPEED_BONUS_CONSTANT_UNIQUE = "GetModifierMoveSpeedBonus_Constant_Unique",
        /**
         * Method Name: `GetModifierMoveSpeedBonus_Constant_Unique_2`
         */
        MOVESPEED_BONUS_CONSTANT_UNIQUE_2 = "GetModifierMoveSpeedBonus_Constant_Unique_2",
        /**
         * Method Name: `GetModifierMoveSpeed_Absolute`
         */
        MOVESPEED_ABSOLUTE = "GetModifierMoveSpeed_Absolute",
        /**
         * Method Name: `GetModifierMoveSpeed_AbsoluteMin`
         */
        MOVESPEED_ABSOLUTE_MIN = "GetModifierMoveSpeed_AbsoluteMin",
        /**
         * Method Name: `GetModifierMoveSpeed_AbsoluteMax`
         */
        MOVESPEED_ABSOLUTE_MAX = "GetModifierMoveSpeed_AbsoluteMax",
        /**
         * Method Name: `GetModifierIgnoreMovespeedLimit`
         */
        IGNORE_MOVESPEED_LIMIT = "GetModifierIgnoreMovespeedLimit",
        /**
         * Method Name: `GetModifierMoveSpeed_Limit`
         */
        MOVESPEED_LIMIT = "GetModifierIgnoreMovespeedLimit",
        /**
         * Method Name: `GetModifierAttackSpeedBaseOverride`
         */
        ATTACKSPEED_BASE_OVERRIDE = "GetModifierAttackSpeedBaseOverride",
        /**
         * Method Name: `GetModifierFixedAttackRate`
         */
        FIXED_ATTACK_RATE = "GetModifierFixedAttackRate",
        /**
         * Method Name: `GetModifierAttackSpeedBonus_Constant`
         */
        ATTACKSPEED_BONUS_CONSTANT = "GetModifierAttackSpeedBonus_Constant",
        /**
         * Method Name: `GetModifierAttackSpeed_Limit`
         */
        IGNORE_ATTACKSPEED_LIMIT = "GetModifierAttackSpeed_Limit",
        /**
         * Method Name: `GetModifierCooldownReduction_Constant`
         */
        COOLDOWN_REDUCTION_CONSTANT = "GetModifierCooldownReduction_Constant",
        /**
         * Method Name: `GetModifierManacostReduction_Constant`
         */
        MANACOST_REDUCTION_CONSTANT = "GetModifierManacostReduction_Constant",
        /**
         * Method Name: `GetModifierBaseAttackTimeConstant`
         */
        BASE_ATTACK_TIME_CONSTANT = "GetModifierBaseAttackTimeConstant",
        /**
         * Method Name: `GetModifierBaseAttackTimeConstant_Adjust`
         */
        BASE_ATTACK_TIME_CONSTANT_ADJUST = "GetModifierBaseAttackTimeConstant_Adjust",
        /**
         * Method Name: `GetModifierAttackPointConstant`
         */
        ATTACK_POINT_CONSTANT = "GetModifierAttackPointConstant",
        /**
         * Method Name: `GetModifierBonusDamageOutgoing_Percentage`
         */
        BONUSDAMAGEOUTGOING_PERCENTAGE = "GetModifierBonusDamageOutgoing_Percentage",
        /**
         * Method Name: `GetModifierDamageOutgoing_Percentage`
         */
        DAMAGEOUTGOING_PERCENTAGE = "GetModifierDamageOutgoing_Percentage",
        /**
         * Method Name: `GetModifierDamageOutgoing_Percentage_Illusion`
         */
        DAMAGEOUTGOING_PERCENTAGE_ILLUSION = "GetModifierDamageOutgoing_Percentage_Illusion",
        /**
         * Method Name: `GetModifierDamageOutgoing_Percentage_Illusion_Amplify`
         */
        DAMAGEOUTGOING_PERCENTAGE_ILLUSION_AMPLIFY = "GetModifierDamageOutgoing_Percentage_Illusion_Amplify",
        /**
         * Method Name: `GetModifierTotalDamageOutgoing_Percentage`
         */
        TOTALDAMAGEOUTGOING_PERCENTAGE = "GetModifierTotalDamageOutgoing_Percentage",
        /**
         * Method Name: `GetModifierSpellAmplify_PercentageCreep`
         */
        SPELL_AMPLIFY_PERCENTAGE_CREEP = "GetModifierSpellAmplify_PercentageCreep",
        /**
         * Method Name: `GetModifierSpellAmplify_Percentage`
         */
        SPELL_AMPLIFY_PERCENTAGE = "GetModifierSpellAmplify_Percentage",
        /**
         * Method Name: `GetModifierSpellAmplify_PercentageUnique`
         */
        SPELL_AMPLIFY_PERCENTAGE_UNIQUE = "GetModifierSpellAmplify_PercentageUnique",
        /**
         * Method Name: `GetModifierHealAmplify_PercentageSource`
         */
        HEAL_AMPLIFY_PERCENTAGE_SOURCE = "GetModifierHealAmplify_PercentageSource",
        /**
         * Method Name: `GetModifierHealAmplify_PercentageTarget`
         */
        HEAL_AMPLIFY_PERCENTAGE_TARGET = "GetModifierHealAmplify_PercentageTarget",
        /**
         * Method Name: `GetModifierHPRegenAmplify_Percentage`
         */
        HP_REGEN_AMPLIFY_PERCENTAGE = "GetModifierHPRegenAmplify_Percentage",
        /**
         * Method Name: `GetModifierLifestealRegenAmplify_Percentage`
         */
        LIFESTEAL_AMPLIFY_PERCENTAGE = "GetModifierLifestealRegenAmplify_Percentage",
        /**
         * Method Name: `GetModifierSpellLifestealRegenAmplify_Percentage`
         */
        SPELL_LIFESTEAL_AMPLIFY_PERCENTAGE = "GetModifierSpellLifestealRegenAmplify_Percentage",
        /**
         * Method Name: `GetModifierMPRegenAmplify_Percentage`
         */
        MP_REGEN_AMPLIFY_PERCENTAGE = "GetModifierMPRegenAmplify_Percentage",
        /**
         * Method Name: `GetModifierManaDrainAmplify_Percentage`
         */
        MANA_DRAIN_AMPLIFY_PERCENTAGE = "GetModifierManaDrainAmplify_Percentage",
        /**
         * Total amplify value is clamped to 0.
         *
         *
         *
         * Method Name: `GetModifierMPRestoreAmplify_Percentage`.
         */
        MP_RESTORE_AMPLIFY_PERCENTAGE = "GetModifierMPRestoreAmplify_Percentage",
        /**
         * Method Name: `GetModifierBaseDamageOutgoing_Percentage`
         */
        BASEDAMAGEOUTGOING_PERCENTAGE = "GetModifierBaseDamageOutgoing_Percentage",
        /**
         * Method Name: `GetModifierBaseDamageOutgoing_PercentageUnique`
         */
        BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE = "GetModifierBaseDamageOutgoing_PercentageUnique",
        /**
         * Method Name: `GetModifierIncomingDamage_Percentage`
         */
        INCOMING_DAMAGE_PERCENTAGE = "GetModifierIncomingDamage_Percentage",
        /**
         * Method Name: `GetModifierIncomingPhysicalDamage_Percentage`
         */
        INCOMING_PHYSICAL_DAMAGE_PERCENTAGE = "GetModifierIncomingPhysicalDamage_Percentage",
        /**
         * Method Name: `GetModifierIncomingPhysicalDamageConstant`
         */
        INCOMING_PHYSICAL_DAMAGE_CONSTANT = "GetModifierIncomingPhysicalDamageConstant",
        /**
         * Method Name: `GetModifierIncomingSpellDamageConstant`
         */
        INCOMING_SPELL_DAMAGE_CONSTANT = "GetModifierIncomingSpellDamageConstant",
        /**
         * Method Name: `GetModifierEvasion_Constant`
         */
        EVASION_CONSTANT = "GetModifierEvasion_Constant",
        /**
         * Method Name: `GetModifierNegativeEvasion_Constant`
         */
        NEGATIVE_EVASION_CONSTANT = "GetModifierNegativeEvasion_Constant",
        /**
         * Method Name: `GetModifierStatusResistance`
         */
        STATUS_RESISTANCE = "GetModifierStatusResistance",
        /**
         * Method Name: `GetModifierStatusResistanceStacking`
         */
        STATUS_RESISTANCE_STACKING = "GetModifierStatusResistanceStacking",
        /**
         * Method Name: `GetModifierStatusResistanceCaster`
         */
        STATUS_RESISTANCE_CASTER = "GetModifierStatusResistanceCaster",
        /**
         * Method Name: `GetModifierAvoidDamage`
         */
        AVOID_DAMAGE = "GetModifierAvoidDamage",
        /**
         * Method Name: `GetModifierAvoidSpell`
         */
        AVOID_SPELL = "GetModifierAvoidSpell",
        /**
         * Method Name: `GetModifierMiss_Percentage`
         */
        MISS_PERCENTAGE = "GetModifierMiss_Percentage",
        /**
         * Values above 100% are ignored.
         *
         *
         *
         * Method Name: `GetModifierPhysicalArmorBase_Percentage`.
         */
        PHYSICAL_ARMOR_BASE_PERCENTAGE = "GetModifierPhysicalArmorBase_Percentage",
        /**
         * Method Name: `GetModifierPhysicalArmorTotal_Percentage`
         */
        PHYSICAL_ARMOR_TOTAL_PERCENTAGE = "GetModifierPhysicalArmorTotal_Percentage",
        /**
         * Method Name: `GetModifierPhysicalArmorBonus`
         */
        PHYSICAL_ARMOR_BONUS = "GetModifierPhysicalArmorBonus",
        /**
         * Method Name: `GetModifierPhysicalArmorBonusUnique`
         */
        PHYSICAL_ARMOR_BONUS_UNIQUE = "GetModifierPhysicalArmorBonusUnique",
        /**
         * Method Name: `GetModifierPhysicalArmorBonusUniqueActive`
         */
        PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE = "GetModifierPhysicalArmorBonusUniqueActive",
        /**
         * Method Name: `GetModifierIgnorePhysicalArmor`
         */
        IGNORE_PHYSICAL_ARMOR = "GetModifierIgnorePhysicalArmor",
        /**
         * Method Name: `GetModifierMagicalResistanceBaseReduction`
         */
        MAGICAL_RESISTANCE_BASE_REDUCTION = "GetModifierMagicalResistanceBaseReduction",
        /**
         * Method Name: `GetModifierMagicalResistanceDirectModification`
         */
        MAGICAL_RESISTANCE_DIRECT_MODIFICATION = "GetModifierMagicalResistanceDirectModification",
        /**
         * Method Name: `GetModifierMagicalResistanceBonus`
         */
        MAGICAL_RESISTANCE_BONUS = "GetModifierMagicalResistanceBonus",
        /**
         * Method Name: `GetModifierMagicalResistanceBonusIllusions`
         */
        MAGICAL_RESISTANCE_BONUS_ILLUSIONS = "GetModifierMagicalResistanceBonusIllusions",
        /**
         * Method Name: `GetModifierMagicalResistanceDecrepifyUnique`
         */
        MAGICAL_RESISTANCE_DECREPIFY_UNIQUE = "GetModifierMagicalResistanceDecrepifyUnique",
        /**
         * Method Name: `GetModifierBaseRegen`
         */
        BASE_MANA_REGEN = "GetModifierBaseRegen",
        /**
         * Method Name: `GetModifierConstantManaRegen`
         */
        MANA_REGEN_CONSTANT = "GetModifierConstantManaRegen",
        /**
         * Method Name: `GetModifierConstantManaRegenUnique`
         */
        MANA_REGEN_CONSTANT_UNIQUE = "GetModifierConstantManaRegenUnique",
        /**
         * Method Name: `GetModifierTotalPercentageManaRegen`
         */
        MANA_REGEN_TOTAL_PERCENTAGE = "GetModifierTotalPercentageManaRegen",
        /**
         * Method Name: `GetModifierConstantHealthRegen`
         * 气血回复
         */
        HEALTH_REGEN_CONSTANT = "GetModifierConstantHealthRegen",
        /**
         * Method Name: `GetModifierHealthRegenPercentage`
         */
        HEALTH_REGEN_PERCENTAGE = "GetModifierHealthRegenPercentage",
        /**
         * Method Name: `GetModifierHealthRegenPercentageUnique`
         */
        HEALTH_REGEN_PERCENTAGE_UNIQUE = "GetModifierHealthRegenPercentageUnique",
        /**
         * Method Name: `GetModifierHealthBonus`
         */
        HEALTH_BONUS = "GetModifierHealthBonus",
        /**
         * Method Name: `GetModifierManaBonus`
         */
        MANA_BONUS = "GetModifierManaBonus",
        /**
         * Method Name: `GetModifierExtraStrengthBonus`
         */
        EXTRA_STRENGTH_BONUS = "GetModifierExtraStrengthBonus",
        /**
         * Method Name: `GetModifierExtraHealthBonus`
         */
        EXTRA_HEALTH_BONUS = "GetModifierExtraHealthBonus",
        /**
         * Method Name: `GetModifierExtraManaBonus`
         */
        EXTRA_MANA_BONUS = "GetModifierExtraManaBonus",
        /**
         * Method Name: `GetModifierExtraHealthPercentage`
         */
        EXTRA_HEALTH_PERCENTAGE = "GetModifierExtraHealthPercentage",
        /**
         * Method Name: `GetModifierExtraManaPercentage`
         */
        EXTRA_MANA_PERCENTAGE = "GetModifierExtraManaPercentage",
        /**
         * Method Name: `GetModifierBonusStats_Strength`
         */
        STATS_STRENGTH_BONUS = "GetModifierBonusStats_Strength",
        /**
         * Method Name: `GetModifierBonusStats_Agility`
         */
        STATS_AGILITY_BONUS = "GetModifierBonusStats_Agility",
        /**
         * Method Name: `GetModifierBonusStats_Intellect`
         */
        STATS_INTELLECT_BONUS = "GetModifierBonusStats_Intellect",
        /**
         * Method Name: `GetModifierBonusStats_Strength_Percentage`
         */
        STATS_STRENGTH_BONUS_PERCENTAGE = "GetModifierBonusStats_Strength_Percentage",
        /**
         * Method Name: `GetModifierBonusStats_Agility_Percentage`
         */
        STATS_AGILITY_BONUS_PERCENTAGE = "GetModifierBonusStats_Agility_Percentage",
        /**
         * Method Name: `GetModifierBonusStats_Intellect_Percentage`
         */
        STATS_INTELLECT_BONUS_PERCENTAGE = "GetModifierBonusStats_Intellect_Percentage",
        /**
         * Method Name: `GetModifierCastRangeBonus`
         */
        CAST_RANGE_BONUS = "GetModifierCastRangeBonus",
        /**
         * Method Name: `GetModifierCastRangeBonusTarget`
         */
        CAST_RANGE_BONUS_TARGET = "GetModifierCastRangeBonusTarget",
        /**
         * Method Name: `GetModifierCastRangeBonusStacking`
         */
        CAST_RANGE_BONUS_STACKING = "GetModifierCastRangeBonusStacking",
        /**
         * Method Name: `GetModifierAttackRangeOverride`
         */
        ATTACK_RANGE_BASE_OVERRIDE = "GetModifierAttackRangeOverride",
        /**
         * Method Name: `GetModifierAttackRangeBonus`
         */
        ATTACK_RANGE_BONUS = "GetModifierAttackRangeBonus",
        /**
         * Method Name: `GetModifierAttackRangeBonusUnique`
         */
        ATTACK_RANGE_BONUS_UNIQUE = "GetModifierAttackRangeBonusUnique",
        /**
         * Method Name: `GetModifierAttackRangeBonusPercentage`
         */
        ATTACK_RANGE_BONUS_PERCENTAGE = "GetModifierAttackRangeBonusPercentage",
        /**
         * Method Name: `GetModifierMaxAttackRange`
         */
        MAX_ATTACK_RANGE = "GetModifierMaxAttackRange",
        /**
         * Method Name: `GetModifierProjectileSpeedBonus`
         */
        PROJECTILE_SPEED_BONUS = "GetModifierProjectileSpeedBonus",
        /**
         * Method Name: `GetModifierProjectileSpeedBonusPercentage`
         */
        PROJECTILE_SPEED_BONUS_PERCENTAGE = "GetModifierProjectileSpeedBonusPercentage",
        /**
         * Method Name: `GetModifierProjectileName`
         */
        PROJECTILE_NAME = "GetModifierProjectileName",
        /**
         * Method Name: `ReincarnateTime`
         */
        REINCARNATION = "ReincarnateTime",
        /**
         * Method Name: `GetModifierConstantRespawnTime`
         */
        RESPAWNTIME = "GetModifierConstantRespawnTime",
        /**
         * Method Name: `GetModifierPercentageRespawnTime`
         */
        RESPAWNTIME_PERCENTAGE = "GetModifierPercentageRespawnTime",
        /**
         * Method Name: `GetModifierStackingRespawnTime`
         */
        RESPAWNTIME_STACKING = "GetModifierStackingRespawnTime",
        /**
         * Method Name: `GetModifierPercentageCooldown`
         */
        COOLDOWN_PERCENTAGE = "GetModifierPercentageCooldown",
        /**
         * Method Name: `GetModifierPercentageCooldownOngoing`
         */
        COOLDOWN_PERCENTAGE_ONGOING = "GetModifierPercentageCooldownOngoing",
        /**
         * Method Name: `GetModifierPercentageCasttime`
         */
        CASTTIME_PERCENTAGE = "GetModifierPercentageCasttime",
        /**
         * Method Name: `GetModifierPercentageAttackAnimTime`
         */
        ATTACK_ANIM_TIME_PERCENTAGE = "GetModifierPercentageAttackAnimTime",
        /**
         * Method Name: `GetModifierPercentageManacost`
         */
        MANACOST_PERCENTAGE = "GetModifierPercentageManacost",
        /**
         * Method Name: `GetModifierPercentageManacostStacking`
         */
        MANACOST_PERCENTAGE_STACKING = "GetModifierPercentageManacostStacking",
        /**
         * Method Name: `GetModifierConstantDeathGoldCost`
         */
        DEATHGOLDCOST = "GetModifierConstantDeathGoldCost",
        /**
         * Method Name: `GetModifierPercentageExpRateBoost`
         */
        EXP_RATE_BOOST = "GetModifierPercentageExpRateBoost",
        /**
         * Method Name: `GetModifierPreAttack_CriticalStrike`
         */
        PREATTACK_CRITICALSTRIKE = "GetModifierPreAttack_CriticalStrike",
        /**
         * Method Name: `GetModifierPreAttack_Target_CriticalStrike`
         */
        PREATTACK_TARGET_CRITICALSTRIKE = "GetModifierPreAttack_Target_CriticalStrike",
        /**
         * Method Name: `GetModifierMagical_ConstantBlock`
         */
        MAGICAL_CONSTANT_BLOCK = "GetModifierMagical_ConstantBlock",
        /**
         * Method Name: `GetModifierPhysical_ConstantBlock`
         */
        PHYSICAL_CONSTANT_BLOCK = "GetModifierPhysical_ConstantBlock",
        /**
         * Method Name: `GetModifierPhysical_ConstantBlockSpecial`
         */
        PHYSICAL_CONSTANT_BLOCK_SPECIAL = "GetModifierPhysical_ConstantBlockSpecial",
        /**
         * Method Name: `GetModifierPhysical_ConstantBlockUnavoidablePreArmor`
         */
        TOTAL_CONSTANT_BLOCK_UNAVOIDABLE_PRE_ARMOR = "GetModifierPhysical_ConstantBlockUnavoidablePreArmor",
        /**
         * Method Name: `GetModifierTotal_ConstantBlock`
         */
        TOTAL_CONSTANT_BLOCK = "GetModifierTotal_ConstantBlock",
        /**
         * Method Name: `GetOverrideAnimation`
         */
        OVERRIDE_ANIMATION = "GetOverrideAnimation",
        /**
         * Method Name: `GetOverrideAnimationWeight`
         */
        OVERRIDE_ANIMATION_WEIGHT = "GetOverrideAnimationWeight",
        /**
         * Method Name: `GetOverrideAnimationRate`
         */
        OVERRIDE_ANIMATION_RATE = "GetOverrideAnimationRate",
        /**
         * Method Name: `GetAbsorbSpell`
         */
        ABSORB_SPELL = "GetAbsorbSpell",
        /**
         * Method Name: `GetReflectSpell`
         */
        REFLECT_SPELL = "GetReflectSpell",
        /**
         * Method Name: `GetDisableAutoAttack`
         */
        DISABLE_AUTOATTACK = "GetDisableAutoAttack",
        /**
         * Method Name: `GetBonusDayVision`
         */
        BONUS_DAY_VISION = "GetBonusDayVision",
        /**
         * Method Name: `GetBonusNightVision`
         */
        BONUS_NIGHT_VISION = "GetBonusNightVision",
        /**
         * Method Name: `GetBonusNightVisionUnique`
         */
        BONUS_NIGHT_VISION_UNIQUE = "GetBonusNightVisionUnique",
        /**
         * Method Name: `GetBonusVisionPercentage`
         */
        BONUS_VISION_PERCENTAGE = "GetBonusVisionPercentage",
        /**
         * Method Name: `GetFixedDayVision`
         */
        FIXED_DAY_VISION = "GetFixedDayVision",
        /**
         * Method Name: `GetFixedNightVision`
         */
        FIXED_NIGHT_VISION = "GetFixedNightVision",
        /**
         * Method Name: `GetMinHealth`
         */
        MIN_HEALTH = "GetMinHealth",
        /**
         * Method Name: `GetAbsoluteNoDamagePhysical`
         */
        ABSOLUTE_NO_DAMAGE_PHYSICAL = "GetAbsoluteNoDamagePhysical",
        /**
         * Method Name: `GetAbsoluteNoDamageMagical`
         */
        ABSOLUTE_NO_DAMAGE_MAGICAL = "GetAbsoluteNoDamageMagical",
        /**
         * Method Name: `GetAbsoluteNoDamagePure`
         */
        ABSOLUTE_NO_DAMAGE_PURE = "GetAbsoluteNoDamagePure",
        /**
         * Method Name: `GetIsIllusion`
         */
        IS_ILLUSION = "GetIsIllusion",
        /**
         * Method Name: `GetModifierIllusionLabel`
         */
        ILLUSION_LABEL = "GetModifierIllusionLabel",
        /**
         * Method Name: `GetModifierStrongIllusion`
         */
        STRONG_ILLUSION = "GetModifierStrongIllusion",
        /**
         * Method Name: `GetModifierSuperIllusion`
         */
        SUPER_ILLUSION = "GetModifierSuperIllusion",
        /**
         * Method Name: `GetModifierSuperIllusionWithUltimate`
         */
        SUPER_ILLUSION_WITH_ULTIMATE = "GetModifierSuperIllusionWithUltimate",
        /**
         * Method Name: `GetModifierXPDuringDeath`
         */
        XP_DURING_DEATH = "GetModifierXPDuringDeath",
        /**
         * Method Name: `GetModifierTurnRate_Percentage`
         */
        TURN_RATE_PERCENTAGE = "GetModifierTurnRate_Percentage",
        /**
         * Method Name: `GetModifierTurnRate_Override`
         */
        TURN_RATE_OVERRIDE = "GetModifierTurnRate_Override",
        /**
         * Method Name: `GetDisableHealing`
         */
        DISABLE_HEALING = "GetDisableHealing",
        /**
         * Method Name: `GetAlwaysAllowAttack`
         */
        ALWAYS_ALLOW_ATTACK = "GetAlwaysAllowAttack",
        /**
         * Method Name: `GetAllowEtherealAttack`
         */
        ALWAYS_ETHEREAL_ATTACK = "GetAllowEtherealAttack",
        /**
         * Method Name: `GetOverrideAttackMagical`
         */
        OVERRIDE_ATTACK_MAGICAL = "GetOverrideAttackMagical",
        /**
         * Method Name: `GetModifierUnitStatsNeedsRefresh`
         */
        UNIT_STATS_NEEDS_REFRESH = "GetModifierUnitStatsNeedsRefresh",
        BOUNTY_CREEP_MULTIPLIER = "GetModifierBountyCreepMultiplier",
        BOUNTY_OTHER_MULTIPLIER = "GetModifierBountyOtherMultiplier",
        /**
         * Method Name: `GetModifierUnitDisllowUpgrading`
         */
        UNIT_DISALLOW_UPGRADING = "GetModifierUnitDisllowUpgrading",
        /**
         * Method Name: `GetModifierDodgeProjectile`
         */
        DODGE_PROJECTILE = "GetModifierDodgeProjectile",
        /**
         * Method Name: `GetTriggerCosmeticAndEndAttack`
         */
        TRIGGER_COSMETIC_AND_END_ATTACK = "GetTriggerCosmeticAndEndAttack",
        /**
         * Method Name: `GetModifierMaxDebuffDuration`
         */
        MAX_DEBUFF_DURATION = "GetModifierMaxDebuffDuration ",
        /**
         * Method Name: `GetPrimaryStatDamageMultiplier`
         */
        PRIMARY_STAT_DAMAGE_MULTIPLIER = "GetPrimaryStatDamageMultiplier",
        /**
         * Method Name: `GetModifierPreAttack_DeadlyBlow`
         */
        PREATTACK_DEADLY_BLOW = "GetModifierPreAttack_DeadlyBlow",
        /**
         * Method Name: `GetAlwaysAutoAttackWhileHoldPosition`
         */
        ALWAYS_AUTOATTACK_WHILE_HOLD_POSITION = "GetAlwaysAutoAttackWhileHoldPosition",
        /**
         * Method Name: `OnTooltip`
         */
        TOOLTIP = "OnTooltip",
        /**
         * Method Name: `GetModifierModelChange`
         */
        MODEL_CHANGE = "GetModifierModelChange",
        /**
         * Method Name: `GetModifierModelScale`
         */
        MODEL_SCALE = "GetModifierModelScale",
        /**
         * Always applies scepter when this property is active
         *
         *
         *
         * Method Name: `GetModifierScepter`.
         */
        IS_SCEPTER = "GetModifierScepter",
        /**
         * Method Name: `GetModifierShard`
         */
        IS_SHARD = "GetModifierShard",
        /**
         * Method Name: `GetModifierRadarCooldownReduction`
         */
        RADAR_COOLDOWN_REDUCTION = "GetModifierRadarCooldownReduction",
        /**
         * Method Name: `GetActivityTranslationModifiers`
         */
        TRANSLATE_ACTIVITY_MODIFIERS = "GetActivityTranslationModifiers",
        /**
         * Method Name: `GetAttackSound`
         */
        TRANSLATE_ATTACK_SOUND = "GetAttackSound",
        /**
         * Method Name: `GetUnitLifetimeFraction`
         */
        LIFETIME_FRACTION = "GetUnitLifetimeFraction",
        /**
         * Method Name: `GetModifierProvidesFOWVision`
         */
        PROVIDES_FOW_POSITION = "GetModifierProvidesFOWVision",
        /**
         * Method Name: `GetModifierSpellsRequireHP`
         */
        SPELLS_REQUIRE_HP = "GetModifierSpellsRequireHP",
        /**
         * Method Name: `GetForceDrawOnMinimap`
         */
        FORCE_DRAW_MINIMAP = "GetForceDrawOnMinimap",
        /**
         * Method Name: `GetModifierDisableTurning`
         */
        DISABLE_TURNING = "GetModifierDisableTurning",
        /**
         * Method Name: `GetModifierIgnoreCastAngle`
         */
        IGNORE_CAST_ANGLE = "GetModifierIgnoreCastAngle",
        /**
         * Method Name: `GetModifierChangeAbilityValue`
         */
        CHANGE_ABILITY_VALUE = "GetModifierChangeAbilityValue",
        /**
         * Method Name: `GetModifierOverrideAbilitySpecial`
         */
        OVERRIDE_ABILITY_SPECIAL = "GetModifierOverrideAbilitySpecial",
        /**
         * Method Name: `GetModifierOverrideAbilitySpecialValue`
         */
        OVERRIDE_ABILITY_SPECIAL_VALUE = "GetModifierOverrideAbilitySpecialValue",
        /**
         * Method Name: `GetModifierAbilityLayout`
         */
        ABILITY_LAYOUT = "GetModifierAbilityLayout",
        TEMPEST_DOUBLE = "GetModifierTempestDouble",
        /**
         * Method Name: `PreserveParticlesOnModelChanged`
         */
        PRESERVE_PARTICLES_ON_MODEL_CHANGE = "PreserveParticlesOnModelChanged",
        /**
         * Method Name: `GetModifierIgnoreCooldown`
         */
        IGNORE_COOLDOWN = "GetModifierIgnoreCooldown",
        /**
         * Method Name: `GetModifierCanAttackTrees`
         */
        CAN_ATTACK_TREES = "GetModifierCanAttackTrees",
        /**
         * Method Name: `GetVisualZDelta`
         */
        VISUAL_Z_DELTA = "GetVisualZDelta",
        INCOMING_DAMAGE_ILLUSION = "GetModifierIncomingDamage_Illusion",
        /**
         * Method Name: `GetModifierNoVisionOfAttacker`
         */
        DONT_GIVE_VISION_OF_ATTACKER = "GetModifierNoVisionOfAttacker",
        /**
         * Method Name: `OnTooltip2`
         */
        TOOLTIP2 = "OnTooltip2",
        /**
         * Method Name: `GetSuppressTeleport`
         */
        SUPPRESS_TELEPORT = "GetSuppressTeleport",
        SUPPRESS_CLEAVE = "GetSuppressCleave",
        /**
         * Method Name: `BotAttackScoreBonus`
         */
        BOT_ATTACK_SCORE_BONUS = "BotAttackScoreBonus",
        /**
         * Method Name: `GetModifierAttackSpeedReductionPercentage`
         */
        ATTACKSPEED_REDUCTION_PERCENTAGE = "GetModifierAttackSpeedReductionPercentage",
        /**
         * Method Name: `GetModifierMoveSpeedReductionPercentage`
         */
        MOVESPEED_REDUCTION_PERCENTAGE = "GetModifierMoveSpeedReductionPercentage",
        ATTACK_WHILE_MOVING_TARGET = "GetModifierAttackWhileMovingTarget",
        /**
         * Method Name: `GetModifierAttackSpeedPercentage`
         */
        ATTACKSPEED_PERCENTAGE = "GetModifierAttackSpeedPercentage",
    }

    /**保留的属性计算，自定义属性计算事件 */
    export const CustomDeclarePropertyEvent: Set<modifierfunction> = new Set([
        // 额外基础攻击力
        modifierfunction.MODIFIER_PROPERTY_BASEATTACK_BONUSDAMAGE,
        //  CD减少百分比
        modifierfunction.MODIFIER_PROPERTY_COOLDOWN_PERCENTAGE,
        //  闪避
        modifierfunction.MODIFIER_PROPERTY_EVASION_CONSTANT,
        // 最小气血，用于计算气血属性
        modifierfunction.MODIFIER_PROPERTY_MIN_HEALTH,
        // 气血恢复
        modifierfunction.MODIFIER_PROPERTY_HEALTH_REGEN_CONSTANT,
        // 额外魔法值
        modifierfunction.MODIFIER_PROPERTY_MANA_BONUS,
        // 魔法恢复
        modifierfunction.MODIFIER_PROPERTY_MANA_REGEN_CONSTANT,
        // 额外技能伤害百分比？
        modifierfunction.MODIFIER_PROPERTY_SPELL_AMPLIFY_PERCENTAGE,
        // 最大攻速上限
        modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BASE_OVERRIDE,
        // 额外攻速
        modifierfunction.MODIFIER_PROPERTY_ATTACKSPEED_BONUS_CONSTANT,
        // 攻击暴击
        modifierfunction.MODIFIER_PROPERTY_PREATTACK_CRITICALSTRIKE,
        // 技能面板数值覆盖
        modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL,
        // 技能面板数值覆盖
        modifierfunction.MODIFIER_PROPERTY_OVERRIDE_ABILITY_SPECIAL_VALUE,

        modifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,

        modifierfunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE,

        modifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,

        modifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,

        modifierfunction.MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT,
    ]);
    /**唯一值属性，计算式不累加，求最大值 */
    export const UNIQUE_PROPERTY = [
        EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
        EMODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE_2,
        EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS_UNIQUE,
        EMODIFIER_PROPERTY.BONUS_NIGHT_VISION_UNIQUE,
        EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE,
        EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE,
        EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE,
        EMODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE_UNIQUE,
        EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT_UNIQUE,
        EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
        EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT_UNIQUE_2,
        EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
        EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
        EMODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE,
        EMODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE,
        EMODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE,
    ];
}

declare global {
    var GPropertyConfig: typeof PropertyConfig;
}

if (_G.GPropertyConfig == null) {
    _G.GPropertyConfig = PropertyConfig;
}
