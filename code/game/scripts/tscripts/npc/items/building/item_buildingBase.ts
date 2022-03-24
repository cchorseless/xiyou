import { GameEnum } from "../../../GameEnum";
import { GameFunc } from "../../../GameFunc";
import { EntityHelper } from "../../../helper/EntityHelper";
import { KVHelper } from "../../../helper/KVHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BuildingComponent } from "../../../rules/Components/Building/BuildingComponent";
import { BuildingManagerComponent } from "../../../rules/Components/Building/BuildingManagerComponent";
import { BuildingState } from "../../../rules/System/Building/BuildingState";
import { BuildingSystem } from "../../../rules/System/Building/BuildingSystem";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";

/**建筑物道具基类 */
export class item_buildingBase extends BaseItem_Plus {
    GetAbilityTextureName(): string {
        return super.GetAbilityTextureName();
    }

    GetCreateUnitName() {
        let info = KVHelper.KvServerConfig.building_item_card[this.constructor.name as 'item_building_zuus']
        return info.bind_unit_name!
    }

    CastFilterResultLocation(vLocation: Vector) {
        if (IsServer()) {
            if (this.GetCaster().IsIllusion() || this.GetCaster().IsClone()) {
                this.errorStr = GameEnum.Event.ErrorCode.dota_hud_error_only_hero_can_use
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
            BuildingSystem.SnapToGrid(vLocation);
            if (!BuildingState.IsValidPosition(vLocation)) {
                this.errorStr = GameEnum.Event.ErrorCode.dota_hud_error_cant_build_at_location
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
        }
        return UnitFilterResult.UF_SUCCESS
    }

    CastFilterResultTarget(hTarget: BaseNpc_Plus) {
        let hCaster = this.GetCasterPlus()
        let sTowerName = this.GetCreateUnitName()
        //  TODO:皮肤名字转成没皮肤的单位再判断
        let sUnitName = hTarget.GetUnitName()
        //  分身无法使用卡
        if (!hCaster.IsRealUnit()) {
            this.errorStr = GameEnum.Event.ErrorCode.dota_hud_error_only_hero_can_use
            return UnitFilterResult.UF_FAIL_CUSTOM
        }
        //  无法对分身使用卡
        if (!hTarget.IsRealUnit()) {
            return UnitFilterResult.UF_FAIL_ILLUSION
        }
        if (IsServer()) {
            //  判断是否满星
            let hBuilding = hTarget.ETRoot.GetComponent(BuildingComponent)
            if (hBuilding && !hBuilding.checkCanStarUp()) {
                //  判断星级和升星
                this.errorStr = "dota_hud_error_star_limit"
                return UnitFilterResult.UF_FAIL_CUSTOM
            }
        }
        //  相同的卡才能吃
        if (sTowerName == sUnitName) {
            return UnitFilterResult.UF_SUCCESS
        }
        this.errorStr = "dota_hud_error_only_can_cast_on_same_hero"
        return UnitFilterResult.UF_FAIL_CUSTOM
    }
    GetCustomCastErrorLocation(vLocation: Vector) {
        return this.errorStr
    }
    GetCustomCastErrorTarget() {
        return this.errorStr
    }

    // GetBehavior() {
    //     let hCaster = this.GetCasterPlus()
    //     if (!GameFunc.IsValid(hCaster)) {
    //         return
    //     }
    //     let iBehavior = tonumber(tostring(super.GetBehavior()))
    //     let sTowerName = this.GetCreateUnitName();
    //     let count = BuildingState.GetBuildingCount(hCaster.GetPlayerOwnerID(), sTowerName)
    //     if (count >= 1) {
    //         iBehavior = iBehavior - DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET
    //     }
    //     return iBehavior
    // }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let hTarget = this.GetCursorTarget() as BaseNpc_Plus;
        let buildM = hCaster.ETRoot.GetComponent(BuildingManagerComponent);
        if (buildM == null) { return };
        //  场上还没有这个单位，种下新的
        if (!GameFunc.IsValid(hTarget)) {
            let sTowerName = this.GetCreateUnitName()
            let location = this.GetCursorPosition()
            BuildingSystem.SnapToGrid(location);
            let result = buildM.placeBuilding(sTowerName, location)
            if (result) {
                this.SpendCharge()
            }
        }
        //  给已有单位升星
        else {
            if (!hTarget.IsRealUnit()) {
                return
            }
            let hBuilding = hTarget.ETRoot.GetComponent(BuildingComponent)
            //  判断星级和升星
            if (hBuilding && hBuilding.checkCanStarUp()) {
                hBuilding.AddStar(1);
                let resinfo: ResHelper.ParticleInfo = {
                    resPath: "particles/prime/hero_spawn_hero_level.vpcf",
                    iAttachment: ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW,
                    owner: hTarget
                }
                let iParticleID = ResHelper.CreateParticle(resinfo)
                ParticleManager.SetParticleControl(iParticleID, 0, this.GetCursorPosition())
                ParticleManager.ReleaseParticleIndex(iParticleID)
                this.SpendCharge()
                return
            }
        }
    }
}