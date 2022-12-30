
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { CombinationConfig } from "../../../shared/CombinationConfig";
import { ET } from "../../../shared/lib/Entity";
import { ERoundBoard } from "../Round/ERoundBoard";
import { ECombination } from "./ECombination";

@GReloadable
export class CombEffectComponent extends ET.Component {

    ApplyBuffEffect(isActive: boolean = false) {
        let ecomb = this.GetParent<ECombination>();
        let configMap = ecomb.config;
        if (configMap) {
            let bufflist: Set<string> = new Set<string>();
            for (let key in configMap) {
                let config = configMap[key];
                let combuff = config.acitve_common_effect;
                let spebuff = config.acitve_special_effect;
                if (combuff && combuff.length > 0) {
                    combuff.split("|").forEach(buff => {
                        buff && bufflist.add(buff);
                    })
                }
                if (spebuff && spebuff.length > 0) {
                    spebuff.split("|").forEach(buff => {
                        buff && bufflist.add(buff);
                    })
                }
            }
            bufflist.forEach(buff => {
                if (buff && buff.length > 0) {
                    let buffconfig = KVHelper.KvServerConfig.effect_config[buff];
                    let type = GGetRegClass<typeof BaseModifier_Plus>(buff);
                    if (buffconfig && type) {
                        let battleunits: IBattleUnitEntityRoot[];
                        switch (buffconfig.target) {
                            case CombinationConfig.EEffectTargetType.hero:
                                battleunits = ecomb.getAllBuilding();
                                break;
                            case CombinationConfig.EEffectTargetType.team:
                                battleunits = GPlayerEntityRoot.GetOneInstance(this.BelongPlayerid).BuildingManager().getAllBattleBuilding(true, false)
                                break;
                            case CombinationConfig.EEffectTargetType.enemy:
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
        let ecomb = this.GetParent<ECombination>();
        LogHelper.print("OnRoundStartBattle", ecomb.combinationId);
        this.ApplyBuffEffect(true);
    }

    OnRoundStartPrize(round: ERoundBoard) {
        let ecomb = this.GetParent<ECombination>();
        let combinationName = ecomb.combinationName;
        let combinationId = ecomb.combinationId;
        if (combinationName === CombinationConfig.ECombinationLabel.suck_blood) {

        }
        else if (combinationName === CombinationConfig.ECombinationLabel.suck_blood) {

        }
    }
}