import { KVHelper } from "../../../helper/KVHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";

export class modifier_combination_effect extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return false;
    }

    config() {
        return KVHelper.KvConfig().effect_config[this.constructor.name];
    }

    getData(prop: string) {
        let conf = this.config();
        if (conf && conf[prop]) {
            return tonumber(conf[prop]);
        }
        return 0;
    }

}