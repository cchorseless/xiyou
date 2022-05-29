import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { EnemyUnitEntityRoot } from "../../Components/Enemy/EnemyUnitEntityRoot";
import { RoundState } from "./RoundState";
import { RoundSystem } from "./RoundSystem";

export class RoundEventHandler {
    public static System: typeof RoundSystem;

    /**添加协议事件 */
    public static startListen(System: typeof RoundSystem) {
        RoundEventHandler.System = System;
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.EntityHurtEvent, this.OnEntityHurtEvent);
        EventHelper.addServerEvent(this, GameEnum.Event.CustomServer.onserver_allplayer_loginfinish, this.OnLoginFinish);
    }

    public static OnEntityHurtEvent(events: EntityHurtEvent) {
        let hUnit = EntIndexToHScript(events.entindex_attacker) as BaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot || !hUnit.ETRoot.AsValid<EnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
            return;
        }
        hUnit.ETRoot.As<EnemyUnitEntityRoot>().GetRound().onEntityHurt(events.entindex_attacker, events.damage);
    }

    public static OnLoginFinish(events: LUA_TO_LUA_DATA) {
        RoundEventHandler.System.runBoardRound(RoundState.GetFirstRoundid());
    }
}
