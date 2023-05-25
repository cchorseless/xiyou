import { DrawConfig } from "../../../shared/DrawConfig";
import { registerAbility } from "../../entityPlus/Base_Plus";
import { ActiveRootItem } from "../ActiveRootItem";

// 神器选择宝箱
@registerAbility()
export class item_shop_artifactchoose extends ActiveRootItem {

    CastFilterResult(): UnitFilterResult {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
            if (playerroot) {
                if (playerroot.DrawComp().tLastArtifacts == null) {
                    return UnitFilterResult.UF_SUCCESS
                }
                else {
                    this.errorStr = "正在选择神器";
                    return UnitFilterResult.UF_FAIL_CUSTOM
                }
            }
        }
        return UnitFilterResult.UF_SUCCESS
    }

    OnSpellStart() {
        let caster = this.GetCasterPlus();
        let playerroot = GGameScene.GetPlayer(caster.GetPlayerID());
        GLogHelper.print("item_shop_artifactchoose", caster.GetPlayerID(), playerroot == null)
        if (playerroot) {
            playerroot.DrawComp().DrawArtifact(this, DrawConfig.EDrawType.DrawArtifact, this.GetSpecialValueFor("count") || 4)
        }
    }


}
