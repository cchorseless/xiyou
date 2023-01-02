import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { CCCombinationBottomPanel } from "../../../view/Combination/CCCombinationBottomPanel";
import { ECombination } from "./ECombination";


@GReloadable
export class CombinationManagerComponent extends ET.Component {

    allCombination: string[] = [];
    addOneCombination(_comb: ECombination) {
        if (!this.allCombination.includes(_comb.Id)) {
            this.AddOneChild(_comb);
            this.allCombination.push(_comb.Id);
        }
        if (!_comb.IsEmpty()) {
            GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
                CCCombinationBottomPanel.GetInstance()?.updateSelf()
            }))
        }

    }
    getCombinationByCombinationName(_comb: string) {
        if (_comb == null) return;
        for (let entityid of this.allCombination) {
            let entity = this.GetChild<ECombination>(entityid);
            if (entity && entity.combinationName == _comb) {
                return entity
            }
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
