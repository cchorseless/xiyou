import { GetRegClass, reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { building_combination_ability } from "../../../kvInterface/building/building_combination_ability";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { CombinationConfig } from "../../System/Combination/CombinationConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { ECombinationLabelItem } from "./ECombinationLabelItem";


@reloadable
export class ECombination extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;
    private config: { [k: string]: building_combination_ability.OBJ_2_1 } = {};
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
        (this as any).isActive = curCount >= this.activeNeedCount;
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }



    getCurUniqueCount() {
        this.uniqueConfigList = [];
        for (let k in this.combination) {
            let c = this.combination[k];
            c.forEach(entity => {
                let building = entity.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
                if (!this.uniqueConfigList.includes(building.ConfigID)) {
                    this.uniqueConfigList.push(building.ConfigID);
                }
            })
        }
        return this.uniqueConfigList.length
    }

    getAllBuilding() {
        let r: BuildingEntityRoot[] = [];
        for (let k in this.combination) {
            let c = this.combination[k];
            c.forEach(entity => {
                let building = entity.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>();
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

    ApplyBuffEffect(isActive: boolean = false) {
        let config = KVHelper.KvServerConfig.building_combination_ability[this.combinationId];
        if (config) {
            let combuff = config.acitve_common_effect;
            let spebuff = config.acitve_special_effect;
            let bufflist: string[] = [];
            if (combuff && combuff.length > 0) {
                combuff.split("|").forEach(buff => {
                    buff && bufflist.push(buff);
                })
            }
            if (spebuff && spebuff.length > 0) {
                spebuff.split("|").forEach(buff => {
                    buff && bufflist.push(buff);
                })
            }
            for (let buff of bufflist) {
                if (buff && buff.length > 0) {
                    let buffconfig = KVHelper.KvServerConfig.effect_config[buff];
                    let type = GetRegClass<typeof BaseModifier_Plus>(buff)
                    if (buffconfig && type) {
                        let buildings: PlayerCreateBattleUnitEntityRoot[];
                        switch (buffconfig.target) {
                            case CombinationConfig.EEffectTargetType.hero:
                                buildings = this.getAllBuilding();
                                break;
                            case CombinationConfig.EEffectTargetType.team:
                                buildings = this.Domain.ETRoot.AsPlayer().BuildingManager().getAllBattleBuilding(true, false)
                                break;
                            case CombinationConfig.EEffectTargetType.enemy:
                                buildings = this.Domain.ETRoot.AsPlayer().EnemyManagerComp().getAllAliveEnemy()
                                break;
                        };
                        if (buildings) {
                            if (isActive) {
                                buildings.forEach(build => {
                                    let entity: BaseNpc_Plus;
                                    if (build.IsBuilding()) {
                                        let RuntimeBuilding = build.As<BuildingEntityRoot>().RuntimeBuilding;
                                        if (RuntimeBuilding) {
                                            entity = RuntimeBuilding.GetDomain<BaseNpc_Plus>();
                                        }
                                    }
                                    else {
                                        entity = build.GetDomain<BaseNpc_Plus>();
                                    }
                                    if (entity) {
                                        type.applyOnly(entity, entity)
                                    }
                                })
                            }
                            else {
                                buildings.forEach(build => {
                                    let entity: BaseNpc_Plus;
                                    if (build.IsBuilding()) {
                                        let RuntimeBuilding = build.As<BuildingEntityRoot>().RuntimeBuilding;
                                        if (RuntimeBuilding) {
                                            entity = RuntimeBuilding.GetDomain<BaseNpc_Plus>();
                                        }
                                    }
                                    else {
                                        entity = build.GetDomain<BaseNpc_Plus>();
                                    }
                                    if (entity) {
                                        type.remove(entity)
                                    }
                                })
                            }
                        }
                    }
                }
            }
        }
    }

}
