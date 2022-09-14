import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { PlayerEntityRoot } from "../../Components/Player/PlayerEntityRoot";
import { PlayerHttpComponent } from "../../Components/Player/PlayerHttpComponent";
import { PlayerScene } from "../../Components/Player/PlayerScene";
import { ET, registerET } from "../../Entity/Entity";
import { PlayerState } from "./PlayerState";

@registerET()
export class PlayerSystemComponent extends ET.Component {
    public readonly AllPlayer: { [k: string]: PlayerEntityRoot } = {};

    public onAwake() {
        PlayerState.init();
        this.addEvent();
    }

    private addEvent() {
        /**客户端登陆 */
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_LoginGame, (event: JS_TO_LUA_DATA) => {
            event.state = true;
            this.OnLoginPlayer(event.PlayerID);
        });


    }

    public readonly IsAllLogin: boolean = false;
    private OnLoginPlayer(playerid: PlayerID) {
        if (this.IsAllLogin) {
            return;
        }
        let playerroot = this.GetPlayer(playerid);
        playerroot.OnLoginFinish();
        for (let player of this.GetAllPlayer()) {
            if (!player.IsLogin) {
                return;
            }
        }
        this.OnAllPlayerClientLoginFinish();
    }


    public OnAllPlayerClientLoginFinish() {
        (this as any).IsAllLogin = true;
        while (this._WaitSyncEntity.length > 0) {
            let entity = this._WaitSyncEntity.shift();
            if (entity == null) {
                break;
            }
            NetTablesHelper.SetETEntity(entity.obj, entity.ignoreChild);
        }
        this._WaitSyncEntity.length = 0;
    }

    private _WaitUploadGameRecord: { k: string, v: string }[] = [];
    public UploadGameRecord(key: string, v: string | number) {
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
    public ListenPlayerDisconnect(inter: number = 5) {
        TimerHelper.addTimer(
            inter,
            () => {
                this.GetAllPlayerid()
                    .forEach(async (iPlayerID) => {
                        if (PlayerResource.GetConnectionState(iPlayerID) == DOTAConnectionState_t.DOTA_CONNECTION_STATE_ABANDONED) {
                            await this.OnPlayerLeaveGame(iPlayerID);
                        }
                    });
                return inter;
            },
            this,
            false
        );
    }

    /**
    * 讓玩家失敗
    * @param iPlayerID
    */
    async OnPlayerLeaveGame(iPlayerID: PlayerID) {
        let player = this.GetPlayer(iPlayerID);
        player.IsLeaveGame = true;
        await player.PlayerHttpComp().PlayerLoginOut();
        let hHero = PlayerResource.GetSelectedHeroEntity(iPlayerID);
        if (hHero && hHero.IsAlive()) {
            // -- 数据存储
            // this.UpdatePlayerEndData(hHero)
            if (IsInToolsMode()) {
                hHero.ForceKill(false);
            }
            let allLose = true;
            this.GetAllPlayerid()
                .forEach((playerId) => {
                    let _hHero = PlayerResource.GetSelectedHeroEntity(playerId);
                    if (_hHero && _hHero.IsAlive()) {
                        allLose = false;
                    }
                });
            if (allLose && !IsInToolsMode()) {
                GameRules.SetGameWinner(DOTATeam_t.DOTA_TEAM_BADGUYS);
            }
        }
    }


    private _WaitSyncEntity: { obj: ET.Entity, ignoreChild: boolean }[] = [];
    public SyncClientEntity(obj: ET.Entity, ignoreChild: boolean = false): void {
        if (this.IsAllLogin) {
            NetTablesHelper.SetETEntity(obj, ignoreChild);
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
    public IsAllBindHeroFinish(): boolean {
        for (let k in this.AllPlayer) {
            if (this.AllPlayer[k].Hero == null) {
                return false;
            }
        }
        return true;
    }


    public IsValidPlayer(playerid: PlayerID | number | string): boolean {
        return this.AllPlayer[playerid + ""] != null;
    }
    public GetOneOnlinePlayer(): PlayerEntityRoot {
        let allPlayer = this.GetAllPlayer();
        for (let player of allPlayer) {
            if (player.PlayerHttpComp().IsOnline) {
                return player;
            }
        }
        return null;
    }


    public GetPlayer(playerid: PlayerID | number | string): PlayerEntityRoot {
        return this.AllPlayer[playerid + ""];
    }

    public GetAllPlayer() {
        return Object.values(this.AllPlayer);
    }

    public async StartGame() {
        let allPlayer = this.GetAllPlayerid();
        let allServerPlayerId: string[] = [];
        for (let playerid of allPlayer) {
            let playerScene = new PlayerScene();
            PlayerEntityRoot.Active(playerScene);
            let playerRoot = playerScene.ETRoot;
            (playerRoot as any).Playerid = playerid;
            this.AllPlayer[playerid + ""] = playerRoot;
            await playerRoot.PlayerHttpComp().PlayerLogin(playerid);
            allServerPlayerId.push(playerRoot.PlayerHttpComp().ServerPlayerID)
        }
        let playerRoot = this.GetOneOnlinePlayer();;
        await playerRoot.PlayerHttpComp().CreateGameRecord(allServerPlayerId);
        this.ListenPlayerDisconnect();
    }

    /**
     * 獲取
     * @param team
     * @returns
     */
    public GetAllPlayeridByTeam(team: DOTATeam_t = DOTATeam_t.DOTA_TEAM_GOODGUYS): Array<PlayerID> {
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

    public GetAllPlayerid(): Array<PlayerID> {
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
    public SteamID2PlayerID(sSteamid: Uint64): PlayerID {
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
    public GetSteamID(iPlayerID: PlayerID): string {
        return PlayerResource.GetSteamID(iPlayerID).ToHexString();
    }

    /**
     * AccountID
     * @param sSteamid
     * @returns
     */
    public GetAccountID(iPlayerID: PlayerID): string {
        return PlayerResource.GetSteamAccountID(iPlayerID).toString();
    }

    /**
     * 获取英雄
     * @param playerid
     * @returns
     */
    public GetHero(playerid: PlayerID) {
        return PlayerResource.GetPlayer(playerid).GetAssignedHero() as BaseNpc_Hero_Plus;
    }
}
