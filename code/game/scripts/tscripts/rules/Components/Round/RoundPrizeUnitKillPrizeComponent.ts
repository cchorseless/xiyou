import { GameFunc } from "../../../GameFunc";
import { modifier_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_no_health_bar } from "../../../npc/modifier/modifier_no_health_bar";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingEntityRoot } from "../Building/BuildingEntityRoot";

@registerET()
export class RoundPrizeUnitKillPrizeComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        domain.addSpawnedHandler(
            ET.Handler.create(this, () => {
                modifier_no_health_bar.applyOnly(domain, domain);
            })
        );
    }
    OnKillByEntity(entityid: EntityIndex) {
        let hUnit = EntIndexToHScript(entityid) as BaseNpc_Plus;
        if (!GameFunc.IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot) {
            return;
        }
        if (hUnit.ETRoot.AsValid<BuildingEntityRoot>("BuildingEntityRoot")) {
            let modifier = modifier_auto_findtreasure.findIn(hUnit);
            if (modifier != null) {
                modifier.FinishOneTarget();
            }
        }
        this.Domain.ETRoot.Dispose();
    }
}
