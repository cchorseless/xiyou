import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";

@registerET()
export class CombinationComponent extends ET.Component {

    onAwake(): void {
        let domain = this.GetDomain<BaseNpc_Plus>();

    }

}