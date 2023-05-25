
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";

// 蛋的荣耀
@registerAbility()
export class courier_egg_honor extends BaseAbility_Plus {
    GetIntrinsicModifierName() {
        return modifier_courier_egg_honor.name;
    }
    Init(): void {
        let Ihander = GHandler.create(this, (keys: ModifierOverrideAbilitySpecialEvent) => {
            if (keys.ability_special_value == "egg_count") {
                return this.GetCasterPlus().findBuffStack(modifier_courier_egg_honor.name);
            }
        })
        this.RegAbilitySpecialValueOverride("egg_count", Ihander);
    }
    /**
     * 孵化棋子至指定位置
     */
    EggChess() {
        let caster = this.GetCasterPlus();
        if (RollPercentage(this.GetSpecialValueFor("egg_pect"))) {
            let playerroot = caster.GetPlayerRoot();
            let allCombination = playerroot.CombinationManager().getAllAtLeastOneCombination();
            let heros: string[] = [];
            for (let sectname of allCombination) {
                heros = heros.concat(GJsonConfigHelper.GetAllHeroBySectLabel(sectname))
            }
            if (heros.length == 0) {
                caster.SetModel("models/props_winter/egg_shatter_02.vmdl")
                return
            }
            caster.SetModel("models/items/phoenix/phoenix_taunt/phoenix_taunt_egg_cooked.vmdl");
            let unitname = GFuncRandom.RandomOne(heros);
            let startpos = caster.GetAbsOrigin();
            let unit = BaseNpc_Plus.CreateUnitByName(unitname, startpos, caster, false);
            unit.SetForwardVector(Vector(0, 1, 0))
            let pos = playerroot.BuildingManager().getNextAddBuildingPos(unitname);
            let count = 30;
            let v = pos - startpos as Vector;
            this.AddTimer(1, () => {
                count--;
                // 抛物线
                unit.SetAbsOrigin(startpos + v * (1 - count / 30) + Vector(0, 0, (15 - math.abs(15 - count)) * 10) as Vector);
                if (count > 0) {
                    return 0.03;
                }
                else {
                    SafeDestroyUnit(unit);
                    playerroot.BuildingManager().addBuilding(unitname, false, 0);
                }
            })
        }
        else {
            caster.SetModel("models/props_winter/egg_shatter_02.vmdl")
        }
    }
}

@registerModifier()
export class modifier_courier_egg_honor extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }

    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            this.iStackCount = this.GetSpecialValueFor("egg_count");
            let hParent = this.GetParentPlus()
            let playerroot = hParent.GetPlayerRoot();
            if (playerroot) {
                this.iStackCount += playerroot.CourierRoot().CourierEggComp().eggExtraHitCount;
            }
            this.SetStackCount(this.iStackCount);
            this.StartIntervalThink(0.1)
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let units = hParent.FindUnitsInRadiusPlus(ChessControlConfig.Gird_Width / 2 + 50);
            units.forEach(unit => {
                this.OnEggAttackLanded(unit)
            });
        }
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTHBAR_PIPS)
    CC_HEALTHBAR_PIPS() {
        return this.GetStackCount();
    }

    iStackCount: number = 0;

    OnEggAttackLanded(attacker: IBaseNpc_Plus) {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (!IsValid(attacker) || !attacker.IsAlive()) return;
            if (attacker.IsAlive()) {
                attacker.Kill(this.GetAbilityPlus(), hParent);
            }
            if (this.iStackCount > 1) {
                this.iStackCount--;
                hParent.SetHealth(hParent.GetMaxHealth() * (this.iStackCount) / this.GetStackCount());
            }
            else {
                hParent.GetPlayerRoot().CourierRoot().CourierEggComp().KillEgg();
            }
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
        }
    }

    OnStackCountChanged(oldstack: number): void {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            if (oldstack > 0) {
                let curstack = this.GetStackCount();
                this.iStackCount += curstack - oldstack;
                if (this.iStackCount > 0) {
                    hParent.SetHealth(hParent.GetMaxHealth() * (this.iStackCount) / this.GetStackCount());
                }
                else {
                    hParent.GetPlayerRoot().CourierRoot().CourierEggComp().KillEgg();
                }
            }
        }
    }

    // @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED, false, true)
    // On_AttackLanded(params: ModifierAttackEvent) {
    //     let hAbility = this.GetAbilityPlus();
    //     let hParent = this.GetParentPlus();
    //     let attacker = params.attacker as IBaseNpc_Plus;
    //     if (!IsValid(hAbility) || hParent.PassivesDisabled() || !IsValid(attacker)) {
    //         return;
    //     }
    //     attacker.Kill(hAbility, hParent);
    // }

}