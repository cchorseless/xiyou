
import { ECombination } from "../Combination/ECombination";

@GReloadable
export class FHeroCombination extends ECombination {
    isFakerCombination() {
        return true;
    }
    static GetCombinationBySectId(BelongPlayerid: PlayerID, _combid: string) {
        if (_combid == null) return;
        const allcomb = FHeroCombination.GetGroupInstance(BelongPlayerid)
        for (let entity of allcomb) {
            if (entity && entity.SectId == _combid) {
                return entity as FHeroCombination;
            }
        }
    }
    static GetCombinationBySectName(BelongPlayerid: PlayerID, _combname: string) {
        if (_combname == null) return;
        return FHeroCombination.GetAllCombination(BelongPlayerid)[_combname] as FHeroCombination[];
    }
    static GetAllCombination(BelongPlayerid: PlayerID,) {
        let r: { [k: string]: FHeroCombination[] } = {};
        const allcomb = FHeroCombination.GetGroupInstance(BelongPlayerid) as FHeroCombination[];
        allcomb.forEach(entity => {
            if (entity && !entity.IsEmpty()) {
                r[entity.SectName] = r[entity.SectName] || [];
                r[entity.SectName].push(entity);
            }
        })
        for (let k in r) {
            r[k].sort((a, b) => { return b.activeNeedCount - a.activeNeedCount })
        }
        return r;
    }
}