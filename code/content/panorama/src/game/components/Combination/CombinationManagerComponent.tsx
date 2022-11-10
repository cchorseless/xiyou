import { EventHelper } from "../../../helper/EventHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { ECombination } from "./ECombination";


@registerET()
export class CombinationManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
    }

    allCombination: string[] = [];
    addOneCombination(_comb: ECombination) {
        if (!this.allCombination.includes(_comb.Id)) {
            this.AddOneChild(_comb);
            this.allCombination.push(_comb.Id);
        }
        if (!_comb.IsEmpty()) {
            TimerHelper.AddTimer(0.1, FuncHelper.Handler.create(this, () => {
                EventHelper.FireClientEvent(this.updateEventName, null, this)
            }))
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