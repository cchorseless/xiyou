import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_medusa_mystic_snake = { "ID": "5505", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Medusa.MysticSnake.Cast", "HasScepterUpgrade": "1", "AbilityCastRange": "700", "AbilityCastPoint": "0.2", "AbilityCooldown": "10", "AbilityManaCost": "140 150 160 170", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "stone_form_scepter_increment": "0.2", "RequiresScepter": "1" }, "11": { "var_type": "FIELD_INTEGER", "movement_slow": "30" }, "12": { "var_type": "FIELD_INTEGER", "turn_slow": "50" }, "13": { "var_type": "FIELD_FLOAT", "slow_duration": "3" }, "01": { "var_type": "FIELD_INTEGER", "radius": "475 475 475 475" }, "02": { "var_type": "FIELD_INTEGER", "snake_jumps": "3 4 5 6" }, "03": { "var_type": "FIELD_FLOAT", "jump_delay": "0.25 0.25 0.25 0.25" }, "04": { "var_type": "FIELD_INTEGER", "snake_damage": "80 120 160 200" }, "05": { "var_type": "FIELD_INTEGER", "snake_mana_steal": "11 14 17 20", "LinkedSpecialBonus": "special_bonus_unique_medusa_3" }, "06": { "var_type": "FIELD_INTEGER", "snake_scale": "35" }, "07": { "var_type": "FIELD_INTEGER", "initial_speed": "800" }, "08": { "var_type": "FIELD_INTEGER", "return_speed": "800" }, "09": { "var_type": "FIELD_FLOAT", "stone_form_scepter_base": "1.5", "RequiresScepter": "1" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_medusa_mystic_snake extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "medusa_mystic_snake";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_medusa_mystic_snake = Data_medusa_mystic_snake;
    Init() {
        this.SetDefaultSpecialValue("snake_mana_steal_agility", 1);
        this.SetDefaultSpecialValue("scepter_chance", 5);
        this.SetDefaultSpecialValue("radius", 475);
        this.SetDefaultSpecialValue("snake_jumps", [4, 5, 6, 7, 8, 9]);
        this.SetDefaultSpecialValue("snake_damage", [100, 200, 400, 800, 1600, 3200]);
        this.SetDefaultSpecialValue("snake_damage_scale", 20);
        this.SetDefaultSpecialValue("snake_agility_gain", 25);
        this.SetDefaultSpecialValue("snake_agility_duration", 12);
        this.SetDefaultSpecialValue("initial_speed", 800);
        this.SetDefaultSpecialValue("return_speed", 1500);
        this.SetDefaultSpecialValue("snake_mana_steal", 20);

    }


    GetCooldown(iLevel: number) {
        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_medusa_custom_7"
        return super.GetCooldown(iLevel) - hCaster.GetTalentValue(sTalentName)
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget()
        hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Medusa.MysticSnake.Cast", hCaster))
        this.FireSnake(hTarget)
    }
    FireSnake(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let radius = this.GetSpecialValueFor("radius")
        let snake_jumps = this.GetSpecialValueFor("snake_jumps")
        let snake_damage = this.GetSpecialValueFor("snake_damage")
        let snake_mana_steal = this.GetSpecialValueFor("snake_mana_steal")
        let snake_mana_steal_agility = this.GetSpecialValueFor("snake_mana_steal_agility")
        let snake_damage_scale = this.GetSpecialValueFor("snake_damage_scale")
        let initial_speed = this.GetSpecialValueFor("initial_speed")

        let tHashtable, index = HashTableHelper.CreateHashtable({
            radius: radius,
            damage: snake_damage,
            snake_mana_steal: snake_mana_steal,
            snake_mana_steal_agility: snake_mana_steal_agility,
            damage_scale: snake_damage_scale,
            max_count: snake_jumps,
            count: 0,
            mana_sum: 0,
            targets: {}
        })

        let tInfo = {
            Ability: this,
            EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile_initial.vpcf", hCaster),
            iSourceAttachment: hCaster.ScriptLookupAttachment("attach_attack2"),
            iMoveSpeed: initial_speed,
            Target: hTarget,
            Source: hCaster,
            ExtraData: {
                hashtable_index: index
            }
        }
        ProjectileManager.CreateTrackingProjectile(tInfo)

    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        let tHashtable = HashTableHelper.GetHashtableByIndex(ExtraData.hashtable_index || -1)

        if (hTarget != null) {
            if (hTarget.TriggerSpellAbsorb(this)) {
                return
            }
            if (hTarget == hCaster) {
                let snake_agility_duration = this.GetSpecialValueFor("snake_agility_duration")

                if (tHashtable.count > 0) {
                    if (hCaster.HasTalent('special_bonus_unique_medusa_custom_3')) {
                        let fOverflowMana = math.max(tHashtable.mana_sum - (hCaster.GetMaxMana() - hCaster.GetMana()), 0)
                        if (fOverflowMana > 0) {
                            let duration = hCaster.GetTalentValue('special_bonus_unique_medusa_custom_3')
                            modifier_medusa_2_mana.apply(hCaster, hCaster, this, { duration: duration, overflow_mana: fOverflowMana })
                        }
                    }
                    hCaster.GiveMana(tHashtable.mana_sum)
                    modifier_medusa_2_buff.apply(hCaster, hCaster, this, { duration: snake_agility_duration, target_count: tHashtable.count })
                }

                hCaster.EmitSound(ResHelper.GetSoundReplacement("Hero_Medusa.MysticSnake.Return", hCaster))
                HashTableHelper.RemoveHashtable(ExtraData.hashtable_index || -1)
                return true
            } else {
                let fDamage = tHashtable.damage * math.pow(1 + tHashtable.damage_scale * 0.01, tHashtable.count)

                let tDamageTable = {
                    ability: this,
                    attacker: hCaster,
                    victim: hTarget,
                    damage: fDamage,
                    damage_type: this.GetAbilityDamageType()
                }
                BattleHelper.GoApplyDamage(tDamageTable)

                hTarget.ReduceMana(tHashtable.snake_mana_steal * hTarget.GetMaxMana() / 100)
                tHashtable.mana_sum = tHashtable.mana_sum + tHashtable.snake_mana_steal_agility * hCaster.GetAgility() + tHashtable.snake_mana_steal * hTarget.GetMaxMana() / 100

                EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_Medusa.MysticSnake.Target", hCaster), hCaster)

                tHashtable.count = tHashtable.count + 1
                table.insert(tHashtable.targets, hTarget)
            }
        }

        if (tHashtable.max_count > tHashtable.count) {
            let hNewTarget = AoiHelper.GetBounceTarget(
                [hTarget],
                hCaster.GetTeamNumber(),
                tHashtable.radius,
                this.GetAbilityTargetTeam(),
                this.GetAbilityTargetType(),
                this.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                vLocation,
                FindOrder.FIND_CLOSEST,
                false
            )
            if (hNewTarget != null) {
                let initial_speed = this.GetSpecialValueFor("initial_speed")
                let tInfo: CreateTrackingProjectileOptions = {
                    Source: hTarget,
                    Ability: this,
                    EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile.vpcf", hCaster),
                    iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                    vSourceLoc: vLocation,
                    iMoveSpeed: initial_speed,
                    Target: hNewTarget,
                    ExtraData: { hashtable_index: ExtraData.hashtable_index || -1 }
                }
                ProjectileManager.CreateTrackingProjectile(tInfo)

                return true
            }
        }

        if (GFuncEntity.IsValid(hCaster)) {
            let return_speed = this.GetSpecialValueFor("return_speed")
            let tInfo = {
                Source: hTarget,
                Ability: this,
                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_medusa/medusa_mystic_snake_projectile_return.vpcf", hCaster),
                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                vSourceLoc: vLocation,
                iMoveSpeed: return_speed,
                Target: hCaster,
                ExtraData: { hashtable_index: ExtraData.hashtable_index || -1 }
            }
            ProjectileManager.CreateTrackingProjectile(tInfo)
        }
        return true
    }

    GetIntrinsicModifierName() {
        return "modifier_medusa_2"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_medusa_2 extends BaseModifier_Plus {
    scepter_chance: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        this.scepter_chance = this.GetSpecialValueFor("scepter_chance")
        if (params.IsOnCreated && IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GFuncEntity.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            //  优先攻击目标
            let target = caster.GetAttackTarget()
            if (target != null && target.GetClassname() == "dota_item_drop") {
                target = null
            }
            if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                target = null
            }

            //  搜索范围
            if (target == null) {
                let teamFilter = ability.GetAbilityTargetTeam()
                let typeFilter = ability.GetAbilityTargetType()
                let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
                let order = FindOrder.FIND_CLOSEST
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                target = targets[0]
            }

            //  施法命令
            if (target != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    TargetIndex: target.entindex(),
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (IsServer()) {
            let hTarget = params.target
            if (GFuncEntity.IsValid(hTarget) && hTarget.GetClassname() != "dota_item_drop") {
                if (!BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
                    let hParent = this.GetParentPlus()
                    if (hParent.HasScepter()) {
                        if (GFuncMath.PRD(this.scepter_chance, hParent, "medusa_2_scepter")) {
                            let hAbility = this.GetAbilityPlus() as ability2_medusa_mystic_snake
                            if (type(hAbility.FireSnake) == "function") {
                                hAbility.FireSnake(hTarget)
                            }
                        }
                    }
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_2_buff extends BaseModifier_Plus {
    snake_agility_gain: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    BeCreated(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let sTalentName = "special_bonus_unique_medusa_custom_1"
        this.snake_agility_gain = hCaster.HasTalent(sTalentName)
            && this.GetSpecialValueFor("snake_agility_gain") + hCaster.GetTalentValue(sTalentName)
            || this.GetSpecialValueFor("snake_agility_gain")
        if (IsServer()) {

            let iTargetCount = params.target_count || 0
            let iValue = this.snake_agility_gain * iTargetCount
            this.ChangeStackCount(iValue)
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.ChangeStackCount(-iValue)
            }))
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(params: IModifierTable) {
        return this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_medusa_2_mana// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_medusa_2_mana extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    Init(params: IModifierTable) {
        if (IsServer()) {
            let fMana = (params.overflow_mana || 0)
            this.ChangeStackCount(fMana)
            GTimerHelper.AddTimer(params.duration, GHandler.create(this, () => {
                this.ChangeStackCount(-fMana)
            }))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)
    GetManaBonus(params: IModifierTable) {
        return this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_BONUS)

    CC_GetModifierManaBonus(params: IModifierTable) {
        return this.GetStackCount()
    }
}
