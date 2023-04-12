
import { ET } from "../../../shared/lib/Entity";
import { ECombinationLabelItem } from "./ECombinationLabelItem";

@GReloadable
export class CombinationComponent extends ET.Component {
    onAwake(): void {
    }

    AbilityCombination: { [k: string]: string[] } = {};
    ItemCombination: { [k: string]: string[] } = {};

    addAbilityRoot(abilityroot: IAbilityEntityRoot) {
        if (abilityroot == null || this.ItemCombination[abilityroot.Id]) { return }
        let type = GGetRegClass<typeof ECombinationLabelItem>("ECombinationLabelItem");
        abilityroot.SectLabels.forEach((item) => {
            if (item && item.length > 0) {
                let entity = this.AddChild(type, "Ability", abilityroot.Id, item);
                if (!this.AbilityCombination[abilityroot.Id]) {
                    this.AbilityCombination[abilityroot.Id] = [];
                }
                this.AbilityCombination[abilityroot.Id].push(entity.Id);
            }
        });
    }
    removeAbilityRoot(abilityroot: IAbilityEntityRoot) {
        let idlist = this.AbilityCombination[abilityroot.Id];
        if (!idlist) { return }
        idlist.forEach((entityid) => {
            let entity = this.GetChild<ECombinationLabelItem>(entityid);
            if (entity) {
                entity.Dispose();
            }
        });
        delete this.AbilityCombination[abilityroot.Id];
    }

    getAllCombinations() {
        let r: ECombinationLabelItem[] = [];
        for (let k in this.AbilityCombination) {
            let idlist = this.AbilityCombination[k];
            idlist.forEach((entityid) => {
                let entity = this.GetChild<ECombinationLabelItem>(entityid);
                if (entity) {
                    r.push(entity);
                }
            });
        };
        for (let k in this.ItemCombination) {
            let idlist = this.ItemCombination[k];
            idlist.forEach((entityid) => {
                let entity = this.GetChild<ECombinationLabelItem>(entityid);
                if (entity) {
                    r.push(entity);
                }
            });
        };
        return r;
    }

    addItemRoot(itemroot: IItemEntityRoot) {
        if (itemroot == null || this.ItemCombination[itemroot.Id]) { return }
        let type = GGetRegClass<typeof ECombinationLabelItem>("ECombinationLabelItem");
        itemroot.SectLabels.forEach((item) => {
            if (item && item.length > 0) {
                let entity = this.AddChild(type, "Item", itemroot.Id, item);
                if (!this.ItemCombination[itemroot.Id]) {
                    this.ItemCombination[itemroot.Id] = [];
                }
                this.ItemCombination[itemroot.Id].push(entity.Id);
            }
        });
    }

    removeItemRoot(itemroot: IItemEntityRoot) {
        if (itemroot == null) { return }
        let idlist = this.ItemCombination[itemroot.Id];
        if (!idlist) { return }
        idlist.forEach((entityid) => {
            let entity = this.GetChild<ECombinationLabelItem>(entityid);
            if (entity) {
                entity.Dispose();
            }
        });
        delete this.AbilityCombination[itemroot.Id];
    }


    refreshCombination() {
        let r = this.GetChilds(ECombinationLabelItem);
        r.forEach(v => {
            v.checkActive();
        })
    }
}
