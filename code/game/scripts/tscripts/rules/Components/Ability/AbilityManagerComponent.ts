import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { AbilityEntityRoot } from "./AbilityEntityRoot";

@registerET()
export class AbilityManagerComponent extends ET.Component {

    public allAbilityRoot: string[] = [];
    onAwake(...args: any[]): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        let len = npc.GetAbilityCount();
        for (let i = 0; i < len; i++) {
            let ability = npc.GetAbilityByIndex(i) as BaseAbility_Plus;
            if (ability && ability.ETRoot) {
                ability.UpgradeAbility(true)
                ability.SetActivated(true);
                ability.SetLevel(1);
                this.addAbilityRoot(ability.ETRoot as AbilityEntityRoot);
            }
        }
    }


    getAbilityRoot(childid: string) {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        return building.GetDomainChild<AbilityEntityRoot>(childid);
    }

    addAbilityRoot(root: AbilityEntityRoot) {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        building.AddDomainChild(root);
        this.allAbilityRoot.push(root.Id);
        if (building.CombinationComp()) {
            building.CombinationComp().addAbilityRoot(root);
        }
    }

    removeAbilityRoot(root: AbilityEntityRoot) {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        if (root.DomainParent != building) {
            return;
        }
        building.RemoveDomainChild(root);
        let index = this.allAbilityRoot.indexOf(root.Id);
        this.allAbilityRoot.splice(index, 1);
        if (building.CombinationComp()) {
            building.CombinationComp().removeAbilityRoot(root);
        }
    }

    levelUpAllAbility() {
        let building = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let ability = building.GetDomainChild<AbilityEntityRoot>(str);
            ability.GetDomain<BaseAbility_Plus>().UpgradeAbility(true);
        })
    }
}