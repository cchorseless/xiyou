import { building_combination_ability } from "../../../kvInterface/building/building_combination_ability";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombinationLabelItem } from "./ECombinationLabelItem";
@registerET()
export class ECombination extends ET.Entity {
    private config: { [k: string]: building_combination_ability.OBJ_2_1 } = {};
    private activeNeedCount: number;
    private combination: { [k: string]: ECombinationLabelItem[] } = {};

    addConfig(c: building_combination_ability.OBJ_2_1) {
        this.config[c.index] = c;
        this.activeNeedCount = tonumber(c.count);
    }

    isInCombination(c: number | string) {
        for (let k in this.config) {
            // if (this.config[k].heroid == "" + c) {
            //     return true
            // }
            if (this.config[k].Abilityid == "" + c) {
                return true;
            }
        }
        return false;
    }

    isActive() {
        let buildingconfigid: string[] = [];
        for (let k in this.combination) { 
            let c = this.combination[k];
            c.forEach(entity => {
                let building = entity.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
                if (!buildingconfigid.includes(building.ConfigID)) {
                    buildingconfigid.push(building.ConfigID);
                }
            })
        }
        return buildingconfigid.length >= this.activeNeedCount;
    }

    addCombination(entity: ECombinationLabelItem) {
        let c = entity.SourceEntityConfigId;
        if (this.isInCombination(c)) {
            this.combination[c] = this.combination[c] || [];
            if (!this.combination[c].includes(entity)) {
                this.combination[c].push(entity);
            }
            if (this.isActive()) {
                // for (let key of this.entityArr) {
                //     let eni = ET.EntityEventSystem.GetEntity(key);
                //     if (eni != null) {
                //     }
                // }
            }
        }
    }

    removeCombination(entity: ECombinationLabelItem) {
        let c = entity.SourceEntityConfigId;
        if (this.combination[c] && this.combination[c].includes(entity)) {
            let index = this.combination[c].indexOf(entity);
            this.combination[c].splice(index, 1);
        }
        if (this.combination[c].length == 0) {
            delete this.combination[c];
        }
        if (!this.isActive()) {
            // for (let key of this.entityArr) {
            //     let eni = ET.EntityEventSystem.GetEntity(key);
            //     if (eni != null) {
            //     }
            // }
        }
    }


    public onDestroy(): void {
    }
}
