import { KVHelper } from "../../../helper/KVHelper";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { modifier_mana_control } from "../../../npc/modifier/battle/modifier_mana_control";
import { AiAttackComponent } from "../AI/AiAttackComponent";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";

export class BattleUnitSummonEntityRoot extends BattleUnitEntityRoot {
    readonly SourceEntityId: EntityIndex;
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        (this.SourceEntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetOwnerPlus().GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof AiAttackComponent>("AiAttackComponent"));
        this.InitSyncClientInfo();
        this.InitColor();
        this.JoinInRound();

    }
    OnRound_Battle() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(npc);
        modifier_mana_control.applyOnly(npc, npc);
        GTimerHelper.AddTimer(0.1,
            GHandler.create(this, () => {
                this.AiAttackComp().startFindEnemyAttack();
            }))
    }
    OnRound_Prize(round: ERoundBoard) {
    }
    IsSummon() {
        return true;
    }
    onKilled(events: EntityKilledEvent): void {
        this.changeAliveState(false);
        this.AiAttackComp()?.endFindToAttack();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }
    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (IsValid(npc) && !npc.__safedestroyed__) {
            SafeDestroyUnit(npc);
        }
    }


    Config() {
        return KVHelper.KvUnits["" + this.ConfigID] as building_unit_tower.OBJ_2_1;;
    }

    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }

}
declare global {
    type IBattleUnitSummonEntityRoot = BattleUnitSummonEntityRoot;
}