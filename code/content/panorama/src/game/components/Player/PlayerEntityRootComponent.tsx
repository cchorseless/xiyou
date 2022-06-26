import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class PlayerEntityRootComponent extends ET.Component {
    AllBuilding: { [entityid: string]: BuildingEntityRoot } = {};
    AllEnemy: { [entityid: string]: EnemyUnitEntityRoot } = {};
    AllEntityRoot: { [entityid: string]: ET.Entity } = {};
    addNetTableETEntity(entity: PlayerConfig.I.INetTableETEntity) {
        this.AllEntityRoot["" + entity.EntityId] = entity as any;
    }
    removeNetTableETEntity(entity: PlayerConfig.I.INetTableETEntity) {
        delete this.AllEntityRoot[entity.EntityId];
    }
    getNetTableETEntity<T extends ET.Entity>(entityindex: string) {
        let entity = this.AllEntityRoot[entityindex];
        if (entity && !entity.IsDisposed()) {
            return entity as T;
        }
        delete this.AllEntityRoot[entityindex];
    }
    addBuilding(b: BuildingEntityRoot) {
        this.addNetTableETEntity(b);
        this.AllBuilding[b.EntityId + ""] = b;
    }

    removeBuilding(b: BuildingEntityRoot) {
        this.removeNetTableETEntity(b);
        delete this.AllBuilding[b.EntityId];
    }

    addEnemy(b: EnemyUnitEntityRoot) {
        this.addNetTableETEntity(b);
        this.AllEnemy[b.EntityId + ""] = b;
    }

    removeEnemy(b: EnemyUnitEntityRoot) {
        this.removeNetTableETEntity(b);
        delete this.AllEnemy[b.EntityId];
    }
}
