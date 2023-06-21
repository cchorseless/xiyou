
import { ET } from "../../../shared/lib/Entity";
import { ECombinationLabelItem } from "../Combination/ECombinationLabelItem";
import { ERoundBoard } from "../Round/ERoundBoard";
import { FHeroCombination } from "./FHeroCombination";


@GReloadable
export class FHeroCombinationManagerComponent extends ET.Component implements IRoundStateCallback {


    onAwake(): void {
        this.addEvent();
        let config = GJSONConfig.CombinationConfig.getDataList();
        let type = GGetRegClass<typeof FHeroCombination>("FHeroCombination");
        for (let info of config) {
            this.allCombination[info.SectName] = this.allCombination[info.SectName] || {};
            let combina = this.allCombination[info.SectName][info.SectId];
            if (combina == null) {
                combina = this.AddChild(type, info.SectId);
                this.allCombination[info.SectName][info.SectId] = combina;
            }
            combina.addConfig(info);
        }
    }

    private addEvent() {
    }
    OnRound_Start(round?: ERoundBoard): void {

    }
    OnRound_WaitingEnd(): void { };
    public OnRound_Battle(round: ERoundBoard) {
        this.getAllActiveCombination().forEach(comb => {
            comb.OnRound_Battle(round);
        })
    }

    public OnRound_Prize(round: ERoundBoard) {
        this.getAllActiveCombination().forEach(comb => {
            if (comb) {
                comb.OnRound_Prize(round);
            }
        })
    }
    public removeAllCombination() {
        for (let info in this.allCombination) {
            let combinas = Object.values(this.allCombination[info])
            for (let comb of combinas) {
                comb.removeAllCombination();
            }
        }
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
    public addEnemyUnit(entity: IEnemyUnitEntityRoot) {
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
        if (info.IsActive && info.SectName.length > 0) {
            let ecombs = this.allCombination[info.SectName];
            if (ecombs) {
                for (let ecombId in ecombs) {
                    let ecomb = ecombs[ecombId];
                    ecomb.addCombination(info);
                }
            }
        }
    }

    public removeEnemyUnit(entity: IEnemyUnitEntityRoot) {
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
        if (info.IsActive && info.SectName.length > 0) {
            let ecombs = this.allCombination[info.SectName];
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