import { GameProtocol } from "../shared/GameProtocol";
import { EventHelper } from "./EventHelper";

export module MiniMapHelper {

    const allTimerInfo: {
        showplayerid: PlayerID,
        forplayerid: PlayerID,
        timerid: ITimerTask
    }[] = [];
    /**
     *
     * @param showplayerid
     * @param forplayerid
     */
    export function showPlayerOnMiniForPlayer(showplayerid: PlayerID, forplayerid: PlayerID) {
        if (!IsServer()) { return }
        let hero = GPlayerEntityRoot.GetHero(showplayerid);
        let v = hero.GetAbsOrigin();
        let offx = math.abs(v.x + 7680) / 7680 / 2;
        let offy = math.abs(v.y - 7680) / 7680 / 2;
        v.x = offx;
        v.y = offy
        EventHelper.fireProtocolEventToPlayer(GameProtocol.Protocol.push_update_minimap, {
            state: true,
            data: {
                [showplayerid]: {
                    v: v,
                    q: hero.GetForwardVector(),
                }
            }
        }, forplayerid)
    }

    /**
     * 停止刷新小地图位置
     * @param showplayerid
     * @param forplayerid
     * @returns
     */
    export function noshowPlayerOnMiniForPlayer(showplayerid: PlayerID, forplayerid: PlayerID) {
        if (!IsServer()) { return }
        for (let i = allTimerInfo.length - 1; i >= 0; i--) {
            let info = allTimerInfo[i];
            if (info.showplayerid == showplayerid && info.forplayerid == forplayerid) {
                info.timerid.Clear()
                allTimerInfo.splice(i, 1);
            }
        }
        EventHelper.fireProtocolEventToPlayer(GameProtocol.Protocol.push_update_minimap_nodraw, {
            state: true,
            data: { [showplayerid]: 1 }
        }, forplayerid)
    }

    export function updatePlayerOnMiniForPlayer(showplayerid: PlayerID, forplayerid: PlayerID) {
        if (!IsServer()) { return }
        let timerid = GTimerHelper.AddFrameTimer(1, GHandler.create(MiniMapHelper, () => {
            showPlayerOnMiniForPlayer(showplayerid, forplayerid);
            return 1
        }));
        allTimerInfo.push({
            showplayerid: showplayerid,
            forplayerid: forplayerid,
            timerid: timerid
        })
    }

}