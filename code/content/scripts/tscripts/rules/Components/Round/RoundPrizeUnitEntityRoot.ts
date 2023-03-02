
import { ET } from "../../../shared/lib/Entity";
import { RoundPrizeUnitKillPrizeComponent } from "./RoundPrizeUnitKillPrizeComponent";

export class RoundPrizeUnitEntityRoot extends ET.EntityRoot {
    readonly RoundID: string;
    readonly OnlyKey: string;
    readonly ConfigID: string;

    public onDestroy(): void {
        let npc = this.GetDomain<IBaseNpc_Plus>();
        GFuncEntity.SafeDestroyUnit(npc);
    }

    onAwake(confid: string, roundid: string, onlyKey: string = null) {
        (this.ConfigID as any) = confid;
        (this.RoundID as any) = roundid;
        (this.OnlyKey as any) = onlyKey;
        this.AddComponent(GGetRegClass<typeof RoundPrizeUnitKillPrizeComponent>("RoundPrizeUnitKillPrizeComponent"));
    }
    onKilled(events: EntityKilledEvent): void {
        this.KillPrizeComp()?.OnKillByEntity(events.entindex_attacker);
    }

    KillPrizeComp() {
        return this.GetComponentByName<RoundPrizeUnitKillPrizeComponent>("RoundPrizeUnitKillPrizeComponent");
    }
}
