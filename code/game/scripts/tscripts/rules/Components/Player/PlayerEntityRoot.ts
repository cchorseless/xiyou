import { NetTablesHelper } from "../../../helper/NetTablesHelper";
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
import { PlayerDataComponent } from "./PlayerDataComponent";
import { PlayerHeroComponent } from "./PlayerHeroComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";
import { PlayerScene } from "./PlayerScene";

export class PlayerEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    readonly Hero?: BaseNpc_Hero_Plus;
    IsLogin: boolean;

    public onAwake(): void {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHttpComponent>("PlayerHttpComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerDataComponent>("PlayerDataComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof DrawComponent>("DrawComponent"));
    }

    public BindHero(hero: BaseNpc_Hero_Plus): void {
        (this as any).Hero = hero;
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHeroComponent>("PlayerHeroComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundManagerComponent>("RoundManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationManagerComponent>("CombinationManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemyManagerComponent>("EnemyManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingManagerComponent>("BuildingManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
    }


    public OnLoginFinish(): void {
        this.IsLogin = true;
        while (this._WaitSyncEntity.length > 0) {
            let entity = this._WaitSyncEntity.shift();
            if (entity == null) {
                break;
            }
            NetTablesHelper.SetETEntity(entity.obj, entity.ignoreChild, this.Playerid);
        }
        this._WaitSyncEntity.length = 0;
    }
    private _WaitSyncEntity: { obj: ET.Entity, ignoreChild: boolean }[] = [];
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        if (this.IsLogin) {
            NetTablesHelper.SetETEntity(obj, ignoreChild, this.Playerid);
        }
        else {
            for (let i = 0, len = this._WaitSyncEntity.length; i < len; i++) {
                if (this._WaitSyncEntity[i].obj === obj) {
                    this._WaitSyncEntity[i].ignoreChild = ignoreChild;
                    return;
                }
            }
            this._WaitSyncEntity.push({ obj: obj, ignoreChild: ignoreChild });
        }
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
    PlayerHeroComp() {
        return this.GetComponentByName<PlayerHeroComponent>("PlayerHeroComponent");
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
