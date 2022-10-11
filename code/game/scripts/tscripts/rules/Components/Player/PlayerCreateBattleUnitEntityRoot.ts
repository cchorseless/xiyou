import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { registerProp } from "../../../npc/entityPlus/BaseModifier_Plus";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { serializeETProps } from "../../Entity/Entity";
import { AbilityManagerComponent } from "../Ability/AbilityManagerComponent";
import { AiAttackComponent } from "../AI/AiAttackComponent";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";
import { ChessComponent } from "../ChessControl/ChessComponent";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { ItemManagerComponent } from "../Item/ItemManagerComponent";
import { RoundStateComponent } from "../Round/RoundStateComponent";
import { WearableComponent } from "../Wearable/WearableComponent";
import { PlayerCreateUnitEntityRoot } from "./PlayerCreateUnitEntityRoot";

export class PlayerCreateBattleUnitEntityRoot extends PlayerCreateUnitEntityRoot {

    @serializeETProps()
    IsShowOverhead: boolean = true;
    SetUIOverHead(isshow: boolean) {
        this.IsShowOverhead = isshow;
        this.SyncClientEntity(this, true);
    }


    IsFriendly() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        return domain.GetTeamNumber() == DOTATeam_t.DOTA_TEAM_GOODGUYS;
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
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ChessComponent>("ChessComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof AiAttackComponent>("AiAttackComponent"));
        // this.AddComponent(PrecacheHelper.GetRegClass<typeof CombinationComponent>("CombinationComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof WearableComponent>("WearableComponent"), this.GetDotaHeroName());
        this.AddComponent(PrecacheHelper.GetRegClass<typeof AbilityManagerComponent>("AbilityManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof ItemManagerComponent>("ItemManagerComponent"));
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundStateComponent>("RoundStateComponent"));

    }

    GetDotaHeroName() {
        return "";
    }
    WearableComp() {
        return this.GetComponentByName<WearableComponent>("WearableComponent");
    }
    ChessComp() {
        return this.GetComponentByName<ChessComponent>("ChessComponent");
    }
    AiAttackComp() {
        return this.GetComponentByName<AiAttackComponent>("AiAttackComponent");
    }
    AbilityManagerComp() {
        return this.GetComponentByName<AbilityManagerComponent>("AbilityManagerComponent");
    }
    ItemManagerComp() {
        return this.GetComponentByName<ItemManagerComponent>("ItemManagerComponent");
    }
    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }
    RoundStateComp() {
        return this.GetComponentByName<RoundStateComponent>("RoundStateComponent");
    }
}