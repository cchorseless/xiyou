import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";

export class modifier_combination_effect extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return false;
    }

    config() {
        return GJSONConfig.BuffEffectConfig.get(this.GetName());
    }

    getData(prop: string) {
        let conf = this.config();
        if (conf && conf.propinfo.has(prop)) {
            return conf.propinfo.get(prop);
        }
        return 0;
    }

}