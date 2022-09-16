import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { PlayerCreateUnitEntityRoot } from "./PlayerCreateUnitEntityRoot";

export class PlayerCreateBattleUnitEntityRoot extends PlayerCreateUnitEntityRoot {
    IsBuilding() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        return domain.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot");
    }

    addBattleComp() {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessComponent>("ChessComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof WearableComponent>("WearableComponent"), this.GetDotaHeroName());
        this.AddComponent(PrecacheHelper.GetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ItemManagerComponent>("ItemManagerComponent"));
    }

    GetDotaHeroName() {
        return "";
    }
    WearableComp() {
        return this.GetComponentByName<WearableComponent>("WearableComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessComponent>("ChessComponent");
    }
    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    ItemManagerComp() {
        return this.GetComponentByName<ItemManagerComponent>("ItemManagerComponent");
    }
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
}