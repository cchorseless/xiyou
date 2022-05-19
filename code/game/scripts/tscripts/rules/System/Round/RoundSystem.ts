import { KVHelper } from "../../../helper/KVHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { RoundManagerComponent } from "../../Components/Round/RoundManagerComponent";
import { PlayerSystem } from "../Player/PlayerSystem";
import { RoundEventHandler } from "./RoundEventHandler";

export class RoundSystem {

    public static init() {
        RoundEventHandler.startListen(RoundSystem);
    }

    public static runSingleRound(round: string) {
        PlayerSystem.PlayerList().forEach((player) => {
            player.RoundManagerComp() .runBasicRound(round);
        });
        let round_time = KVHelper.KvServerConfig.building_round[round as "10"].round_time;
        TimerHelper.addTimer(
            tonumber(round_time),
            () => {
                RoundSystem.runSingleRound("" + (tonumber(round) + 1));
            },
            this,
            true
        );
    }
}
