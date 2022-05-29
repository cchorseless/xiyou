import { KVHelper } from "../../../helper/KVHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { RoundManagerComponent } from "../../Components/Round/RoundManagerComponent";
import { PlayerSystem } from "../Player/PlayerSystem";
import { RoundEventHandler } from "./RoundEventHandler";
import { RoundState } from "./RoundState";

export class RoundSystem {
    public static init() {
        RoundEventHandler.startListen(RoundSystem);
    }

    public static runBoardRound(round: string) {
        RoundState.iRound = round;
        PlayerSystem.GetAllPlayer().forEach((player) => {
            player.RoundManagerComp().runBoardRound(round);
        });
        
    }
    public static runBasicRound(round: string) {
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
