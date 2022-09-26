import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
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

    learnAbility(ability: string) {

        return true
    }

    getAbilityRoot(childid: string) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        return battleunit.GetDomainChild<AbilityEntityRoot>(childid);
    }

    addAbilityRoot(root: AbilityEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        battleunit.AddDomainChild(root);
        this.allAbilityRoot.push(root.Id);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().addAbilityRoot(root);
        }
    }

    removeAbilityRoot(root: AbilityEntityRoot) {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (root.DomainParent != battleunit) {
            return;
        }
        battleunit.RemoveDomainChild(root);
        let index = this.allAbilityRoot.indexOf(root.Id);
        this.allAbilityRoot.splice(index, 1);
        if (battleunit.CombinationComp()) {
            battleunit.CombinationComp().removeAbilityRoot(root);
        }
    }

    levelUpAllAbility() {
        let battleunit = this.GetDomain<BaseNpc_Plus>().ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        this.allAbilityRoot.forEach(str => {
            let ability = battleunit.GetDomainChild<AbilityEntityRoot>(str);
            ability.GetDomain<BaseAbility_Plus>().UpgradeAbility(true);
        })
    }
}