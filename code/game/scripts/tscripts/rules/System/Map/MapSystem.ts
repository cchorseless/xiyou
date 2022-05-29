import { GameSetting } from "../../../GameSetting";
import { unit_portal } from "../../../npc/units/common/unit_portal";
import { MapState } from "./MapState";

export class MapSystem {
    public static init() {
        MapState.init();
        this.CreateAllMapUnit();
    }

    public static CreateAllMapUnit() {
        for (let i = 0; i < GameSetting.GAME_MAX_PLAYER; i++) {
            let f_v = MapState.PlayerTpDoorPoint[i];
            let t_v = MapState.BaseTpDoorPoint[i];
            unit_portal.CreatePortal(f_v, t_v, Vector(0, 1, 0), "player_" + i);
            unit_portal.CreatePortal(t_v, f_v, Vector(0, 1, 0), "base_" + i);
        }
    }
}
