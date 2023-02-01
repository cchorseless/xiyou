import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { GEventHelper } from "../../../../../scripts/tscripts/shared/lib/GEventHelper";


@GReloadable
export class ECombination extends ET.Entity {
    public combinationName: string;
    public combinationId: string;
    public activeNeedCount: number;
    public uniqueConfigList: string[] = [];

    isFakerCombination() {
        return false;
    }
    IsActive() {
        return this.uniqueConfigList.length >= this.activeNeedCount;
    }
    IsEmpty() {
        return this.uniqueConfigList.length == 0;
    }

    onSerializeToEntity(): void {
        this.onReload()
    }
    onReload() {
        GEventHelper.FireEvent(ECombination.name, null, null, this)
    }

    static GetCombinationByCombinationId(BelongPlayerid: PlayerID, _combid: string) {
        if (_combid == null) return;
        const allcomb = ECombination.GetGroupInstance(BelongPlayerid)
        for (let entity of allcomb) {
            if (entity && entity.combinationId == _combid) {
                return entity
            }
        }
    }
    static GetCombinationByCombinationName(BelongPlayerid: PlayerID, _combname: string) {
        if (_combname == null) return;
        return this.GetAllCombination(BelongPlayerid)[_combname]
    }
    static GetAllCombination(BelongPlayerid: PlayerID,) {
        let r: { [k: string]: ECombination[] } = {};
        const allcomb = ECombination.GetGroupInstance(BelongPlayerid)
        allcomb.forEach(entity => {
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