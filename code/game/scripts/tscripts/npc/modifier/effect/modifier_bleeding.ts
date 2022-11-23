import { GameEnum } from "../../../shared/GameEnum";
import { GameFunc } from "../../../GameFunc";
import { BattleHelper } from "../../../helper/BattleHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_property } from "../../propertystat/modifier_property";
/**流血BUFF */
@registerModifier()
export class modifier_bleeding extends BaseModifier_Plus {
    IsHidden() { return false }
    IsDebuff() { return true }
    IsPurgable() { return false }
    IsPurgeException() { return false }
    IsStunDebuff() { return false }
    AllowIllusionDuplicate() { return false }
    GetAttributes() {
        /**可以同时拥有多个 */
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE
    }
    /**上次位置 */
    vLastPosition: Vector;
    /**未计算伤害距离 */
    fDistance: number;
    /**触发伤害距离 */
    static fTriggerDistance = 100

    Init(params: ModifierTable) {
        if (IsServer()) {
            // 层数
            this.addTimer(params.duration || 1, () => {
                this.DecrementStackCount()
            });
            this.IncrementStackCount();
        }
    }
    OnCreated(params: ModifierTable) {
        if (IsServer()) {
            super.OnCreated(params);
            let hParent = this.GetParentPlus()
            this.vLastPosition = GameFunc.VectorFunctions.StringToVector(params.vLastPosition) || hParent.GetAbsOrigin()
            this.fDistance = params.fDistance || 0;
            // 伤害计算
            this.addFrameTimer(1, () => {
                this.applyDamage();
                return 1
            })
            // // 流血特效
            // let iParticleID = ResHelper.CreateParticle(
            //     {
            //         resPath: "particles/units/heroes/hero_pudge/pudge_meathook_impact.vpcf",
            //         resNpc: this.GetCasterPlus(),
            //         iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN,
            //         owner: this.GetParent()
            //     })
            // ParticleManager.SetParticleControlEnt(iParticleID, 0, this.GetParent(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParent().GetAbsOrigin(), true)
            // ParticleManager.ReleaseParticleIndex(iParticleID)
        }
    }
    /**返回伤害数值 */
    bleedingHandler: ((V: BattleHelper.DamageOptions) => number);
    applyDamage() {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!GameFunc.IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (this.bleedingHandler == null) {
                this.Destroy()
                return
            }

            let vPosition = hParent.GetAbsOrigin()
            this.fDistance += ((vPosition - this.vLastPosition) as Vector).Length2D();
            let fDamageFactor = math.floor(this.fDistance / modifier_bleeding.fTriggerDistance)
            if (fDamageFactor > 0) {
                let tDamageTable: BattleHelper.DamageOptions = {
                    ability: hAbility,
                    victim: hParent,
                    attacker: hCaster,
                    damage: 0,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    eom_flags: BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_BLEEDING +
                        BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_DOT +
                        BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_DAMAGE_TRANSFORM +
                        BattleHelper.enum_EOM_DAMAGE_FLAGS.EOM_DAMAGE_FLAG_NO_SPELL_CRIT
                };
                tDamageTable.damage = this.bleedingHandler(tDamageTable)
                if (this.GetStackCount() != 0) {
                    tDamageTable.damage = math.max(tDamageTable.damage * this.GetStackCount(), 1)
                }
                let vColor = Vector(255, 32, 32)
                let fDuration = 1;
                let _out = modifier_property.SumProps(hCaster, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.OUTGOING_BLEED_DAMAGE_PERCENTAGE);
                let _incom = modifier_property.SumProps(hParent, null, GameEnum.Property.Enum_MODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE);
                let iNumber = math.ceil(tDamageTable.damage * (1 + _incom * 0.01) * (1 + _out * 0.01))
                // 造成伤害
                while (fDamageFactor > 0) {
                    fDamageFactor -= 1;
                    // 伤害飘字
                    let iParticleID = ResHelper.CreateParticle({ resPath: "particles/msg_fx/msg_damage.vpcf", iAttachment: ParticleAttachment_t.PATTACH_CUSTOMORIGIN })
                    ParticleManager.SetParticleControlEnt(iParticleID, 0, hParent, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", hParent.GetAbsOrigin(), true)
                    ParticleManager.SetParticleControl(iParticleID, 1, Vector(0, iNumber, 3))
                    ParticleManager.SetParticleControl(iParticleID, 2, Vector(fDuration, ('' + iNumber).length + 1, 0))
                    ParticleManager.SetParticleControl(iParticleID, 3, vColor)
                    ParticleManager.ReleaseParticleIndex(iParticleID)
                    BattleHelper.GoApplyDamage(tDamageTable)
                }

            };
            this.fDistance -= fDamageFactor * modifier_bleeding.fTriggerDistance;
            this.vLastPosition = vPosition;
        }
    }
    /**
     * 添加流血效果
     * @param hTarget
     * @param hCaster
     * @param hAbility
     * @param bleedingHandler 返回伤害
     * @param fDuration
     * @param bMultiple 是否叠加
     * @returns
     */
    static Bleeding(
        hTarget: BaseNpc_Plus,
        hCaster: BaseNpc_Plus,
        hAbility: BaseAbility_Plus,
        fDuration: number,
        bleedingHandler: (V: BattleHelper.DamageOptions) => number,
        bMultiple: boolean = false) {
        if (!IsServer()) { return };
        if (!GameFunc.IsValid(hTarget)) return;
        let tModifiers = hTarget.FindAllModifiersByName(modifier_bleeding.name) as modifier_bleeding[];
        let vLastPosition;
        let fDistance;
        let hModifier;
        if (tModifiers && tModifiers.length > 0) {
            for (let _hModifier of tModifiers) {
                if (GameFunc.IsValid(_hModifier) && GameFunc.IsValid(_hModifier.GetAbilityPlus()) && GameFunc.IsValid(hAbility)) {
                    if (_hModifier.GetAbilityPlus().GetAbilityName() == hAbility.GetAbilityName()) {
                        if (!bMultiple) {
                            vLastPosition = _hModifier.vLastPosition
                            fDistance = _hModifier.fDistance
                            _hModifier.Destroy()
                            break
                        }
                        else if (hCaster == _hModifier.GetCasterPlus()) {
                            hModifier = _hModifier
                        }
                    }
                }
            }

        }

        if (!GameFunc.IsValid(hModifier)) {
            hModifier = modifier_bleeding.apply(hTarget, hCaster, hAbility, {
                vLastPosition: vLastPosition,
                fDistance: fDistance,
                duration: fDuration
            })
        }
        else {
            hModifier.SetDuration(fDuration, true)
            hModifier.ForceRefresh()
        }
        if (GameFunc.IsValid(hModifier)) {
            hModifier.bleedingHandler = bleedingHandler
        }
    }
}

