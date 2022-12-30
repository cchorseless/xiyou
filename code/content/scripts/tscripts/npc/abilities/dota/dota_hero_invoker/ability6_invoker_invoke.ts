import { GameFunc } from "../../../../GameFunc";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { ability1_invoker_quas } from "./ability1_invoker_quas";
import { ability2_invoker_wex } from "./ability2_invoker_wex";
import { ability3_invoker_exort } from "./ability3_invoker_exort";

/** dota原技能数据 */
export const Data_invoker_invoke = { "ID": "5375", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_NO_TARGET | DOTA_ABILITY_BEHAVIOR_IMMEDIATE | DOTA_ABILITY_BEHAVIOR_SHOW_IN_GUIDES", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "MaxLevel": "1", "RequiredLevel": "1", "AbilitySound": "Hero_Invoker.Invoke", "AbilityCooldown": "7", "AbilityManaCost": "0", "AbilityCastAnimation": "ACT_INVALID", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "max_invoked_spells": "2" }, "02": { "var_type": "FIELD_FLOAT", "cooldown_reduction_per_orb": "0.3" } } };

@registerAbility()
export class ability6_invoker_invoke extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "invoker_invoke";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_invoker_invoke = Data_invoker_invoke;
    _orbs: any[];
    _cursor: number;


    Spawn() {
        if (IsServer()) {
            this._orbs = []
            for (let i = 1; i <= 3; i++) {
                table.insert(this._orbs, {
                    sType: "",
                    sAttachmentName: "attach_orb" + tostring(i),
                    hBuff: null
                })
            }
            this._cursor = 1
        }
    }
    ProcsMagicStick() {
        return false
    }
    GetSpell() {
        let res = [] as any[]
        for (let i = 1; i <= 3; i++) {
            let sType = this._orbs[i].sType
            if (sType == "quas") {
                table.insert(res, "q")
            } else if (sType == "wex") {
                table.insert(res, "w")
            } else if (sType == "exort") {
                table.insert(res, "e")
            } else {
                return
            }
        }
        if (res[0] == res[3]) {
            let temp = res[2]
            res[2] = res[3]
            res[3] = temp
        } else if (res[2] == res[3]) {
            let temp = res[0]
            res[0] = res[3]
            res[3] = temp
        } else if (res[0] != res[2]) {
            return "qwe"
        }
        let spell = ""
        for (let i = 1; i <= 3; i++) {
            spell = spell + res[i]
        }
        return spell
    }
    GetIntrinsicModifierName() {
        return "modifier_invoker_invoke_custom"
    }
    Invoke(sOrb: string) {
        if (!(sOrb == "quas" || sOrb == "wex" || sOrb == "exort")) { return }
        let hCaster = this.GetCasterPlus()
        let sParticleName = ResHelper.GetParticleReplacement("particles/units/heroes/hero_invoker/invoker_" + sOrb + "_orb.vpcf", hCaster)
        let iParticleID = ResHelper.CreateParticle({
            resPath: sParticleName,
            resNpc: null,
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN,
            owner: hCaster
        });

        let orb = this._orbs[this._cursor]
        if (GameFunc.IsValid(orb.hBuff)) {
            orb.hBuff.Destroy()
        }
        orb.sType = sOrb
        ParticleManager.SetParticleControlEnt(iParticleID, 1, hCaster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, orb.sAttachmentName, Vector(0, 0, 0), false)
        // let hAbility = invoker_ + sOrb + _custom.findIn(hCaster)
        // orb.hBuff = modifier_invoker_ + sOrb + _custom.apply(hCaster, hCaster, hAbility)
        // if (orb.hBuff) {
        //     orb.hBuff.AddParticle(iParticleID, false, false, 0, false, false)
        // }
        this._cursor = this._cursor + 1
        if (this._cursor > 3) {
            this._cursor = 1
        }
    }
    OnSpellStart() {
        let spell = this.GetSpell()
        if (spell) {
            spell = "invoker_" + spell + "_custom"
        }
        else {
            this.EndCooldown()
            return
        }
        let hCaster = this.GetCasterPlus()
        let hAbility = hCaster.FindAbilityByName(spell) as IBaseAbility_Plus;
        if (hAbility) {
            if (hAbility.GetAbilityIndex() == 3) {
                this.EndCooldown()
            } else if (hAbility.GetAbilityIndex() == 4) {
                let hAbility2 = hCaster.GetAbilityByIndex(3)
                hCaster.SwapAbilities(hAbility2.GetName(), hAbility.GetName(), true, true)
                this.EndCooldown()
            } else {
                let hAbility2 = hCaster.GetAbilityByIndex(3)
                let hAbility3 = hCaster.GetAbilityByIndex(4)
                hCaster.SwapAbilities(hAbility2.GetName(), hAbility3.GetName(), true, false)
                hCaster.SwapAbilities(hAbility.GetName(), hAbility3.GetName(), true, false)
                hAbility3.SetHidden(false)
                hAbility3.SetHidden(true)
                if (hAbility.IsCooldownReady()) {
                    hAbility2.EndCooldown()
                }
            }
        }
        else {
            hAbility = hCaster.AddAbility(spell) as IBaseAbility_Plus
            let hAbility2 = hCaster.GetAbilityByIndex(3)
            let hAbility3 = hCaster.GetAbilityByIndex(4)
            hCaster.SwapAbilities(hAbility2.GetName(), hAbility3.GetName(), true, false)
            hCaster.SwapAbilities(hAbility.GetName(), hAbility3.GetName(), true, false)
            if (hAbility3.GetName() == "invoker_empty1_custom" || hAbility3.GetName() == "invoker_empty2_custom") {
                hCaster.RemoveAbilityByHandle(hAbility3)
            } else {
                hAbility3.SetHidden(true)
            }
            if (hAbility.IsCooldownReady()) {
                hAbility2.EndCooldown()
            }
        }
        hAbility.Spawn()
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_invoker_invoke_custom extends BaseModifier_Plus {
    tAutoCastMemory: any;
    _tooltip: number;
    OnCreated(params: ModifierTable) {
        super.OnCreated(params);
        if (IsServer()) {
            this.tAutoCastMemory = {}
            this.StartIntervalThink(0)
        }
        this._tooltip = 0
    }
    OnIntervalThink() {
        let hCaster = this.GetParentPlus()
        for (let i = 3; i <= 4; i++) {
            let hAbility = hCaster.GetAbilityByIndex(i) as IBaseAbility_Plus
            if (hAbility && hAbility.IsFullyCastable() && hAbility.GetAutoCastState()) {
                let tMemory = this.tAutoCastMemory[hAbility.GetName()]
                let tTargets = FindUnitsInRadius(hCaster.GetTeam(), hCaster.GetOrigin(), null, hAbility.GetCastRange(hCaster.GetOrigin(), null), hAbility.GetAbilityTargetTeam(), hAbility.GetAbilityTargetType(), hAbility.GetAbilityTargetFlags(), 0, false)
                if (tTargets.length > 0) {
                    if (tMemory) {
                        ExecuteOrderFromTable({
                            UnitIndex: hCaster.entindex(),
                            OrderType: tMemory.iOrder,
                            TargetIndex: tMemory.hTarget && tMemory.hTarget.entindex() || tTargets[RandomInt(1, tTargets.length)].entindex(),
                            AbilityIndex: hAbility.entindex(),
                            Position: tMemory.vPos,
                            Queue: false
                        })
                    } else {
                        let hTarget = tTargets[RandomInt(1, tTargets.length)]
                        let iOrder = 0
                        let iBehavior = hAbility.GetBehaviorInt()
                        if (bit.band(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
                            iOrder = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET
                        } else if (bit.band(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) {
                            iOrder = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET
                        } else if (bit.band(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) {
                            iOrder = dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION
                        }
                        ExecuteOrderFromTable({
                            UnitIndex: hCaster.entindex(),
                            OrderType: iOrder,
                            TargetIndex: hTarget.entindex(),
                            AbilityIndex: hAbility.entindex(),
                            Position: hTarget.GetOrigin(),
                            Queue: false
                        })
                    }
                } else {

                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    OnOrder(params: ModifierTable) {
        let hAbility = params.ability
        if (params.issuer_player_index != -1 && hAbility) {
            if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION || params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET || params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET) {
                this.tAutoCastMemory[hAbility.GetName()] = {
                    vPos: params.new_pos,
                    iOrder: params.order_type,
                    hTarget: params.target
                }
            } else if (params.order_type == dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO) {
                let bState = hAbility.GetAutoCastState()
                if (bState) {
                    this.tAutoCastMemory[hAbility.GetName()] = null
                }
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    EOM_GetModifierStatusResistanceStacking() {
        let hAbility = ability1_invoker_quas.findIn(this.GetCasterPlus())
        if (GameFunc.IsValid(hAbility)) {
            let mult = this.GetCasterPlus().GetTalentValue("special_bonus_unique_invoker_custom_3")
            if (mult != 0) {
                return hAbility.GetSpecialValueFor("status_resistance_per_level") * hAbility.GetLevel() * mult
            } else {
                return hAbility.GetSpecialValueFor("status_resistance_per_level") * hAbility.GetLevel()
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.COOLDOWN_PERCENTAGE)
    EOM_GetModifierPercentageCooldown() {
        let hAbility = ability2_invoker_wex.findIn(this.GetCasterPlus())
        if (GameFunc.IsValid(hAbility)) {
            let mult = this.GetCasterPlus().GetTalentValue("special_bonus_unique_invoker_custom_3")
            if (mult != 0) {
                return hAbility.GetSpecialValueFor("cooldown_reduce_per_level") * hAbility.GetLevel() * mult
            } else {
                return hAbility.GetSpecialValueFor("cooldown_reduce_per_level") * hAbility.GetLevel()
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.SPELL_AMPLIFY_BONUS)
    EOM_GetModifierSpellAmplifyBonus() {
        let hAbility = ability3_invoker_exort.findIn(this.GetCasterPlus())
        if (GameFunc.IsValid(hAbility)) {
            let mult = this.GetCasterPlus().GetTalentValue("special_bonus_unique_invoker_custom_3")
            if (mult != 0) {
                return hAbility.GetSpecialValueFor("spell_amplify_per_level") * hAbility.GetLevel() * mult
            } else {
                return hAbility.GetSpecialValueFor("spell_amplify_per_level") * hAbility.GetLevel()
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.OVERRIDE_ANIMATION)

    Get_OverrideAnimation() {
        return GameActivity_t.ACT_DOTA_CONSTANT_LAYER
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    On_Tooltip() {
        if (IsClient()) {
            let res = 0
            if (this._tooltip == 0) {
                res = this.EOM_GetModifierStatusResistanceStacking()
            } else if (this._tooltip == 1) {
                res = this.EOM_GetModifierPercentageCooldown()
            } else if (this._tooltip == 2) {
                res = this.EOM_GetModifierSpellAmplifyBonus()
            }
            this._tooltip = this._tooltip + 1
            if (this._tooltip >= 3) {
                this._tooltip = 0
            }
            return res
        }
    }
}
