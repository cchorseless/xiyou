import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_particle } from "../../../modifier/modifier_particle";
import { modifier_shredder_3_link_buff } from "./ability3_shredder_reactive_armor";

/** dota原技能数据 */
export const Data_shredder_timber_chain = { "ID": "5525", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING | DOTA_ABILITY_BEHAVIOR_ROOT_DISABLES", "AbilityUnitDamageType": "DAMAGE_TYPE_PURE", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "FightRecapLevel": "1", "AbilitySound": "Hero_Shredder.TimberChain.Cast", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCastRange": "850 1050 1250 1450", "AbilityCooldown": "4", "AbilityManaCost": "60 70 80 90", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "chain_radius": "90 90 90 90" }, "02": { "var_type": "FIELD_INTEGER", "range": "800 950 1100 1250", "LinkedSpecialBonus": "special_bonus_unique_timbersaw_3" }, "03": { "var_type": "FIELD_INTEGER", "radius": "225 225 225 225" }, "04": { "var_type": "FIELD_INTEGER", "speed": "2200 2400 2600 2800" }, "05": { "var_type": "FIELD_INTEGER", "damage": "100 140 180 220" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_shredder_timber_chain extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shredder_timber_chain";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shredder_timber_chain = Data_shredder_timber_chain;
    Init() {
        this.SetDefaultSpecialValue("reduce_move_speed_pct", 25);
        this.SetDefaultSpecialValue("duration", 7);
        this.SetDefaultSpecialValue("debuff_duration", 3);
        this.SetDefaultSpecialValue("base_spell_crit_damage", 100);
        this.SetDefaultSpecialValue("bonus_spell_crit_chance", 4);
        this.SetDefaultSpecialValue("bonus_spell_crit_damage", 30);
        this.SetDefaultSpecialValue("stack_limit", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("stack_duration", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("cooldown", 0.4);
        this.SetDefaultSpecialValue("damage_per_second_factor", 9);
        this.SetDefaultSpecialValue("length", 770);
        this.SetDefaultSpecialValue("width", 375);

    }

    Init_old() {
        this.SetDefaultSpecialValue("bonus_spell_crit_chance", 4);
        this.SetDefaultSpecialValue("base_spell_crit_damage", 100);
        this.SetDefaultSpecialValue("bonus_spell_crit_damage", 30);
        this.SetDefaultSpecialValue("stack_limit", [6, 8, 10, 12, 14, 16]);
        this.SetDefaultSpecialValue("stack_duration", [5, 6, 7, 8, 9, 10]);
        this.SetDefaultSpecialValue("cooldown", 0.4);

    }



    GetBehavior() {
        let iBehavior = tonumber(tostring(super.GetBehavior()))
        if (this.GetCasterPlus().HasShard()) {
            iBehavior = iBehavior + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE
        }
        return iBehavior
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        modifier_shredder_2_fire_buff.apply(hCaster, hCaster, this, { duration: duration })
    }
    GetIntrinsicModifierName() {
        return "modifier_shredder_2"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shredder_2 extends BaseModifier_Plus {
    cooldown: number;
    stack_duration: number;
    bIsCooldownReady: boolean;
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

        this.stack_duration = this.GetSpecialValueFor("stack_duration")
        this.cooldown = this.GetSpecialValueFor("cooldown")
        if (IsServer()) {
            this.bIsCooldownReady = true
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.stack_duration = this.GetSpecialValueFor("stack_duration")
        this.cooldown = this.GetSpecialValueFor("cooldown")
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (!GameFunc.IsValid(ability)) {
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
            if (!caster.HasShard()) {
                return
            }

            let range = ability.GetSpecialValueFor("length")
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_DAMAGE_PERCENTAGE)

    CC_GetModifierOutgoingDamagePercentage(params: IModifierTable) {
        if (IsServer() && params != null) {
            if (this.GetParentPlus().PassivesDisabled()) {
                return
            }
            let hAbility = params.inflictor
            if (hAbility != null && !hAbility.IsItem() && !hAbility.IsToggle() && hAbility.ProcsMagicStick()) {
                if (this.bIsCooldownReady) {
                    this.bIsCooldownReady = false
                    this.GetParentPlus().addTimer(this.cooldown, () => {
                        this.bIsCooldownReady = true
                    })
                    this.GetParentPlus().EmitSound(ResHelper.GetSoundReplacement("Hero_Shredder.ReactiveArmor", this.GetParentPlus()))

                    modifier_shredder_2_buff.apply(this.GetParentPlus(), this.GetParentPlus(), this.GetAbilityPlus(), { duration: this.stack_duration })
                }
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shredder_2_buff extends BaseModifier_Plus {
    _tooltip: number;
    base_spell_crit_damage: any;
    bonus_spell_crit_chance: number;
    bonus_spell_crit_damage: number;
    stack_limit: number;
    max_stack_limit: number;
    hBuffPtcl: modifier_shredder_2_particle;
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
        this.base_spell_crit_damage = this.GetSpecialValueFor("base_spell_crit_damage")
        this.bonus_spell_crit_chance = this.GetSpecialValueFor("bonus_spell_crit_chance")
        this.bonus_spell_crit_damage = this.GetSpecialValueFor("bonus_spell_crit_damage")
        this.stack_limit = this.GetSpecialValueFor("stack_limit") + hCaster.GetTalentValue("special_bonus_unique_shredder_custom_5")
        if (modifier_shredder_3_link_buff.exist(hParent)) {
            let percent = modifier_shredder_3_link_buff.GetStackIn(hParent, hCaster)
            this.bonus_spell_crit_chance = this.bonus_spell_crit_chance * percent / 100
            this.bonus_spell_crit_damage = this.bonus_spell_crit_damage * percent / 100
        }
        if (IsServer()) {
            this.max_stack_limit = this.GetAbilityPlus().GetLevelSpecialValueFor("stack_limit", this.GetAbilityPlus().GetMaxLevel())
            if (params.bNoTimer != 1) {
                this.hBuffPtcl = modifier_shredder_2_particle.apply(this.GetParentPlus(), hCaster, this.GetAbilityPlus())
                this.IncrementStackCount()
                this.addTimer(params.duration, () => {
                    this.DecrementStackCount()
                })
            }
        }
    }
    BeRefresh(params: IModifierTable) {

        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        this.base_spell_crit_damage = this.GetSpecialValueFor("base_spell_crit_damage")
        this.bonus_spell_crit_chance = this.GetSpecialValueFor("bonus_spell_crit_chance")
        this.bonus_spell_crit_damage = this.GetSpecialValueFor("bonus_spell_crit_damage")
        this.stack_limit = this.GetSpecialValueFor("stack_limit") + hCaster.GetTalentValue("special_bonus_unique_shredder_custom_5")
        if (modifier_shredder_3_link_buff.exist(hParent)) {
            let percent = modifier_shredder_3_link_buff.GetStackIn(hParent, hCaster)
            this.bonus_spell_crit_chance = this.bonus_spell_crit_chance * percent / 100
            this.bonus_spell_crit_damage = this.bonus_spell_crit_damage * percent / 100
        }
        if (IsServer()) {
            if (params.bNoTimer != 1) {
                if (this.GetStackCount() < this.stack_limit) {
                    this.IncrementStackCount()
                    this.addTimer(params.duration, () => {
                        this.DecrementStackCount()
                    })
                }
            }
        }
    }
    BeDestroy() {

        if (IsServer()) {
            if (GameFunc.IsValid(this.hBuffPtcl)) {
                this.hBuffPtcl.Destroy()
            }
        }
    }

    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
            if (GameFunc.IsValid(this.hBuffPtcl)) {
                let iStackCount = this.GetStackCount()

                let iStackCountPtcl = 0
                if (iStackCount > this.max_stack_limit * 0) {
                    iStackCountPtcl = iStackCountPtcl + 1
                }
                if (iStackCount > this.max_stack_limit * 0.25) {
                    iStackCountPtcl = iStackCountPtcl + 10
                }
                if (iStackCount > this.max_stack_limit * 0.5) {
                    iStackCountPtcl = iStackCountPtcl + 100
                }
                if (iStackCount > this.max_stack_limit * 0.75) {
                    iStackCountPtcl = iStackCountPtcl + 1000
                }
                this.hBuffPtcl.SetStackCount(iStackCountPtcl)
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        this._tooltip = (this._tooltip || 0) % 3 + 1
        if (this._tooltip == 1) {
            return this.bonus_spell_crit_chance * this.GetStackCount()
        } else if (this._tooltip == 2) {
            return this.base_spell_crit_damage
        } else if (this._tooltip == 3) {
            return this.bonus_spell_crit_damage * this.GetStackCount()
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE)
    CC_GetModifierSpellCriticalStrike(params: IModifierTable) {
        if (GameFunc.mathUtil.PRD(this.bonus_spell_crit_chance * this.GetStackCount(), this.GetParentPlus(), "modifier_shredder_2_buff")) {
            return this.base_spell_crit_damage
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_CRITICALSTRIKE_DAMAGE)
    CC_GetModifierSpellCriticalStrikeDamage(params: IModifierTable) {
        return this.bonus_spell_crit_damage * this.GetStackCount()
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shredder_2_fire_buff extends BaseModifier_Plus {
    damage_per_second_factor: number;
    length: number;
    debuff_duration: number;
    width: number;
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
    GetTexture() {
        return "shredder_flamethrower"
    }
    BeCreated(params: IModifierTable) {

        this.damage_per_second_factor = this.GetSpecialValueFor("damage_per_second_factor")
        this.length = this.GetSpecialValueFor("length")
        this.width = this.GetSpecialValueFor("width")
        this.debuff_duration = this.GetSpecialValueFor("debuff_duration")
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Shredder.Flamethrower", hParent))
            this.StartIntervalThink(0.1)
        } else {
            let iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_flame_thrower.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(iParticleID, 3, this.GetParentPlus(), ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, null, this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }
    }
    BeRefresh(params: IModifierTable) {

        this.damage_per_second_factor = this.GetSpecialValueFor("damage_per_second_factor")
        this.length = this.GetSpecialValueFor("length")
        this.width = this.GetSpecialValueFor("width")
        this.debuff_duration = this.GetSpecialValueFor("debuff_duration")
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.GetParentPlus().StopSound(ResHelper.GetSoundReplacement("Hero_Shredder.Flamethrower", hParent))
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            let vTargetPos = (hParent.GetAbsOrigin() + hParent.GetForwardVector() * this.length) as Vector
            let tTarget = FindUnitsInLine(hParent.GetTeamNumber(), hParent.GetAbsOrigin(), vTargetPos, null, this.width, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE)
            let fDamage = (hParent.GetStrength() + hParent.GetAgility() + hParent.GetIntellect()) * this.damage_per_second_factor
            for (let hTarget of (tTarget)) {

                let damage_table =
                {
                    ability: this.GetAbilityPlus(),
                    attacker: hParent,
                    victim: hTarget,
                    damage: fDamage * 0.1,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
                }
                BattleHelper.GoApplyDamage(damage_table)
                modifier_shredder_2_fire_debuff.apply(hTarget, hParent, this.GetAbilityPlus(), { duration: this.debuff_duration })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shredder_2_fire_debuff extends BaseModifier_Plus {
    reduce_move_speed_pct: number;
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
    GetStatusEffectName() {
        return "particles/status_fx/status_effect_shredder_flame_thrower_debuff.vpcf"
    }
    StatusEffectPriority() {
        return 10
    }
    GetEffectName() {
        return ResHelper.GetParticleReplacement("particles/units/heroes/hero_shredder/shredder_flame_thrower_debuff_post.vpcf", this.GetCasterPlus())
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW
    }
    GetTexture() {
        return "shredder_flamethrower"
    }
    BeCreated(params: IModifierTable) {

        this.reduce_move_speed_pct = this.GetSpecialValueFor("reduce_move_speed_pct")
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            hParent.EmitSound(ResHelper.GetSoundReplacement("Hero_Shredder.Flamethrower.Target", hParent))
        }
    }
    BeRefresh(params: IModifierTable) {

        this.reduce_move_speed_pct = this.GetSpecialValueFor("reduce_move_speed_pct")
    }
    BeDestroy() {

        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.GetParentPlus().StopSound(ResHelper.GetSoundReplacement("Hero_Shredder.Flamethrower.Target", hParent))
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return -this.reduce_move_speed_pct
    }
}

// 特效
@registerModifier()
export class modifier_shredder_2_particle extends modifier_particle {
    iParticleID_1: ParticleID;
    iParticleID_2: ParticleID;
    iParticleID_3: ParticleID;
    iParticleID_4: ParticleID;
    BeCreated(params: IModifierTable) {

        let whirling_radius = this.GetSpecialValueFor("whirling_radius")
        if (IsServer()) {
            if (params.flag) {
                this.SetStackCount(params.flag)
            }
        } else {
            let hCaster = this.GetCasterPlus()
            let hParent = this.GetParentPlus()
            this.iParticleID_1 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_armor_lyr1.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(this.iParticleID_1, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID_1, false, false, -1, false, false)
            this.iParticleID_2 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_armor_lyr2.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(this.iParticleID_2, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID_2, false, false, -1, false, false)
            this.iParticleID_3 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_armor_lyr3.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(this.iParticleID_3, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID_3, false, false, -1, false, false)
            this.iParticleID_4 = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_shredder/shredder_armor_lyr4.vpcf",
                resNpc: this.GetCasterPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetParentPlus()
            });

            ParticleManager.SetParticleControlEnt(this.iParticleID_4, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_armor", this.GetParentPlus().GetAbsOrigin(), true)
            ParticleManager.SetParticleControlEnt(this.iParticleID_4, 4, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_chimmney", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID_4, false, false, -1, false, false)
        }
    }
    OnStackCountChanged(iOldStackCount: number) {
        if (IsServer()) {
        } else {
            if (this.iParticleID_1) {
                let iStackCount = this.GetStackCount()
                let i1 = iStackCount % 10
                let i2 = math.floor((iStackCount % 100) / 10)
                let i3 = math.floor((iStackCount % 1000) / 100)
                let i4 = math.floor(iStackCount / 1000)
                ParticleManager.SetParticleControl(this.iParticleID_1, 2, Vector(i1, 0, 0))
                ParticleManager.SetParticleControl(this.iParticleID_2, 2, Vector(i2, 0, 0))
                ParticleManager.SetParticleControl(this.iParticleID_3, 2, Vector(i3, 0, 0))
                ParticleManager.SetParticleControl(this.iParticleID_4, 2, Vector(i4, 0, 0))
            }
        }
    }
}
