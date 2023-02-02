
import { ResHelper } from "../../../helper/ResHelper";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { ChessDataComponent } from "../ChessControl/ChessDataComponent";
/**塔防组件 */
@GReloadable
export class BuildingDataComponent extends ChessDataComponent {

    private iGoldCost: number;
    /**累计造成伤害 */
    public fDamage: number;

    onAwake() {
        super.onAwake();
        this.iStar = 1;
    }

    /**金币价格 */
    GetGoldCost() {
        return this.iGoldCost || 0;
    }

    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR;
    }

    GetPopulation(): number {
        let towerID = this.GetDomain<IBaseNpc_Plus>().ETRoot.As<IBuildingEntityRoot>().ConfigID;
        return GBuildingSystem.GetInstance().GetBuildingPopulation(towerID);
    }
    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {
        this.iStar += n;
        let domain = this.GetDomain<IBaseNpc_Plus>();
        let building = domain.ETRoot.As<IBuildingEntityRoot>();
        // "particles/generic_hero_status/hero_levelup.vpcf"
        // "particles/units/heroes/hero_oracle/oracle_false_promise_cast_enemy.vpcf"
        let iParticleID = ResHelper.CreateParticle(
            new ResHelper.ParticleInfo()
                .set_resPath("particles/generic_hero_status/hero_levelup.vpcf")
                .set_iAttachment(ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW)
                .set_owner(domain)
                .set_validtime(3)
        );
        EmitSoundOn("lvl_up", domain);
        // 变大
        domain.SetModelScale(this.iScale * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        building.AbilityManagerComp().levelUpAllAbility();
        // 通知跑马灯
        this.SyncClient();
    }

}
