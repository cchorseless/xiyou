import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombination } from "./ECombination";

@registerET()
export class CombinationManagerComponent extends ET.Component {
    onAwake(): void {
        let config = KVHelper.KvServerConfig.building_combination;
        for (let key in config) {
            let info = config[key];
            let combina = this.allCombination[info.relation];
            if (combina == null) {
                combina = this.AddChild(ECombination);
                this.allCombination[info.relation] = combina;
            }
            combina.addConfig(info);
        }
    }

    private allCombination: { [k: string]: ECombination } = {};
    private entityArr: string[] = [];

    public add(entity: BuildingEntityRoot) {
        let comb = entity.CombinationComp();
        if (comb == null) {
            return;
        }
        if (this.entityArr.indexOf(entity.Id) == -1) {
            this.entityArr.push(entity.Id);
        }
        for (let k in this.allCombination) {
            let info = this.allCombination[k];
            if (info.isInCombination(entity.ConfigID)) {
                info.addCombination(entity);
            }
        }
    }

    public remove(entity: BuildingEntityRoot) {
        let comb = entity.CombinationComp();
        if (comb == null) {
            return;
        }
        let index = this.entityArr.indexOf(entity.Id);
        if (index > -1) {
            this.entityArr.splice(index, 1);
        }
        for (let k in this.allCombination) {
            let info = this.allCombination[k];
            if (info.isInCombination(entity.ConfigID)) {
                info.removeCombination(entity);
            }
        }
    }

    private refresh(entity: BuildingEntityRoot, isadd: boolean) {
        let config;
    }

    public onDestroy(): void {
        this.entityArr = null;
    }
}
