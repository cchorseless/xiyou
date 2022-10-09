import { ET, registerET } from "../../../libs/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
import { PlayerScene } from "../Player/PlayerScene";
import { EnemyUnitComponent } from "./EnemyUnitComponent";

@registerET()
export class EnemyUnitEntityRoot extends PlayerCreateBattleUnitEntityRoot {

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