
import { KVHelper } from "../../../helper/KVHelper";
import { ChessControlConfig } from "../../../shared/ChessControlConfig";
import { ET } from "../../../shared/lib/Entity";
import { GEventHelper } from "../../../shared/lib/GEventHelper";
import { ERoundBoard } from "../Round/ERoundBoard";
import { ECombination } from "./ECombination";
import { ECombinationLabelItem } from "./ECombinationLabelItem";

@GReloadable
export class CombinationManagerComponent extends ET.Component {

    onAwake(): void {
        this.addEvent();
        let config = KVHelper.KvServerConfig.building_combination_ability;
        let type = GGetRegClass<typeof ECombination>("ECombination");
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
        this.SyncClient(true);
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

    public OnRoundStartBattle() {
        this.getAllActiveCombination().forEach(comb => {
            comb.CombEffectComp().OnRoundStartBattle();
        })
    }

    public OnRoundStartPrize(round: ERoundBoard) {
        this.getAllActiveCombination().forEach(comb => {
            if (comb.CombEffectComp()) {
                comb.CombEffectComp().OnRoundStartPrize(round);
            }
        })
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
