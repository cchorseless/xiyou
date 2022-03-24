import { KVHelper } from "../../../helper/KVHelper";
import { CombinationManagerComponent } from "../../Components/Combination/CombinationManagerComponent";

export class CombinationSystem {

    /**是否工作 */
    public static IsWorking: boolean = true;

    static readonly AllManager: { [k: string]: CombinationManagerComponent } = {};

    public static RegComponent(comp: CombinationManagerComponent) {
        CombinationSystem.AllManager[comp.PlayerID] = comp;
    }
    /**初始化 */
    public static init() {

    }

    public static LoadConfig() {
        let config = KVHelper.KvServerConfig.building_combination;
        for (let key in config) {
            let info = config[key as "1001"];

        }

    }

}