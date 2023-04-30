
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// 伤害分担
@registerAbility()
export class faker_courier_damage_shared extends BaseAbility_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_faker_courier_damage_shared"
    }

}

@registerModifier()
export class modifier_faker_courier_damage_shared extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return true;
    }
    public IsPurgable(): boolean {
        return false;
    }


    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE, false, true)
    CC_OnTakeDamage(params: ModifierInstanceEvent) {
        let hTarget = this.GetParentPlus()
        let attacker = params.attacker as IBaseNpc_Plus;
        let ability = params.inflictor as IBaseAbility_Plus;
        let damage_type = params.damage_type;
        let damage_category = params.damage_category;
        let damage_flags = params.damage_flags;
        if (!IsValid(hTarget)) {
            this.Destroy()
            return
        }
        let allenemy = hTarget.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(hTarget.GetTeam());
        allenemy = allenemy.filter((enemy) => { return enemy.GetOwnerPlus() == hTarget });
        let enemyCount = allenemy.length;
        if (enemyCount < 1) {
            return
        }
        let damage = math.floor(params.damage / enemyCount);
        allenemy.forEach((enemy) => {
            if (enemy !== hTarget) {
                ApplyDamage({
                    victim: enemy,
                    attacker: attacker,
                    damage: damage,
                    damage_type: damage_type,
                    damage_flags: damage_flags,
                    ability: ability,
                });
            }
        });
        // 补偿伤害
        hTarget.ModifyHealthPlus(damage * (enemyCount - 1))
    }
}

