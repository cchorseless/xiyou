
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { registerAbility } from "../../entityPlus/Base_Plus";

// 种树
@registerAbility()
export class ability3_courier_base extends BaseAbility_Plus {
    GetBehavior() {
        return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED +
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT
    }
    GetCooldown() {
        return 5
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        return 500
    }

    GetManaCost() {
        return 0
    }
    GetChannelTime() {
        return 1
    }
    OnSpellStart() {
        // modifier_test.apply(this.GetCasterPlus(), this.GetCasterPlus())
    }
    /**施法完成 */
    OnChannelFinish(OnChannelFinish: boolean) {
        if (!IsServer() || OnChannelFinish) { return };
        let point = this.GetCursorPosition();
        let r = 100;
        for (let i = 0; i < 6; i++) {
            let _point = point + Vector(r * Math.cos(20 * i), r * Math.sin(20 * i), point.z)
            CreateTempTree(_point as Vector, 5)
        }
    }
}


