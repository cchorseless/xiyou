import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_life_stealer_rage = { "ID": "5249", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE", "SpellDispellableType": "SPELL_DISPELLABLE_NO", "AbilitySound": "Hero_LifeStealer.Rage", "AbilityCastPoint": "0", "AbilityCastRange": "0", "AbilityCooldown": "18", "AbilityManaCost": "75 100 125 150", "AbilityDuration": "3 4 5 6", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "movement_speed_bonus": "15 16 17 18" }, "02": { "var_type": "FIELD_FLOAT", "duration": "3.0 4.0 5.0 6.0", "LinkedSpecialBonus": "special_bonus_unique_lifestealer" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_life_stealer_rage extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "life_stealer_rage";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_life_stealer_rage = Data_life_stealer_rage;
    Init() {
        this.SetDefaultSpecialValue("attack_speed", 300);
        this.SetDefaultSpecialValue("duration", [3, 3.5, 4, 4.5, 5, 5.5]);
        this.SetDefaultSpecialValue("shard_attack_damage", 120);

    }


    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        this.InheritAbility(hCaster, 100, false)
    }
    // 感染继承技能效果
    InheritAbility(hTarget: IBaseNpc_Plus, InheritPct: number, bPermanent: boolean) {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration") * InheritPct * 0.01
        hTarget.Purge(false, true, false, false, false)
        if (bPermanent) {
            let hAbility3 = hCaster.FindAbilityByName("ability6_life_stealer_infest")
            if (GameFunc.IsValid(hAbility3) && hAbility3.GetLevel() > 0) {
                let scepter_interval = hAbility3.GetSpecialValueFor("scepter_interval")
                modifier_life_stealer_1_buff.apply(hTarget, hCaster, this, { bPermanent: 1, _duration: this.GetSpecialValueFor("duration"), scepter_interval: scepter_interval, InheritPct: InheritPct })
            }
        } else {
            modifier_life_stealer_1_buff.apply(hTarget, hCaster, this, { duration: duration, InheritPct: InheritPct })
        }
        // 音效
        EmitSoundOnLocationWithCaster(hTarget.GetAbsOrigin(), ResHelper.GetSoundReplacement("Hero_LifeStealer.Rage", hCaster), hTarget)
    }

    // GetIntrinsicModifierName() {
    //     return "modifier_life_stealer_1"
    // }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_1 extends BaseModifier_Plus {
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
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus()
            if (ability == null || ability.IsNull()) {
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

            let range = caster.Script_GetAttackRange()

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets.length > 0) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex(),
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_life_stealer_1_buff extends BaseModifier_Plus {
    shard_attack_damage: any;
    attack_speed: number;
    InheritPct: any;
    iParticleID: ParticleID;
    fDuration: number;
    fCoolDown: number;
    _duration: any;
    scepter_interval: any;
    IsHidden() {
        return this.GetStackCount() == 0
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
        return "life_stealer_rage"
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        this.attack_speed = this.GetSpecialValueFor("attack_speed") + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_2")
        this.shard_attack_damage = this.GetSpecialValueFor("shard_attack_damage")
        if (IsServer()) {
            this.InheritPct = params.InheritPct || 0
            this.SetStackCount(this.InheritPct)
            this.iParticleID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_life_stealer/life_stealer_rage.vpcf",
                resNpc: hCaster,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hParent
            });

            ParticleManager.SetParticleControl(this.iParticleID, 0, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControl(this.iParticleID, 1, hParent.GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(this.iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
            this.AddParticle(this.iParticleID, false, false, 0, false, false)
            // 永久继承
            if (params.bPermanent != null && params.bPermanent == 1) {
                this.fDuration = GameRules.GetGameTime()
                this.fCoolDown = GameRules.GetGameTime()
                this._duration = params._duration || 0
                this.scepter_interval = params.scepter_interval || 0
                this.StartIntervalThink(0)
            }
        } else {
            if (hCaster == hParent) {
                let iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/status_fx/status_effect_life_stealer_rage.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_INVALID,
                    owner: hParent
                });

                this.AddParticle(iParticleID, false, true, 10, false, false)
            }
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        this.attack_speed = this.GetSpecialValueFor("attack_speed") + hCaster.GetTalentValue("special_bonus_unique_life_stealer_custom_2")
        this.shard_attack_damage = this.GetSpecialValueFor("shard_attack_damage")
        if (IsServer()) {
            this.InheritPct = params.InheritPct || 0
            this.SetStackCount(this.InheritPct)
        }
    }
    OnIntervalThink() {
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            let fDuration = GameRules.GetGameTime() - this.fDuration
            let fCoolDown = GameRules.GetGameTime() - this.fCoolDown
            if (fDuration >= this._duration && this.GetStackCount() != 0) {
                this.SetStackCount(0)
                ParticleManager.DestroyParticle(this.iParticleID, true)
            }
            if (fCoolDown >= this.scepter_interval && this.GetStackCount() == 0) {
                hParent.Purge(false, true, false, true, true)
                this.SetStackCount(this.InheritPct)
                this.fDuration = GameRules.GetGameTime()
                this.fCoolDown = GameRules.GetGameTime()
                this.iParticleID = ResHelper.CreateParticle({
                    resPath: "particles/units/heroes/hero_life_stealer/life_stealer_rage.vpcf",
                    resNpc: hCaster,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                ParticleManager.SetParticleControl(this.iParticleID, 0, hParent.GetAbsOrigin())
                ParticleManager.SetParticleControl(this.iParticleID, 1, hParent.GetAbsOrigin())
                ParticleManager.SetParticleControlEnt(this.iParticleID, 2, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
                this.AddParticle(this.iParticleID, false, false, 0, false, false)
            }
        }
    }

    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: this.GetStackCount() != 0,
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant() {
        return this.attack_speed * this.GetStackCount() * 0.01
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_LIFESTEALER_RAGE
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.DAMAGEOUTGOING_PERCENTAGE)
    GetDamageOutgoing_Percentage() {
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasShard() && this.GetCasterPlus() == this.GetParentPlus()) {
            return this.shard_attack_damage
        }
        return 0
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAX_ATTACKSPEED_BONUS)
    G_MAX_ATTACKSPEED_BONUS() {
        return this.GetCasterPlus().HasTalent("special_bonus_unique_life_stealer_custom_7") && this.attack_speed * this.GetStackCount() * 0.01 || 0
    }
}
