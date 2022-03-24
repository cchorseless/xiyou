import { building_combination } from "../../../kvInterface/building/building_combination";
import { ET } from "../../Entity/Entity";
import { CombinationComponent } from "./CombinationComponent";

export class ECombination extends ET.Entity {

    private config: { [k: string]: building_combination.OBJ_2_1 } = {};
    private activeNeedCount: number;
    private combination: { [k: string]: number } = {};
    private entityArr: string[] = [];
    
    addConfig(c: building_combination.OBJ_2_1) {
        this.config[c.index] = c;
        this.activeNeedCount = tonumber(c.count);
    }

    isInCombination(c: number | string) {
        for (let k in this.config) {
            if (this.config[k].heroid == "" + c) {
                return true
            }
        }
        return false
    }

    isActive() {
        return Object.keys(this.config).length <= this.activeNeedCount;
    }

    addCombination(entity: ET.EntityRoot) {
        let comp = entity.GetComponent(CombinationComponent);
        if (comp == null) { return };
        if (this.entityArr.indexOf(entity.Id) == -1) {
            this.entityArr.push(entity.Id);
        };
        let c = comp.configID;
        if (this.isInCombination(c)) {
            this.combination[c] = this.combination[c] || 0;
            this.combination[c] += 1;
            if (this.isActive()) {
                for (let key of this.entityArr) {
                    let eni = ET.EntityEventSystem.GetEntity(key);
                    if (eni != null) {
                    }
                }
            }
        }
    }

    removeCombination(entity: ET.EntityRoot) {
        let comp = entity.GetComponent(CombinationComponent);
        if (comp == null) { return };
        let index = this.entityArr.indexOf(entity.Id);
        if (index > -1) {
            this.entityArr.splice(index, 1);
        }
        let c = comp.configID;
        if (this.isInCombination(c)) {
            this.combination[c] && (this.combination[c] -= 1);
            if (this.combination[c] == 0) {
                delete this.combination[c];
            }
        }
    }
    public onDestroy(): void {
        this.entityArr = null;
    }
}