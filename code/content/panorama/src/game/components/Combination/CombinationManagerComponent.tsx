import { NetHelper } from "../../../helper/NetHelper";
import { registerET, ET } from "../../../libs/Entity";
import { PlayerScene } from "../Player/PlayerScene";
import { ECombination } from "./ECombination";


@registerET()
export class CombinationManagerComponent extends ET.Component {
    onSerializeToEntity(): void {
        let playerid = NetHelper.GetPlayerIdByNetTableName(this.NetTableName);
        PlayerScene.EntityRootManage.getPlayer(playerid)?.AddOneComponent(this);
    }

    allCombination: string[] = [];
    addCombination(_comb: ECombination) {
        this.AddOneChild(_comb);
        this.allCombination.push(_comb.Id)
    }

    getAllCombination() {
        let r: ECombination[] = [];
        this.allCombination.forEach(entityid => {
            let entity = this.GetChild<ECombination>(entityid);
            if (entity && entity.uniqueConfigList.length > 0) {
                r.push(entity)
            }
        })
        return r;
    }

}