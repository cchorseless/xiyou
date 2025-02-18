import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { GEventHelper } from "../../../../../scripts/tscripts/shared/lib/GEventHelper";


@GReloadable
export class ECombination extends ET.Entity {
    public SectName: string;
    public SectId: string;
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

    static GetCombinationBySectId(BelongPlayerid: PlayerID, _combid: string) {
        if (_combid == null) return;
        const allcomb = ECombination.GetGroupInstance(BelongPlayerid)
        for (let entity of allcomb) {
            if (entity && entity.SectId == _combid) {
                return entity as ECombination;
            }
        }
    }
    static GetCombinationBySectName(BelongPlayerid: PlayerID, _combname: string) {
        if (_combname == null) return;
        return ECombination.GetAllCombination(BelongPlayerid)[_combname] as ECombination[];
    }
    static GetAllCombination(BelongPlayerid: PlayerID,) {
        let r: { [k: string]: ECombination[] } = {};
        const allcomb = ECombination.GetGroupInstance(BelongPlayerid) as ECombination[];
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