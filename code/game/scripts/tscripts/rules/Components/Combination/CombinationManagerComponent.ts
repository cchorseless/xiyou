import { KVHelper } from "../../../helper/KVHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET, registerET } from "../../Entity/Entity";
import { AbilityEntityRoot } from "../Ability/AbilityEntityRoot";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombination } from "./ECombination";
import { ECombinationLabelItem } from "./ECombinationLabelItem";

@registerET()
export class CombinationManagerComponent extends ET.Component {
    onAwake(): void {
        let config = KVHelper.KvServerConfig.building_combination_ability;
        let type = PrecacheHelper.GetRegClass<typeof ECombination>("ECombination");
        for (let key in config) {
            let info = config[key];
            this.allCombination[info.relation] = this.allCombination[info.relation] || {};
            let combina = this.allCombination[info.relation][info.relationid];
            if (combina == null) {
                combina = this.AddChild(type);
                this.allCombination[info.relation][info.relationid] = combina;
            }
            combina.addConfig(info);
        }
    }

    private allCombination: { [k: string]: { [k: string]: ECombination } } = {};

    public addBuilding(entity: BuildingEntityRoot) {
        let comb = entity.CombinationComp();
        if (comb == null) {
            return;
        }
        let allCombination = comb.getAllCombinations();
        for (let info of allCombination) {
            this.addCombination(info);
        }
    }

    public addCombination(info: ECombinationLabelItem) {
        if (info.IsActive && info.CombinationName.length > 0) {
            let ecombs = this.allCombination[info.CombinationName];
            if (ecombs) {
                for (let ecombId in ecombs) {
                    let ecomb = ecombs[ecombId];
                    ecomb.addCombination(info);
                }
            }
        }
    }


    public removeBuilding(entity: BuildingEntityRoot) {
        let comb = entity.CombinationComp();
        if (comb == null) {
            return;
        }
        let allCombination = comb.getAllCombinations();
        for (let info of allCombination) {
            this.removeCombination(info)
        }
    }

    public removeCombination(info: ECombinationLabelItem) {
        if (info.IsActive && info.CombinationName.length > 0) {
            let ecombs = this.allCombination[info.CombinationName];
            if (ecombs) {
                for (let ecombId in ecombs) {
                    let ecomb = ecombs[ecombId];
                    ecomb.removeCombination(info);
                }
            }
        }
    }

    private refresh(entity: BuildingEntityRoot, isadd: boolean) {
        let config;
    }

    public onDestroy(): void {
    }
}
