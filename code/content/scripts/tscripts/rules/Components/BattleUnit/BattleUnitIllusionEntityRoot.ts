import { KVHelper } from "../../../helper/KVHelper";
import { modifier_jiaoxie_wudi } from "../../../npc/modifier/battle/modifier_jiaoxie_wudi";
import { AiAttackComponent } from "../AI/AiAttackComponent";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
import { ERoundBoard } from "../Round/ERoundBoard";

export class BattleUnitIllusionEntityRoot extends BattleUnitEntityRoot {
    public onAwake(playerid: PlayerID, conf: string) {
        (this.BelongPlayerid as any) = playerid;
        (this.ConfigID as any) = conf;
        (this.EntityId as any) = this.GetDomain<IBaseNpc_Plus>().GetEntityIndex();
        this.AddComponent(GGetRegClass<typeof AiAttackComponent>("AiAttackComponent"));
        this.JoinInRound();

    }
    OnRound_Battle() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        modifier_jiaoxie_wudi.remove(npc);
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            this.AiAttackComp().startFindEnemyAttack();
        }))
    }
    OnRound_Prize(round: ERoundBoard) {
    }
    IsIllusion(): boolean {
        return true;
    }

    onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GFuncEntity.IsValid(npc) && !npc.__safedestroyed__) {
            GFuncEntity.SafeDestroyUnit(npc);
        }
    }



    Config() {
        return KVHelper.KvUnits["" + this.ConfigID] as building_unit_tower.OBJ_2_1;
    }

    GetDotaHeroName() {
        return this.Config().DotaHeroName;
    }
}
