import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_never_death extends BaseModifier_Plus {
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }

    IsHidden(): boolean {
        return false;
    }

    DeclareFunctions() {
        return [
            modifierfunction.MODIFIER_PROPERTY_MIN_HEALTH
        ]
    }
    GetMinHealth() {
        return 1;
    }


    public Init(params?: IModifierTable): void {
        if (IsServer()) {
            // let hero = this.GetParentPlus().GetPlayerRoot().Hero;
            // hero.SetFollowRange(200);
            // this.GetParentPlus().SetFollowRange(200);
            // this.GetParentPlus().FollowEntity(this.GetParentPlus().GetPlayerRoot().Hero, false)
            // this.GetParentPlus().SetOrigin
        }
    }
}
