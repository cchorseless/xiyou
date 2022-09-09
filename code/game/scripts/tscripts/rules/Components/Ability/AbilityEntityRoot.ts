import { LogHelper } from "../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { CombinationComponent } from "../Combination/CombinationComponent";
import { PlayerCreateUnitEntityRoot } from "../Player/PlayerCreateUnitEntityRoot";

export class AbilityEntityRoot extends PlayerCreateUnitEntityRoot {

    SetConfigId(playerid: PlayerID, conf: string) {
        (this as any).Playerid = playerid;
        (this as any).ConfigID = conf;
        (this as any).EntityId = this.GetDomain<BaseAbility_Plus>().GetEntityIndex();
    }
    onAwake() {
        let domain = this.GetDomain<BaseAbility_Plus>();
        (this as any).EntityId = domain.GetEntityIndex();
    }

    CombinationComp() {
        return this.GetComponentByName<CombinationComponent>("CombinationComponent");
    }


    readonly SyncDomainProps: string[] = [];
}
