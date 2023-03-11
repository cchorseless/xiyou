
import { LogHelper } from "../../../helper/LogHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { CombinationConfig } from "../../../shared/CombinationConfig";
import { Dota } from "../../../shared/Gen/Types";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";
import { ECombinationLabelItem } from "./ECombinationLabelItem";


@GReloadable
export class ECombination extends ET.Entity {

    public config: { [k: string]: Dota.CombinationConfigRecord } = {};
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


    addConfig(c: Dota.CombinationConfigRecord) {
        this.config[c.index] = c;
        this.activeNeedCount = tonumber(c.activeCount);
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
        if (this.combination[c] && this.combination[c].length == 0) {
            delete this.combination[c];
        }
        this.checkActive();
        LogHelper.print("removeCombination-------")
        if (!this.isActive) {
            // this.CancelEffect();
        }
    }
    ApplyBuffEffect(isActive: boolean = false) {
        let configMap = this.config;
        if (configMap) {
            let bufflist = new Map<string, string>();
            for (let key in configMap) {
                let config = configMap[key];
                let combuff = config.acitveCommonEffect;
                let spebuff = config.acitveSpecialEffect;
                if (combuff && combuff.length > 0) {
                    combuff.split("|").forEach(buff => {
                        buff && bufflist.set(buff, config.Abilityid);
                    })
                }
                if (spebuff && spebuff.length > 0) {
                    spebuff.split("|").forEach(buff => {
                        buff && bufflist.set(buff, config.Abilityid);
                    })
                }
            }
            bufflist.forEach((abilityname, buff) => {
                if (buff && buff.length > 0) {
                    let buffconfig = GJSONConfig.BuffEffectConfig.get(buff);
                    let type = GGetRegClass<typeof BaseModifier_Plus>(buff);
                    if (buffconfig && type) {
                        let battleunits: IBattleUnitEntityRoot[];
                        switch (buffconfig.target) {
                            case CombinationConfig.EEffectTargetType.self:
                                battleunits = this.getAllBuilding().filter(unit => {
                                    let root = unit.GetDomain<IBaseNpc_Plus>();
                                    if (root) {
                                        if (root.FindAbilityByName(abilityname)) {
                                            return true;
                                        }
                                        if (root.FindItemInInventory(abilityname)) {
                                            return true;
                                        }
                                    }
                                    return false;
                                });
                                break;
                            case CombinationConfig.EEffectTargetType.hero:
                                battleunits = this.getAllBuilding();
                                break;
                            case CombinationConfig.EEffectTargetType.team:
                                battleunits = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).BuildingManager().getAllBattleBuilding(true, false)
                                break;
                            case CombinationConfig.EEffectTargetType.enemyteam:
                                battleunits = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).EnemyManagerComp().getAllAliveEnemy()
                                break;
                        };
                        if (battleunits) {
                            if (isActive) {
                                battleunits.forEach(unit => {
                                    let entity: IBaseNpc_Plus;
                                    if (unit.IsBuilding()) {
                                        let RuntimeBuilding = unit.As<IBuildingEntityRoot>().RuntimeBuilding;
                                        if (RuntimeBuilding) {
                                            entity = RuntimeBuilding.GetDomain<IBaseNpc_Plus>();
                                        }
                                    }
                                    else {
                                        entity = unit.GetDomain<IBaseNpc_Plus>();
                                    }
                                    if (entity) {
                                        type.applyOnly(entity, entity)
                                    }
                                })
                            }
                            else {
                                battleunits.forEach(unit => {
                                    let entity: IBaseNpc_Plus;
                                    if (unit.IsBuilding()) {
                                        let RuntimeBuilding = unit.As<IBuildingEntityRoot>().RuntimeBuilding;
                                        if (RuntimeBuilding) {
                                            entity = RuntimeBuilding.GetDomain<IBaseNpc_Plus>();
                                        }
                                    }
                                    else {
                                        entity = unit.GetDomain<IBaseNpc_Plus>();
                                    }
                                    if (entity) {
                                        type.remove(entity)
                                    }
                                })
                            }
                        }
                    }
                }
            })
        }
    }

    OnRoundStartBattle() {
        LogHelper.print("OnRoundStartBattle", this.combinationId);
        this.ApplyBuffEffect(true);
    }

    OnRoundStartPrize(round: ERoundBoard) {
        let combinationName = this.combinationName;
        let combinationId = this.combinationId;
        if (combinationName === CombinationConfig.ECombinationLabel.sect_suck_blood) {

        }
        else if (combinationName === CombinationConfig.ECombinationLabel.sect_suck_blood) {

        }
    }
}
