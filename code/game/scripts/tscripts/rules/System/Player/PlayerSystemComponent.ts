import { GameEnum } from "../../../GameEnum";
import { EventHelper } from "../../../helper/EventHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { PlayerEntityRoot } from "../../Components/Player/PlayerEntityRoot";
import { PlayerHttpComponent } from "../../Components/Player/PlayerHttpComponent";
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
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.game_rules_state_change, (e) => {
            const nNewState = GameRules.State_Get();
            switch (nNewState) {
                // -- 游戏初始化
                case DOTA_GameState.DOTA_GAMERULES_STATE_CUSTOM_GAME_SETUP:
                    this.CreateAllPlayer();
                    break;
            }
        });

        /**客户端登陆 */
        EventHelper.addProtocolEvent(this, GameEnum.Event.CustomProtocol.req_LoginGame, (event: JS_TO_LUA_DATA) => {
            event.state = true;
            this.OnLoginPlayer(event.PlayerID);
        });
    }

    private IsAllLogin: boolean = false;
    private OnLoginPlayer(playerid: PlayerID) {
        if (this.IsAllLogin) {
            return;
        }
        let playerroot = this.GetPlayer(playerid);
        TimerHelper.addTimer(1, () => {
            playerroot.DrawComp().DrawStartCard();
        });
        playerroot.IsLogin = true;
        for (let player of this.GetAllPlayer()) {
            if (!player.IsLogin) {
                return;
            }
        }
        this.IsAllLogin = true;
        this.OnAllPlayerClientLogin();
    }

    private OnAllPlayerClientLogin() {
        let allPlayer = this.GetAllPlayer();
        allPlayer.forEach((player) => {
            EventHelper.SyncETEntity(player.PlayerDataComp().toJsonObject(), player.Playerid);
        });
        EventHelper.fireServerEvent(GameEnum.Event.CustomServer.onserver_allplayer_loginfinish);
    }

    public IsValidPlayer(playerid: PlayerID | number | string): boolean {
        return this.AllPlayer[playerid + ""] != null;
    }

    public GetPlayer(playerid: PlayerID | number | string): PlayerEntityRoot {
        return this.AllPlayer[playerid + ""];
    }

    public GetAllPlayer() {
        return Object.values(this.AllPlayer);
    }

    public CreateAllPlayer() {
        let allPlayer = this.GetAllPlayerid();
        allPlayer.forEach(async (playerid) => {
            let playerRoot = new PlayerEntityRoot();
            (playerRoot as any).Playerid = playerid;
            this.AllPlayer[playerid + ""] = playerRoot;
            let playerhttp = playerRoot.AddPreAwakeComponent(PrecacheHelper.GetRegClass<typeof PlayerHttpComponent>("PlayerHttpComponent"));
            await playerhttp.PlayerLogin(playerid);
        });
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
