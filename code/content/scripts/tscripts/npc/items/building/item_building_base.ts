import { KVHelper } from "../../../helper/KVHelper";
import { ActiveRootItem } from "../ActiveRootItem";

/**建筑物道具基类 */
export class item_building_base extends ActiveRootItem {
    GetCreateUnitName() {
        let itemname = this.GetAbilityName();
        let info = KVHelper.KvConfig().building_item_card[itemname];
        return info.bind_unit_name;
    }

    // CastFilterResultLocation(vLocation: Vector) {
    //     if (IsServer()) {
    //         if (this.GetCaster().IsIllusion() || this.GetCaster().IsClone()) {
    //             this.errorStr = BuildingConfig.ErrorCode.dota_hud_error_only_hero_can_use;
    //             return UnitFilterResult.UF_FAIL_CUSTOM;
    //         }
    //         let hCaster = this.GetCasterPlus();
    //         let boardPos = GChessControlSystem.GetInstance().GetBoardLocalVector2(vLocation, false);
    //         if (boardPos.playerid != hCaster.ETRoot.As<IPlayerEntityRoot>().Playerid || boardPos.x < 0 || boardPos.y < 0 || boardPos.y > ChessControlConfig.ChessValid_Max_Y) {
    //             this.errorStr = BuildingConfig.ErrorCode.dota_hud_error_cant_build_at_location;
    //             return UnitFilterResult.UF_FAIL_CUSTOM;
    //         }
    //     }
    //     return UnitFilterResult.UF_SUCCESS;
    // }

    // CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
    //     let hCaster = this.GetCasterPlus();
    //     let sTowerName = this.GetCreateUnitName();
    //     //  TODO:皮肤名字转成没皮肤的单位再判断
    //     let sUnitName = hTarget.GetUnitName();
    //     //  分身无法使用卡
    //     if (!hCaster.IsRealUnit()) {
    //         this.errorStr = BuildingConfig.ErrorCode.dota_hud_error_only_hero_can_use;
    //         return UnitFilterResult.UF_FAIL_CUSTOM;
    //     }
    //     //  无法对分身使用卡
    //     if (!hTarget.IsRealUnit()) {
    //         return UnitFilterResult.UF_FAIL_ILLUSION;
    //     }
    //     if (IsServer()) {
    //         //  判断是否满星
    //         let hBuilding = hTarget.ETRoot.GetComponent(BuildingComponent);
    //         if (hBuilding && !hBuilding.checkCanStarUp()) {
    //             //  判断星级和升星
    //             this.errorStr = "dota_hud_error_star_limit";
    //             return UnitFilterResult.UF_FAIL_CUSTOM;
    //         }
    //     }
    //     //  相同的卡才能吃
    //     if (sTowerName == sUnitName) {
    //         return UnitFilterResult.UF_SUCCESS;
    //     }
    //     this.errorStr = "dota_hud_error_only_can_cast_on_same_hero";
    //     return UnitFilterResult.UF_FAIL_CUSTOM;
    // }

    // GetBehavior() {
    //     if (IsServer()) {
    //         let sTowerName = this.GetCreateUnitName();
    //         let BuildingManager = this.GetOwnerPlus().ETRoot.As<IPlayerEntityRoot>().BuildingManager();
    //         let count = BuildingManager.getBuilding(sTowerName).length;
    //         if (count >= 1) {
    //             return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    //         }
    //         return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT;
    //     } else {
    //         return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    //     }
    // }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let buildM = hCaster.ETRoot.As<IPlayerEntityRoot>().BuildingManager();
        let chessM = hCaster.ETRoot.As<IPlayerEntityRoot>().ChessControlComp();
        if (buildM == null || chessM == null) {
            return;
        }
        let sTowerName = this.GetCreateUnitName();
        let building = buildM.addBuilding(sTowerName);
        if (building) {
            this.SpendCharge();
        }
    }

    // _OnSpellStart() {
    //     let hCaster = this.GetCasterPlus();
    //     let hTarget = this.GetCursorTarget() as IBaseNpc_Plus;
    //     let buildM = hCaster.ETRoot.As<IPlayerEntityRoot>().BuildingManager();
    //     let chessM = hCaster.ETRoot.As<IPlayerEntityRoot>().ChessControlComp();
    //     if (buildM == null || chessM == null) {
    //         return;
    //     }
    //     //  场上还没有这个单位，种下新的
    //     if (!GameFunc.IsValid(hTarget)) {
    //         let sTowerName = this.GetCreateUnitName();
    //         let location = this.GetCursorPosition();
    //         let boardPos = GChessControlSystem.GetInstance().GetBoardLocalVector2(location, false);
    //         if (boardPos.playerid != hCaster.ETRoot.As<IPlayerEntityRoot>().Playerid || boardPos.y > ChessControlConfig.ChessValid_Max_Y) {
    //             return;
    //         }
    //         let trueLocal = GChessControlSystem.GetInstance().GetBoardGirdCenterVector3(boardPos);
    //         let result = buildM.placeBuilding(sTowerName, trueLocal);
    //         if (result) {
    //             this.SpendCharge();
    //         }
    //     }
    //     //  给已有单位升星
    //     else {
    //         if (!hTarget.IsRealUnit()) {
    //             return;
    //         }
    //         let hBuilding = hTarget.ETRoot.GetComponent(BuildingComponent);
    //         //  判断星级和升星
    //         if (hBuilding && hBuilding.checkCanStarUp()) {
    //             hBuilding.AddStar(1);
    //             this.SpendCharge();
    //             return;
    //         }
    //     }
    // }
}
