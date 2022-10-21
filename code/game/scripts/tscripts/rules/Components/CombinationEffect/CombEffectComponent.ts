import { GetRegClass, reloadable } from "../../../GameCache";
import { KVHelper } from "../../../helper/KVHelper";
import { BaseModifier_Plus } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { CombinationConfig } from "../../System/Combination/CombinationConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ECombination } from "../Combination/ECombination";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";

@reloadable
export class CombEffectComponent extends ET.Component {

    public combinationId: string;

    onAwake(CombinationId: string): void {
        this.combinationId = CombinationId;
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
                    let type = GetRegClass<typeof BaseModifier_Plus>(buff);
                    if (buffconfig && type) {
                        let battleunits: PlayerCreateBattleUnitEntityRoot[];
                        switch (buffconfig.target) {
                            case CombinationConfig.EEffectTargetType.hero:
                                battleunits = this.GetParent<ECombination>().getAllBuilding();
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

    OnRoundStartPrize?(round: ERoundBoard, iswin: boolean): void;
}