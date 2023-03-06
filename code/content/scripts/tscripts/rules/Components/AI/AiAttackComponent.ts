
import { modifier_taunt } from "../../../npc/modifier/effect/modifier_taunt";
import { ET } from "../../../shared/lib/Entity";

@GReloadable
export class AiAttackComponent extends ET.Component {

    timerBattle: ITimerTask;
    startFindEnemyAttack() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let chessComp = domain.ETRoot.As<IBattleUnitEntityRoot>().ChessComp();
        chessComp.updateBoardPos();
        if (this.timerBattle) {
            this.timerBattle.Clear();
            this.timerBattle = null;
        }
        this.timerBattle = GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            if (this.IsDisposed()) { return }
            if (chessComp.isMoving) {
                return 0.1;
            }
            // todo
            if (this.castAbilityAndItem()) {
                return 1;
            }
            let enemy = this.findAroundEnemyToAttack();
            if (enemy) {
                let enemyRoot = enemy.ETRoot.As<IBattleUnitEntityRoot>();
                if (!chessComp.IsCanAttackTarget(enemyRoot)) {
                    let pos = chessComp.FindClosePosToEnemy(enemyRoot);
                    if (pos) {
                        domain.MoveToTargetToAttack(enemy)
                        // chessComp.blinkChessX(pos, false);
                    }
                } else {
                    GFuncEntity.ExecuteOrder(domain, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, enemy, null);
                }
                return 1;
            }
        }))
    }

    endFindToAttack() {
        if (this.timerBattle) {
            this.timerBattle.Clear()
            this.timerBattle = null;
        }
    }

    onDestroy(): void {
        GLogHelper.print("onDestroy", "AiAttackComponent")
        this.endFindToAttack();
    }
    castAbilityAndItem() {
        let u = this.GetDomain<IBaseNpc_Plus>();
        let battleUnit = u.ETRoot.As<IBattleUnitEntityRoot>();
        let abilityM = battleUnit.AbilityManagerComp();
        if (abilityM) {
            let abilitys = abilityM.getAllCanCastAbility();
            // GLogHelper.print(abilitys.length)
            while (abilitys.length > 0) {
                let ability = abilitys.shift();
                // GLogHelper.print(ability.GetAbilityName())
                if (ability && ability.AutoSpellSelf()) {
                    return true;
                }
            }
        }
        let itemM = battleUnit.InventoryComp();
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
    findAroundEnemyToAttack(): IBaseNpc_Plus {
        let u = this.GetDomain<IBuilding_BaseNpc>();
        let building = u.ETRoot.As<IBattleUnitEntityRoot>();
        if (!GFuncEntity.IsValid(u)) {
            return;
        }
        let new_target: IBaseNpc_Plus = null;
        if (u.FindEnemyToAttack) {
            new_target = u.FindEnemyToAttack();
        }
        if (!GFuncEntity.IsValid(new_target)) {
            let current_target = u.GetAttackTarget() as IBaseNpc_Plus;
            let all_unit: IBattleUnitEntityRoot[];
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
            if (_taunt && GFuncEntity.IsValid(_taunt.TauntUnit)) {
                // 有嘲讽目标，优先打嘲讽目标
                new_target = _taunt.TauntUnit;
            }
            // 优先3：已经在打合适的目标
            if (new_target == null && GFuncEntity.IsValid(current_target)) {
                new_target = current_target;
            }
            // 优先4：找最近的
            if (new_target == null) {
                let closest_distance = 9999;
                for (let enemy of all_unit) {
                    let v = enemy.GetDomain<IBaseNpc_Plus>();
                    if (GFuncEntity.IsValid(v)) {
                        let d = GFuncVector.AsVector(v.GetAbsOrigin() - u.GetAbsOrigin()).Length2D();
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