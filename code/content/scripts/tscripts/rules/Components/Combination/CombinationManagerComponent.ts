
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { ERoundBoard } from "../Round/ERoundBoard";
import { ECombination } from "./ECombination";
import { ECombinationLabelItem } from "./ECombinationLabelItem";

@GReloadable
export class CombinationManagerComponent extends ET.Component implements IRoundStateCallback {

    onAwake(): void {
        this.addEvent();
        let config = GJSONConfig.CombinationConfig.getDataList();
        let type = GGetRegClass<typeof ECombination>("ECombination");
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
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_JoinBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                this.addBuilding(building);
            }),
            this.BelongPlayerid,
        );
        GEventHelper.AddEvent(ChessControlConfig.Event.ChessControl_LeaveBattle,
            GHandler.create(this, (building: IBuildingEntityRoot) => {
                this.removeBuilding(building);
            }),
            this.BelongPlayerid)
    }
    OnRound_Start(round?: ERoundBoard): void { }
    OnRound_WaitingEnd(): void { };
    public OnRound_Battle() {
        this.getAllActiveCombination().forEach(comb => {
            comb.OnRound_Battle();
        })
    }

    public OnRound_Prize(round: ERoundBoard) {
        this.getAllActiveCombination().forEach(comb => {
            if (comb) {
                comb.OnRound_Prize(round);
            }
        })
    }
    /**
     * 减少羁绊需求数量
     * @param sectname 
     * @param v 
     * @returns 
     */
    public ChangeCombinationActiveNeedCount(sectname: string, v = -1) {
        let combs = this.allCombination[sectname];
        if (combs == null) return;
        let r: ECombination[] = Object.values(combs);
        r.sort((a, b) => { return a.activeNeedCount - b.activeNeedCount })
        for (let i = 0, len = r.length; i < len; i++) {
            let ecomb = r[i];
            if (ecomb.activeNeedCount + v > i) {
                ecomb.activeNeedCount += v;
                ecomb.checkActive()
            }
        }
    }

    private allCombination: { [relation: string]: { [relationid: string]: ECombination } } = {};
    public addBuilding(entity: IBuildingEntityRoot) {
        let comb = entity.CombinationComp();
        if (comb == null) {
            return;
        }
        let allCombination = comb.getAllCombinations();
        for (let info of allCombination) {
            this.addCombination(info);
        }
    }

    public getAllActiveCombination() {
        let r: ECombination[] = [];
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

    public removeBuilding(entity: IBuildingEntityRoot) {
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
