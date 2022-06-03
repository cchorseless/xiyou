import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET } from "../../Entity/Entity";
import { RoundPrizeUnitKillPrizeComponent } from "./RoundPrizeUnitKillPrizeComponent";

export class RoundPrizeUnitEntityRoot extends ET.EntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;
    readonly ConfigID: string;

    public Dispose(): void {
        let npc = this.GetDomain<BaseNpc_Plus>();
        super.Dispose();
        npc.SafeDestroy();
    }
    
    public OnActive(): void {
        this.AddComponent(PrecacheHelper.GetRegClass<typeof RoundPrizeUnitKillPrizeComponent>("RoundPrizeUnitKillPrizeComponent"));
    }

    SetConfigId(confid: string, roundid: string, onlyKey: string = null) {
        (this as any).ConfigID = confid;
        (this as any).RoundID = roundid;
        (this as any).OnlyKey = onlyKey;
    }

    KillPrizeComp() {
        return this.GetComponentByName<RoundPrizeUnitKillPrizeComponent>("RoundPrizeUnitKillPrizeComponent");
    }
}
