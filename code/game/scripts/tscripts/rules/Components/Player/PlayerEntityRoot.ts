import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET } from "../../Entity/Entity";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { DrawComponent } from "../Draw/DrawComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerComponent } from "./PlayerComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";

export class PlayerEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    PlayerComp() {
        return this.GetComponentByName<PlayerComponent>("PlayerComponent");
    }
    PlayerHttpComp() {
        return this.GetComponentByName<PlayerHttpComponent>("PlayerHttpComponent");
    }
    DrawComp() {
        return this.GetComponentByName<DrawComponent>("DrawComponent");
    }
    RoundManagerComp() {
        return this.GetComponentByName<RoundManagerComponent>("RoundManagerComponent");
    }
    CombinationManager() {
        return this.GetComponentByName<CombinationManagerComponent>("CombinationManagerComponent");
    }
    BuildingManager() {
        return this.GetComponentByName<BuildingManagerComponent>("BuildingManagerComponent");
    }
    CheckIsAlive() {
        return this.GetDomain<BaseNpc_Hero_Plus>().IsAlive();
    }
}
