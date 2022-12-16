import { reloadable } from "../../../GameCache";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { BattleUnitEntityRoot } from "../BattleUnit/BattleUnitEntityRoot";
/**棋子数据组件 */
@reloadable
export class ChessDataComponent extends ET.Component {
    public iScale: number = 1;
    @serializeETProps()
    public iLevel: number = 1;
    @serializeETProps()
    public iStar: number = 1;
    @serializeETProps()
    public IsShowOverhead: boolean = false;
    SetUIOverHead(isshow: boolean) {
        this.IsShowOverhead = false;
        this.Domain.ETRoot.As<BattleUnitEntityRoot>().SyncClientEntity(this, true);

    }
    onAwake() {
        this.iScale = this.GetDomain<BaseNpc_Plus>().GetAbsScale();
    }
    onDestroy(): void {
        this.Domain.ETRoot.As<BattleUnitEntityRoot>().DelClientEntity(this);
    }
    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }

    SetStar(n: number) {
        this.iStar = n;
        let domain = this.GetDomain<BaseNpc_Plus>();
        let building = domain.ETRoot.As<BattleUnitEntityRoot>();
        // 变大
        domain.SetModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        building.AbilityManagerComp().setAllAbilityLevel(n);
        // 属性
    }

}
