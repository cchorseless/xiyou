import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { RoundPrizeUnitKillPrizeComponent } from "./RoundPrizeUnitKillPrizeComponent";

export class RoundPrizeUnitEntityRoot extends ET.EntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;
    readonly ConfigID: string;

    public onDestroy(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        npc.SafeDestroy();
    }

    onAwake(confid: string, roundid: string, onlyKey: string = null) {
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
        (this as any).OnlyKey = onlyKey;
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundPrizeUnitKillPrizeComponent>("RoundPrizeUnitKillPrizeComponent"));
    }
    onKilled(events: EntityKilledEvent): void {
        this.KillPrizeComp()?.OnKillByEntity(events.entindex_attacker);
    }

    KillPrizeComp() {
        return this.GetComponentByName<RoundPrizeUnitKillPrizeComponent>("RoundPrizeUnitKillPrizeComponent");
    }
}
