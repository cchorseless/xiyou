import { KVHelper } from "../../../helper/KVHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { RoundManagerComponent } from "../../Components/Round/RoundManagerComponent";
import { RoundEventHandler } from "./RoundEventHandler";

export class RoundSystem {

    static readonly AllManager: { [k: string]: RoundManagerComponent } = {};

    public static RegComponent(comp: RoundManagerComponent) {
        RoundSystem.AllManager[comp.PlayerID] = comp;
    }

    public static init() {
        RoundEventHandler.startListen(RoundSystem);
    }


    public static runSingleRound(round: string) {
        Object.values(RoundSystem.AllManager).forEach(allround => {
            allround.runBasicRound(round);
        });
        let round_time = KVHelper.KvServerConfig.building_round[round as "10"].round_time;
        TimerHelper.addTimer(tonumber(round_time), () => {
            RoundSystem.runSingleRound("" + (tonumber(round) + 1));
        }, this, true)
    }
}