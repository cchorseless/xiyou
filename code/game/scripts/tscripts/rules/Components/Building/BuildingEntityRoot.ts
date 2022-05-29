import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { RoundBuildingComponent } from "../Round/RoundBuildingComponent";
import { BuildingComponent } from "./BuildingComponent";
import { BuildingPropsComponent } from "./BuildingPropsComponent";

export class BuildingEntityRoot extends PlayerCreateUnitEntityRoot {

    SetConfigId(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
    }
    BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }
    BuildingPropComp() {
        return this.GetComponentByName<BuildingPropsComponent>("BuildingPropsComponent");
    }
    
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessComponent>("ChessComponent");
    }
    RoundBuildingComp() {
        return this.GetComponentByName<RoundBuildingComponent>("RoundBuildingComponent");
    }
  
}
