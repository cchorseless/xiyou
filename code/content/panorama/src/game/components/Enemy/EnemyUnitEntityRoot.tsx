import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { PlayerScene } from "../Player/PlayerScene";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

@registerET()
export class EnemyUnitEntityRoot extends ET.Entity implements PlayerConfig.I.INetTableETEntity {
    EntityId: EntityIndex;
    Playerid: PlayerID;
    ConfigID: string;

    onSerializeToEntity() {
        PlayerScene.EntityRootManage.addEnemy(this);
    }
    onDestroy() {
        PlayerScene.EntityRootManage.removeEnemy(this);
    }
    get EnemyUnitComp() {
        return this.GetComponentByName<EnemyUnitComponent>("EnemyUnitComponent");
    }
}