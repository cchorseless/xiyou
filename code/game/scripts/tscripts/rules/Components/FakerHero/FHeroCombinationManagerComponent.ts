import { GetRegClass, reloadable } from "../../../GameCache";
import { EventHelper } from "../../../helper/EventHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { ET } from "../../Entity/Entity";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { RoundConfig } from "../../../shared/RoundConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombinationLabelItem } from "../Combination/ECombinationLabelItem";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FakerHeroEntityRoot } from "./FakerHeroEntityRoot";
import { FHeroCombination } from "./FHeroCombination";


@reloadable
export class FHeroCombinationManagerComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;

    onAwake(): void {
        this.addEvent();
        let config = KVHelper.KvServerConfig.building_combination_ability;
        let type = GetRegClass<typeof FHeroCombination>("FHeroCombination");
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
        this.Domain.ETRoot.As<FakerHeroEntityRoot>().SyncClientEntity(this);
    }

    private addEvent() {
    }


    public getAllActiveCombination() {
        let r: FHeroCombination[] = [];
        for (let info in this.allCombination) {
            let combinas = Object.values(this.allCombination[info])
            for (let comb of combinas) {
                if (comb.isActive) {
                    r.push(comb);
                }
            }
        }
        return r;
    }

    private allCombination: { [k: string]: { [k: string]: FHeroCombination } } = {};
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