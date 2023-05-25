import { DrawConfig } from "../../../shared/DrawConfig";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootItem } from "../ActiveRootItem";

// 初级装备宝箱（多选1）
@registerAbility()
export class item_shop_equipchoose_c extends ActiveRootItem {

    CastFilterResult(): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
            if (playerroot) {
                if (playerroot.DrawComp().tLastEquips == null) {
                    return UnitFilterResult.UF_SUCCESS
                }
                else {
                    this.errorStr = "正在选择装备";
                    return UnitFilterResult.UF_FAIL_CUSTOM
                }
            }
        }
        return UnitFilterResult.UF_SUCCESS
    }
    DrawType = DrawConfig.EDrawType.DrawEquipV1;

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
        GLogHelper.print("item_shop_artifactchoose", caster.GetPlayerID(), playerroot == null)
        if (playerroot) {
            playerroot.DrawComp().DrawEquip(this, this.DrawType, this.GetSpecialValueFor("count") || 4)
        }
    }
}

// 中级装备宝箱（多选1）
@registerAbility()
export class item_shop_equipchoose_b extends item_shop_equipchoose_c {

    DrawType = DrawConfig.EDrawType.DrawEquipV2;

}

// 高级装备宝箱（多选1）
@registerAbility()
export class item_shop_equipchoose_a extends item_shop_equipchoose_c {
    DrawType = DrawConfig.EDrawType.DrawEquipV3;
}

// 传奇装备宝箱（多选1）
@registerAbility()
export class item_shop_equipchoose_s extends item_shop_equipchoose_c {
    DrawType = DrawConfig.EDrawType.DrawEquipV4;
}