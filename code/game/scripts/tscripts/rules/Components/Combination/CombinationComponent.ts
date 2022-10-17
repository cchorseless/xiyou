import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { AbilityEntityRoot } from "../Ability/AbilityEntityRoot";
import { ItemEntityRoot } from "../Item/ItemEntityRoot";
import { ECombinationLabelItem } from "./ECombinationLabelItem";

@registerET()
export class CombinationComponent extends ET.Component {
    onAwake(): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
    }

    AbilityCombination: string[] = [];
    ItemCombination: string[] = [];
    addAbilityRoot(abilityroot: AbilityEntityRoot) {
        let config = abilityroot.config();
        if (config == null) {
            return;
        }
        if (config.CombinationLabel && config.CombinationLabel.length > 0) {
            let type = PrecacheHelper.GetRegClass<typeof ECombinationLabelItem>("ECombinationLabelItem");
            config.CombinationLabel.split("|").forEach((item) => {
                if (item && item.length > 0) {
                    let entity = this.AddChild(type, "Ability", abilityroot.Id, item);
                    this.AbilityCombination.push(entity.Id);
                }
            });
        }
    }
    removeAbilityRoot(abilityroot: AbilityEntityRoot) {
        for (let i = 0, len = this.AbilityCombination.length; i < len; i++) {
            let entity = this.GetChild<ECombinationLabelItem>(this.AbilityCombination[i]);
            if (entity) {
                if (entity.SourceEntityId === abilityroot.Id) {
                    entity.Dispose();
                    this.AbilityCombination.splice(i, 1);
                    i--;
                    if (i >= this.AbilityCombination.length - 1) {
                        break;
                    }
                }
            }
        }
    }

    getAllCombinations() {
        let r: ECombinationLabelItem[] = [];
        [].concat(this.AbilityCombination, this.ItemCombination).forEach((entityid) => {
            let entity = this.GetChild<ECombinationLabelItem>(entityid);
            if (entity) {
                r.push(entity);
            }
        });
        return r;
    }

    addItemRoot(itemroot: ItemEntityRoot) {
        let config = itemroot.config();
        if (config == null) {
            return;
        }
        if (config.CombinationLabel && config.CombinationLabel.length > 0) {
            let type = PrecacheHelper.GetRegClass<typeof ECombinationLabelItem>("ECombinationLabelItem");
            config.CombinationLabel.split("|").forEach((item) => {
                if (item && item.length > 0) {
                    let entity = this.AddChild(type, "Item", itemroot.Id, item);
                    this.ItemCombination.push(entity.Id);
                }
            });
        }
    }

    removeItemRoot(itemroot: ItemEntityRoot) {
        for (let i = 0, len = this.ItemCombination.length; i < len; i++) {
            let entity = this.GetChild<ECombinationLabelItem>(this.ItemCombination[i]);
            if (entity) {
                if (entity.SourceEntityId === itemroot.Id) {
                    entity.Dispose();
                    this.ItemCombination.splice(i, 1);
                    i--;
                    if (i >= this.ItemCombination.length - 1) {
                        break;
                    }
                }
            }
        }
    }
    // 战吼
    OnRoundStartBattle() {

    }

}
