import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { TCharacter } from "../../../service/account/TCharacter";
import { ET } from "../../Entity/Entity";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { ChessControlComponent } from "../ChessControl/ChessControlComponent";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { DrawComponent } from "../Draw/DrawComponent";
import { EnemyManagerComponent } from "../Enemy/EnemyManagerComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerComponent } from "./PlayerComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";

export class PlayerEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    IsLogin: boolean;

    public OnActive(): void {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerComponent>("PlayerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof DrawComponent>("DrawComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundManagerComponent>("RoundManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationManagerComponent>("CombinationManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemyManagerComponent>("EnemyManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingManagerComponent>("BuildingManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        this.PlayerHttpComp().Ping();
    }
    public OnLoginFinish(): void {
        this.IsLogin = true;
        this.TCharacter()?.SyncClient();
        this.PlayerDataComp().updateNetTable();
    }
    PlayerComp() {
        return this.GetComponentByName<PlayerComponent>("PlayerComponent");
    }
    PlayerDataComp() {
        return this.GetComponentByName<PlayerDataComponent>("PlayerDataComponent");
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
    ChessControlComp() {
        return this.GetComponentByName<ChessControlComponent>("ChessControlComponent");
    }
    EnemyManagerComp() {
        return this.GetComponentByName<EnemyManagerComponent>("EnemyManagerComponent");
    }

    TCharacter() {
        return this.GetComponentByName<TCharacter>("TCharacter");
    }
    CheckIsAlive() {
        return this.GetDomain<BaseNpc_Hero_Plus>().IsAlive();
    }
}
