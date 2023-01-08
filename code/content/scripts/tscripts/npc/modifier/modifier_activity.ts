/*
 * @Author: Jaxh
 * @Date: 2021-05-11 14:49:01
 * @LastEditors: your name
 * @LastEditTime: 2021-05-19 14:36:43
 * @Description:出生自带BUFF标签
 */
import { BaseModifier_Plus } from "../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../propertystat/modifier_event";
@registerModifier()
export class modifier_activity extends BaseModifier_Plus {
    params: ModifierTable;
    _move: any;
    _attack_range: any;
    _attackspeed: any;

    GetAttributes() { return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE }

    Init(params: ModifierTable) {
        if (IsServer()) {
            this.params = params;
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    On_UnitMoved(event: ModifierUnitEvent) {
        if (this.GetParent() == null) { return };
        let basemove = this.GetParent().GetBaseMoveSpeed()
        let current = this.GetParent().GetMoveSpeedModifier(basemove, false);
        let _newdata;
        if (this.params.run && current >= tonumber(this.params.run)) {
            _newdata = Activity_Flags.run
        }
        else if (this.params.walk && current >= tonumber(this.params.walk)) {
            _newdata = Activity_Flags.walk
        }
        if (this._move != _newdata) {
            this._move = _newdata
            this.updateActivityModifiers()
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(event: ModifierAttackEvent) {
        if (this.GetParent() == null) { return }
        if (event.target == null) return;
        // 攻速
        this._attackspeed = null;
        let attackSpeed = this.GetParent().GetAttackSpeed() * 100;
        if (this.params.fastest && attackSpeed >= tonumber(this.params.fastest)) {
            this._attackspeed = (Activity_Flags.fastest)
        }
        else if (this.params.faster && attackSpeed >= tonumber(this.params.faster)) {
            this._attackspeed = (Activity_Flags.faster)
        }
        else if (this.params.fast && attackSpeed >= tonumber(this.params.fast)) {
            this._attackspeed = (Activity_Flags.fast)
        }
        // 攻击距离
        this._attack_range = null;
        let fDistance = CalcDistanceBetweenEntityOBB(this.GetParent(), event.target);
        if (this.params.attack_long_range && fDistance >= tonumber(this.params.attack_long_range)) {
            this._attack_range = (Activity_Flags.attack_long_range)
        }
        else if (this.params.attack_normal_range && fDistance >= tonumber(this.params.attack_normal_range)) {
            this._attack_range = (Activity_Flags.attack_normal_range)
        }
        else if (this.params.attack_short_range && fDistance >= tonumber(this.params.attack_short_range)) {
            this._attack_range = (Activity_Flags.attack_short_range)
        }
        // 有没有锤子
        if (this.params.no_hammer) {
            this._activity_Flag.add(Activity_Flags.no_hammer)
        }
        else {
            this._activity_Flag.delete(Activity_Flags.no_hammer)
        }
        // 刷新
        this.updateActivityModifiers()
    }
    /**
     * 动作标签
     */
    public _activity_Flag = new Set<string>();
    updateActivityModifiers() {
        let parent = this.GetParent();
        if (parent == null) { return }
        // 清掉原有动作
        parent.ClearActivityModifiers();
        //  更新新的标签
        if (this._move) {
            parent.AddActivityModifier(this._move);
        }
        if (this._attack_range) {
            parent.AddActivityModifier(this._attack_range);
        }
        if (this._attackspeed) {
            parent.AddActivityModifier(this._attackspeed);
        }
        this._activity_Flag.forEach((flag: string) => {
            parent.AddActivityModifier(flag);
        })
    }
}

export const Activity_Flags = {
    walk: 'walk',
    run: 'run',
    fast: "fast",
    faster: "faster",
    fastest: "fastest",
    attack_normal_range: "attack_normal_range",
    attack_short_range: "attack_short_range",
    attack_long_range: "attack_long_range",
    no_hammer: "no_hammer",
}

declare global {
    var Gmodifier_activity: typeof modifier_activity;
}
if (_G.Gmodifier_activity == null) {
    _G.Gmodifier_activity = modifier_activity;
}