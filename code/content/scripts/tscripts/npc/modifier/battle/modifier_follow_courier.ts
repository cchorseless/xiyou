import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_follow_courier extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    IsHidden(): boolean {
        return false;
    }


    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            let hero = this.GetParentPlus().GetPlayerRoot().Hero;
            // let unit = BaseNpc_Plus.CreateUnitByName("npc_eon_cart", hero.GetAbsOrigin() - hero.GetForwardVector() * 300 as Vector, hero)
            this.GetParentPlus().FollowEntity(hero, false);
            this.GetParentPlus().SetMoveCapability(DOTAUnitMoveCapability_t.DOTA_UNIT_CAP_MOVE_NONE)
            this.GetParentPlus().SetLocalOrigin(hero.GetLeftVector() * 200 + Vector(0, 0, 30) as Vector)
        }
        // this.StartIntervalThink(0)
    }

    OnIntervalThink() {
        if (IsServer()) {
            let hero = this.GetParentPlus().GetPlayerRoot().Hero;
            if (IsValid(hero)) {
                this.GetParentPlus().SetAbsOrigin(hero.GetAbsOrigin() + hero.GetForwardVector() * 300 as Vector)
            }
        }
    }
}
