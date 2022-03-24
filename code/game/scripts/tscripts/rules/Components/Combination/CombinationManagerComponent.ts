import { KVHelper } from "../../../helper/KVHelper";
import { BaseNpc_Hero_Plus } from "../../../npc/entityPlus/BaseNpc_Hero_Plus";
import { ET } from "../../Entity/Entity";
import { CombinationSystem } from "../../System/Combination/CombinationSystem";
import { CombinationComponent } from "./CombinationComponent";
import { ECombination } from "./ECombination";

export class CombinationManagerComponent extends ET.Component {
    readonly PlayerID: number;

    onAwake(): void {
        let config = KVHelper.KvServerConfig.building_combination;
        for (let key in config) {
            let info = config[key as "1001"];
            let combina = this.allCombination[info.relation];
            if (combina == null) {
                combina =  this.AddChild(ECombination);
                this.allCombination[info.relation] = combina
            }
            combina.addConfig(info);
        }
        let domain = this.GetDomain<BaseNpc_Hero_Plus>();
        (this as any).PlayerID = domain.GetPlayerID();
        CombinationSystem.RegComponent(this);
    }

    private allCombination: { [k: string]: ECombination } = {};
    private entityArr: string[] = [];

    public add(entity: ET.EntityRoot) {
        let comb = entity.GetComponent(CombinationComponent);
        if (comb == null) { return };
        if (this.entityArr.indexOf(entity.Id) == -1) {
            this.entityArr.push(entity.Id);
        };
        for (let k in this.allCombination) {
            let info = this.allCombination[k];
            if (info.isInCombination(comb.configID)) { 
                info.addCombination(entity);
            }
        }
    }

    public remove(entity: ET.EntityRoot) {
        let comb = entity.GetComponent(CombinationComponent);
        if (comb == null) { return };
        let index = this.entityArr.indexOf(entity.Id);
        if (index > -1) {
            this.entityArr.splice(index, 1);
        }
        for (let k in this.allCombination) {
            let info = this.allCombination[k];
            if (info.isInCombination(comb.configID)) { 
                info.removeCombination(entity);
            }
        }
    }

    private refresh(entity: ET.EntityRoot, isadd: boolean) {
        let config
    }


    public onDestroy(): void {
        this.entityArr = null;
    }
}