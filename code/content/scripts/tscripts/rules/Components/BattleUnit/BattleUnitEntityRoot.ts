
import { GameFunc } from "../../../GameFunc";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { AiAttackComponent } from "../AI/AiAttackComponent";
import { BuffManagerComponent } from "../Buff/BuffManagerComponent";
import { ChessMoveComponent } from "../ChessControl/ChessMoveComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { InventoryComponent } from "../Inventory/InventoryComponent";
import { RoundStateComponent } from "../Round/RoundStateComponent";
import { WearableComponent } from "../Wearable/WearableComponent";

export class BattleUnitEntityRoot extends BaseEntityRoot {

    onVictory() {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        if (GameFunc.IsValid(npc)) {
            npc.Stop();
            npc.StartGesture(GameActivity_t.ACT_DOTA_VICTORY);
        }
    }


    onKilled(events: EntityKilledEvent): void {
        this.ChessComp()?.changeAliveState(false);
        this.AiAttackComp()?.endFindToAttack();
        let npc = this.GetDomain<IBaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }

    IsFriendly() {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        return domain.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS;
    }
    IsBattleUnit() {
        return true;
    }
    IsSummon() {
        return false;
    }
    IsIllusion() {
        return false;
    }
    IsRuntimeBuilding() {
        return false;
    }
    IsBuilding() {
        return false;
    }
    addBattleComp() {
        this.AddComponent(GGetRegClass<typeof ChessMoveComponent>("ChessMoveComponent"));
        this.AddComponent(GGetRegClass<typeof AiAttackComponent>("AiAttackComponent"));
        // this.AddComponent(GGetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.AddComponent(GGetRegClass<typeof WearableComponent>("WearableComponent"), this.GetDotaHeroName());
        this.AddComponent(GGetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(GGetRegClass<typeof InventoryComponent>("InventoryComponent"));
        this.AddComponent(GGetRegClass<typeof BuffManagerComponent>("BuffManagerComponent"));
        this.AddComponent(GGetRegClass<typeof RoundStateComponent>("RoundStateComponent"));

    }

    GetDotaHeroName() {
        return "";
    }
    WearableComp() {
        return this.GetComponentByName<WearableComponent>("WearableComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessMoveComponent>("ChessMoveComponent");
    }
    AiAttackComp() {
        return this.GetComponentByName<AiAttackComponent>("AiAttackComponent");
    }
    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    InventoryComp() {
        return this.GetComponentByName<InventoryComponent>("InventoryComponent");
    }
    BuffManagerComp() {
        return this.GetComponentByName<BuffManagerComponent>("BuffManagerComponent");
    }
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
    RoundStateComp() {
        return this.GetComponentByName<RoundStateComponent>("RoundStateComponent");
    }
}

declare global {
    type IBattleUnitEntityRoot = BattleUnitEntityRoot;
}