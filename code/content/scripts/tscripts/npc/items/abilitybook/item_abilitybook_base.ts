import { KVHelper } from "../../../helper/KVHelper";
import { BuildingConfig } from "../../../shared/BuildingConfig";
import { ActiveRootItem } from "../ActiveRootItem";

/**建筑物道具基类 */
export class item_abilitybook_base extends ActiveRootItem {
    GetCreateUnitName() {
        let itemname = this.GetAbilityName();
        let info = KVHelper.KvConfig().building_item_card[itemname];
        return info.bind_unit_name;
    }

    CastFilterResultTarget(hTarget: IBaseNpc_Plus) {
        let hCaster = this.GetCasterPlus();
        //  分身无法使用卡
        if (!hCaster.IsRealUnit()) {
            this.errorStr = BuildingConfig.ErrorCode.dota_hud_error_only_hero_can_use;
            return UnitFilterResult.UF_FAIL_CUSTOM;
        }
        //  无法对分身使用卡
        if (!hTarget.IsRealUnit()) {
            return UnitFilterResult.UF_FAIL_ILLUSION;
        }
        if (IsServer()) {
            let isbuilding = hTarget.ETRoot.AsValid<IBuildingEntityRoot>("BuildingEntityRoot");
            if (!isbuilding) {
                this.errorStr = "dota_hud_error_not_valid_building";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
            let building = hTarget.ETRoot.As<IBuildingEntityRoot>();
            if (!building.AbilityManagerComp()) {
                this.errorStr = "dota_hud_error_cant_learn_ability";
                return UnitFilterResult.UF_FAIL_CUSTOM;
            }
        }
        return UnitFilterResult.UF_SUCCESS;
    }

    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET;
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus();
        let building = hCaster.ETRoot.As<IBattleUnitEntityRoot>();
        let abilityM = building.AbilityManagerComp();
        if (abilityM == null) {
            return;
        }
        let sTowerName = this.GetCreateUnitName();
        let result = abilityM.tryLearnExtraAbility(sTowerName);
        if (result) {
            this.SpendCharge();
        }
    }

}
