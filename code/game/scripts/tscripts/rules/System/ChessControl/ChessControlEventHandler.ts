import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BuildingEntityRoot } from "../../Components/Building/BuildingEntityRoot";
import { PlayerSystem } from "../Player/PlayerSystem";
import { ChessControlConfig } from "./ChessControlConfig";
import { ChessControlSystem } from "./ChessControlSystem";

export class ChessControlEventHandler {
    private static System: typeof ChessControlSystem;

    public static startListen(System: typeof ChessControlSystem) {
        ChessControlEventHandler.System = System;
        /**移动棋子 */
        EventHelper.addProtocolEvent(this, ChessControlConfig.EProtocol.pick_chess_position, (event: CLIENT_DATA<ChessControlConfig.I.pick_chess_position>) => {
            let v = Vector(event.data.x, event.data.y, event.data.z);
            let entity = EntIndexToHScript(event.data.entityid as EntityIndex) as BaseNpc_Plus;
            if (!GameFunc.IsValid(entity) || entity.ETRoot == null || !entity.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
                [event.state, event.message] = [false, "cant find entity"];
            } else {
                [event.state, event.message] = PlayerSystem.GetPlayer(event.PlayerID).ChessControlComp().moveChess(entity.ETRoot.As<BuildingEntityRoot>(), v);
            }
        });
    }
}
