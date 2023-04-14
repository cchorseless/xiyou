import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
/**流血BUFF */
@registerModifier()
export class modifier_generic_bleeding extends BaseModifier_Plus {
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

    Init(params: IModifierTable) {
        if (IsServer()) {
            // 层数
            GTimerHelper.AddTimer(params.duration || 1, GHandler.create(this, () => {
                this.DecrementStackCount()
            }));
            this.IncrementStackCount();
        }
    }
    BeCreated(params: IModifierTable) {
        if (IsServer()) {

            let hParent = this.GetParentPlus()
            this.vLastPosition = GFuncVector.StringToVector(params.vLastPosition) || hParent.GetAbsOrigin()
            this.fDistance = params.fDistance || 0;
            // 伤害计算
            GTimerHelper.AddFrameTimer(1, GHandler.create(this, () => {
                this.applyDamage();
                return 1
            }))
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
    bleedingHandler: ((V: IBattleDamageOptions) => number);
    applyDamage() {
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (IsServer()) {
            if (!IsValid(hCaster)) {
                this.Destroy()
                return
            }
            if (this.bleedingHandler == null) {
                this.Destroy()
                return
            }

            let vPosition = hParent.GetAbsOrigin()
            this.fDistance += ((vPosition - this.vLastPosition) as Vector).Length2D();
            let fDamageFactor = math.floor(this.fDistance / modifier_generic_bleeding.fTriggerDistance)
            if (fDamageFactor > 0) {
                let tDamageTable: IBattleDamageOptions = {
                    ability: hAbility,
                    victim: hParent,
                    attacker: hCaster,
                    damage: 0,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                    extra_flags: GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_BLEEDING +
                        GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_DOT +
                        GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NO_DAMAGE_TRANSFORM +
                        GEBATTLE_DAMAGE_FLAGS.DAMAGE_FLAG_NO_SPELL_CRIT
                };
                tDamageTable.damage = this.bleedingHandler(tDamageTable)
                if (this.GetStackCount() != 0) {
                    tDamageTable.damage = math.max(tDamageTable.damage * this.GetStackCount(), 1)
                }
                let vColor = Vector(255, 32, 32)
                let fDuration = 1;
                let _out = GPropertyCalculate.SumProps(hCaster, null, GPropertyConfig.EMODIFIER_PROPERTY.OUTGOING_BLEED_DAMAGE_PERCENTAGE);
                let _incom = GPropertyCalculate.SumProps(hParent, null, GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_BLEED_DAMAGE_PERCENTAGE);
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
                    ApplyDamage(tDamageTable)
                }

            };
            this.fDistance -= fDamageFactor * modifier_generic_bleeding.fTriggerDistance;
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
        hTarget: IBaseNpc_Plus,
        hCaster: IBaseNpc_Plus,
        hAbility: IBaseAbility_Plus,
        fDuration: number,
        bleedingHandler: (V: IBattleDamageOptions) => number,
        bMultiple: boolean = false) {
        if (!IsServer()) { return };
        if (!IsValid(hTarget)) return;
        let tModifiers = hTarget.FindAllModifiersByName(modifier_generic_bleeding.name) as modifier_generic_bleeding[];
        let vLastPosition;
        let fDistance;
        let hModifier;
        if (tModifiers && tModifiers.length > 0) {
            for (let _hModifier of tModifiers) {
                if (IsValid(_hModifier) && IsValid(_hModifier.GetAbilityPlus()) && IsValid(hAbility)) {
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

        if (!IsValid(hModifier)) {
            hModifier = modifier_generic_bleeding.apply(hTarget, hCaster, hAbility, {
                vLastPosition: vLastPosition,
                fDistance: fDistance,
                duration: fDuration
            })
        }
        else {
            hModifier.SetDuration(fDuration, true)
            hModifier.ForceRefresh()
        }
        if (IsValid(hModifier)) {
            hModifier.bleedingHandler = bleedingHandler
        }
    }
}

