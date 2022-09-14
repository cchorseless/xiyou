import { GameFunc } from "../../../GameFunc";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { ET, registerET, serializeETProps } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { BuildingEntityRoot } from "./BuildingEntityRoot";
/**塔防组件 */
@registerET()
export class BuildingComponent extends ET.Component {
    public readonly IsSerializeEntity: boolean = true;
    public vLocation: Vector;
    public fAngle: number;
    public iLevel: number;
    public iAbilityPoints: number;
    public iQualificationLevel: number;
    public iBaseGoldCost: number;
    private iGoldCost: number;
    /**累计造成伤害 */
    public fDamage: number;
    /**星级 */
    @serializeETProps()
    public iStar: number = 1;
    @serializeETProps()
    public PrimaryAttribute: number = 1;
    onAwake(vLocation: Vector, fAngle: number) {
        this.vLocation = vLocation;
        this.fAngle = fAngle;
        this.iStar = 1;
        this.PrimaryAttribute = GameFunc.AsAttribute(this.Domain.ETRoot.As<BuildingEntityRoot>().Config().AttributePrimary);
        TimerHelper.addTimer(
            2,
            () => {
                // this.ChangeFashionEquip(1);
            },
            this
        );
    }

    updateNetTable() {
        this.Domain.ETRoot.As<BuildingEntityRoot>().GetPlayer().SyncClientEntity(this);
    }



    Dispose(): void {
        NetTablesHelper.DelETEntity(this, this.Domain.ETRoot.As<BuildingEntityRoot>().Playerid);
        super.Dispose();
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

    ChangeFashionEquip(n: number) {
        // if (wearables.length >= 1) {
        //     print("MODEL REMOVED, RESPAWNING HERO");
        //     //  hero.SetRespawnPosition(hero.GetOrigin())
        //     hero.RespawnHero(false, false, false);
        // }
    }

    public GetPopulation(): number {
        let towerID = this.GetDomain<BaseNpc_Plus>().ETRoot.As<BuildingEntityRoot>().ConfigID;
        return GameRules.Addon.ETRoot.BuildingSystem().GetBuildingPopulation(towerID);
    }
    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {
        this.iStar += n;
        let domain = this.GetDomain<BaseNpc_Plus>();
        let building = domain.ETRoot.As<BuildingEntityRoot>();
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
        domain.SetModelScale(domain.GetModelScale() * BuildingConfig.MODEL_SCALE[this.iStar - 1]);
        // 技能升级
        building.AbilityManagerComp().levelUpAllAbility();
        // 通知跑马灯
        this.updateNetTable();
    }
}
