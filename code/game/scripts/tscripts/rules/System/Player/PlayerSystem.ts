import { GameEnum } from "../../../GameEnum";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { PlayerComponent } from "../../Components/Player/PlayerComponent";
import { PlayerConfig } from "./PlayerConfig";
import { PlayerState } from "./PlayerState";

export class PlayerSystem {

    static AllPlayer: { [k: string]: PlayerComponent } = {};

    public static RegComponent(comp: PlayerComponent) {
        (comp as any).playerColor = PlayerConfig.playerColor[comp.PlayerID];
        PlayerSystem.AllPlayer[comp.PlayerID] = comp;
    }

    public static GetPlayer(playerid: PlayerID | number | string) {
        return PlayerSystem.AllPlayer[playerid];
    }

    public static init() {
        PlayerState.init();
    }


    /**
     * 獲取
     * @param team
     * @returns
     */
    public static GetAllPlayeridByTeam(team: DOTATeam_t = DOTATeam_t.DOTA_TEAM_GOODGUYS): Array<PlayerID> {
        let count = PlayerResource.GetPlayerCountForTeam(team);
        let r: Array<PlayerID> = [];
        for (let i = 0; i < count; i++) {
            let playerid = PlayerResource.GetNthPlayerIDOnTeam(team, i);
            if (PlayerResource.IsValidPlayerID(playerid)) {
                r.push(playerid)
            }
        }
        return r;
    }

    /**
     * 将steamid转为playerid
     * @param sSteamid
     * @returns
     */
    public static SteamID2PlayerID(sSteamid: Uint64): PlayerID {
        let retPlayerID = -1;
        let _sSteamid = sSteamid.ToHexString();
        PlayerSystem.GetAllPlayeridByTeam().forEach(
            (iPlayerID) => {
                let sPlayerSteamid = PlayerResource.GetSteamID(iPlayerID).ToHexString();
                if (sPlayerSteamid == _sSteamid) {
                    retPlayerID = iPlayerID
                }
            }
        )
        return retPlayerID as PlayerID
    }

    /**
     * 获取英雄
     * @param playerid
     * @returns
     */
    public static GetHero(playerid: PlayerID) {
        return PlayerResource.GetPlayer(playerid).GetAssignedHero() as BaseNpc_Hero_Plus
    }

    /**
     * 获取英雄出生点
     * @returns
     */
    public static getHeroReSpawnPoint(playerid: PlayerID) {
        if (PlayerState.HeroReSpawnPoint == null) {
            PlayerState.HeroReSpawnPoint = {
                playerid: [], Vector: []
            };
            let allE = Entities.FindAllByClassname(GameEnum.Unit.UnitClass.info_player_start_goodguys);
            allE.forEach((e) => {
                PlayerState.HeroReSpawnPoint.Vector.push(e.GetAbsOrigin())
            })
        }
        let index = PlayerState.HeroReSpawnPoint.playerid.indexOf(playerid)
        if (index == -1) {
            PlayerState.HeroReSpawnPoint.playerid.push(playerid)
            index = PlayerState.HeroReSpawnPoint.playerid.length - 1
        }
        return PlayerState.HeroReSpawnPoint.Vector[index]
    }
}