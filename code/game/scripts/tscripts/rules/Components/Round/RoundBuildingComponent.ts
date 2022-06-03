import { GameFunc } from "../../../GameFunc";
import { TimerHelper } from "../../../helper/TimerHelper";
import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_taunt } from "../../../npc/modifier/effect/modifier_taunt";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/modifier_jiaoxie_wudi";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { modifier_remnant } from "../../../npc/modifier/modifier_remnant";
import { IBuilding_BaseNpc } from "../../../npc/units/building/Building_BaseNpc";
import { ET, registerET } from "../../Entity/Entity";
import { RoundConfig } from "../../System/Round/RoundConfig";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { EnemyUnitEntityRoot } from "../Enemy/EnemyUnitEntityRoot";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";
/**回合控制 */
@registerET()
export class RoundBuildingComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let currentround = domain.ETRoot.As<PlayerCreateUnitEntityRoot>().GetPlayer().RoundManagerComp().getCurrentBoardRound();
        switch (currentround.roundState) {
            case RoundConfig.ERoundBoardState.start:
                this.OnBoardRound_Start();
                break;
        }
    }
    OnBoardRound_Start() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_jiaoxie_wudi.applyOnly(domain, domain);
            })
        );
    }

    timerBattle: string;
    OnBoardRound_Battle() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(domain);
        modifier_remnant.applyOnly(domain, domain);
        let chessComp = domain.ETRoot.As<BuildingEntityRoot>().ChessComp();
        chessComp.updateBoardPos();
        if (this.timerBattle) {
            TimerHelper.removeTimer(this.timerBattle);
            this.timerBattle = null;
        }
        this.timerBattle = TimerHelper.addTimer(
            0.1,
            () => {
                if (chessComp.is_moving) {
                    return 0.1;
                }
                let enemy = this.FindAroundEnemyToAttack();
                if (enemy) {
                    let enemyRoot = enemy.ETRoot.As<EnemyUnitEntityRoot>();
                    if (!chessComp.IsCanAttackTarget(enemyRoot)) {
                        let pos = chessComp.FindClosePosToEnemy(enemyRoot);
                        if (pos) {
                            chessComp.blinkChessX(pos);
                        }
                    } else {
                        GameFunc.ExecuteOrder(domain, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, enemy, null);
                    }
                    return 1;
                }
            },
            this
        );
    }

    OnBoardRound_Prize(isWin: boolean) {
        if (this.timerBattle) {
            TimerHelper.removeTimer(this.timerBattle);
            this.timerBattle = null;
        }
        let domain = this.GetDomain<BaseNpc_Plus>();
        if (isWin) {
            building_auto_findtreasure.findIn(domain).StartFindTreasure();
            modifier_wait_portal.applyOnly(domain, domain, null, { duration: 60 });
        } else {
            modifier_remnant.remove(domain);
        }
    }
    OnBackBoardFromBaseRoom() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.SetIdleAcquire(true);
        // domain.StartGesture(GameActivity_t.ACT_DOTA_IDLE);
    }
    OnBoardRound_WaitingEnd() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let ability = building_auto_findtreasure.findIn(domain);
        if (ability.IsFinding()) {
            ability.GoBackBoard();
        }
    }

    FindAroundEnemyToAttack(): BaseNpc_Plus {
        let u = this.GetDomain<BaseNpc_Plus>();
        let building = u.ETRoot.As<BuildingEntityRoot>();
        if (!GameFunc.IsValid(u)) {
            return;
        }
        let new_target: BaseNpc_Plus = null;
        if ((u as IBuilding_BaseNpc).FindEnemyToAttack) {
            new_target = (u as IBuilding_BaseNpc).FindEnemyToAttack();
        }
        if (!GameFunc.IsValid(new_target)) {
            let current_target = u.GetAttackTarget() as BaseNpc_Plus;
            let all_unit = building.GetPlayer().EnemyManagerComp().getAllEnemy();
            // 优先1：嘲讽
            let _taunt = modifier_taunt.findIn(u);
            if (_taunt && GameFunc.IsValid(_taunt.TauntUnit)) {
                // 有嘲讽目标，优先打嘲讽目标
                new_target = _taunt.TauntUnit;
            }
            // 优先3：已经在打合适的目标
            if (new_target == null && GameFunc.IsValid(current_target)) {
                new_target = current_target;
            }
            // 优先4：找最近的
            if (new_target == null) {
                let closest_distance = 9999;
                for (let enemy of all_unit) {
                    let v = enemy.GetDomain<BaseNpc_Plus>();
                    if (GameFunc.IsValid(v)) {
                        let d = GameFunc.AsVector(v.GetAbsOrigin() - u.GetAbsOrigin()).Length2D();
                        if (d < closest_distance) {
                            new_target = v;
                            closest_distance = d;
                        }
                    }
                }
            }
        }
        return new_target;
    }
}
