import { GetRegClass } from "../../../GameCache";
import { GameFunc } from "../../../GameFunc";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { registerProp } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { BaseEntityRoot } from "../../Entity/BaseEntityRoot";
import { serializeETProps } from "../../Entity/Entity";
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
        let npc = this.GetDomain<BaseNpc_Plus>();
        if (GameFunc.IsValid(npc)) {
            npc.Stop();
            npc.StartGesture(GameActivity_t.ACT_DOTA_VICTORY);
        }
    }


    onKilled(events: EntityKilledEvent): void {
        this.ChessComp()?.changeAliveState(false);
        this.AiAttackComp()?.endFindToAttack();
        let npc = this.GetDomain<BaseNpc_Plus>();
        npc.StartGesture(GameActivity_t.ACT_DOTA_DIE);
    }

    IsFriendly() {
        let domain = this.GetDomain<BaseNpc_Plus>();
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
        this.AddComponent(GetRegClass<typeof ChessMoveComponent>("ChessMoveComponent"));
        this.AddComponent(GetRegClass<typeof AiAttackComponent>("AiAttackComponent"));
        // this.AddComponent(GetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.AddComponent(GetRegClass<typeof WearableComponent>("WearableComponent"), this.GetDotaHeroName());
        this.AddComponent(GetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(GetRegClass<typeof InventoryComponent>("InventoryComponent"));
        this.AddComponent(GetRegClass<typeof BuffManagerComponent>("BuffManagerComponent"));
        this.AddComponent(GetRegClass<typeof RoundStateComponent>("RoundStateComponent"));

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