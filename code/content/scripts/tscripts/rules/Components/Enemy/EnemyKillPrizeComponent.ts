
import { ET } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";

@GReloadable
export class EnemyKillPrizeComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domainroot = this.Domain.ETRoot.As<IEnemyUnitEntityRoot>();
        let round = domainroot.GetRound<ERoundBoard>();
        let Roundconfig = domainroot.GetRoundBasicUnitConfig();
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
