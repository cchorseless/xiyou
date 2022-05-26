import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { BuildingComponent } from "./BuildingComponent";

export class BuildingEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    readonly ConfigID: string;

    SetConfigId(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
    }
    BuildingComp() {
        return this.GetComponentByName<BuildingComponent>("BuildingComponent");
    }
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessComponent>("ChessComponent");
    }
    public Dispose(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        super.Dispose();
        npc.SafeDestroy();
    }
}
