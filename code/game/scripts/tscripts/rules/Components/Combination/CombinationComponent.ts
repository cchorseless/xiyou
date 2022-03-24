import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";

export class CombinationComponent extends ET.Component {

    configID: number;
    onAwake(towerID: number): void {
        this.configID = towerID;
        let domain = this.GetDomain<BaseNpc_Plus>();

    }

}