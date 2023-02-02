import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";

/** dota原技能数据 */
export const Data_arc_warden_flux = { "ID": "5677", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_UNIT_TARGET", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_ArcWarden.Flux.Target", "AbilityCastRange": "500 600 700 800", "AbilityCastPoint": "0.3 0.3 0.3 0.3", "AbilityCooldown": "16.0", "AbilityManaCost": "75", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "6.0", "LinkedSpecialBonus": "special_bonus_unique_arc_warden_2" }, "02": { "var_type": "FIELD_INTEGER", "damage_per_second": "15 30 45 60" }, "03": { "var_type": "FIELD_INTEGER", "search_radius": "225" }, "04": { "var_type": "FIELD_FLOAT", "think_interval": "0.5" }, "05": { "var_type": "FIELD_INTEGER", "move_speed_slow_pct": "20 30 40 50" }, "06": { "var_type": "FIELD_INTEGER", "abilitycastrange": "", "LinkedSpecialBonus": "special_bonus_unique_arc_warden_5" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1" };

@registerAbility()
export class ability1_arc_warden_flux extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "arc_warden_flux";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_arc_warden_flux = Data_arc_warden_flux;
    Init() {
        this.SetDefaultSpecialValue("duration", 5);
        this.SetDefaultSpecialValue("slow_pct", [20, 30, 40, 50, 60, 70]);
        this.SetDefaultSpecialValue("damage_interval", 1);
        this.SetDefaultSpecialValue("base_damage", [140, 230, 400, 720, 1350, 2500]);
        this.SetDefaultSpecialValue("damage_bonus_all", [2, 2.4, 2.8, 3.2, 3.6, 4]);
        this.SetDefaultSpecialValue("shock_bonus_all", 1);
        this.SetDefaultSpecialValue("extra_shock_count", 1);
        this.SetDefaultSpecialValue("shard_radius", 400);

    }



    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        if (hCaster.HasShard()) {
            let units = AoiHelper.FindEntityInRadius(hCaster.GetTeam(), this.GetCursorTarget().GetOrigin(), this.GetSpecialValueFor("shard_radius"), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC)
            for (let u of (units)) {

                this.Process(u)
            }
        } else {
            this.Process(this.GetCursorTarget())
        }
        EmitSoundOn(ResHelper.GetSoundReplacement("Hero_ArcWarden.Flux.Cast", hCaster), hCaster)
    }
    Process(hTarget: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }
        let hCaster = this.GetCasterPlus()
        let iParticle = ResHelper.CreateParticle({
            resPath: "particles/units/heroes/hero_arc_warden/arc_warden_flux_cast.vpcf",
            resNpc: hCaster,
            iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
            owner: hCaster
        });

        ParticleManager.SetParticleControlEnt(iParticle, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", Vector(0, 0, 0), false)
        ParticleManager.SetParticleControlEnt(iParticle, 2, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack2", Vector(0, 0, 0), false)
        ParticleManager.SetParticleControlEnt(iParticle, 1, hTarget, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), false)
        let duration = this.GetSpecialValueFor("duration")
        let fDamage = this.GetSpecialValueFor("base_damage") + hCaster.GetAllStats() * this.GetSpecialValueFor("damage_bonus_all")
        let iShockCount = this.GetSpecialValueFor("shock_bonus_all") * hCaster.GetAllStats()
        let iSlow = -this.GetSpecialValueFor("slow_pct")
        let fDamageTick = this.GetSpecialValueFor("damage_interval")
        let iExtraShockCount = this.GetSpecialValueFor("extra_shock_count") + hCaster.GetTalentValue("special_bonus_unique_arc_warden_custom_3")
        let iShockDamageIncrease = hCaster.GetTalentValue("special_bonus_unique_arc_warden_custom_4")
        modifier_arc_warden_1_debuff.apply(hTarget, hCaster, this, {
            duration: duration,
            fDamage: fDamage,
            iShockCount: iShockCount,
            iSlow: iSlow,
            fDamageTick: fDamageTick,
            iExtraShockCount: iExtraShockCount,
            iShockDamageIncrease: iShockDamageIncrease
        })
    }

    GetIntrinsicModifierName() {
        return "modifier_arc_warden_1"
    }
}
//  Modifiers
@registerModifier()
export class modifier_arc_warden_1 extends BaseModifier_Plus {
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
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }
            let range = ability.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
            let targets = AoiHelper.FindEntityInRadius(hCaster.GetTeam(), hCaster.GetAbsOrigin(), range, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC)
            if (targets.length >= 1) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET,
                    AbilityIndex: ability.entindex(),
                    TargetIndex: targets[0].entindex()
                })
            }
        }
    }
}
//  Modifiers
@registerModifier()
export class modifier_arc_warden_1_debuff extends BaseModifier_Plus {
    tTimeInfo: any[];
    iSlow: any;
    iExtraShockCount: any;
    iShockDamageIncrease: any;
    flag: any;
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
    GetEffectName() {
        return "particles/units/heroes/hero_arc_warden/arc_warden_flux_tgt.vpcf"
    }
    GetEffectAttachType() {
        return ParticleAttachment_t.PATTACH_CENTER_FOLLOW
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.iSlow = params.iSlow
            this.iExtraShockCount = params.iExtraShockCount
            this.iShockDamageIncrease = params.iShockDamageIncrease
            this.SetHasCustomTransmitterData(true)
            if (!this.tTimeInfo) {
                this.tTimeInfo = []
            }
            let info = {
                fDamage: params.fDamage,
                fDamageTime: 0,
                iShockCount: params.iShockCount,
                fDieTime: this.GetDieTime(),
                fDamageTick: params.fDamageTick
            }
            table.insert(this.tTimeInfo, info)
            this.IncrementStackCount()
            this.StartIntervalThink(0)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            this.iSlow = params.iSlow
            this.iExtraShockCount = params.iExtraShockCount
            this.iShockDamageIncrease = params.iShockDamageIncrease
            this.SendBuffRefreshToClients()
            let info = {
                fDamage: params.fDamage,
                fDamageTime: 0,
                iShockCount: params.iShockCount,
                fDieTime: this.GetDieTime(),
                fDamageTick: params.fDamageTick
            }
            table.insert(this.tTimeInfo, info)
            this.IncrementStackCount()
        }
    }
    AddCustomTransmitterData() {
        return {
            iSlow: this.iSlow,
            iExtraShockCount: this.iExtraShockCount,
            iShockDamageIncrease: this.iShockDamageIncrease
        }
    }
    HandleCustomTransmitterData(params: IModifierTable) {
        this.iSlow = params.iSlow
        this.iExtraShockCount = params.iExtraShockCount
        this.iShockDamageIncrease = params.iShockDamageIncrease
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.StartIntervalThink(-1)
        }
    }
    Process(fDamage: number, iShockCount: number) {
        modifier_shock.Shock(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), iShockCount)
        let tDamageTable = {
            attacker: this.GetCasterPlus(),
            victim: this.GetParentPlus(),
            damage: fDamage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damaga_flags: 0,
            ability: this.GetAbilityPlus()
        }
        BattleHelper.GoApplyDamage(tDamageTable)
    }
    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let fGameTime = GameRules.GetGameTime()
        for (let i = this.tTimeInfo.length - 1; i >= 0; i--) {
            if ((fGameTime - this.tTimeInfo[i].fDamageTime) >= this.tTimeInfo[i].fDamageTick) {
                this.Process(this.tTimeInfo[i].fDamage, this.tTimeInfo[i].iShockCount)
                this.tTimeInfo[i].fDamageTime = fGameTime
            }
            if (fGameTime >= this.tTimeInfo[i].fDieTime) {
                table.remove(this.tTimeInfo, i)
                this.DecrementStackCount()
            }
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    GetMoveSpeedBonus_Percentage() {
        return this.iSlow
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        return this.iExtraShockCount
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP2)
    On_Tooltip2() {
        return this.iShockDamageIncrease
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_SHOCK_ACTIVATED)
    OnShockActivated(params: IModifierTable) {
        if (this.flag) {
            return
        }
        this.flag = true
        //
        let hUnit = params.unit
        let hCaster = params.caster
        let hAbility = params.ability
        for (let i = 1; i <= this.iExtraShockCount; i++) {
            hUnit.ShockActive(hCaster, hAbility, true, 100)
        }
        this.flag = null
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SHOCK_DAMAGE_PERCENTAGE)
    EOM_GetModifierIncomingShockDamagePercentage() {
        return this.iShockDamageIncrease
    }
}
