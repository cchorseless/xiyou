import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";

/** dota原技能数据 */
export const Data_void_spirit_aether_remnant = { "ID": "7701", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_DONT_RESUME_MOVEMENT | DOTA_ABILITY_BEHAVIOR_VECTOR_TARGETING", "AbilityUnitTargetType": "DOTA_UNIT_TARGET_HERO | DOTA_UNIT_TARGET_BASIC", "AbilityUnitTargetTeam": "DOTA_UNIT_TARGET_TEAM_ENEMY", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "FightRecapLevel": "1", "AbilitySound": "Hero_VoidSpirit.AetherRemnant.Cast", "AbilityCastPoint": "0.0", "AbilityCastRange": "850", "AbilityCooldown": "17.0 15.0 13.0 11.0", "AbilityManaCost": "85 90 95 100", "AbilitySpecial": { "10": { "var_type": "FIELD_FLOAT", "pull_duration": "1.2 1.4 1.6 1.8" }, "11": { "var_type": "FIELD_INTEGER", "pull_destination": "44 50 56 62" }, "12": { "var_type": "FIELD_FLOAT", "duration": "20.0" }, "13": { "var_type": "FIELD_FLOAT", "think_interval": "0.1" }, "01": { "var_type": "FIELD_INTEGER", "start_radius": "90" }, "02": { "var_type": "FIELD_INTEGER", "end_radius": "90" }, "03": { "var_type": "FIELD_INTEGER", "radius": "300" }, "04": { "var_type": "FIELD_INTEGER", "projectile_speed": "900" }, "05": { "var_type": "FIELD_INTEGER", "remnant_watch_distance": "450" }, "06": { "var_type": "FIELD_INTEGER", "remnant_watch_radius": "130" }, "07": { "var_type": "FIELD_INTEGER", "watch_path_vision_radius": "200" }, "08": { "var_type": "FIELD_FLOAT", "activation_delay": "0.4" }, "09": { "var_type": "FIELD_INTEGER", "impact_damage": "80 130 180 230" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_1", "AbilityCastGestureSlot": "DEFAULT" };

@registerAbility()
export class ability1_void_spirit_aether_remnant extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "void_spirit_aether_remnant";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_void_spirit_aether_remnant = Data_void_spirit_aether_remnant;
    Init() {
        this.SetDefaultSpecialValue("radius", 200);
        this.SetDefaultSpecialValue("duration", 12);
        this.SetDefaultSpecialValue("damage", [200, 400, 800, 1200, 1600, 2400]);
        this.SetDefaultSpecialValue("chain_damage_intellect", 1);
        this.SetDefaultSpecialValue("rooted_druation", [1, 1.5, 2, 2.5, 3, 3.5]);
        this.SetDefaultSpecialValue("projectile_speed", 900);
        this.SetDefaultSpecialValue("cast_range", 1000);

    }


    //  触发被动
    UseIllusionSpell() {
        if (!GameFunc.IsValid(this)
            || !GameFunc.IsValid(this.GetCasterPlus())) {
            return
        }

        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { IsDummy: boolean, tIlls: any[], iActivePct: number };
        if (GameFunc.IsValid(hCaster)
            && !hCaster.IsIllusion()
            && !hCaster.IsDummy
            && hCaster.tIlls) {
            let hOriAbility = ability1_void_spirit_aether_remnant.findIn(hCaster)
            let iOriLevel = GameFunc.IsValid(hOriAbility) && hOriAbility.GetLevel() || -1
            if (iOriLevel <= 0) {
                return
            }

            let iActive = 0
            let iUse = 0
            //  灵扉施法
            for (let hIll of (hCaster.tIlls)) {
                if (GameFunc.IsValid(hIll) && hIll.bActive) {
                    iActive = iActive + 1
                    //  激活概率判断
                    let iActivePct = hCaster.iActivePct
                    if (RandomInt(1, 100) < iActivePct) {
                        iUse = iUse + 1
                        let hAbility = ability1_void_spirit_aether_remnant.findIn(hIll)
                        if (!GameFunc.IsValid(hAbility)) {
                            hAbility = hIll.AddAbility("void_spirit_1")
                            hAbility.SetLevel(iOriLevel)
                        }
                        let iLevel = hAbility.GetLevel()
                        if (iLevel != iOriLevel) {
                            hAbility.SetLevel(iOriLevel)
                        }

                        hAbility.UseSpell(hIll, this.GetCursorPosition())
                        hIll.StartGesture(GameActivity_t.ACT_DOTA_CAST_ABILITY_1)
                        hIll.SetForwardVector(hCaster.GetForwardVector())
                        //  ExecuteOrderFromTable({
                        //  	UnitIndex : hIll.entindex(),
                        //  	OrderType : dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                        //  	AbilityIndex : hAbility.entindex(),
                        //  	Position : this.GetCursorPosition(),
                        //  })
                    }
                }
            }
        }
    }
    GetCastRange(vLocation: Vector, hTarget: IBaseNpc_Plus) {
        if (IsClient()) {
            return this.GetSpecialValueFor("cast_range")
        }
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vTarget = this.GetCursorPosition()
        this.UseIllusionSpell()
        this.UseSpell(hCaster, vTarget)
    }
    UseSpell(hCaster: IBaseNpc_Plus, vTarget: Vector) {
        //  let hCaster = this.GetCasterPlus()
        //  let vTarget = this.GetCursorPosition()
        let vOrigin = hCaster.GetAbsOrigin()
        if (hCaster == this.GetOriCaster()) {
            hCaster.EmitSound('Hero_VoidSpirit.AetherRemnant.Cast')
            hCaster.EmitSound('Hero_VoidSpirit.AetherRemnant')
        }

        let cast_range = this.GetSpecialValueFor("cast_range")
        //  let projectile_speed = this.GetSpecialValueFor("projectile_speed")
        let _v = (vTarget - vOrigin) as Vector
        let vDir = _v.Normalized()
        if (vDir.Length2D() < 0.01) {
            vDir = Vector(1, 0, 0)
        }
        if (_v.Length2D() > cast_range) {
            vTarget = (vOrigin + vDir * cast_range) as Vector
        }

        let duration = this.GetSpecialValueFor("duration")
        modifier_void_spirit_1_thinker.applyThinker(vTarget, hCaster, this, { duration: duration }, hCaster.GetTeamNumber(), false)
    }

    GetIntrinsicModifierName() {
        return "modifier_void_spirit_1"
    }

    //  这个技能都用这个应用伤害
    GoApplyDamage(hTarget: IBaseNpc_Plus) {
        if (!GameFunc.IsValid(hTarget)) {
            return
        }
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        let iDamagePct = 100
        if (GameFunc.IsValid(hCaster.hParent)
            && hCaster.IsDummy) {
            // hCaster = hCaster.hParent
            // iDamagePct = hCaster.iDamagePct + (hCaster.HasShard() && hCaster.all_damage_amplify || 0) + hCaster.GetTalentValue('special_bonus_unique_void_spirit_custom_8')
        }
        let fDamage = this.GetSpecialValueFor("damage")
        let chain_damage_intellect = this.GetSpecialValueFor("chain_damage_intellect")
        fDamage = fDamage + hCaster.GetIntellect() * chain_damage_intellect
        fDamage = fDamage * (iDamagePct * 0.01)

        let damage_table = {
            ability: this,
            victim: hTarget,
            attacker: hCaster,
            damage: fDamage,
            damage_type: this.GetAbilityDamageType(),
        }
        BattleHelper.GoApplyDamage(damage_table)
    }
    GetOriCaster() {
        let hCaster = this.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };
        if (GameFunc.IsValid(hCaster.hParent) && hCaster.IsDummy) {
            hCaster = hCaster.hParent as any
        }
        return hCaster
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
//  Modifiers
@registerModifier()
export class modifier_void_spirit_1 extends BaseModifier_Plus {
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
            let ability = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let hCaster = ability.GetCasterPlus() as IBaseNpc_Plus & { hParent: IBaseNpc_Plus, IsDummy: boolean, tIlls: any[], iActivePct: number };

            if (!ability.GetAutoCastState()) {
                return
            }

            if (hCaster.IsTempestDouble() || hCaster.IsIllusion() || hCaster.IsDummy) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let range = ability.GetSpecialValueFor("cast_range") + hCaster.GetCastRangeBonus()
            let radius = ability.GetSpecialValueFor("radius")

            let position = AoiHelper.GetAOEMostTargetsPosition(hCaster.GetAbsOrigin(),
                range,
                hCaster.GetTeamNumber(),
                radius,
                null,
                DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO,
                ability.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
                FindOrder.FIND_CLOSEST
            )

            //  施法命令
            if (position && position != vec3_invalid && hCaster.IsPositionInRange(position, range)) {
                ExecuteOrderFromTable({
                    UnitIndex: hCaster.entindex(),
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                    AbilityIndex: ability.entindex(),
                    Position: position,
                })
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_1_thinker extends BaseModifier_Plus {
    rooted_druation: number;
    radius: number;
    think_interval: number;
    tTriggered: any[];
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        this.radius = this.GetSpecialValueFor('radius')
        this.rooted_druation = this.GetSpecialValueFor('rooted_druation')
        if (IsServer()) {
            this.think_interval = 1 / 30
            this.StartIntervalThink(this.think_interval)
            let hAbility = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant
            if (this.GetCasterPlus() == (hAbility && hAbility.GetOriCaster && hAbility.GetOriCaster())) {
                this.GetParentPlus().EmitSound('Hero_VoidSpirit.AetherRemnant.Spawn_lp')
            }
        }

        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_void_spirit/aether_remnant/void_spirit_1_aether_remnant_watch.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlForward(iPtclID, 0, ((this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()) as Vector).Normalized())
            ParticleManager.SetParticleControl(iPtclID, 0, this.GetCasterPlus().GetAbsOrigin())
            ParticleManager.SetParticleControl(iPtclID, 1, this.GetParentPlus().GetAbsOrigin())
            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.tTriggered = null
            let hAbility = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant
            let hParent = this.GetParentPlus()
            if (this.GetCasterPlus() == (hAbility && hAbility.GetOriCaster && hAbility.GetOriCaster())) {
                hParent.StopSound('Hero_VoidSpirit.AetherRemnant.Spawn_lp')
                hParent.EmitSound('Hero_VoidSpirit.AetherRemnant.Destroy')
            }
            UTIL_Remove(hParent)
        }
    }
    OnIntervalThink() {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant

        if (!GameFunc.IsValid(hAbility) || !GameFunc.IsValid(hCaster)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hOriCaster = hAbility.GetOriCaster && hAbility.GetOriCaster() || null
        if (!GameFunc.IsValid(hOriCaster)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        // 监测范围
        let tTargets = FindUnitsInRadius(
            hParent.GetTeamNumber(),
            hParent.GetAbsOrigin(),
            null,
            this.radius,
            hAbility.GetAbilityTargetTeam(),
            hAbility.GetAbilityTargetType(),
            hAbility.GetAbilityTargetFlags(),
            FindOrder.FIND_ANY_ORDER,
            false
        )
        let iTotalCanRooted = 1 + hOriCaster.GetTalentValue('special_bonus_unique_void_spirit_custom_1')
        this.tTriggered = this.tTriggered || []
        for (let hTarget of (tTargets as IBaseNpc_Plus[])) {
            if (GameFunc.IsValid(hTarget)
                && hTarget.IsAlive()
                && this.tTriggered.length < iTotalCanRooted
                && this.tTriggered.indexOf(hTarget) == null) {
                table.insert(this.tTriggered, hTarget)
                this.RootedEmmy(hTarget)
                if (this.tTriggered.length >= iTotalCanRooted) {
                    this.Destroy()
                    return
                }
            }
        }

        if (this.tTriggered.length >= iTotalCanRooted) {
            this.Destroy()
            return
        }
    }
    RootedEmmy(hTarget: IBaseNpc_Plus) {
        if (GameFunc.IsValid(hTarget) && hTarget.IsAlive()) {
            let hAbility = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant
            if (this.GetCasterPlus() == (hAbility && hAbility.GetOriCaster && hAbility.GetOriCaster())) {
                hTarget.EmitSound('Hero_VoidSpirit.AetherRemnant.Target')
                hTarget.EmitSound('Hero_VoidSpirit.AetherRemnant.Triggered')
            }

            if (hAbility && hAbility.GoApplyDamage) {
                hAbility.GoApplyDamage(hTarget)
            }
            // 拉人
            if (hTarget.IsAlive()) {
                modifier_void_spirit_1_debuff.apply(hTarget, this.GetCasterPlus(), this.GetAbilityPlus(), {
                    duration: this.rooted_druation * hTarget.GetStatusResistanceFactor(this.GetCasterPlus())
                })
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // -modifier_void_spirit_1_debuff// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_void_spirit_1_debuff extends BaseModifier_Plus {
    damage_income: any;
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
        return 'particles/status_fx/status_effect_void_spirit_aether_remnant.vpcf'
    }
    StatusEffectPriority() {
        return 10
    }
    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let hAbility = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant

            this.damage_income = hAbility.GetOriCaster().GetTalentValue('special_bonus_unique_void_spirit_custom_3')

            if (this.GetCasterPlus() == (hAbility && hAbility.GetOriCaster && hAbility.GetOriCaster())) {
                hParent.EmitSound('Hero_VoidSpirit.AetherRemnant.Triggered')
            }
        }
        if (IsClient()) {
            let iPtclID = ResHelper.CreateParticle({
                resPath: "particles/units/heroes/hero_void_spirit/aether_remnant/void_spirit_1_aether_remnant_pull.vpcf",
                resNpc: null,
                iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
                owner: this.GetCasterPlus()
            });

            ParticleManager.SetParticleControlForward(iPtclID, 0, ((this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin()) as Vector).Normalized())
            ParticleManager.SetParticleControl(iPtclID, 0, this.GetCasterPlus().GetAbsOrigin())
            ParticleManager.SetParticleControlEnt(iPtclID, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true)
            this.AddParticle(iPtclID, false, false, -1, false, false)
        }
    }
    OnRefresh(params: IModifierTable) {
        super.OnRefresh(params);
        if (IsServer()) {
            this.damage_income = (this.GetAbilityPlus() as ability1_void_spirit_aether_remnant).GetOriCaster().GetTalentValue('special_bonus_unique_void_spirit_custom_3')
        }
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            let hAbility = this.GetAbilityPlus() as ability1_void_spirit_aether_remnant
            if (this.GetCasterPlus() == (hAbility && hAbility.GetOriCaster && hAbility.GetOriCaster())) {
                this.GetParentPlus().StopSound('Hero_VoidSpirit.AetherRemnant.Triggered')
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    G_INCOMING_DAMAGE_PERCENTAGE() {
        return this.damage_income
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
    }
}
