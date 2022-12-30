import { GameFunc } from "../../../../GameFunc";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { EntityHelper } from "../../../../helper/EntityHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../entityPlus/BaseNpc_Plus";
import { modifier_shock } from "../../../modifier/effect/modifier_shock";
import { modifier_stunned } from "../../../modifier/effect/modifier_stunned";
import { modifier_particle, modifier_particle_thinker } from "../../../modifier/modifier_particle";
import { LogHelper } from "../../../../helper/LogHelper";
import { HashTableHelper } from "../../../../helper/HashTableHelper";
import { GameSetting } from "../../../../GameSetting";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { GameEnum } from "../../../../shared/GameEnum";


@registerAbility()
export class t36_splash extends BaseAbility_Plus {

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let duration = this.GetSpecialValueFor("duration")
        let iStackCount = modifier_t36_splash.GetStackIn(hCaster)
        // let modifier_combination_t36_dragon_kill = Load(hCaster, "modifier_combination_t36_dragon_kill")
        // let aura_friend_radius = (GameFunc.IsValid(modifier_combination_t36_dragon_kill) && modifier_combination_t36_dragon_kill.GetStackCount() > 0) && modifier_combination_t36_dragon_kill.aura_friend_radius || 0
        let aura_friend_radius = 1
        if (aura_friend_radius != 0) {
            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY
            let typeFilter = this.GetAbilityTargetType()
            let flagFilter = this.GetAbilityTargetFlags()
            let order = FindOrder.FIND_CLOSEST
            let targets = FindUnitsInRadius(hCaster.GetTeamNumber(), hCaster.GetAbsOrigin(), null, aura_friend_radius, teamFilter, typeFilter, flagFilter, order, false)
            for (let target of (targets)) {

                let modifier = modifier_t36_splash_attack_bonus.apply(target, hCaster, this, { duration: duration, stack: iStackCount })
                //  if ( modifier ) {
                //  	modifier.SetStackCount(iStackCount)
                //  }
            }
        } else {
            modifier_t36_splash_attack_bonus.apply(hCaster, hCaster, this, { duration: duration, stack: iStackCount })
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_t36_splash"
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t36_splash extends BaseModifier_Plus {
    inner_splash_radius: number;
    inner_splash_damage_percent: number;
    outer_splash_radius: number;
    outer_splash_damage_percent: number;
    aura_radius: number;
    other_kill_stack_bonus: number;
    self_kill_extra_stack_bonus: number;
    extra_attack_factor: number;
    extra_radius: number;
    attack_factor: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetParentPlus()
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME)
        } else {
            let EffectName = "particles/econ/items/centaur/cent_icehoof/cent_icehoof_back_ambient.vpcf"
            let nIndexFX = ResHelper.CreateParticle({
                resPath: EffectName,
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                owner: hCaster
            });

            ParticleManager.SetParticleControlEnt(nIndexFX, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_attack1", hCaster.GetAbsOrigin(), true)
            this.AddParticle(nIndexFX, false, false, -1, false, false)
        }
    }
    Init(params: ModifierTable) {
        this.inner_splash_radius = this.GetSpecialValueFor("inner_splash_radius")
        this.inner_splash_damage_percent = this.GetSpecialValueFor("inner_splash_damage_percent")
        this.outer_splash_radius = this.GetSpecialValueFor("outer_splash_radius")
        this.outer_splash_damage_percent = this.GetSpecialValueFor("outer_splash_damage_percent")
        this.aura_radius = this.GetSpecialValueFor("aura_radius")
        this.other_kill_stack_bonus = this.GetSpecialValueFor("other_kill_stack_bonus")
        this.self_kill_extra_stack_bonus = this.GetSpecialValueFor("self_kill_extra_stack_bonus")
        this.attack_factor = this.GetSpecialValueFor("attack_factor")
        this.extra_attack_factor = this.GetSpecialValueFor("extra_attack_factor")
        this.extra_radius = this.GetSpecialValueFor("extra_radius")
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    On_AttackLanded(params: ModifierAttackEvent) {
        if (params.target == null || params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (params.attacker == this.GetParentPlus() && !params.attacker.IsIllusion() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS)) {
            let extra_radius = modifier_t36_splash_attack_bonus.exist(params.target) && this.extra_radius || 0;
            let position = params.target.GetAbsOrigin()
            let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), position, this.outer_splash_radius + extra_radius, null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, 1)

            for (let target of (targets)) {

                if (target != params.target) {
                    let fDamagePercent = this.outer_splash_damage_percent
                    if (target.IsPositionInRange(position, this.inner_splash_radius + extra_radius)) {
                        fDamagePercent = this.inner_splash_damage_percent
                    }
                    let tDamageTable = {
                        victim: target,
                        attacker: params.attacker,
                        damage: params.original_damage * fDamagePercent * 0.01,
                        damage_type: this.GetAbilityPlus().GetAbilityDamageType(),
                        ability: this.GetAbilityPlus()
                    }
                    BattleHelper.GoApplyDamage(tDamageTable)
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    OnDeath(params: ModifierTable) {
        let hAttacker = params.attacker
        if (!GameFunc.IsValid(hAttacker)) {
            return
        }
        if (hAttacker.GetTeamNumber() == params.unit.GetTeamNumber()) {
            return
        }
        // && !Spawner.IsEndless()
        if (hAttacker != null && hAttacker.GetUnitLabel() != "builder") {
            hAttacker = hAttacker.GetSource()
            if (hAttacker.IsIllusion()) {
                return
            }
            let hCaster = this.GetParentPlus()
            let factor = params.unit.IsConsideredHero() && 5 || 1
            let iBonusStack = (hAttacker == hCaster) && (this.self_kill_extra_stack_bonus + this.other_kill_stack_bonus) * factor || this.other_kill_stack_bonus * factor
            if (hAttacker == hCaster || params.unit.IsPositionInRange(hCaster.GetAbsOrigin(), this.aura_radius)) {
                this.SetStackCount(this.GetStackCount() + iBonusStack)
                //  let EffectName = "particles/units/heroes/hero_terrorblade/terrorblade_metamorphosis_transform_end.vpcf"
                //  let nIndexFX = ResHelper.CreateParticle({
                //     resPath: EffectName,
                //     resNpc: null,
                //     iAttachment:   ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                //     owner:  hCaster
                // });

                //  ParticleManager.SetParticleControlEnt(nIndexFX, 0, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, null, hCaster.GetAbsOrigin(), true)
                //  ParticleManager.ReleaseParticleIndex(nIndexFX)
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    GetPreAttack_BonusDamage(params: ModifierTable) {
        let hCaster = this.GetParentPlus()
        // let _modifier_combination_t36_dragon_kill = modifier_combination_t36_dragon_kill.findIn(hCaster) as any;
        // let attack_extra_bonus_factor = (GameFunc.IsValid(_modifier_combination_t36_dragon_kill) && _modifier_combination_t36_dragon_kill.GetStackCount() > 0) && modifier_combination_t36_dragon_kill.attack_extra_bonus_factor || 0

        // return this.GetStackCount() * (this.attack_factor + attack_extra_bonus_factor)
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

            let range = ability.GetSpecialValueFor("aura_radius")
            let teamFilter = ability.GetAbilityTargetTeam()
            let typeFilter = ability.GetAbilityTargetType()
            let flagFilter = ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST
            let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
            if (targets[0] != null) {
                ExecuteOrderFromTable({
                    UnitIndex: caster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET,
                    AbilityIndex: ability.entindex()
                })
            }
        }
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_t36_splash_attack_bonus extends BaseModifier_Plus {
    extra_attack_factor: number;
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
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus()
        if (IsServer()) {
            this.SetStackCount(math.ceil(tonumber(params.stack)))
        } else {
            if (hCaster == hParent) {
                let nIndexFX = ResHelper.CreateParticle({
                    resPath: "particles/world_shrine/dire_shrine_regen.vpcf",
                    resNpc: null,
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hParent
                });

                ParticleManager.SetParticleControlEnt(nIndexFX, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
                this.AddParticle(nIndexFX, false, false, -1, false, false)
            }
        }
    }
    Init(params: ModifierTable) {
        this.extra_attack_factor = this.GetSpecialValueFor("extra_attack_factor")
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)

    GetPreAttack_BonusDamage(params: ModifierTable) {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        if (!GameFunc.IsValid(hCaster)) {
            this.Destroy()
            return
        }
        // let modifier_combination_t36_dragon_kill = modifier_combination_t36_dragon_kill.findIn(hCaster) as any;
        // let activate_attack_bonus_factor = (GameFunc.IsValid(modifier_combination_t36_dragon_kill) && modifier_combination_t36_dragon_kill.GetStackCount() > 0) && modifier_combination_t36_dragon_kill.activate_attack_bonus_factor || 0
        // return this.GetStackCount() * (this.extra_attack_factor + activate_attack_bonus_factor)
    }
}