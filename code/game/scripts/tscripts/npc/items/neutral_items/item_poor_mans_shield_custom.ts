/*
 * @Author: Jaxh
 * @Date: 2021-04-30 13:32:45
 * @LastEditors: your name
 * @LastEditTime: 2021-05-20 11:21:49
 * @Description: file content
 */
import { LogHelper } from "../../../helper/LogHelper";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { GameEnum } from "../../../GameEnum";

@registerAbility()
export class item_poor_mans_shield_custom extends BaseItem_Plus {
    public GetIntrinsicModifierName(): string {
        if (this.GetCaster().GetUnitLabel() != 'builder')
            return modifier_item_poor_mans_shield_custom.name
    }
}
@registerModifier()
export class modifier_item_poor_mans_shield_custom extends BaseModifier_Plus {

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    public bonus_attack_speed: number;

    public per_reduce_gold: number;

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BONUSDAMAGEOUTGOING_PERCENTAGE)
    public damage_amplify_percent: number;

    Init(params: ModifierTable) {
        this.bonus_attack_speed = this.GetSpecialValueFor("bonus_attack_speed")
        this.per_reduce_gold = this.GetSpecialValueFor("per_reduce_gold")
        this.damage_amplify_percent = this.GetSpecialValueFor("damage_amplify_percent")
    }

    OnCreated(params: any) {
        super.OnCreated(params)
        if (IsServer()) {
            this.StartIntervalThink(1)
        }
    }


    OnIntervalThink() {
        if (IsServer()) {

        }
    }
}

