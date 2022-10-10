import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";
/**塔防组件 */
@registerET()
export class BuildingPropsComponent extends ET.Component {


    onAwake(...args: any[]): void {
    }

}
