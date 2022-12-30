
import { KVHelper } from "../../helper/KVHelper";
import { ET } from "../../shared/lib/Entity";

@GReloadable
export class CombinationSystemComponent extends ET.SingletonComponent {

    /**是否工作 */
    public IsWorking: boolean = true;
    /**初始化 */
    public onAwake(...args: any[]): void {

    }

    public LoadConfig() {
        let config = KVHelper.KvServerConfig.building_combination;
        for (let key in config) {
            let info = config[key as "1001"];

        }

    }

}

declare global {
    /**
     * @ServerOnly
     */
    var GCombinationSystem: typeof CombinationSystemComponent;
}
if (_G.GCombinationSystem == undefined) {
    _G.GCombinationSystem = CombinationSystemComponent;
}