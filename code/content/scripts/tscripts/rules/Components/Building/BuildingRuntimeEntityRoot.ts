
import { KVHelper } from "../../../helper/KVHelper";
import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";

export class BuildingRuntimeEntityRoot extends BattleUnitEntityRoot {
    public IsRuntimeBuilding(): boolean {
        return true;
    }
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.addBattleComp();
        this.JoinInRound();
    }


    OnRound_Battle() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(npc);
        this.AbilityManagerComp().OnRound_Battle();
        this.InventoryComp().OnRound_Battle();
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            this.AiAttackComp().startFindEnemyAttack();
        }))
    }
    OnRound_Prize(round: ERoundBoard) {
        this.AiAttackComp().endFindToAttack();
        this.AbilityManagerComp().OnRound_Prize(round);
        this.InventoryComp().OnRound_Prize(round);
        if (round.isWin) {
            // this.StartFindTreasure();
        }
    }
    OnRound_WaitingEnd() {
        this.StopFindTreasure();
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(npc) && !npc.__safedestroyed__) {
            GFuncEntity.SafeDestroyUnit(npc);
        }
    }

    onKilled(events: EntityKilledEvent): void {
        this.changeAliveState(false);
        this.AiAttackComp().endFindToAttack();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }

    Config() {
        return KVHelper.KvConfig().building_unit_tower["" + this.ConfigID];
    }

    GetSourceBuilding() {

    }

    StartFindTreasure() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        this.AbilityManagerComp().clearAllAbility();
        domain.addAbilityPlus("building_auto_findtreasure")
        building_auto_findtreasure.findIn(domain).StartFindTreasure();
        modifier_wait_portal.applyOnly(domain, domain, null, { duration: 60 });
    }

    StopFindTreasure() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let ability = building_auto_findtreasure.findIn(domain);
        if (ability.IsFinding()) {
            ability.GoBackBoard();
        }
    }
    OnBackBoardFromBaseRoom() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.SetIdleAcquire(true);
        // domain.StartGesture(GameActivity_t.ACT_DOTA_IDLE);
    }
    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }

}