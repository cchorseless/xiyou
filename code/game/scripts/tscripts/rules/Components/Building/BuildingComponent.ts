import { GameFunc } from "../../../GameFunc";
import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
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
    }

    updateNetTable() {
        NetTablesHelper.SetETEntity(this, false, this.Domain.ETRoot.As<BuildingEntityRoot>().Playerid);
    }

    public Dispose(): void {
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

    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {
        this.iStar += n;
        let domain = this.GetDomain<BaseNpc_Plus>();
        let resinfo: ResHelper.IParticleInfo = {
            resPath: "particles/prime/hero_spawn_hero_level.vpcf",
            iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
            owner: domain,
        };
        let iParticleID = ResHelper.CreateParticle(resinfo);
        ParticleManager.SetParticleControl(iParticleID, 0, domain.GetCursorPosition());
        ParticleManager.ReleaseParticleIndex(iParticleID);
    }
}
