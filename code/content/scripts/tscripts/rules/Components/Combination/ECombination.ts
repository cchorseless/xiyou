
import { LogHelper } from "../../../helper/LogHelper";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { CombEffectComponent } from "./CombEffectComponent";
import { ECombinationLabelItem } from "./ECombinationLabelItem";


@GReloadable
export class ECombination extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    public config: { [k: string]: building_combination_ability.OBJ_2_1 } = {};
    private combination: { [k: string]: ECombinationLabelItem[] } = {};
    @serializeETProps()
    public combinationName: string;
    @serializeETProps()
    public combinationId: string;
    @serializeETProps()
    public activeNeedCount: number;
    @serializeETProps()
    public uniqueConfigList: string[] = [];

    onAwake(CombinationId: string): void {
        this.combinationId = CombinationId;
        this.AddComponent(GGetRegClass<typeof CombEffectComponent>("CombEffectComponent"));
    }

    CombEffectComp() {
        return this.GetComponent(GGetRegClass<typeof CombEffectComponent>("CombEffectComponent"));
    }

    addConfig(c: building_combination_ability.OBJ_2_1) {
        this.config[c.index] = c;
        this.activeNeedCount = tonumber(c.active_count);
        this.combinationName = c.relation;
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


    readonly isActive: boolean = false;
    checkActive() {
        let curCount = this.getCurUniqueCount();
        // todo 特殊需要处理
        (this.isActive as any) = curCount >= this.activeNeedCount;
        this.SyncClient();
    }


    getCurUniqueCount() {
        this.uniqueConfigList = [];
        for (let k in this.combination) {
            let c = this.combination[k];
            c.forEach(entity => {
                let building = entity.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBuildingEntityRoot>();
                if (!this.uniqueConfigList.includes(building.ConfigID)) {
                    this.uniqueConfigList.push(building.ConfigID);
                }
            })
        }
        return this.uniqueConfigList.length
    }

    getAllBuilding() {
        let r: IBuildingEntityRoot[] = [];
        for (let k in this.combination) {
            let c = this.combination[k];
            c.forEach(entity => {
                let building = entity.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBuildingEntityRoot>();
                if (!r.includes(building)) {
                    r.push(building);
                }
            })
        }
        return r;
    }

    addCombination(entity: ECombinationLabelItem) {
        let c = entity.SourceEntityConfigId;
        if (this.isInCombination(c)) {
            this.combination[c] = this.combination[c] || [];
            if (!this.combination[c].includes(entity)) {
                this.combination[c].push(entity);
            }
            this.checkActive();
            if (this.isActive) {
                // this.ApplyBuffEffect(true);
            }
        }
    }
    removeAllCombination() {
        this.combination = {};
        this.checkActive();
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
        this.checkActive();
        LogHelper.print("removeCombination-------")
        if (!this.isActive) {
            // this.CancelEffect();
        }
    }

}
