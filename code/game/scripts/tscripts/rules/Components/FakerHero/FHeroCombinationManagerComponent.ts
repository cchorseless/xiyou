import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET, registerET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../System/ChessControl/ChessControlConfig";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombination } from "../Combination/ECombination";
import { ECombinationLabelItem } from "../Combination/ECombinationLabelItem";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroEntityRoot } from "./FakerHeroEntityRoot";


@registerET()
export class FHeroCombinationManagerComponent extends ET.Component {
    onAwake(): void {
        this.addEvent();
        let config = KVHelper.KvServerConfig.building_combination_ability;
        let type = PrecacheHelper.GetRegClass<typeof ECombination>("ECombination");
        for (let key in config) {
            let info = config[key];
            this.allCombination[info.relation] = this.allCombination[info.relation] || {};
            let combina = this.allCombination[info.relation][info.relationid];
            if (combina == null) {
                combina = this.AddChild(type, info.relationid);
                this.allCombination[info.relation][info.relationid] = combina;
            }
            combina.addConfig(info);
        }
    }

    private addEvent() {
        let player = this.Domain.ETRoot.As<FakerHeroEntityRoot>();
    }

    activeECombination(isActive: boolean) {
        for (let info in this.allCombination) {
            let combinas = Object.values(this.allCombination[info])
            for (let comb of combinas) {
                if (comb.isActive) {
                    comb.ApplyBuffEffect(isActive);
                }
                if (!isActive) {
                    comb.removeAllCombination();
                }
            }
        }
    }


    private allCombination: { [k: string]: { [k: string]: ECombination } } = {};
    public addEnemyUnit(entity: EnemyUnitEntityRoot) {
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

    public removeEnemyUnit(entity: EnemyUnitEntityRoot) {
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

    public onDestroy(): void {
    }



}