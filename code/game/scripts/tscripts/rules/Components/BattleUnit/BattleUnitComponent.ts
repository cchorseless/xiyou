import { reloadable } from "../../../GameCache";
import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, serializeETProps } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { PlayerCreateBattleUnitEntityRoot } from "../Player/PlayerCreateBattleUnitEntityRoot";
/**战斗单位组件 */
@reloadable
export class BattleUnitComponent extends ET.Component {
    public iScale: number = 1;
    @serializeETProps()
    public iLevel: number = 1;
    @serializeETProps()
    public iStar: number = 1;
    onAwake() {
        this.iScale = this.GetDomain<BaseNpc_Plus>().GetAbsScale();
    }
    onDestroy(): void {
        this.Domain.ETRoot.As<PlayerCreateBattleUnitEntityRoot>().DelClientEntity(this);
    }
    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }

    SetStar(n: number) {
        this.iStar = n;
        let domain = this.GetDomain<BaseNpc_Plus>();
        let building = domain.ETRoot.As<PlayerCreateBattleUnitEntityRoot>();
        // 变大
        domain.SetModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        building.AbilityManagerComp().setAllAbilityLevel(n);
        // 属性
    }

}
