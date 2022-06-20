import { NetHelper } from "../../../helper/NetHelper";
import { ET, registerET } from "../../../libs/Entity";
import { PlayerConfig } from "../../system/Player/PlayerConfig";
import { PlayerScene } from "./PlayerScene";

@registerET()
export class PlayerETEntityComponent extends ET.Component {
    allEntity: { [entityindex: string]: ET.Entity } = {};
    addNetTableETEntity(entity: PlayerConfig.I.INetTableETEntity) {
        this.allEntity["" + entity.EntityId] = entity as any;
    }

    getNetTableETEntity<T extends ET.Entity>(entityindex: string) {
        let entity = this.allEntity[entityindex];
        if (entity && !entity.IsDisposed()) {
            return entity as T;
        }
        delete this.allEntity[entityindex];
    }

    onAwake() {
       
    }
}
