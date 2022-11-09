import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { registerET, ET } from "../../../libs/Entity";
import { CombinationBottomPanel } from "../../../view/Combination/CombinationBottomPanel";
import { PlayerScene } from "../Player/PlayerScene";
import { ECombination } from "./ECombination";


@registerET()
export class CombinationManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }

    allCombination: string[] = [];
    async addOneCombination(_comb: ECombination) {
        if (!this.allCombination.includes(_comb.Id)) {
            this.AddOneChild(_comb);
            this.allCombination.push(_comb.Id);
        }
        if (!_comb.IsEmpty()) {
            await CombinationBottomPanel.GetInstance()!.addOneCombination(_comb.FixBelongPlayerid as PlayerID, _comb);
        }

    }

    getAllCombination() {
        let r: { [k: string]: ECombination[] } = {};
        this.allCombination.forEach(entityid => {
            let entity = this.GetChild<ECombination>(entityid);
            if (entity && !entity.IsEmpty()) {
                r[entity.combinationName] = r[entity.combinationName] || [];
                r[entity.combinationName].push(entity);
            }
        })
        for (let k in r) {
            r[k].sort((a, b) => { return b.activeNeedCount - a.activeNeedCount })
        }
        return r;
    }

}