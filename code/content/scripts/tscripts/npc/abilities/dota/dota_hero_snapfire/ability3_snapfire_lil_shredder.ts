
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_snapfire_lil_shredder = { "ID": "6488", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "FightRecapLevel": "1", "AbilitySound": "Hero_Snapfire.ExplosiveShells.Cast", "AbilityCastPoint": "0.0", "AbilityCastRange": "800", "AbilityCastAnimation": "ACT_DOTA_OVERRIDE_ABILITY_3", "AbilityCooldown": "24 20 16 12", "AbilityDuration": "6", "AbilityManaCost": "50 65 80 95", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "damage": "20 45 70 95" }, "02": { "var_type": "FIELD_INTEGER", "buffed_attacks": "6" }, "03": { "var_type": "FIELD_INTEGER", "attack_speed_bonus": "300" }, "04": { "var_type": "FIELD_INTEGER", "attack_range_bonus": "75 150 225 300" }, "05": { "var_type": "FIELD_INTEGER", "buff_duration_tooltip": "6" }, "06": { "var_type": "FIELD_FLOAT", "base_attack_time": "1.0" }, "07": { "var_type": "FIELD_INTEGER", "armor_reduction_per_attack": "1" }, "08": { "var_type": "FIELD_FLOAT", "armor_duration": "5.0" } } };

@registerAbility()
export class ability3_snapfire_lil_shredder extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "snapfire_lil_shredder";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_snapfire_lil_shredder = Data_snapfire_lil_shredder;
    Init() {
        this.SetDefaultSpecialValue("crit_shard", 600);
        this.SetDefaultSpecialValue("damage", [360, 540, 720, 900, 1100]);
        this.SetDefaultSpecialValue("attack_count", 6);
        this.SetDefaultSpecialValue("reduce_move_speed_percent", 75);
        this.SetDefaultSpecialValue("point_blank_range", 600);
        this.SetDefaultSpecialValue("blast_speed", 3000);
        this.SetDefaultSpecialValue("blast_width_initial", 225);
        this.SetDefaultSpecialValue("blast_width_end", 400);
        this.SetDefaultSpecialValue("debuff_duration", 3);
        this.SetDefaultSpecialValue("point_blank_dmg_bonus_pct", 50);

    }


    OnToggle() {
        let hCaster = this.GetCasterPlus()
        if (this.GetToggleState()) {
            modifier_snapfire_3_buff.apply(hCaster, hCaster, this, null)
        } else {
            let hRotBuff = modifier_snapfire_3_buff.findIn(hCaster)
            if (hRotBuff != null) {
                hRotBuff.Destroy()
            }
        }
    }
    OnProjectileHit_ExtraData(hTarget: IBaseNpc_Plus, vLocation: Vector, ExtraData: any) {
        let hCaster = this.GetCasterPlus()
        if (GFuncEntity.IsValid(hTarget)) {
            BattleHelper.Attack(hCaster, hTarget, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USEPROJECTILE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NEVERMISS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        modifier_snapfire_3_buff.apply(hCaster, hCaster, this, null)
    }

    GetIntrinsicModifierName() {
        return "modifier_snapfire_3"
    }

}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_3 extends BaseModifier_Plus {
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
    BeCreated(params: IModifierTable) {

        if (IsServer()) {
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
            if (modifier_snapfire_3_buff.exist(caster)) {
                return
            }

            let range = caster.Script_GetAttackRange()
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable(
                    {
                        UnitIndex: caster.entindex(),
                        OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                        AbilityIndex: ability.entindex()
                    }
                )
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_3_buff extends BaseModifier_Plus {
    damage_percent: number;
    bonus_attack_range: number;
    reduce_armor_duration: number;
    base_attack_time: number;
    attack_stack: number;
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    bonus_attack_speed: number;
    tAtkRecode: number[];
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
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.tAtkRecode = []
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.ExplosiveShells.Cast", hParent))
            this.SetStackCount(this.attack_stack)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: " ",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            this.AddParticle(iParticleID, false, false, 0, false, false)
        }
    }
    Init(params: IModifierTable) {
        let hParent = this.GetParentPlus()
        this.damage_percent = this.GetSpecialValueFor("damage_percent")
        this.bonus_attack_range = this.GetSpecialValueFor("bonus_attack_range")
        this.reduce_armor_duration = this.GetSpecialValueFor("reduce_armor_duration")
        this.attack_stack = this.GetSpecialValueFor("attack_stack")
        this.base_attack_time = this.GetSpecialValueFor("base_attack_time")
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Snapfire.ExplosiveShells.Cast", hParent))
            this.SetStackCount(this.attack_stack)
        }
    }
    OnStackCountChanged(iStackCount: number) {
        if (IsServer()) {
            if (this.GetStackCount() <= 0) {
                this.Destroy()
            }
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    attackStart(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            modifier_snapfire_3_buff_projectile.apply(params.attacker, params.attacker, this.GetAbilityPlus(), null)
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD)
    attackRecord(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            if (modifier_snapfire_3_buff_projectile.exist(params.attacker)) {
                modifier_snapfire_3_buff_projectile.remove(params.attacker);
                this.DecrementStackCount()
                table.insert(this.tAtkRecode, params.record)
                params.attacker.EmitSound('Hero_Snapfire.ExplosiveShellsBuff.Target')
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    attackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus() &&
            !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            if (this.tAtkRecode.indexOf(params.record) != -1) {
                modifier_snapfire_3_debuff_reduce_armor.apply(params.target, params.attacker, this.GetAbilityPlus(), { duration: this.reduce_armor_duration })
                let attacker = params.attacker as IBaseNpc_Plus;
                // 天赋 - 弹射
                if (attacker.HasTalent("special_bonus_unique_snapfire_custom_8")) {
                    let bonus_count = attacker.GetTalentValue("special_bonus_unique_snapfire_custom_8", "value")
                    let radius = attacker.GetTalentValue("special_bonus_unique_snapfire_custom_8", "radius")
                    let tTarget = FindUnitsInRadius(params.attacker.GetTeamNumber(), params.target.GetAbsOrigin(), null, radius + 400, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_CLOSEST, false)
                    for (let hTarget of (tTarget)) {
                        if (GFuncEntity.IsValid(hTarget) && hTarget != params.target) {
                            let info = {
                                Source: params.target,
                                Target: hTarget,
                                Ability: this.GetAbilityPlus(),
                                EffectName: ResHelper.GetParticleReplacement("particles/units/heroes/hero_snapfire/hero_snapfire_shells_projectile.vpcf", this.GetParentPlus()),
                                iSourceAttachment: DOTAProjectileAttachment_t.DOTA_PROJECTILE_ATTACHMENT_HITLOCATION,
                                iMoveSpeed: 1300,
                                fExpireTime: GameRules.GetGameTime() + 10.0,
                            }
                            ProjectileManager.CreateTrackingProjectile(info)
                            bonus_count = bonus_count - 1
                            if (bonus_count <= 0) {
                                break
                            }
                        }
                    }
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_RECORD_DESTROY)
    attackRecordDestroy(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") { return }
        if (params.attacker == this.GetParentPlus()) {
            GameFunc.ArrayFunc.ArrayRemove(this.tAtkRecode, params.record)
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ATTACK_DAMAGE)
    GetOverrideAttackDamage(params: IModifierTable) {
        return this.GetParentPlus().GetAverageTrueAttackDamage(this.GetParentPlus()) * this.damage_percent * 0.01
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: IModifierTable) {
        return this.base_attack_time
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus(params: IModifierTable) {
        return this.bonus_attack_range
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.bonus_attack_speed
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.CAST_RANGE_BONUS_STACKING)
    GetCastRangeBonusStacking(params: ModifierAbilityEvent) {
        if (IsServer()) {
            if (GFuncEntity.IsValid(params.ability) &&
                GameFunc.IncludeArgs(params.ability.GetBehaviorInt(), DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_ATTACK)[0]) {
                return this.bonus_attack_range
            }
            return 0
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_3_debuff_reduce_armor extends BaseModifier_Plus {
    reduce_armor: number;
    max_reduce_armor_stack: number;
    mark_stack: number;
    mark_duration: number;
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
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
        this.reduce_armor = this.GetSpecialValueFor("reduce_armor")
        this.max_reduce_armor_stack = this.GetSpecialValueFor("max_reduce_armor_stack")
        this.mark_stack = this.GetSpecialValueFor("mark_stack")
        this.mark_duration = this.GetSpecialValueFor("mark_duration")
        if (IsServer()) {
            this.SetStackCount(math.min(this.GetStackCount() + 1, this.max_reduce_armor_stack))
        }
    }

    OnStackCountChanged(iStackCount: number) {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { tMarkUnit: IBaseNpc_Plus[] }
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (this.GetStackCount() >= this.mark_stack) {
                modifier_snapfire_3_debuff_mark.apply(hParent, hCaster, hAbility, { duration: this.mark_duration })
                if (hCaster.tMarkUnit == null) {
                    hCaster.tMarkUnit = []
                }
                if (hCaster.tMarkUnit.indexOf(hParent) == -1) {
                    table.insert(hCaster.tMarkUnit, hParent)
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus() {
        return -this.reduce_armor * this.GetStackCount()
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_GetModifierMagicalArmorBonus() {
        if (GFuncEntity.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasTalent("special_bonus_unique_snapfire_custom_1")) {
            return -this.reduce_armor * this.GetStackCount()
        }
        return 0
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_tooltip() {
        return -this.reduce_armor * this.GetStackCount()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_snapfire_3_debuff_mark extends BaseModifier_Plus {
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
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

        if (IsServer()) {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_life_stealer/life_stealer_infested_unit.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW,
                owner: this.GetParentPlus()
            });

            this.AddParticle(iParticleID, false, false, -1, false, true)
        }
    }

    BeDestroy() {

        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { tMarkUnit: IBaseNpc_Plus[] }
        let hParent = this.GetParentPlus()
        if (GFuncEntity.IsValid(hCaster) && hCaster.tMarkUnit != null) {
            GameFunc.ArrayFunc.ArrayRemove(hCaster.tMarkUnit, hParent)
        }
    }
}

@registerModifier()
export class modifier_snapfire_3_buff_projectile extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_SUPER_ULTRA
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PROJECTILE_NAME)
    GetProjectileName(params: IModifierTable) {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_snapfire/hero_snapfire_shells_projectile.vpcf", this.GetParentPlus())
    }
}
