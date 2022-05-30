import { GameEnum } from "../../../GameEnum";
import { GameSetting } from "../../../GameSetting";
import { EventHelper } from "../../../helper/EventHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { unit_base_baoxiang } from "../../../npc/units/common/unit_base_baoxiang";
import { unit_portal } from "../../../npc/units/common/unit_portal";
import { ET, registerET } from "../../Entity/Entity";
import { MapState } from "./MapState";

@registerET()
export class MapSystemComponent extends ET.Component {
    public onAwake(...args: any[]): void {
        MapState.init();
        this.addEvent();
    }

    public addEvent() {
        EventHelper.addServerEvent(this, GameEnum.Event.CustomServer.onserver_allplayer_loginfinish, () => {
            this.CreateAllMapUnit();
        });
    }

    public CreateAllMapUnit() {
        for (let i = 0; i < GameSetting.GAME_MAX_PLAYER; i++) {
            let f_v = MapState.PlayerTpDoorPoint[i];
            let t_v = MapState.BaseTpDoorPoint[i];
            let forvard = MapState.BaseVForwardPoint[i];
            unit_portal.CreatePortal(f_v, t_v, Vector(0, -1, 0), "player_" + i);
            unit_portal.CreatePortal(t_v, f_v, MapState.BaseVForwardPoint[i], "base_" + i, DOTATeam_t.DOTA_TEAM_BADGUYS);
            let baoxiang = unit_base_baoxiang.CreateOne(MapState.BaseBaoXiangPoint[i], DOTATeam_t.DOTA_TEAM_GOODGUYS, true, null, null);
            baoxiang.SetForwardVector(forvard);
        }
    }
}
