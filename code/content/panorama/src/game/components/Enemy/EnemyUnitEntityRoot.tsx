import { ET, registerET } from "../../../libs/Entity";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

@registerET()
export class EnemyUnitEntityRoot extends BattleUnitEntityRoot {

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