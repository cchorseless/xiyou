
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { GameProtocol } from "../../../shared/GameProtocol";
import { ET } from "../../../shared/lib/Entity";
import { PlayerConfig } from "../../../shared/PlayerConfig";
import { BuildingManagerComponent } from "../Building/BuildingManagerComponent";
import { ChessControlComponent } from "../ChessControl/ChessControlComponent";
import { CombinationManagerComponent } from "../Combination/CombinationManagerComponent";
import { CourierEntityRoot } from "../Courier/CourierEntityRoot";
import { DrawComponent } from "../Draw/DrawComponent";
import { EnemyManagerComponent } from "../Enemy/EnemyManagerComponent";
import { FakerHeroEntityRoot } from "../FakerHero/FakerHeroEntityRoot";
import { RoundManagerComponent } from "../Round/RoundManagerComponent";
import { PlayerDataComponent } from "./PlayerDataComponent";
import { PlayerHttpComponent } from "./PlayerHttpComponent";
import { PlayerScene } from "./PlayerScene";

@GReloadable
export class PlayerSystem extends ET.EntityRoot {
    static readonly HeroSpawnPoint: Vector[] = [];
    static Init() {
        // 出生点
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint0").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint1").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint2").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint3").GetAbsOrigin());
        this.HeroSpawnPoint.push(Entities.FindByName(null, "player_startpoint4").GetAbsOrigin());
        this.addEvent();

    }
    private static addEvent() {
        /**客户端登陆 */
        EventHelper.addProtocolEvent(GameProtocol.Protocol.req_LoginGame, GHandler.create(this, (event: JS_TO_LUA_DATA) => {
            event.state = true;
            this.OnClientLoginPlayer(event.PlayerID);
        }));

    }
    /**
     * 登录服务器
     */
    static async LoginServer() {
        let allPlayer = this.GetAllPlayerid();
        let allServerPlayerId: string[] = [];
        for (let playerid of allPlayer) {
            let playerScene = new PlayerScene();
            PlayerEntityRoot.Active(playerScene, playerid);
            let playerRoot = playerScene.ETRoot;
            await playerRoot.PlayerHttpComp().PlayerLogin(playerid);
            allServerPlayerId.push(playerRoot.PlayerHttpComp().ServerPlayerID)
        }
        let playerRoot = this.GetOneOnlinePlayer();;
        await playerRoot.PlayerHttpComp().CreateGameRecord(allServerPlayerId);
        GLogHelper.print("登录服务器成功");
        // GTimerHelper.AddTimer(5, GHandler.create(this, () => {
        //     GLogHelper.print("开始游戏");
        //     playerRoot.PlayerHttpComp().PlayerLogin(0);
        //     return 5
        // }))
        this.ListenPlayerDisconnect();
    }
    static readonly IsAllLogin: boolean = false;
    private static OnClientLoginPlayer(playerid: PlayerID) {
        if (this.IsAllLogin) {
            return;
        }
        let playerroot = PlayerEntityRoot.GetOneInstance(playerid)
        playerroot.OnLoginFinish();
        const allPlayer = PlayerEntityRoot.GetAllInstance()
        for (let player of allPlayer) {
            if (!player.IsLogin) {
                return;
            }
        }
        (this.IsAllLogin as any) = true;
        GGameScene.OnAllPlayerClientLoginFinish();
    }

    private static _WaitUploadGameRecord: { k: string, v: string }[] = [];
    public static UploadGameRecord(key: string, v: string | number) {
        this._WaitUploadGameRecord.push({ k: key, v: v + "" });
        let player = this.GetOneOnlinePlayer();
        if (player) {
            let keys: string[] = [];
            let values: string[] = [];
            for (let info of this._WaitUploadGameRecord) {
                keys.push(info.k);
                values.push(info.v);
            }
            this._WaitUploadGameRecord = [];
            player.PlayerHttpComp().UploadGameRecord(keys, values);
        }
    }


    /**
       * 監聽玩家斷綫自動失敗
       * @param inter
       */
    public static ListenPlayerDisconnect(inter: number = 1) {
        GTimerHelper.AddTimer(inter,
            GHandler.create(this, () => {
                this.GetAllValidPlayer().forEach(async (playerroot) => {
                    const iPlayerID = playerroot.BelongPlayerid;
                    if (PlayerResource.GetConnectionState(iPlayerID) == DOTAConnectionState_t.DOTA_CONNECTION_STATE_ABANDONED) {
                        await this.OnPlayerLeaveGame(iPlayerID);
                    }
                });
                return inter;
            }), true);
    }

    /**
    * 讓玩家失敗
    * @param iPlayerID
    */
    static async OnPlayerLeaveGame(iPlayerID: PlayerID) {
        let player = PlayerEntityRoot.GetOneInstance(iPlayerID)
        player.IsLeaveGame = true;
        await player.PlayerHttpComp().PlayerLoginOut();
        let hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID);
        if (hHero && hHero.IsAlive()) {
            // -- 数据存储
            // this.UpdatePlayerEndData(hHero)
            hHero.ForceKill(false);
            let allLose = true;
            this.GetAllPlayerid()
                .forEach((playerId) => {
                    let _hHero = PlayerResource.GetSelectedHeroEntity(playerId);
                    if (_hHero && _hHero.IsAlive()) {
                        allLose = false;
                    }
                });
            if (allLose) {
                GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_BADGUYS);
            }
        }
    }

    public static IsAllBindHeroFinish(): boolean {
        const allPlayer = PlayerEntityRoot.GetAllInstance()
        for (let player of allPlayer) {
            if (player.Hero == null) {
                return false;
            }
        }
        return true;
    }


    public static IsValidPlayer(playerid: PlayerID | number | string): boolean {
        return PlayerEntityRoot.GetOneInstance(Number(playerid) as PlayerID) != null;
    }
    public static GetOneOnlinePlayer(): IPlayerEntityRoot {
        const allPlayer = PlayerEntityRoot.GetAllInstance()
        for (let player of allPlayer) {
            if (player.PlayerHttpComp().IsOnline) {
                return player;
            }
        }
        return null;
    }

    public static GetAllValidPlayer(): IPlayerEntityRoot[] {
        return PlayerEntityRoot.GetAllInstance().filter(player => { return !player.IsLeaveGame })
    }

    /**
     * 开始游戏
     */
    static StartGame() {
        const allPlayer = PlayerEntityRoot.GetAllInstance()
        for (let player of allPlayer) {
            player.PlayerDataComp().StartGame();
        }
    }

    /**
     * 獲取
     * @param team
     * @returns
     */
    static GetAllPlayeridByTeam(team: DOTATeam_t = DOTATeam_t.DOTA_TEAM_GOODGUYS): Array<PlayerID> {
        let count = PlayerResource.GetPlayerCountForTeam(team);
        let r: Array<PlayerID> = [];
        for (let i = 0; i < count; i++) {
            let playerid = PlayerResource.GetNthPlayerIDOnTeam(team, i);
            if (PlayerResource.IsValidPlayerID(playerid)) {
                r.push(playerid);
            }
        }
        return r;
    }

    static GetAllPlayerid(): Array<PlayerID> {
        let count = PlayerResource.GetPlayerCount();
        let r: Array<PlayerID> = [];
        for (let playerid = 0; playerid < count; playerid++) {
            if (PlayerResource.IsValidPlayerID(playerid)) {
                r.push(playerid);
            }
        }
        return r;
    }

    /**
     * 将steamid转为playerid
     * @param sSteamid
     * @returns
     */
    static SteamID2PlayerID(sSteamid: Uint64): PlayerID {
        let retPlayerID = -1;
        let _sSteamid = sSteamid.ToHexString();
        this.GetAllPlayeridByTeam().forEach((iPlayerID) => {
            let sPlayerSteamid = PlayerResource.GetSteamID(iPlayerID).ToHexString();
            if (sPlayerSteamid == _sSteamid) {
                retPlayerID = iPlayerID;
            }
        });
        return retPlayerID as PlayerID;
    }

    /**
     * steamid
     * @param sSteamid
     * @returns
     */
    static GetSteamID(iPlayerID: PlayerID): string {
        return PlayerResource.GetSteamID(iPlayerID).ToHexString();
    }

    /**
     * AccountID
     * @param sSteamid
     * @returns
     */
    static GetAccountID(iPlayerID: PlayerID): string {
        return PlayerResource.GetSteamAccountID(iPlayerID).toString();
    }

    /**
     * 获取英雄
     * @param playerid
     * @returns
     */
    static GetHero(playerid: PlayerID) {
        return PlayerResource.GetPlayer(playerid).GetAssignedHero() as IBaseNpc_Hero_Plus;
    }
}



export class PlayerEntityRoot extends PlayerSystem {
    readonly Hero?: IBaseNpc_Hero_Plus;
    readonly FakerHero?: IBaseNpc_Plus;

    public IsLogin: boolean;
    public IsLeaveGame: boolean = false;

    public onAwake(playerid: PlayerID): void {
        (this.BelongPlayerid as any) = playerid;
        this.AddComponent(GGetRegClass<typeof PlayerHttpComponent>("PlayerHttpComponent"));
        this.AddComponent(GGetRegClass<typeof PlayerDataComponent>("PlayerDataComponent"));
        this.AddComponent(GGetRegClass<typeof DrawComponent>("DrawComponent"));
    }

    public BindHero(hero: IBaseNpc_Hero_Plus): void {
        LogHelper.print("BindHero :=>", this.BelongPlayerid);
        (this.Hero as any) = hero;
        CourierEntityRoot.Active(hero);
        this.AddComponent(GGetRegClass<typeof RoundManagerComponent>("RoundManagerComponent"));
        this.AddComponent(GGetRegClass<typeof CombinationManagerComponent>("CombinationManagerComponent"));
        this.AddComponent(GGetRegClass<typeof EnemyManagerComponent>("EnemyManagerComponent"));
        this.AddComponent(GGetRegClass<typeof BuildingManagerComponent>("BuildingManagerComponent"));
        this.AddComponent(GGetRegClass<typeof ChessControlComponent>("ChessControlComponent"));
        this.CreateFakerHero();
        GGameServiceSystem.GetInstance().OnBindHeroFinish(this.BelongPlayerid);
    }

    public CreateFakerHero() {
        if (this.FakerHero == null) {
            let spawn = GMapSystem.GetInstance().getFakerHeroSpawnPoint(this.BelongPlayerid);
            // todo
            (this.FakerHero as any) = BaseNpc_Plus.CreateUnitByName("unit_base_baoxiang", spawn, this.Hero, true, DOTATeam_t.DOTA_TEAM_BADGUYS);
            FakerHeroEntityRoot.Active(this.FakerHero, this.BelongPlayerid, "unit_base_baoxiang");
        }
    }


    public OnLoginFinish(): void {
        this.IsLogin = true;
        while (this._WaitSyncEntity.length > 0) {
            let entity = this._WaitSyncEntity.shift();
            if (entity == null) {
                break;
            }
            this.SyncClientEntity(entity.obj, entity.ignoreChild, entity.isShare);
        }
        this._WaitSyncEntity.length = 0;
    }
    private _WaitSyncEntity: { obj: ET.Entity, ignoreChild: boolean, isShare: boolean }[] = [];
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false, isShare: boolean = false): void {
        if (this.IsLeaveGame) { return }
        if (this.IsLogin) {
            if (isShare) {
                NetTablesHelper.SetETEntity(obj, ignoreChild);
            }
            else {
                NetTablesHelper.SetETEntity(obj, ignoreChild, this.BelongPlayerid);
            }
        }
        else {
            for (let i = 0, len = this._WaitSyncEntity.length; i < len; i++) {
                if (this._WaitSyncEntity[i].obj === obj) {
                    this._WaitSyncEntity[i].ignoreChild = ignoreChild;
                    this._WaitSyncEntity[i].isShare = isShare;
                    return;
                }
            }
            this._WaitSyncEntity.push({ obj: obj, ignoreChild: ignoreChild, isShare: isShare });
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
    CourierRoot() {
        return this.Hero.ETRoot.As<ICourierEntityRoot>()
    }

    FakerHeroRoot() {
        return this.FakerHero.ETRoot.As<IFakerHeroEntityRoot>()
    }

    TCharacter() {
        return this.GetComponentByName<ITCharacter>("TCharacter");
    }

    CheckIsAlive() {
        return this.Hero.IsAlive();
    }

    GetColor() {
        return GFuncVector.ArrayToVector(PlayerConfig.playerColor[this.BelongPlayerid]);
    }

}

declare global {
    type IPlayerEntityRoot = PlayerEntityRoot;
    var GPlayerEntityRoot: typeof PlayerEntityRoot;
}
if (_G.GPlayerEntityRoot == null) {
    _G.GPlayerEntityRoot = PlayerEntityRoot;
}