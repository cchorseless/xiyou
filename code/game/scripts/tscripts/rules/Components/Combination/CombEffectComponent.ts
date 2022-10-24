import { GetRegClass, reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { CombinationConfig } from "../../System/Combination/CombinationConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombination } from "./ECombination";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";

@reloadable
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
            for (let buff of bufflist) {
                if (buff && buff.length > 0) {
                    let buffconfig = KVHelper.KvServerConfig.effect_config[buff];
                    let type = GetRegClass<typeof BaseModifier_Plus>(buff);
                    if (buffconfig && type) {
                        let battleunits: PlayerCreateBattleUnitEntityRoot[];
                        switch (buffconfig.target) {
                            case CombinationConfig.EEffectTargetType.hero:
                                battleunits = ecomb.getAllBuilding();
                                break;
                            case CombinationConfig.EEffectTargetType.team:
                                battleunits = this.Domain.ETRoot.AsPlayer().BuildingManager().getAllBattleBuilding(true, false)
                                break;
                            case CombinationConfig.EEffectTargetType.enemy:
                                battleunits = this.Domain.ETRoot.AsPlayer().EnemyManagerComp().getAllAliveEnemy()
                                break;
                        };
                        if (battleunits) {
                            if (isActive) {
                                battleunits.forEach(unit => {
                                    let entity: BaseNpc_Plus;
                                    if (unit.IsBuilding()) {
                                        let RuntimeBuilding = unit.As<BuildingEntityRoot>().RuntimeBuilding;
                                        if (RuntimeBuilding) {
                                            entity = RuntimeBuilding.GetDomain<BaseNpc_Plus>();
                                        }
                                    }
                                    else {
                                        entity = unit.GetDomain<BaseNpc_Plus>();
                                    }
                                    if (entity) {
                                        type.applyOnly(entity, entity)
                                    }
                                })
                            }
                            else {
                                battleunits.forEach(unit => {
                                    let entity: BaseNpc_Plus;
                                    if (unit.IsBuilding()) {
                                        let RuntimeBuilding = unit.As<BuildingEntityRoot>().RuntimeBuilding;
                                        if (RuntimeBuilding) {
                                            entity = RuntimeBuilding.GetDomain<BaseNpc_Plus>();
                                        }
                                    }
                                    else {
                                        entity = unit.GetDomain<BaseNpc_Plus>();
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

    OnRoundStartBattle() {
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