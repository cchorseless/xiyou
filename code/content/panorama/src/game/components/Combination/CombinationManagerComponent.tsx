import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { registerET, ET } from "../../../libs/Entity";
import { CombinationBottomPanel } from "../../../view/Combination/CombinationBottomPanel";
import { PlayerScene } from "../Player/PlayerScene";
import { ECombination } from "./ECombination";


@registerET()
export class CombinationManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        let player = PlayerScene.EntityRootManage.getPlayer(playerid)!;
        player.AddOneComponent(this);
    }

    allCombination: string[] = [];
    async addOneCombination(_comb: ECombination) {
        if (!this.allCombination.includes(_comb.Id)) {
            this.AddOneChild(_comb);
            this.allCombination.push(_comb.Id);
        }
        if (!_comb.IsEmpty()) {
            let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
            await CombinationBottomPanel.GetInstance()!.addOneCombination(playerid, _comb);
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
        return r;
    }

}