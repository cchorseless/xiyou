
import { modifier_auto_findtreasure } from "../../../npc/abilities/common/building_auto_findtreasure";
import { ET } from "../../../shared/lib/Entity";

@GReloadable
export class RoundPrizeUnitKillPrizeComponent extends ET.Component {
    onAwake(...args: any[]): void {
        let domain = this.GetDomain<IBaseNpc_Plus>();
        domain.addSpawnedHandler(
            GHandler.create(this, () => {
                // modifier_no_health_bar.applyOnly(domain, domain);
            })
        );
    }
    OnKillByEntity(entityid: EntityIndex) {
        let hUnit = EntIndexToHScript(entityid) as IBaseNpc_Plus;
        if (!IsValid(hUnit)) {
            return;
        }
        if (!hUnit.ETRoot) {
            return;
        }
        if (hUnit.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot")) {
            let modifier = modifier_auto_findtreasure.findIn(hUnit);
            if (modifier != null) {
                modifier.FinishOneTarget();
            }
        }
        this.Domain.ETRoot.Dispose();
    }
}
