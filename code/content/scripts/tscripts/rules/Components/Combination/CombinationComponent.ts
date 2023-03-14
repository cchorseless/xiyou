
import { ET } from "../../../shared/lib/Entity";
import { ECombinationLabelItem } from "./ECombinationLabelItem";

@GReloadable
export class CombinationComponent extends ET.Component {
    onAwake(): void {
        let domain = this.GetDomain<IBaseNpc_Plus>();
    }

    AbilityCombination: string[] = [];
    ItemCombination: string[] = [];
    addAbilityRoot(abilityroot: IAbilityEntityRoot) {
        let type = GGetRegClass<typeof ECombinationLabelItem>("ECombinationLabelItem");
        abilityroot.SectLabels.forEach((item) => {
            if (item && item.length > 0) {
                let entity = this.AddChild(type, "Ability", abilityroot.Id, item);
                this.AbilityCombination.push(entity.Id);
            }
        });
    }
    removeAbilityRoot(abilityroot: IAbilityEntityRoot) {
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

    addItemRoot(itemroot: IItemEntityRoot) {
        let type = GGetRegClass<typeof ECombinationLabelItem>("ECombinationLabelItem");
        itemroot.SectLabels.forEach((item) => {
            if (item && item.length > 0) {
                let entity = this.AddChild(type, "Item", itemroot.Id, item);
                this.ItemCombination.push(entity.Id);
            }
        });
    }

    removeItemRoot(itemroot: IItemEntityRoot) {
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

}
