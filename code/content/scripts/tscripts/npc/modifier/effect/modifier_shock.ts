
import { GameFunc } from "../../../GameFunc";
import { BattleHelper } from "../../../helper/BattleHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_property } from "../../propertystat/modifier_property";

/**触电 */
@registerModifier()
export class modifier_shock extends BaseModifier_Plus {
    GetTexture() {
        return "harpy_storm_chain_lightning"
    }
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
        return "particles/status_fx/status_effect_mjollnir_shield.vpcf"
    }
    StatusEffectPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH
    }
    /**冷却 */
    static SHOCK_COOLDOWN = 0.1;
    static MAX_SHOCK_STACK = 210000000
    static SHOCK_DURATION = 10
    /**上次伤害时间 */
    IsCooldown: boolean = false;

    OnCreated(params: IModifierTable) {
        super.OnCreated(params);
        if (IsClient()) {
            let info: ResHelper.IParticleInfo = {
                resPath: "particles/econ/items/zeus/lightning_weapon_fx/zues_immortal_lightning_weapon_energy.vpcf",
                level: ResHelper.PARTICLE_DETAIL_LEVEL.PARTICLE_DETAIL_LEVEL_MEDIUM,
                owner: this.GetParentPlus(),
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
            }
            let iParticleID = ResHelper.CreateParticle(info)
            ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", Vector(0, 0, 0), false)
            this.AddParticle(iParticleID, false, false, -1, false, false)
        }

    }
    Init(params: IModifierTable) {
        if (IsServer()) {
            let iShockStack = params.iShockStack;
            let duration = params.duration || modifier_shock.SHOCK_DURATION;
            GTimerHelper.AddTimer(duration, GHandler.create(this, () => {
                this.changeStackCount(-iShockStack);
            }))
            this.changeStackCount(iShockStack);
        }
    }


    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    OnShowTooltip() {
        return this.GetStackCount()
    }
    /**受到伤害 */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    OnHurted(params: ModifierInstanceEvent) {
        if (!BattleHelper.DamageFilter(params.record, BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_SHOCK)) {
            return
        }
        let hAttacker = params.attacker
        let hAbility = params.inflictor as IBaseAbility_Plus;
        if (GameFunc.IsValid(hAttacker) && !this.IsCooldown) {
            modifier_shock.ShockActive(this.GetParentPlus(), hAttacker, hAbility, 100, false)
        }
    }
    /**
     * 触电
     * @param hCaster
     * @param hAbility
     * @param iShockStack
     */
    static Shock(target: IBaseNpc_Plus, hCaster: IBaseNpc_Plus, hAbility: IBaseAbility_Plus, iCount: number) {
        if (!IsServer()) { return };
        if (iCount > 0) {
            let outpect = modifier_property.SumProps(hCaster, null, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_SHOCK_COUNT_PERCENTAGE);
            let inpect = modifier_property.SumProps(target, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_SHOCK_COUNT_PERCENTAGE);
            iCount = math.floor(iCount * (1 + outpect * 0.01) * (1 + inpect * 0.01))
        }
        let iShockStack = math.min(iCount, modifier_shock.MAX_SHOCK_STACK)	//  触电层数
        let hShockModifier = modifier_shock.findIn(target);
        if (GameFunc.IsValid(hShockModifier)) {
            let iStack = hShockModifier.GetStackCount()
            let iTargetStack = modifier_shock.MAX_SHOCK_STACK - iStack
            iShockStack = iTargetStack > iShockStack && iShockStack || iTargetStack
        }
        if (iShockStack <= 1) { iShockStack = 1 }
        modifier_shock.apply(target, hCaster, hAbility, {
            duration: modifier_shock.SHOCK_DURATION,
            iShockStack: iShockStack
        })
    }

    static ShockActive(target: IBaseNpc_Plus, hCaster: IBaseNpc_Plus, hAbility: IBaseAbility_Plus, fPercent: number, bIgnoreCooldown = true) {
        if (!GameFunc.IsValid(target)) {
            return
        }
        if (!GameFunc.IsValid(hCaster)) {
            return
        }
        let m_shock = modifier_shock.findIn(target);
        if (!GameFunc.IsValid(m_shock)) {
            return
        }
        if (m_shock.IsCooldown && !bIgnoreCooldown) {
            return
        }
        let damage = m_shock.GetStackCount() * (fPercent * 0.01)
        let damageInfo = {
            attacker: hCaster,
            victim: m_shock.GetParentPlus(),
            ability: hAbility,
            damage: damage,
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NO_SPELL_AMPLIFICATION,
            eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_SHOCK + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_TRANSFORM + BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT,
        }
        BattleHelper.GoApplyDamage(damageInfo);
        ResHelper.CreateParticle(
            {
                resPath: "particles/units/heroes/hero_zuus/zuus_arc_lightning_impact.vpcf",
                iAttachment: ParticleAttachment_t.PATTACH_POINT_FOLLOW,
                owner: m_shock.GetParentPlus()
            }
        );
        if (!bIgnoreCooldown) {
            m_shock.StartCooldown();
        }
    }

    StartCooldown(fCooldown: number = modifier_shock.SHOCK_COOLDOWN) {
        this.IsCooldown = true;
        GTimerHelper.AddTimer(fCooldown, GHandler.create(this, () => {
            this.IsCooldown = false;
        }))
    }
}


