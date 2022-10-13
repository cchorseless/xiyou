import { GameFunc } from "../../../GameFunc";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_taunt } from "../../../npc/modifier/effect/modifier_taunt";
import { IBuilding_BaseNpc } from "../../../npc/units/building/Building_BaseNpc";
import { registerET, ET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";

@registerET()
export class AiAttackComponent extends ET.Component {

    timerBattle: string;
    startFindEnemyAttack() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        let chessComp = domain.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().ChessComp();
        chessComp.updateBoardPos();
        if (this.timerBattle) {
            TimerHelper.removeTimer(this.timerBattle);
            this.timerBattle = null;
        }
        this.timerBattle = TimerHelper.addTimer(
            0.1,
            () => {
                if (this.IsDisposed()) { return }
                if (chessComp.isMoving) {
                    return 0.1;
                }
                // todo
                if (this.castAbilityAndItem()) {
                    return 0.1;
                }
                let enemy = this.findAroundEnemyToAttack();
                if (enemy) {
                    let enemyRoot = enemy.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
                    if (!chessComp.IsCanAttackTarget(enemyRoot)) {
                        let pos = chessComp.FindClosePosToEnemy(enemyRoot);
                        if (pos) {
                            chessComp.blinkChessX(pos, false);
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

    endFindToAttack() {
        if (this.timerBattle) {
            TimerHelper.removeTimer(this.timerBattle);
            this.timerBattle = null;
        }
    }

    onDestroy(): void {
        this.endFindToAttack();
    }
    castAbilityAndItem() {
        let u = this.GetDomain<BaseNpc_Plus>();
        let battleUnit = u.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        let abilityM = battleUnit.AbilityManagerComp();
        if (abilityM) {
            let abilitys = abilityM.getAllCanCastAbility();
            while (abilitys.length > 0) {
                let ability = abilitys.shift();
                if (ability && ability.AutoSpellSelf()) {
                    return true;
                }
            }
        }
        let itemM = battleUnit.ItemManagerComp();
        if (itemM) {
            let items = itemM.getAllCanCastItem();
            while (items.length > 0) {
                let item = items.shift();
                if (item && item.AutoSpellSelf()) {
                    return true;
                }
            }
        }
        return false;
    }



    findAroundEnemyToAttack(): BaseNpc_Plus {
        let u = this.GetDomain<BaseNpc_Plus>();
        let building = u.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        if (!GameFunc.IsValid(u)) {
            return;
        }
        let new_target: BaseNpc_Plus = null;
        if ((u as IBuilding_BaseNpc).FindEnemyToAttack) {
            new_target = (u as IBuilding_BaseNpc).FindEnemyToAttack();
        }
        if (!GameFunc.IsValid(new_target)) {
            let current_target = u.GetAttackTarget() as BaseNpc_Plus;
            let all_unit: PlayerCreateBattleUnitEntityRoot[];
            if (u.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS) {
                all_unit = building.GetPlayer().EnemyManagerComp().getAllBattleUnitAlive();
            }
            else if (u.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_BADGUYS) {
                all_unit = building.GetPlayer().BuildingManager().getAllBattleUnitAlive();
            }
            else {
                return
            }
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