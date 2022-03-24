export module GameEnum {


    export namespace Property {


        export enum PrimaryAttribute {
            DOTA_ATTRIBUTE_AGILITY,
            DOTA_ATTRIBUTE_STRENGTH,
            DOTA_ATTRIBUTE_INTELLECT,
        }
        /**
         *属性枚举统计标记
         */
        export enum Enum_MODIFIER_PROPERTY {
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

            //#region 自定义属性
            /**毒相关 */
            INCOMING_POISON_DAMAGE_PERCENTAGE = modifierfunction.MODIFIER_FUNCTION_INVALID + 1000,
            OUTGOING_POISON_COUNT_PERCENTAGE,
            INCOMING_POISON_COUNT_PERCENTAGE,
            /**中毒触发时间间隔 todo */
            POISON_TICKTIME_PERCENTAGE,
            /**流血相关 */
            INCOMING_BLEED_DAMAGE_PERCENTAGE,
            OUTGOING_BLEED_DAMAGE_PERCENTAGE,
            /**触电伤害 */
            INCOMING_SHOCK_DAMAGE_PERCENTAGE,
            INCOMING_SHOCK_COUNT_PERCENTAGE,
            OUTGOING_SHOCK_COUNT_PERCENTAGE,
            /**基础物理护甲 */
            PHYSICAL_ARMOR_BASE,
            IGNORE_PHYSICAL_ARMOR_PERCENTAGE,
            IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE,
            /**魔法护甲 */
            MAGICAL_ARMOR_BASE,
            MAGICAL_ARMOR_BONUS,
            MAGICAL_ARMOR_BASE_PERCENTAGE,
            MAGICAL_ARMOR_PERCENTAGE,
            IGNORE_MAGICAL_ARMOR,
            IGNORE_MAGICAL_ARMOR_PERCENTAGE,
            IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE,
            /**todo */
            OUTGOING_DAMAGE_PERCENTAGE,
            /**todo */
            OUTGOING_PURE_DAMAGE_PERCENTAGE,
            /**todo */
            OUTGOING_MAGICAL_DAMAGE_CONSTANT,
            /** */
            OUTGOING_DAMAGE_PERCENTAGE_SPECIAL,
            /**输出物理伤害 todo*/
            OUTGOING_PHYSICAL_DAMAGE_PERCENTAGE,
            /**受到魔法伤害 */
            INCOMING_MAGICAL_DAMAGE_PERCENTAGE,
            /**纯粹伤害加深 */
            INCOMING_PURE_DAMAGE_PERCENTAGE,
            /**todo */
            OUTGOING_PURE_DAMAGE_CONSTANT,
            /**受到技能伤害增加 */
            INCOMING_SPELL_DAMAGE_PERCENTAGE,
            /**持续性伤害加深 */
            INCOMING_DOT_DAMAGE_PERCENTAGE,
            /**todo */
            INCOMING_SHOCK_DAMAGE_PERCENTAG,
            /**todo */
            INCOMING_CRITICALSTRIKE_PERCENT,
            /**todo */
            OUTGOING_MAGICAL_DAMAGE_PERCENTAGE,
            /**TODO */
            OUTGOING_PHYSICAL_DAMAGE_CONSTANT,
            /**攻击暴击概率 */
            CRITICALSTRIKE_CHANCE,
            /**攻击暴击伤害 */
            CRITICALSTRIKE_DAMAGE,
            /**todo */
            CRITICALSTRIKE,
            /**todo */
            SPELL_CRITICALSTRIKE,
            /**技能暴击概率 */
            SPELL_CRITICALSTRIKE_CHANCE,
            /**技能暴击伤害 */
            SPELL_CRITICALSTRIKE_DAMAGE,
            /**额外技能伤害 */
            SPELL_AMPLIFY_BASE,
            SPELL_AMPLIFY_BONUS,
            SPELL_AMPLIFY_BONUS_UNIQUE,
            /**TODO */
            STATS_NO_ALL_ARMOR,
            /**额外生命值
             * hero no use
             */
            HP_BONUS,
            /**额外生命百分比 hero no use */
            HP_BONUS_PERCENTAGE,
            /**最终生命百分比 hero no use */
            HP_PERCENTAGE,
            HP_PERCENT_ENEMY,
            /**TODO */
            MANA_PERCENTAGE,
            /**幻象额外时间 */
            SUMMON_DURATION_BONUS,
            /**攻速上限额外值 */
            MAX_ATTACKSPEED_BONUS,
            /**力量百分比 todo */
            STATS_STRENGTH_PERCENTAGE,
            /**基础力量百分比 todo */
            STATS_STRENGTH_BASE_PERCENTAGE,
            /**敏捷百分比 todo */
            STATS_AGILITY_PERCENTAGE,
            /**todo */
            STATS_INTELLECT_PERCENTAGE,
            /**TODO */
            STATUS_RESISTANCE_FORCE,
            STATS_STRENGTH_BASE,
            STATS_AGILITY_BASE,
            STATS_INTELLECT_BASE,
            /**主属性 todo */
            STATS_PRIMARY_BONUS,
            /**主属性基础 todo */
            STATS_PRIMARY_BASE,
            /**全属性 */
            STATS_ALL_BONUS,
            /**全属性百分比 */
            STATS_ALL_PERCENTAGE,
            /**todo */
            TARGET_CRITICALSTRIKE,
            //#endregion

        }


        /**
         * 属性枚举函数
         */
        export enum Enum_MODIFIER_PROPERTY_FUNC {
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

            modifierfunction.MODIFIER_PROPERTY_PREATTACK_TARGET_CRITICALSTRIKE,

            modifierfunction.MODIFIER_PROPERTY_TOTALDAMAGEOUTGOING_PERCENTAGE,

            modifierfunction.MODIFIER_PROPERTY_DAMAGEOUTGOING_PERCENTAGE,

            modifierfunction.MODIFIER_PROPERTY_INCOMING_DAMAGE_PERCENTAGE,

            modifierfunction.MODIFIER_PROPERTY_INCOMING_SPELL_DAMAGE_CONSTANT,
        ]);
        /**唯一值属性，计算式不累加，求最大值 */
        export const UNIQUE_PROPERTY = [
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_UNIQUE_2,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BONUS_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.BONUS_NIGHT_VISION_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MANA_REGEN_CONSTANT_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS_UNIQUE_ACTIVE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.HEALTH_REGEN_PERCENTAGE_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT_UNIQUE_2,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_RESISTANCE_DECREPIFY_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.BASEDAMAGEOUTGOING_PERCENTAGE_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_MAGICAL_ARMOR_PERCENTAGE_UNIQUE,
            GameEnum.Property.Enum_MODIFIER_PROPERTY.IGNORE_PHYSICAL_ARMOR_PERCENTAGE_UNIQUE,
        ];

    }

    export namespace Unit {
        /**单位类型 */
        export enum UnitClass {
            /**饰品 */
            dota_item_wearable = 'dota_item_wearable',
            /**道具 */
            item_lua = 'item_lua',
            /**技能 */
            ability_lua = 'ability_lua',
            /**生物 */
            npc_dota_creature = 'npc_dota_creature',
            /**防御塔 */
            npc_dota_tower = 'npc_dota_tower',
            /**出生点 */
            info_player_start_goodguys = 'info_player_start_goodguys',
        }

        export enum UnitLabels {
            /**NPC */
            npc = 'npc',
            /**采集物 */
            collect = 'collect',
            /**怪物 */
            monster = 'monster',
            /**红方传送点 */
            redtp = 'redtp',
            /**红方传送点 */
            bluetp = 'bluetp',
        }
        /**单位名称 */
        export enum UnitNames {
            //#region dota
            dota_hero_antimage = "dota_hero_antimage",
            dota_hero_axe = "dota_hero_axe",
            dota_hero_bane = "dota_hero_bane",
            dota_hero_bloodseeker = "dota_hero_bloodseeker",
            dota_hero_crystal_maiden = "dota_hero_crystal_maiden",
            dota_hero_drow_ranger = "dota_hero_drow_ranger",
            dota_hero_earthshaker = "dota_hero_earthshaker",
            dota_hero_juggernaut = "dota_hero_juggernaut",
            dota_hero_mirana = "dota_hero_mirana",
            dota_hero_nevermore = "dota_hero_nevermore",
            dota_hero_morphling = "dota_hero_morphling",
            dota_hero_phantom_lancer = "dota_hero_phantom_lancer",
            dota_hero_puck = "dota_hero_puck",
            dota_hero_pudge = "dota_hero_pudge",
            dota_hero_razor = "dota_hero_razor",
            dota_hero_sand_king = "dota_hero_sand_king",
            dota_hero_storm_spirit = "dota_hero_storm_spirit",
            dota_hero_sven = "dota_hero_sven",
            dota_hero_tiny = "dota_hero_tiny",
            dota_hero_vengefulspirit = "dota_hero_vengefulspirit",
            dota_hero_windrunner = "dota_hero_windrunner",
            dota_hero_zuus = "dota_hero_zuus",
            dota_hero_kunkka = "dota_hero_kunkka",
            dota_hero_lina = "dota_hero_lina",
            dota_hero_lich = "dota_hero_lich",
            dota_hero_lion = "dota_hero_lion",
            dota_hero_shadow_shaman = "dota_hero_shadow_shaman",
            dota_hero_slardar = "dota_hero_slardar",
            dota_hero_tidehunter = "dota_hero_tidehunter",
            dota_hero_witch_doctor = "dota_hero_witch_doctor",
            dota_hero_riki = "dota_hero_riki",
            dota_hero_enigma = "dota_hero_enigma",
            dota_hero_tinker = "dota_hero_tinker",
            dota_hero_sniper = "dota_hero_sniper",
            dota_hero_necrolyte = "dota_hero_necrolyte",
            dota_hero_warlock = "dota_hero_warlock",
            dota_hero_beastmaster = "dota_hero_beastmaster",
            dota_hero_queenofpain = "dota_hero_queenofpain",
            dota_hero_venomancer = "dota_hero_venomancer",
            dota_hero_faceless_void = "dota_hero_faceless_void",
            dota_hero_skeleton_king = "dota_hero_skeleton_king",
            dota_hero_death_prophet = "dota_hero_death_prophet",
            dota_hero_phantom_assassin = "dota_hero_phantom_assassin",
            dota_hero_pugna = "dota_hero_pugna",
            dota_hero_templar_assassin = "dota_hero_templar_assassin",
            dota_hero_viper = "dota_hero_viper",
            dota_hero_luna = "dota_hero_luna",
            dota_hero_dragon_knight = "dota_hero_dragon_knight",
            dota_hero_dazzle = "dota_hero_dazzle",
            dota_hero_rattletrap = "dota_hero_rattletrap",
            dota_hero_leshrac = "dota_hero_leshrac",
            dota_hero_furion = "dota_hero_furion",
            dota_hero_life_stealer = "dota_hero_life_stealer",
            dota_hero_dark_seer = "dota_hero_dark_seer",
            dota_hero_clinkz = "dota_hero_clinkz",
            dota_hero_omniknight = "dota_hero_omniknight",
            dota_hero_enchantress = "dota_hero_enchantress",
            dota_hero_huskar = "dota_hero_huskar",
            dota_hero_night_stalker = "dota_hero_night_stalker",
            dota_hero_broodmother = "dota_hero_broodmother",
            dota_hero_bounty_hunter = "dota_hero_bounty_hunter",
            dota_hero_weaver = "dota_hero_weaver",
            dota_hero_jakiro = "dota_hero_jakiro",
            dota_hero_batrider = "dota_hero_batrider",
            dota_hero_chen = "dota_hero_chen",
            dota_hero_spectre = "dota_hero_spectre",
            dota_hero_doom_bringer = "dota_hero_doom_bringer",
            dota_hero_ancient_apparition = "dota_hero_ancient_apparition",
            dota_hero_ursa = "dota_hero_ursa",
            dota_hero_spirit_breaker = "dota_hero_spirit_breaker",
            dota_hero_gyrocopter = "dota_hero_gyrocopter",
            dota_hero_alchemist = "dota_hero_alchemist",
            dota_hero_invoker = "dota_hero_invoker",
            dota_hero_silencer = "dota_hero_silencer",
            dota_hero_obsidian_destroyer = "dota_hero_obsidian_destroyer",
            dota_hero_lycan = "dota_hero_lycan",
            dota_hero_brewmaster = "dota_hero_brewmaster",
            dota_hero_shadow_demon = "dota_hero_shadow_demon",
            dota_hero_lone_druid = "dota_hero_lone_druid",
            dota_hero_chaos_knight = "dota_hero_chaos_knight",
            dota_hero_meepo = "dota_hero_meepo",
            dota_hero_treant = "dota_hero_treant",
            dota_hero_ogre_magi = "dota_hero_ogre_magi",
            dota_hero_undying = "dota_hero_undying",
            dota_hero_rubick = "dota_hero_rubick",
            dota_hero_disruptor = "dota_hero_disruptor",
            dota_hero_nyx_assassin = "dota_hero_nyx_assassin",
            dota_hero_naga_siren = "dota_hero_naga_siren",
            dota_hero_keeper_of_the_light = "dota_hero_keeper_of_the_light",
            dota_hero_wisp = "dota_hero_wisp",
            dota_hero_visage = "dota_hero_visage",
            dota_hero_slark = "dota_hero_slark",
            dota_hero_medusa = "dota_hero_medusa",
            dota_hero_troll_warlord = "dota_hero_troll_warlord",
            dota_hero_centaur = "dota_hero_centaur",
            dota_hero_magnataur = "dota_hero_magnataur",
            dota_hero_shredder = "dota_hero_shredder",
            dota_hero_bristleback = "dota_hero_bristleback",
            dota_hero_tusk = "dota_hero_tusk",
            dota_hero_skywrath_mage = "dota_hero_skywrath_mage",
            dota_hero_abaddon = "dota_hero_abaddon",
            dota_hero_elder_titan = "dota_hero_elder_titan",
            dota_hero_legion_commander = "dota_hero_legion_commander",
            dota_hero_ember_spirit = "dota_hero_ember_spirit",
            dota_hero_earth_spirit = "dota_hero_earth_spirit",
            dota_hero_terrorblade = "dota_hero_terrorblade",
            dota_hero_phoenix = "dota_hero_phoenix",
            dota_hero_oracle = "dota_hero_oracle",
            dota_hero_techies = "dota_hero_techies",
            dota_hero_target_dummy = "dota_hero_target_dummy",
            dota_hero_winter_wyvern = "dota_hero_winter_wyvern",
            dota_hero_arc_warden = "dota_hero_arc_warden",
            dota_hero_abyssal_underlord = "dota_hero_abyssal_underlord",
            dota_hero_monkey_king = "dota_hero_monkey_king",
            dota_hero_pangolier = "dota_hero_pangolier",
            dota_hero_dark_willow = "dota_hero_dark_willow",
            dota_hero_grimstroke = "dota_hero_grimstroke",
            dota_hero_mars = "dota_hero_mars",
            dota_hero_void_spirit = "dota_hero_void_spirit",
            dota_hero_snapfire = "dota_hero_snapfire",
            dota_hero_hoodwink = "dota_hero_hoodwink",
            dota_hero_dawnbreaker = "dota_hero_dawnbreaker",
            //#endregion
            //#region 自定义
            /**全局计时器 */
            info_target = 'info_target',
            /**添加了BUFF的空实体 */
            npc_dota_thinker = 'npc_dota_thinker',
            npc_dota_companion = 'npc_dota_companion',
            /**传送点 */
            unit_red_tp = 'unit_red_tp',
            unit_blue_tp = 'unit_blue_tp',
            /**泉水 */
            dota_fountain = 'dota_fountain',
            npc_dota_nemestice_tower_dire = 'npc_dota_nemestice_tower_dire',
            npc_dota_nemestice_tower_radiant = 'npc_dota_nemestice_tower_radiant'
        }
    }

    /**
     * 事件枚举
     */
    export namespace Event {
        /**
         * 所有系统保留事件类型
         */
        export enum GameEvent {
            //#region
            /**
             * Send once a server starts.
             */
            ServerSpawnEvent = "server_spawn",
            /**
             * Server is about to be shut down.
             */
            ServerPreShutdownEvent = "server_pre_shutdown",
            /**
             * Server shut down.
             */
            ServerShutdownEvent = "server_shutdown",
            /**
             * A generic server message.
             */
            ServerMessageEvent = "server_message",
            /**
             * A server console var has changed.
             */
            ServerCvarEvent = "server_cvar",
            ServerAddbanEvent = "server_addban",
            ServerRemovebanEvent = "server_removeban",
            PlayerActivateEvent = "player_activate",
            /**
             * Player has sent final message in the connection sequence.
             */
            PlayerConnectFullEvent = "player_connect_full",
            PlayerSayEvent = "player_say",
            PlayerFullUpdateEvent = "player_full_update",
            /**
             * A new client connected.
             */
            PlayerConnectEvent = "player_connect",
            /**
             * A client was disconnected.
             */
            PlayerDisconnectEvent = "player_disconnect",
            /**
             * A player changed his name.
             */
            PlayerInfoEvent = "player_info",
            /**
             * Player spawned in game.
             */
            PlayerSpawnEvent = "player_spawn",
            PlayerTeamEvent = "player_team",
            local_player_team = "local_player_team",
            PlayerChangenameEvent = "player_changename",
            /**
             * A player changed his class.
             */
            PlayerClassEvent = "player_class",
            /**
             * Players scores changed.
             */
            PlayerScoreEvent = "player_score",
            PlayerHurtEvent = "player_hurt",
            /**
             * Player shoot his weapon.
             */
            PlayerShootEvent = "player_shoot",
            /**
             * A public player chat.
             */
            PlayerChatEvent = "player_chat",
            /**
             * Emits a sound to everyone on a team.
             */
            TeamplayBroadcastAudioEvent = "teamplay_broadcast_audio",
            FinaleStartEvent = "finale_start",
            PlayerStatsUpdatedEvent = "player_stats_updated",
            /**
             * Fired when achievements/stats are downloaded from Steam or XBox Live.
             */
            user_data_downloaded = "user_data_downloaded",
            RagdollDissolvedEvent = "ragdoll_dissolved",
            /**
             * Info about team.
             */
            TeamInfoEvent = "team_info",
            /**
             * Team score changed.
             */
            TeamScoreEvent = "team_score",
            /**
             * A spectator/player is a cameraman.
             */
            HltvCameramanEvent = "hltv_cameraman",
            /**
             * Shot of a single entity.
             */
            HltvChaseEvent = "hltv_chase",
            /**
             * A camera ranking.
             */
            HltvRankCameraEvent = "hltv_rank_camera",
            /**
             * An entity ranking.
             */
            HltvRankEntityEvent = "hltv_rank_entity",
            /**
             * Show from fixed view.
             */
            HltvFixedEvent = "hltv_fixed",
            /**
             * A HLTV message send by moderators.
             */
            HltvMessageEvent = "hltv_message",
            /**
             * General HLTV status.
             */
            HltvStatusEvent = "hltv_status",
            HltvTitleEvent = "hltv_title",
            /**
             * A HLTV chat msg sent by spectators.
             */
            HltvChatEvent = "hltv_chat",
            HltvVersioninfoEvent = "hltv_versioninfo",
            DemoStartEvent = "demo_start",
            demo_stop = "demo_stop",
            DemoSkipEvent = "demo_skip",
            map_shutdown = "map_shutdown",
            map_transition = "map_transition",
            HostnameChangedEvent = "hostname_changed",
            DifficultyChangedEvent = "difficulty_changed",
            /**
             * A message send by game logic to everyone.
             */
            GameMessageEvent = "game_message",
            /**
             * Send when new map is completely loaded.
             */
            GameNewmapEvent = "game_newmap",
            RoundStartEvent = "round_start",
            RoundEndEvent = "round_end",
            round_start_pre_entity = "round_start_pre_entity",
            round_start_post_nav = "round_start_post_nav",
            round_freeze_end = "round_freeze_end",
            /**
             * Round restart.
             */
            TeamplayRoundStartEvent = "teamplay_round_start",
            /**
             * A game event, name may be 32 charaters long.
             */
            PlayerDeathEvent = "player_death",
            PlayerFootstepEvent = "player_footstep",
            PlayerHintmessageEvent = "player_hintmessage",
            BreakBreakableEvent = "break_breakable",
            BreakPropEvent = "break_prop",
            EntityKilledEvent = "entity_killed",
            DoorOpenEvent = "door_open",
            DoorCloseEvent = "door_close",
            DoorUnlockedEvent = "door_unlocked",
            VoteStartedEvent = "vote_started",
            VoteFailedEvent = "vote_failed",
            VotePassedEvent = "vote_passed",
            VoteChangedEvent = "vote_changed",
            VoteCastYesEvent = "vote_cast_yes",
            VoteCastNoEvent = "vote_cast_no",
            AchievementEventEvent = "achievement_event",
            AchievementEarnedEvent = "achievement_earned",
            achievement_write_failed = "achievement_write_failed",
            BonusUpdatedEvent = "bonus_updated",
            spec_target_updated = "spec_target_updated",
            EntityVisibleEvent = "entity_visible",
            /**
             * The player pressed use but a use entity wasn't found.
             */
            PlayerUseMissEvent = "player_use_miss",
            gameinstructor_draw = "gameinstructor_draw",
            gameinstructor_nodraw = "gameinstructor_nodraw",
            FlareIgniteNpcEvent = "flare_ignite_npc",
            helicopter_grenade_punt_miss = "helicopter_grenade_punt_miss",
            PhysgunPickupEvent = "physgun_pickup",
            InventoryUpdatedEvent = "inventory_updated",
            cart_updated = "cart_updated",
            store_pricesheet_updated = "store_pricesheet_updated",
            item_schema_initialized = "item_schema_initialized",
            drop_rate_modified = "drop_rate_modified",
            event_ticket_modified = "event_ticket_modified",
            gc_connected = "gc_connected",
            InstructorStartLessonEvent = "instructor_start_lesson",
            InstructorCloseLessonEvent = "instructor_close_lesson",
            InstructorServerHintCreateEvent = "instructor_server_hint_create",
            InstructorServerHintStopEvent = "instructor_server_hint_stop",
            SetInstructorGroupEnabledEvent = "set_instructor_group_enabled",
            ClientsideLessonClosedEvent = "clientside_lesson_closed",
            dynamic_shadow_light_changed = "dynamic_shadow_light_changed",
            /**
             * Shot of a single entity.
             */
            DotaChaseHeroEvent = "dota_chase_hero",
            DotaCombatlogEvent = "dota_combatlog",
            DotaGameStateChangeEvent = "dota_game_state_change",
            HeroSelectedEvent = "hero_selected",
            DotaPlayerPickHeroEvent = "dota_player_pick_hero",
            ModifierEventEvent = "modifier_event",
            DotaPlayerKillEvent = "dota_player_kill",
            DotaPlayerDenyEvent = "dota_player_deny",
            DotaBarracksKillEvent = "dota_barracks_kill",
            DotaTowerKillEvent = "dota_tower_kill",
            DotaEffigyKillEvent = "dota_effigy_kill",
            DotaRoshanKillEvent = "dota_roshan_kill",
            DotaCourierLostEvent = "dota_courier_lost",
            DotaCourierRespawnedEvent = "dota_courier_respawned",
            DotaGlyphUsedEvent = "dota_glyph_used",
            DotaSuperCreepsEvent = "dota_super_creeps",
            DotaItemPurchaseEvent = "dota_item_purchase",
            DotaItemGiftedEvent = "dota_item_gifted",
            DotaItemPlacedInNeutralStashEvent = "dota_item_placed_in_neutral_stash",
            DotaRunePickupEvent = "dota_rune_pickup",
            DotaWardKilledEvent = "dota_ward_killed",
            DotaRuneSpottedEvent = "dota_rune_spotted",
            DotaItemSpottedEvent = "dota_item_spotted",
            DotaNoBattlePointsEvent = "dota_no_battle_points",
            DotaChatInformationalEvent = "dota_chat_informational",
            DotaActionItemEvent = "dota_action_item",
            DotaChatBanNotificationEvent = "dota_chat_ban_notification",
            DotaChatEventEvent = "dota_chat_event",
            DotaChatTimedRewardEvent = "dota_chat_timed_reward",
            DotaPauseEventEvent = "dota_pause_event",
            DotaChatKillStreakEvent = "dota_chat_kill_streak",
            DotaChatFirstBloodEvent = "dota_chat_first_blood",
            DotaChatAssassinAnnounceEvent = "dota_chat_assassin_announce",
            DotaChatAssassinDeniedEvent = "dota_chat_assassin_denied",
            DotaChatAssassinSuccessEvent = "dota_chat_assassin_success",
            DotaPlayerUpdateHeroSelectionEvent = "dota_player_update_hero_selection",
            dota_player_update_selected_unit = "dota_player_update_selected_unit",
            dota_player_update_query_unit = "dota_player_update_query_unit",
            dota_player_update_killcam_unit = "dota_player_update_killcam_unit",
            DotaPlayerTakeTowerDamageEvent = "dota_player_take_tower_damage",
            DotaHudErrorMessageEvent = "dota_hud_error_message",
            dota_action_success = "dota_action_success",
            dota_starting_position_changed = "dota_starting_position_changed",
            DotaTeamNeutralStashItemsChangedEvent = "dota_team_neutral_stash_items_changed",
            DotaTeamNeutralStashItemsAcknowledgedChangedEvent = "dota_team_neutral_stash_items_acknowledged_changed",
            dota_money_changed = "dota_money_changed",
            dota_enemy_money_changed = "dota_enemy_money_changed",
            dota_portrait_unit_stats_changed = "dota_portrait_unit_stats_changed",
            DotaPortraitUnitModifiersChangedEvent = "dota_portrait_unit_modifiers_changed",
            dota_force_portrait_update = "dota_force_portrait_update",
            dota_inventory_changed = "dota_inventory_changed",
            dota_item_suggestions_changed = "dota_item_suggestions_changed",
            dota_estimated_match_duration_changed = "dota_estimated_match_duration_changed",
            dota_hero_ability_points_changed = "dota_hero_ability_points_changed",
            DotaItemPickedUpEvent = "dota_item_picked_up",
            DotaItemPhysicalDestroyedEvent = "dota_item_physical_destroyed",
            DotaNeutralItemSentToStashEvent = "dota_neutral_item_sent_to_stash",
            DotaInventoryItemChangedEvent = "dota_inventory_item_changed",
            DotaAbilityChangedEvent = "dota_ability_changed",
            DotaSpectatorTalentChangedEvent = "dota_spectator_talent_changed",
            dota_portrait_ability_layout_changed = "dota_portrait_ability_layout_changed",
            DotaInventoryItemAddedEvent = "dota_inventory_item_added",
            dota_inventory_changed_query_unit = "dota_inventory_changed_query_unit",
            DotaLinkClickedEvent = "dota_link_clicked",
            DotaSetQuickBuyEvent = "dota_set_quick_buy",
            DotaQuickBuyChangedEvent = "dota_quick_buy_changed",
            DotaPlayerShopChangedEvent = "dota_player_shop_changed",
            DotaHeroEnteredShopEvent = "dota_hero_entered_shop",
            DotaPlayerShowKillcamEvent = "dota_player_show_killcam",
            DotaPlayerShowMinikillcamEvent = "dota_player_show_minikillcam",
            gc_user_session_created = "gc_user_session_created",
            team_data_updated = "team_data_updated",
            guild_data_updated = "guild_data_updated",
            guild_open_parties_updated = "guild_open_parties_updated",
            fantasy_updated = "fantasy_updated",
            fantasy_league_changed = "fantasy_league_changed",
            fantasy_score_info_changed = "fantasy_score_info_changed",
            league_admin_info_updated = "league_admin_info_updated",
            league_series_info_updated = "league_series_info_updated",
            player_info_updated = "player_info_updated",
            PlayerInfoIndividualUpdatedEvent = "player_info_individual_updated",
            game_rules_state_change = "game_rules_state_change",
            MatchHistoryUpdatedEvent = "match_history_updated",
            MatchDetailsUpdatedEvent = "match_details_updated",
            TeamDetailsUpdatedEvent = "team_details_updated",
            live_games_updated = "live_games_updated",
            RecentMatchesUpdatedEvent = "recent_matches_updated",
            news_updated = "news_updated",
            PersonaUpdatedEvent = "persona_updated",
            tournament_state_updated = "tournament_state_updated",
            party_updated = "party_updated",
            lobby_updated = "lobby_updated",
            dashboard_caches_cleared = "dashboard_caches_cleared",
            LastHitEvent = "last_hit",
            PlayerCompletedGameEvent = "player_completed_game",
            PlayerReconnectedEvent = "player_reconnected",
            NommedTreeEvent = "nommed_tree",
            DotaRuneActivatedServerEvent = "dota_rune_activated_server",
            DotaPlayerGainedLevelEvent = "dota_player_gained_level",
            DotaPlayerLearnedAbilityEvent = "dota_player_learned_ability",
            DotaPlayerUsedAbilityEvent = "dota_player_used_ability",
            DotaNonPlayerUsedAbilityEvent = "dota_non_player_used_ability",
            DotaPlayerBeginCastEvent = "dota_player_begin_cast",
            DotaNonPlayerBeginCastEvent = "dota_non_player_begin_cast",
            DotaAbilityChannelFinishedEvent = "dota_ability_channel_finished",
            DotaHoldoutReviveCompleteEvent = "dota_holdout_revive_complete",
            DotaHoldoutReviveEliminatedEvent = "dota_holdout_revive_eliminated",
            DotaPlayerKilledEvent = "dota_player_killed",
            DotaAssistEarnedEvent = "dota_assist_earned",
            bindpanel_open = "bindpanel_open",
            bindpanel_close = "bindpanel_close",
            keybind_changed = "keybind_changed",
            dota_item_drag_begin = "dota_item_drag_begin",
            dota_item_drag_end = "dota_item_drag_end",
            dota_shop_item_drag_begin = "dota_shop_item_drag_begin",
            dota_shop_item_drag_end = "dota_shop_item_drag_end",
            DotaItemPurchasedEvent = "dota_item_purchased",
            DotaItemCombinedEvent = "dota_item_combined",
            DotaItemUsedEvent = "dota_item_used",
            DotaItemAutoPurchaseEvent = "dota_item_auto_purchase",
            DotaUnitEventEvent = "dota_unit_event",
            DotaQuestStartedEvent = "dota_quest_started",
            DotaQuestCompletedEvent = "dota_quest_completed",
            gameui_activated = "gameui_activated",
            gameui_hidden = "gameui_hidden",
            PlayerFullyjoinedEvent = "player_fullyjoined",
            DotaSpectateHeroEvent = "dota_spectate_hero",
            DotaMatchDoneEvent = "dota_match_done",
            dota_match_done_client = "dota_match_done_client",
            JoinedChatChannelEvent = "joined_chat_channel",
            LeftChatChannelEvent = "left_chat_channel",
            gc_chat_channel_list_updated = "gc_chat_channel_list_updated",
            FileDownloadedEvent = "file_downloaded",
            PlayerReportCountsUpdatedEvent = "player_report_counts_updated",
            ScaleformFileDownloadCompleteEvent = "scaleform_file_download_complete",
            ItemPurchasedEvent = "item_purchased",
            gc_mismatched_version = "gc_mismatched_version",
            DotaWorkshopFileselectedEvent = "dota_workshop_fileselected",
            dota_workshop_filecanceled = "dota_workshop_filecanceled",
            rich_presence_updated = "rich_presence_updated",
            live_leagues_updated = "live_leagues_updated",
            DotaHeroRandomEvent = "dota_hero_random",
            DotaRiverPaintedEvent = "dota_river_painted",
            DotaScanUsedEvent = "dota_scan_used",
            DotaScanFoundEnemyEvent = "dota_scan_found_enemy",
            DotaRdChatTurnEvent = "dota_rd_chat_turn",
            DotaAdNominatedBanEvent = "dota_ad_nominated_ban",
            DotaAdBanEvent = "dota_ad_ban",
            DotaAdBanCountEvent = "dota_ad_ban_count",
            DotaAdHeroCollisionEvent = "dota_ad_hero_collision",
            dota_favorite_heroes_updated = "dota_favorite_heroes_updated",
            profile_opened = "profile_opened",
            profile_closed = "profile_closed",
            item_preview_closed = "item_preview_closed",
            DashboardSwitchedSectionEvent = "dashboard_switched_section",
            DotaTournamentItemEventEvent = "dota_tournament_item_event",
            DotaHeroSwapEvent = "dota_hero_swap",
            dota_reset_suggested_items = "dota_reset_suggested_items",
            halloween_high_score_received = "halloween_high_score_received",
            HalloweenPhaseEndEvent = "halloween_phase_end",
            halloween_high_score_request_failed = "halloween_high_score_request_failed",
            DotaHudSkinChangedEvent = "dota_hud_skin_changed",
            DotaInventoryPlayerGotItemEvent = "dota_inventory_player_got_item",
            player_is_experienced = "player_is_experienced",
            player_is_notexperienced = "player_is_notexperienced",
            dota_tutorial_lesson_start = "dota_tutorial_lesson_start",
            dota_tutorial_task_advance = "dota_tutorial_task_advance",
            DotaTutorialShopToggledEvent = "dota_tutorial_shop_toggled",
            map_location_updated = "map_location_updated",
            richpresence_custom_updated = "richpresence_custom_updated",
            game_end_visible = "game_end_visible",
            enable_china_logomark = "enable_china_logomark",
            HighlightHudElementEvent = "highlight_hud_element",
            hide_highlight_hud_element = "hide_highlight_hud_element",
            intro_video_finished = "intro_video_finished",
            matchmaking_status_visibility_changed = "matchmaking_status_visibility_changed",
            practice_lobby_visibility_changed = "practice_lobby_visibility_changed",
            DotaCourierTransferItemEvent = "dota_courier_transfer_item",
            full_ui_unlocked = "full_ui_unlocked",
            ClientDisconnectEvent = "client_disconnect",
            HeroSelectorPreviewSetEvent = "hero_selector_preview_set",
            AntiaddictionToastEvent = "antiaddiction_toast",
            hero_picker_shown = "hero_picker_shown",
            hero_picker_hidden = "hero_picker_hidden",
            dota_local_quickbuy_changed = "dota_local_quickbuy_changed",
            ShowCenterMessageEvent = "show_center_message",
            HudFlipChangedEvent = "hud_flip_changed",
            frosty_points_updated = "frosty_points_updated",
            DefeatedEvent = "defeated",
            reset_defeated = "reset_defeated",
            booster_state_updated = "booster_state_updated",
            CustomGameDifficultyEvent = "custom_game_difficulty",
            TreeCutEvent = "tree_cut",
            UgcDetailsArrivedEvent = "ugc_details_arrived",
            UgcSubscribedEvent = "ugc_subscribed",
            UgcUnsubscribedEvent = "ugc_unsubscribed",
            UgcDownloadRequestedEvent = "ugc_download_requested",
            UgcInstalledEvent = "ugc_installed",
            PrizepoolReceivedEvent = "prizepool_received",
            MicrotransactionSuccessEvent = "microtransaction_success",
            DotaRubickAbilityStealEvent = "dota_rubick_ability_steal",
            community_cached_names_updated = "community_cached_names_updated",
            SpecItemPickupEvent = "spec_item_pickup",
            SpecAegisReclaimTimeEvent = "spec_aegis_reclaim_time",
            AccountTrophiesChangedEvent = "account_trophies_changed",
            AccountAllHeroChallengeChangedEvent = "account_all_hero_challenge_changed",
            TeamShowcaseUiUpdateEvent = "team_showcase_ui_update",
            dota_match_signout = "dota_match_signout",
            DotaIllusionsCreatedEvent = "dota_illusions_created",
            DotaYearBeastKilledEvent = "dota_year_beast_killed",
            DotaPlayerSpawnedEvent = "dota_player_spawned",
            DotaHeroUndoselectionEvent = "dota_hero_undoselection",
            dota_challenge_socache_updated = "dota_challenge_socache_updated",
            dota_player_team_changed = "dota_player_team_changed",
            party_invites_updated = "party_invites_updated",
            lobby_invites_updated = "lobby_invites_updated",
            custom_game_mode_list_updated = "custom_game_mode_list_updated",
            custom_game_lobby_list_updated = "custom_game_lobby_list_updated",
            friend_lobby_list_updated = "friend_lobby_list_updated",
            dota_team_player_list_changed = "dota_team_player_list_changed",
            dota_player_connection_state_changed = "dota_player_connection_state_changed",
            dota_player_details_changed = "dota_player_details_changed",
            PlayerProfileStatsUpdatedEvent = "player_profile_stats_updated",
            CustomGamePlayerCountUpdatedEvent = "custom_game_player_count_updated",
            CustomGameFriendsPlayedUpdatedEvent = "custom_game_friends_played_updated",
            custom_games_friends_play_updated = "custom_games_friends_play_updated",
            DotaPlayerUpdateAssignedHeroEvent = "dota_player_update_assigned_hero",
            dota_player_hero_selection_dirty = "dota_player_hero_selection_dirty",
            DotaNpcGoalReachedEvent = "dota_npc_goal_reached",
            DotaPlayerSelectedCustomTeamEvent = "dota_player_selected_custom_team",
            DotaCoinWagerEvent = "dota_coin_wager",
            DotaWagerTokenEvent = "dota_wager_token",
            DotaRankWagerEvent = "dota_rank_wager",
            DotaBountyEvent = "dota_bounty",
            DotaCandyEvent = "dota_candy",
            DotaAdRandomedEvent = "dota_ad_randomed",
            colorblind_mode_changed = "colorblind_mode_changed",
            DotaReportSubmittedEvent = "dota_report_submitted",
            client_reload_game_keyvalues = "client_reload_game_keyvalues",
            DotaHeroInventoryItemChangeEvent = "dota_hero_inventory_item_change",
            game_rules_shutdown = "game_rules_shutdown",
            AegisEventEvent = "aegis_event",
            DotaBuybackEvent = "dota_buyback",
            BoughtBackEvent = "bought_back",
            DotaShrineKillEvent = "dota_shrine_kill",
            ParticleSystemStartEvent = "particle_system_start",
            ParticleSystemStopEvent = "particle_system_stop",
            DotaCombatEventMessageEvent = "dota_combat_event_message",
            DotaItemSpawnedEvent = "dota_item_spawned",
            DotaPlayerReconnectedEvent = "dota_player_reconnected",
            DotaOnHeroFinishSpawnEvent = "dota_on_hero_finish_spawn",
            DotaCreatureGainedLevelEvent = "dota_creature_gained_level",
            DotaHeroTeleportToUnitEvent = "dota_hero_teleport_to_unit",
            DotaNeutralCreepCampClearedEvent = "dota_neutral_creep_camp_cleared",
            NpcSpawnedEvent = "npc_spawned",
            NpcReplacedEvent = "npc_replaced",
            EntityHurtEvent = "entity_hurt",
            /**
             * The specified channel contains new messages.
             */
            ChatNewMessageEvent = "chat_new_message",
            /**
             * The specified channel has had players leave or join.
             */
            ChatMembersChangedEvent = "chat_members_changed",
            DotaTeamKillCreditEvent = "dota_team_kill_credit",

        }

        /**自定义服务器事件 */
        export enum CustomServer {
            /**服务器完成任务 */
            onserver_finish_task = 'onserver_finish_task',
            /**请求产生协作任务 */
            onserver_create_team_task = 'onserver_create_team_task',
            /**服务器更新对局任务进度 */
            onserver_update_game_task_jindu = 'onserver_update_game_task_jindu',
        }
        /**JS 请求 LUA 的协议 */
        export enum CustomProtocol {
            /**推送错误信息 */
            push_error_message = 'push_error_message',
            push_update_minimap = 'push_update_minimap',
            push_update_minimap_nodraw = 'push_update_minimap_nodraw',
            req_DebugGameOver = 'req_DebugGameOver',
            req_DebugReload = 'req_DebugReload',
            req_DebugRestart = "req_DebugRestart",
            req_DebugClearAll = "req_DebugClearAll",
            req_KEY_DOWN = 'req_KEY_DOWN',
            req_KEY_UP = 'req_KEY_UP',
            /**道具位置改变 */
            req_ITEM_SLOT_CHANGE = 'req_ITEM_SLOT_CHANGE',
            /**摄像机环绕 */
            req_Camera_Yaw_Change = 'req_Camera_Yaw_Change',
            req_Mouse_Event = 'req_Mouse_Event',
            req_Mouse_Position = 'req_Mouse_Position',
            req_Update_Setting = 'req_Update_Setting',
            /**添加机器人 */
            req_addBot = 'req_addBot',
            /**获取自己身份信息 */
            req_get_self_shen_fen_info = 'req_get_self_shen_fen_info',
            /**获取所有知道的身份信息 */
            req_get_know_other_shen_fen_info = 'req_get_know_other_shen_fen_info',
            /**获取当前断线重连数据 */
            req_get_current_reconnect_data = 'req_get_current_reconnect_data',
            /**获取回合信息 */
            req_get_current_round_info = 'req_get_current_round_info',
            /**创建队伍 */
            req_send_to_make_team = 'req_send_to_make_team',
            req_send_to_make_team_finish = 'req_send_to_make_team_finish',
            /**提交发言顺序 */
            req_send_to_sure_chat_turn = 'req_send_to_sure_chat_turn',
            /**结束本轮发言 */
            req_end_current_player_chat = 'req_end_current_player_chat',
            /**投票組隊意见 */
            req_send_to_make_team_idea = 'req_send_to_make_team_idea',
            /**投票組隊结果 */
            req_send_to_make_team_idea_result = 'req_send_to_make_team_idea_result',
            /**投票任务意见 */
            req_send_to_finish_task_idea = 'req_send_to_finish_task_idea',
            /**投票任务结果 */
            req_send_to_finish_task_idea_result = 'req_send_to_finish_task_idea_result',
            /**投票任务结果 */
            req_send_to_sync_task_record = 'req_send_to_sync_task_record',
            /**刺杀界面 */
            req_send_to_goto_ci_sha = 'req_send_to_goto_ci_sha',
            /**游戏结果 */
            req_send_to_game_result = 'req_send_to_game_result',
            //#region 任务系统
            /**请求所有任务 */
            req_self_all_task = 'req_self_all_task',

            /**接到任务 */
            req_new_task = 'req_new_task',
            /**更新单个任务进度 */
            req_update_one_task = 'req_update_one_task',
            /**客户端请求完成任务 */
            req_finish_task_from_client = 'req_finish_task_from_client',
            /**请求任务奖励 */
            req_task_prize = 'req_task_prize',
            /**采集物采集 */
            req_collect_entity = 'req_collect_entity',
            //#endregion

        }
        /**错误信息 */
        export enum ErrorCode {
            /**相同塔限制 */
            dota_hud_error_has_same_tower = 'dota_hud_error_has_same_tower',
            /**人口限制 */
            dota_hud_error_population_limit = 'dota_hud_error_population_limit',

            dota_hud_error_only_hero_can_use = 'dota_hud_error_only_hero_can_use',
            dota_hud_error_cant_build_at_location = 'dota_hud_error_cant_build_at_location',
        }

    }

    /**玩家行为 */
    export namespace Debugger {

        export enum globalData {
            DOTA_GAMERULES_STATE_INIT = 'DOTA_GAMERULES_STATE_INIT',
            DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD = 'DOTA_GAMERULES_STATE_WAIT_FOR_PLAYERS_TO_LOAD',
            DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP = 'DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP',
        }
        export enum updateData {

        }

    }

    export namespace Dota2 {
        /**英雄名称 */
        export enum enum_HeroName {
            antimage = "npc_dota_hero_antimage",
            axe = "npc_dota_hero_axe",
            bane = "npc_dota_hero_bane",
            bloodseeker = "npc_dota_hero_bloodseeker",
            crystal_maiden = "npc_dota_hero_crystal_maiden",
            drow_ranger = "npc_dota_hero_drow_ranger",
            earthshaker = "npc_dota_hero_earthshaker",
            juggernaut = "npc_dota_hero_juggernaut",
            mirana = "npc_dota_hero_mirana",
            nevermore = "npc_dota_hero_nevermore",
            morphling = "npc_dota_hero_morphling",
            phantom_lancer = "npc_dota_hero_phantom_lancer",
            puck = "npc_dota_hero_puck",
            pudge = "npc_dota_hero_pudge",
            razor = "npc_dota_hero_razor",
            sand_king = "npc_dota_hero_sand_king",
            storm_spirit = "npc_dota_hero_storm_spirit",
            sven = "npc_dota_hero_sven",
            tiny = "npc_dota_hero_tiny",
            vengefulspirit = "npc_dota_hero_vengefulspirit",
            windrunner = "npc_dota_hero_windrunner",
            zuus = "npc_dota_hero_zuus",
            kunkka = "npc_dota_hero_kunkka",
            lina = "npc_dota_hero_lina",
            lich = "npc_dota_hero_lich",
            lion = "npc_dota_hero_lion",
            shadow_shaman = "npc_dota_hero_shadow_shaman",
            slardar = "npc_dota_hero_slardar",
            tidehunter = "npc_dota_hero_tidehunter",
            witch_doctor = "npc_dota_hero_witch_doctor",
            riki = "npc_dota_hero_riki",
            enigma = "npc_dota_hero_enigma",
            tinker = "npc_dota_hero_tinker",
            sniper = "npc_dota_hero_sniper",
            necrolyte = "npc_dota_hero_necrolyte",
            warlock = "npc_dota_hero_warlock",
            beastmaster = "npc_dota_hero_beastmaster",
            queenofpain = "npc_dota_hero_queenofpain",
            venomancer = "npc_dota_hero_venomancer",
            faceless_void = "npc_dota_hero_faceless_void",
            skeleton_king = "npc_dota_hero_skeleton_king",
            death_prophet = "npc_dota_hero_death_prophet",
            phantom_assassin = "npc_dota_hero_phantom_assassin",
            pugna = "npc_dota_hero_pugna",
            templar_assassin = "npc_dota_hero_templar_assassin",
            viper = "npc_dota_hero_viper",
            luna = "npc_dota_hero_luna",
            dragon_knight = "npc_dota_hero_dragon_knight",
            dazzle = "npc_dota_hero_dazzle",
            rattletrap = "npc_dota_hero_rattletrap",
            leshrac = "npc_dota_hero_leshrac",
            furion = "npc_dota_hero_furion",
            life_stealer = "npc_dota_hero_life_stealer",
            dark_seer = "npc_dota_hero_dark_seer",
            clinkz = "npc_dota_hero_clinkz",
            omniknight = "npc_dota_hero_omniknight",
            enchantress = "npc_dota_hero_enchantress",
            huskar = "npc_dota_hero_huskar",
            night_stalker = "npc_dota_hero_night_stalker",
            broodmother = "npc_dota_hero_broodmother",
            bounty_hunter = "npc_dota_hero_bounty_hunter",
            weaver = "npc_dota_hero_weaver",
            jakiro = "npc_dota_hero_jakiro",
            batrider = "npc_dota_hero_batrider",
            chen = "npc_dota_hero_chen",
            spectre = "npc_dota_hero_spectre",
            doom_bringer = "npc_dota_hero_doom_bringer",
            ancient_apparition = "npc_dota_hero_ancient_apparition",
            ursa = "npc_dota_hero_ursa",
            spirit_breaker = "npc_dota_hero_spirit_breaker",
            gyrocopter = "npc_dota_hero_gyrocopter",
            alchemist = "npc_dota_hero_alchemist",
            invoker = "npc_dota_hero_invoker",
            silencer = "npc_dota_hero_silencer",
            obsidian_destroyer = "npc_dota_hero_obsidian_destroyer",
            lycan = "npc_dota_hero_lycan",
            brewmaster = "npc_dota_hero_brewmaster",
            shadow_demon = "npc_dota_hero_shadow_demon",
            lone_druid = "npc_dota_hero_lone_druid",
            chaos_knight = "npc_dota_hero_chaos_knight",
            meepo = "npc_dota_hero_meepo",
            treant = "npc_dota_hero_treant",
            ogre_magi = "npc_dota_hero_ogre_magi",
            undying = "npc_dota_hero_undying",
            rubick = "npc_dota_hero_rubick",
            disruptor = "npc_dota_hero_disruptor",
            nyx_assassin = "npc_dota_hero_nyx_assassin",
            naga_siren = "npc_dota_hero_naga_siren",
            keeper_of_the_light = "npc_dota_hero_keeper_of_the_light",
            wisp = "npc_dota_hero_wisp",
            visage = "npc_dota_hero_visage",
            slark = "npc_dota_hero_slark",
            medusa = "npc_dota_hero_medusa",
            troll_warlord = "npc_dota_hero_troll_warlord",
            centaur = "npc_dota_hero_centaur",
            magnataur = "npc_dota_hero_magnataur",
            shredder = "npc_dota_hero_shredder",
            bristleback = "npc_dota_hero_bristleback",
            tusk = "npc_dota_hero_tusk",
            skywrath_mage = "npc_dota_hero_skywrath_mage",
            abaddon = "npc_dota_hero_abaddon",
            elder_titan = "npc_dota_hero_elder_titan",
            legion_commander = "npc_dota_hero_legion_commander",
            ember_spirit = "npc_dota_hero_ember_spirit",
            earth_spirit = "npc_dota_hero_earth_spirit",
            terrorblade = "npc_dota_hero_terrorblade",
            phoenix = "npc_dota_hero_phoenix",
            oracle = "npc_dota_hero_oracle",
            techies = "npc_dota_hero_techies",
            target_dummy = "npc_dota_hero_target_dummy",
            winter_wyvern = "npc_dota_hero_winter_wyvern",
            arc_warden = "npc_dota_hero_arc_warden",
            abyssal_underlord = "npc_dota_hero_abyssal_underlord",
            monkey_king = "npc_dota_hero_monkey_king",
            pangolier = "npc_dota_hero_pangolier",
            dark_willow = "npc_dota_hero_dark_willow",
            grimstroke = "npc_dota_hero_grimstroke",
            mars = "npc_dota_hero_mars",
            void_spirit = "npc_dota_hero_void_spirit",
            snapfire = "npc_dota_hero_snapfire",
            hoodwink = "npc_dota_hero_hoodwink",
            dawnbreaker = "npc_dota_hero_dawnbreaker",

        };
        /**英雄ID */
        export enum enum_HeroID {
            antimage = 1,
            axe = 2,
            bane = 3,
            bloodseeker = 4,
            crystal_maiden = 5,
            drow_ranger = 6,
            earthshaker = 7,
            juggernaut = 8,
            mirana = 9,
            nevermore = 11,
            morphling = 10,
            phantom_lancer = 12,
            puck = 13,
            pudge = 14,
            razor = 15,
            sand_king = 16,
            storm_spirit = 17,
            sven = 18,
            tiny = 19,
            vengefulspirit = 20,
            windrunner = 21,
            zuus = 22,
            kunkka = 23,
            lina = 25,
            lich = 31,
            lion = 26,
            shadow_shaman = 27,
            slardar = 28,
            tidehunter = 29,
            witch_doctor = 30,
            riki = 32,
            enigma = 33,
            tinker = 34,
            sniper = 35,
            necrolyte = 36,
            warlock = 37,
            beastmaster = 38,
            queenofpain = 39,
            venomancer = 40,
            faceless_void = 41,
            skeleton_king = 42,
            death_prophet = 43,
            phantom_assassin = 44,
            pugna = 45,
            templar_assassin = 46,
            viper = 47,
            luna = 48,
            dragon_knight = 49,
            dazzle = 50,
            rattletrap = 51,
            leshrac = 52,
            furion = 53,
            life_stealer = 54,
            dark_seer = 55,
            clinkz = 56,
            omniknight = 57,
            enchantress = 58,
            huskar = 59,
            night_stalker = 60,
            broodmother = 61,
            bounty_hunter = 62,
            weaver = 63,
            jakiro = 64,
            batrider = 65,
            chen = 66,
            spectre = 67,
            doom_bringer = 69,
            ancient_apparition = 68,
            ursa = 70,
            spirit_breaker = 71,
            gyrocopter = 72,
            alchemist = 73,
            invoker = 74,
            silencer = 75,
            obsidian_destroyer = 76,
            lycan = 77,
            brewmaster = 78,
            shadow_demon = 79,
            lone_druid = 80,
            chaos_knight = 81,
            meepo = 82,
            treant = 83,
            ogre_magi = 84,
            undying = 85,
            rubick = 86,
            disruptor = 87,
            nyx_assassin = 88,
            naga_siren = 89,
            keeper_of_the_light = 90,
            wisp = 91,
            visage = 92,
            slark = 93,
            medusa = 94,
            troll_warlord = 95,
            centaur = 96,
            magnataur = 97,
            shredder = 98,
            bristleback = 99,
            tusk = 100,
            skywrath_mage = 101,
            abaddon = 102,
            elder_titan = 103,
            legion_commander = 104,
            ember_spirit = 106,
            earth_spirit = 107,
            terrorblade = 109,
            phoenix = 110,
            oracle = 111,
            techies = 105,
            target_dummy = 127,
            winter_wyvern = 112,
            arc_warden = 113,
            abyssal_underlord = 108,
            monkey_king = 114,
            pangolier = 120,
            dark_willow = 119,
            grimstroke = 121,
            mars = 129,
            void_spirit = 126,
            snapfire = 128,
            hoodwink = 123,
            dawnbreaker = 135,

        };
        /**dota 自带buff */
        export enum modifierName {
            /**无敌BUFF */
            modifier_invulnerable = 'modifier_invulnerable',
            /**泉水回血 */
            modifier_fountain_aura = 'modifier_fountain_aura',
            /**泉水真实视野 */
            modifier_fountain_truesight_aura = 'modifier_fountain_truesight_aura',
            /**泉水被动 */
            modifier_fountain_passive = 'modifier_fountain_passive',
            /**塔真实视野 */
            modifier_tower_truesight_aura = 'modifier_tower_truesight_aura',
            /**塔增加护甲BUFF */
            modifier_tower_aura = 'modifier_tower_aura',
        }

    }
}
