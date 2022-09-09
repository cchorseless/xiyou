import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";

@registerET()
export class AbilityManagerComponent extends ET.Component {

    onAwake(...args: any[]): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let len = npc.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = npc.GetAbilityByIndex(i) as BaseAbility_Plus;
            if (ability.ETRoot) {
                npc.ETRoot.As<BuildingEntityRoot>().AddDomainChild(ability.ETRoot);
            }
        }
    }
}