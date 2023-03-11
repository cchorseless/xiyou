import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";

export class modifier_combination_effect extends BaseModifier_Plus {

    public IsHidden(): boolean {
        return true;
    }

    config() {
        return GJSONConfig.BuffEffectConfig.get(this.GetName());
    }

    getSpecialData(prop: string) {
        let conf = this.config();
        if (conf && conf.propinfo.has(prop)) {
            return conf.propinfo.get(prop);
        }
        return 0;
    }

}