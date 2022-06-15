import { LogHelper } from "../../../helper/LogHelper";
import { BaseAbility_Plus } from "../../../npc/entityPlus/BaseAbility_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";

export class AbilityEntityRoot extends ET.EntityRoot {
    @serializeETProps()
    readonly EntityId: EntityIndex;

    OnActive() {
        let domain = this.GetDomain<BaseAbility_Plus>();
        (this as any).EntityId = domain.GetEntityIndex();
    }
    readonly SyncDomainProps: string[] = [];
}
