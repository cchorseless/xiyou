import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

export class EnemyKillPrizeComponent extends ET.Component {


    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let unitComp = domain.ETRoot.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
        let round = unitComp.Round;
        let Roundconfig = round.config;
        this.killGold = RandomInt(tonumber(Roundconfig.gold_min), tonumber(Roundconfig.gold_max));
        if (round.IsBasic) {
            if (RandomInt(1, 100) < tonumber(KVHelper.KvServerConfig.building_config.DROP_WOOD_CHANCE.configValue)) {
                this.killWood = tonumber(KVHelper.KvServerConfig.building_config.DROP_WOOD_NUM.configValue)
            }
        }
    }
    public killGold: number = 0;
    public killWood: number = 0;
}