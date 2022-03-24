import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { EnemyUnitComponent } from "../../Components/Enemy/EnemyUnitComponent";
import { RoundSystem } from "./RoundSystem";

export class RoundEventHandler {


    private static System: typeof RoundSystem;

    /**添加协议事件 */
    public static startListen(System: typeof RoundSystem) {
        this.System = System;
        EventHelper.addGameEvent(GameEnum.Event.GameEvent.EntityHurtEvent, this.OnEntityHurtEvent, this);
    }

    public static OnEntityHurtEvent(events: EntityHurtEvent) {
        let hUnit = EntIndexToHScript(events.entindex_attacker) as BaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return
        }
        if (!hUnit.ETRoot) {
            return
        }
        let unitComp = hUnit.ETRoot.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
        if (!unitComp) {
            return
        }
        unitComp.Round.onEntityHurt(events.entindex_attacker, events.damage);
    }
}