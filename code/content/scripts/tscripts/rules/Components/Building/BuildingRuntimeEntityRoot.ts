
import { KVHelper } from "../../../helper/KVHelper";
import { building_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_mana_control } from "../../../npc/modifier/battle/modifier_mana_control";
import { modifier_wait_portal } from "../../../npc/modifier/modifier_portal";
import { modifier_tp } from "../../../npc/modifier/modifier_tp";
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
        this.InitSyncClientInfo();
        this.InitColor()
        this.JoinInRound();
    }


    OnRound_Battle(round: ERoundBoard) {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(npc);
        modifier_mana_control.applyOnly(npc, npc);
        this.AbilityManagerComp().OnRound_Battle();
        this.InventoryComp().OnRound_Battle();
        let delay = 1;
        if (round.IsFinalRound()) {
            let infp = GChessControlSystem.GetInstance().changeToEndBossPos(this.ChessComp().ChessVector)
            modifier_tp.TeleportToPoint(npc, infp.pos, 1, () => {
                npc.SetForwardVector(infp.forward);
            });
            delay = 1.5;
        }
        GTimerHelper.AddTimer(delay, GHandler.create(this, () => {
            this.AiAttackComp().startFindEnemyAttack();
        }))
    }
    OnRound_Prize(round: ERoundBoard) {
        this.AiAttackComp().endFindToAttack();
        this.AbilityManagerComp().OnRound_Prize(round);
        this.InventoryComp().OnRound_Prize(round);
        if (round.isWin > 0) {
            this.onVictory();
        }
    }
    OnRound_WaitingEnd() {
        this.StopFindTreasure();
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (IsValid(npc) && !npc.__safedestroyed__) {
            SafeDestroyUnit(npc);
        }
    }

    onKilled(events: EntityKilledEvent): void {
        this.changeAliveState(false);
        this.AiAttackComp()?.endFindToAttack();
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

declare global {
    type IBuildingRuntimeEntityRoot = BuildingRuntimeEntityRoot;
    var GBuildingRuntimeEntityRoot: typeof BuildingRuntimeEntityRoot;
}

if (_G.GBuildingRuntimeEntityRoot == undefined) {
    _G.GBuildingRuntimeEntityRoot = BuildingRuntimeEntityRoot;
}