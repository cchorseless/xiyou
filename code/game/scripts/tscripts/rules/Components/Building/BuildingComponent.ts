import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { BuildingEntityRoot } from "./BuildingEntityRoot";
/**塔防组件 */
@registerET()
export class BuildingComponent extends ET.Component {
    public vLocation: Vector;
    public fAngle: number;
    public iLevel: number;
    public iXP: number;
    public iAbilityPoints: number;
    public iQualificationLevel: number;
    public iBaseGoldCost: number;
    private iGoldCost: number;
    /**累计造成伤害 */
    public fDamage: number;
    public hBlocker: CBaseEntity;
    public iIndex: number;
    /**星级 */
    public iStar: number;

    onAwake(vLocation: Vector, fAngle: number) {
        let domain = this.GetDomain<BaseNpc_Plus>();
        this.vLocation = vLocation;
        this.fAngle = fAngle;
        this.iStar = 1;
        this.updateNetTable();
    }

    updateNetTable() {
        let domain = this.GetDomain<BaseNpc_Plus>();
        NetTablesHelper.SetData<IBuildingInfo>(NetTablesHelper.ENetTables.building, "" + domain.GetEntityIndex(), {
            configid: domain.ETRoot.As<BuildingEntityRoot>().ConfigID,
            iStar: this.iStar,
            entityid: domain.GetEntityIndex() as number,
            showhealthbar: 1,
        });
    }

    onDestroy(): void {
        let domain = this.GetDomain<BaseNpc_Plus>();
        NetTablesHelper.SetData<IEntityInfo>(NetTablesHelper.ENetTables.building, "" + domain.GetEntityIndex(), null);
    }

    GetAbilityPoints() {
        return this.iAbilityPoints;
    }
    /**金币价格 */
    GetGoldCost() {
        return this.iGoldCost || 0;
    }

    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }

    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {}
}
