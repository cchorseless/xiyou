import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { BaseNpc_Plus } from "../../../npc/entityPlus/BaseNpc_Plus";
import { modifier_test } from "../../../npc/modifier/modifier_test";
import { ET } from "../../Entity/Entity";
import { BuildingConfig } from "../../System/Building/BuildingConfig";
import { KVConfigComponment } from "../KVConfig/KVConfigComponment";
/**塔防组件 */
export class BuildingComponent extends ET.Component {
    /**创建的单位名称 */
    public readonly towerID: string;
    public vLocation: Vector;
    public fAngle: number;
    public iLevel: number;
    public iXP: number;
    public iAbilityPoints: number;
    public iQualificationLevel: number;
    public iBaseGoldCost: number;
    private iGoldCost: number;
    public iBuildRound: number;
    /**累计造成伤害 */
    public fDamage: number;
    public hBlocker: CBaseEntity;
    public iIndex: number;
    /**星级 */
    public iStar: number;


    onAwake(towerID: string, vLocation: Vector, fAngle: number) {
        (this as any).towerID = towerID;
        this.vLocation = vLocation;
        this.fAngle = fAngle;
        let kvConfig = KVHelper.KvServerConfig.building_unit_tower[towerID as "npc_dota_hero_lina_custom"];
        this.Domain.ETRoot.AddComponent(KVConfigComponment, towerID, kvConfig);
    }


    updateNetTable() {
        // CustomNetTables.SetTableValue("buildings", this.GetComponentEntityIndex(), {
        //     sName: this.GetComponentEntityName(),
        //     iBuildingIndex: this.getIndex(),
        //     iCurrentXP: this.GetCurrentXP(),
        //     iNeededXPToLevel: this.GetNeededXPToLevel(),
        //     iLevel: this.GetLevel(),
        //     iMaxLevel: this.GetMaxLevel(),
        //     iAbilityPoints: this.GetAbilityPoints(),
        //     tUpgrades: this.GetUpgradeInfos(),
        //     iGoldCost: this.GetGoldCost(),
        //     iQualificationLevel: this.GetQualificationLevel(),
        //     tQualificationAbilities: this.tQualificationAbilities,
        //     sQualificationComponentName: this.QualificationComponentName,
        //     bIsHero: this.ComponentEntityIsHero()
        // })
    }

    GetAbilityPoints() {
        return this.iAbilityPoints
    }
    /**金币价格 */
    GetGoldCost() {
        return this.iGoldCost || 0
    }

    /**是否可以升星 */
    checkCanStarUp() {
        return this.iStar < BuildingConfig.MAX_STAR
    }

    /**
     * 升星
     * @param n
     */
    AddStar(n: number) {
    }

}