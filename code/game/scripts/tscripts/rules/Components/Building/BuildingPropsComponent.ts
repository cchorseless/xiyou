import { reloadable } from "../../../GameCache";
import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";
/**塔防组件 */
@reloadable
export class BuildingPropsComponent extends ET.Component {


    onAwake(...args: any[]): void {
    }

}
