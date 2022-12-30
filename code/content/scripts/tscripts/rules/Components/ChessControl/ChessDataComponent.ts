
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { ET, serializeETProps } from "../../../shared/lib/Entity";
/**棋子数据组件 */
@GReloadable
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
        this.SyncClient(true);

    }
    onAwake() {
        this.iScale = this.GetDomain<IBaseNpc_Plus>().GetAbsScale();
    }
    onDestroy(): void {
        this.Domain.ETRoot.As<IBattleUnitEntityRoot>().DelClientEntity(this);
    }
    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }

    SetStar(n: number) {
        this.iStar = n;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let building = domain.ETRoot.As<IBattleUnitEntityRoot>();
        // 变大
        domain.SetModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        building.AbilityManagerComp().setAllAbilityLevel(n);
        // 属性
    }

}
