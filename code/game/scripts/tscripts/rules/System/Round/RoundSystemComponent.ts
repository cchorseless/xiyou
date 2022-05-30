import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { unit_base_equip_bag } from "../../../npc/units/common/unit_base_equip_bag";
import { unit_base_gold_bag } from "../../../npc/units/common/unit_base_gold_bag";
import { EnemyUnitEntityRoot } from "../../Components/Enemy/EnemyUnitEntityRoot";
import { RoundManagerComponent } from "../../Components/Round/RoundManagerComponent";
import { ET, registerET } from "../../Entity/Entity";
import { MapState } from "../Map/MapState";
import { RoundState } from "./RoundState";

@registerET()
export class RoundSystemComponent extends ET.Component {
    public onAwake() {
        this.addEvent()
    }
    public addEvent() {
        EventHelper.addGameEvent(this, GameEnum.Event.GameEvent.EntityHurtEvent, this.OnEntityHurtEvent);
        EventHelper.addServerEvent(this, GameEnum.Event.CustomServer.onserver_allplayer_loginfinish, () => {
            this.runBoardRound(RoundState.GetFirstRoundid());
        });
    }

    private OnEntityHurtEvent(events: EntityHurtEvent) {
        let hUnit = EntIndexToHScript(events.entindex_attacker) as BaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot || !hUnit.ETRoot.AsValid<EnemyUnitEntityRoot>("EnemyUnitEntityRoot")) {
            return;
        }
        hUnit.ETRoot.As<EnemyUnitEntityRoot>().GetRound().onEntityHurt(events.entindex_attacker, events.damage);
    }

    public runBoardRound(round: string) {
        RoundState.iRound = round;
        GameRules.Addon.ETRoot.PlayerSystem()
            .GetAllPlayer()
            .forEach((player) => {
                player.RoundManagerComp().runBoardRound(round);
            });
        RoundState.createRoundMapUnit(round);
    }

    public runBasicRound(round: string) {
        // PlayerSystem.GetAllPlayer().forEach((player) => {
        //     player.RoundManagerComp().runBasicRound(round);
        // });
        // let round_time = KVHelper.KvServerConfig.building_round[round as "10"].round_time;
        // TimerHelper.addTimer(
        //     tonumber(round_time),
        //     () => {
        //         RoundSystem.runBasicRound("" + (tonumber(round) + 1));
        //     },
        //     this,
        //     true
        // );
    }
}
