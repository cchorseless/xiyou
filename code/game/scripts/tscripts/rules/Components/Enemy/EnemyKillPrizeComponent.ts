import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";
import { EnemyUnitComponent } from "./EnemyUnitComponent";
import { EnemyUnitEntityRoot } from "./EnemyUnitEntityRoot";

@registerET()
export class EnemyKillPrizeComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domainroot = this.Domain.ETRoot.As<EnemyUnitEntityRoot>();
        let round = domainroot.GetRound<ERoundBoard>();
        let Roundconfig = domainroot.GetRoundUnitConfig();
        this.killGold = RandomInt(tonumber(Roundconfig.gold_min), tonumber(Roundconfig.gold_max));
        // if (round.IsBasic) {
        //     if (RandomInt(1, 100) < tonumber(KVHelper.KvServerConfig.building_config.DROP_WOOD_CHANCE.configValue)) {
        //         this.killWood = tonumber(KVHelper.KvServerConfig.building_config.DROP_WOOD_NUM.configValue);
        //     }
        // }
    }
    public killGold: number = 0;
    public killWood: number = 0;
}
