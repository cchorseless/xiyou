import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { unit_base_baoxiang } from "../../../npc/units/common/unit_base_baoxiang";
import { TCharacter } from "../../../service/account/TCharacter";
import { ET } from "../../Entity/Entity";
import { PlayerConfig } from "../../System/Player/PlayerConfig";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { ChessControlComponent } from "../ChessControl/ChessControlComponent";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { CourierEntityRoot } from "../Courier/CourierEntityRoot";
import { DrawComponent } from "../Draw/DrawComponent";
import { EnemyManagerComponent } from "../Enemy/EnemyManagerComponent";
import { FakerHeroEntityRoot } from "../FakerHero/FakerHeroEntityRoot";
import { FHeroCombinationManagerComponent } from "../FakerHero/FHeroCombinationManagerComponent";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";

export class PlayerEntityRoot extends ET.EntityRoot {
    readonly Playerid: PlayerID;
    readonly Hero?: BaseNpc_Hero_Plus;
    readonly FakerHero?: BaseNpc_Plus;

    public IsLogin: boolean;
    public IsLeaveGame: boolean = false;

    public onAwake(): void {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerHttpComponent>("PlayerHttpComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof PlayerDataComponent>("PlayerDataComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof DrawComponent>("DrawComponent"));
    }

    public BindHero(hero: BaseNpc_Hero_Plus): void {
        LogHelper.print("BindHero :=>", this.Playerid);
        (this as any).Hero = hero;
        CourierEntityRoot.Active(hero);
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundManagerComponent>("RoundManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationManagerComponent>("CombinationManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof EnemyManagerComponent>("EnemyManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof BuildingManagerComponent>("BuildingManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        this.CreateFakerHero();
    }

    public CreateFakerHero() {
        if (this.FakerHero == null) {
            let player = this.Domain.ETRoot.AsPlayer();
            let spawn = GameRules.Addon.ETRoot.MapSystem().getFakerHeroSpawnPoint(player.Playerid);
            // todo
            (this as any).FakerHero = unit_base_baoxiang.CreateOne(spawn, DOTATeam_t.DOTA_TEAM_BADGUYS, true);
            FakerHeroEntityRoot.Active(this.FakerHero, player.Playerid, "unit_base_baoxiang");
        }
    }


    public OnLoginFinish(): void {
        this.IsLogin = true;
        while (this._WaitSyncEntity.length > 0) {
            let entity = this._WaitSyncEntity.shift();
            if (entity == null) {
                break;
            }
            this.SyncClientEntity(entity.obj, entity.ignoreChild);
        }
        this._WaitSyncEntity.length = 0;
    }
    private _WaitSyncEntity: { obj: ET.Entity, ignoreChild: boolean }[] = [];
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        if (this.IsLeaveGame) { return }
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
        return this.Hero.IsAlive();
    }

    GetColor() {
        return PlayerConfig.playerColor[this.Playerid];
    }
}
