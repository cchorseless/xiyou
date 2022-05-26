import { KVHelper } from "../../../helper/KVHelper";
import { building_round_challenge } from "../../../kvInterface/building/building_round_challenge";
import { ERound } from "./ERound";

export class ERoundChallenge extends ERound {
    config: building_round_challenge.OBJ_2_1 = null;
    onAwake(configid: string): void {
        this.configID = configid;
        this.config = KVHelper.KvServerConfig.building_round_challenge["" + configid];
    }
}
