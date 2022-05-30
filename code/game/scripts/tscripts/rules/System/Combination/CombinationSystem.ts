import { KVHelper } from "../../../helper/KVHelper";
import { ET, registerET } from "../../Entity/Entity";

@registerET()
export class CombinationSystemComponent extends ET.Component {

    /**是否工作 */
    public  IsWorking: boolean = true;
    /**初始化 */
    public  onAwake(...args: any[]): void {
        
    }

    public  LoadConfig() {
        let config = KVHelper.KvServerConfig.building_combination;
        for (let key in config) {
            let info = config[key as "1001"];

        }

    }

}