
import { ET } from "../../../shared/lib/Entity";

@GReloadable
export class AiAttackComponent extends ET.Component {

    timerBattle: ITimerTask;
    startFindEnemyAttack() {
        if (this.timerBattle) {
            this.timerBattle.Clear();
            this.timerBattle = null;
        }
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (!npc.IsAttacker()) {
            return;
        }
        // if (!npc.IsCreature() && !npc.IsCreep()) {
        //     return
        // }
        this.timerBattle = GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            if (this.IsDisposed()) { return }
            let u = this.GetDomain<IBaseNpc_Plus>();
            if (u.IsCommandRestricted() || u.IsStunned() || u.IsFeared() || u.IsFreeze() || u.IsOutOfGame()) {
                return 0.5;
            }
            if (u.IsChanneling()) {
                return 0.5;
            }
            let casttime = this.castAbilityAndItem();
            if (!u.IsIllusion() && casttime > 0) {
                return casttime;
            }
            if (this.findAroundEnemyToAttack()) {
                return 1;
            }
            return 0.5;
        }))
    }

    endFindToAttack() {
        if (this.timerBattle) {
            this.timerBattle.Clear()
            this.timerBattle = null;
        }
    }

    IsCanAttackTarget(target: IBaseNpc_Plus, x?: number, y?: number) {
        if (target == null) {
            return false;
        }
        let attacker = this.GetDomain<IBaseNpc_Plus>();
        if (!IsValid(attacker) || !IsValid(target)) {
            return false;
        }
        if (!attacker.IsAlive() || !target.IsAlive()) {
            return false;
        }
        if (x == null || y == null) {
            let pos = attacker.GetAbsOrigin();
            x = pos.x;
            y = pos.y;
        }
        let targetpos = target.GetAbsOrigin();
        let p = Vector(x, y, targetpos.z);
        let p2 = targetpos;
        if (!target.IsInvisible() && GFuncVector.AsVector(p - p2).Length2D() < attacker.GetAttackRangePlus() + target.GetHullRadius() + attacker.GetHullRadius()) {
            return true;
        } else {
            return false;
        }
    }
    onDestroy(): void {
        this.endFindToAttack();
    }
    castAbilityAndItem() {
        let u = this.GetDomain<IBaseNpc_Plus>();
        let abilitys = u.GetAllCanCastAbility();
        while (abilitys.length > 0) {
            let ability = abilitys.shift();
            if (ability && ability.AutoSpellSelf()) {
                return math.max(ability.GetCastPoint() || 0, 1);
            }
        }
        let items = u.GetAllCanCastItem();
        while (items.length > 0) {
            let item = items.shift();
            if (item && item.AutoSpellSelf()) {
                return math.max(item.GetCastPoint() || 0, 1);
            }
        }
        return -1;
    }
    findAroundEnemyToAttack(): boolean {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (!IsValid(npc)) {
            return false;
        }
        if (!npc.HasMovementCapability()) {
            return false
        }
        const playerroot = GGameScene.GetPlayer(this.BelongPlayerid);
        if (!playerroot) {
            return false
        }
        let new_target = npc.GetAttackTarget() as IBaseNpc_Plus;
        if (!IsValid(new_target) || !new_target.IsAlive()) {
            let team = npc.GetTeam() == DOTATeam_t.DOTA_TEAM_GOODGUYS ? DOTATeam_t.DOTA_TEAM_BADGUYS : DOTATeam_t.DOTA_TEAM_GOODGUYS;
            let enemys = playerroot.BattleUnitManagerComp().GetAllBattleUnitAliveNpc(team);
            enemys = enemys.filter((v) => { return v.IsAlive() && v.IsAttacker() });
            if (enemys.length > 0) {
                let pos = npc.GetAbsOrigin();
                enemys.sort((a, b) => {
                    let apos = a.GetAbsOrigin();
                    let bpos = b.GetAbsOrigin();
                    let a1 = (apos - pos as Vector).Length2D();
                    let b1 = (bpos - pos as Vector).Length2D();
                    if (math.abs(a1 - b1) < 50) {
                        return b.GetHealthLosePect() - a.GetHealthLosePect();
                    }
                    return a1 - b1;
                });
                new_target = enemys[0] as IBaseNpc_Plus;
            }
        }
        if (IsValid(new_target)) {
            if (this.IsCanAttackTarget(new_target)) {
                GFuncEntity.ExecuteOrder(npc, dotaunitorder_t.DOTA_UNIT_ORDER_ATTACK_TARGET, new_target, null);
            }
            else {
                npc.MoveToTargetToAttack(new_target)
            }
            return true;
        }
        return false;
    }


}