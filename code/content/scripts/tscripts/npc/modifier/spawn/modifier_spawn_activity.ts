/*
 * @Author: Jaxh
 * @Date: 2021-05-11 14:49:01
 * @LastEditors: your name
 * @LastEditTime: 2021-05-19 14:36:43
 * @Description:出生自带BUFF标签
 */
import {BaseModifier_Plus} from "../../entityPlus/BaseModifier_Plus";
import {registerModifier} from "../../entityPlus/Base_Plus";
import {Enum_MODIFIER_EVENT, registerEvent} from "../../propertystat/modifier_event";

@registerModifier()
export class modifier_spawn_activity extends BaseModifier_Plus {
    params: IModifierTable;
    _move: EActivity_Flags;
    _attack_range: EActivity_Flags;
    _attackspeed: EActivity_Flags;

    GetAttributes() {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_IGNORE_INVULNERABLE
    }

    Init(params: IModifierTable) {
        if (IsServer()) {
            this.params = params;
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_UNIT_MOVED)
    On_UnitMoved(event: ModifierUnitEvent) {
        if (this.GetParent() == null) {
            return
        }
        if (this.params.run == null && this.params.walk == null) {
            return;
        }
        let basemove = this.GetParent().GetBaseMoveSpeed()
        let current = this.GetParent().GetMoveSpeedModifier(basemove, false);
        let _newdata = EActivity_Flags.walk;
        if (this.params.run && current >= tonumber(this.params.run)) {
            _newdata = EActivity_Flags.run
        } else if (this.params.walk && current >= tonumber(this.params.walk)) {
            _newdata = EActivity_Flags.walk
        }
        if (this._move != _newdata) {
            this._move = _newdata
            this.updateActivityModifiers()
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_START)
    On_AttackStart(event: ModifierAttackEvent) {
        if (this.GetParent() == null) {
            return
        }
        if (event.target == null) return;
        let bchange = false;
        if (this.params.fastest || this.params.faster || this.params.fast) {
            // 攻速
            let newdata = null;
            let attackSpeed = this.GetParent().GetAttackSpeed() * 100;
            if (this.params.fastest && attackSpeed >= tonumber(this.params.fastest)) {
                newdata = (EActivity_Flags.fastest)
            } else if (this.params.faster && attackSpeed >= tonumber(this.params.faster)) {
                newdata = (EActivity_Flags.faster)
            } else if (this.params.fast && attackSpeed >= tonumber(this.params.fast)) {
                newdata = (EActivity_Flags.fast)
            }
            if(this._attackspeed != newdata) {
                this._attackspeed= newdata;
                bchange = true;
            }
        }
        if (this.params.attack_long_range || this.params.attack_normal_range || this.params.attack_short_range) {
            // 攻击距离
            let newdata = null;
            let fDistance = CalcDistanceBetweenEntityOBB(this.GetParent(), event.target);
            if (this.params.attack_long_range && fDistance >= tonumber(this.params.attack_long_range)) {
                newdata = (EActivity_Flags.attack_long_range)
            } else if (this.params.attack_normal_range && fDistance >= tonumber(this.params.attack_normal_range)) {
                newdata = (EActivity_Flags.attack_normal_range)
            } else if (this.params.attack_short_range && fDistance >= tonumber(this.params.attack_short_range)) {
                newdata = (EActivity_Flags.attack_short_range)
            }
            if(this._attack_range != newdata) {
                this._attack_range= newdata;
                bchange = true;
            }
            // 有没有锤子
            // if (this.params.no_hammer) {
            //     this._activity_Flag.add(EActivity_Flags.no_hammer)
            // } else {
            //     this._activity_Flag.delete(EActivity_Flags.no_hammer)
            // }

        }

        // 刷新
        if(bchange){
            this.updateActivityModifiers()
        }
    }

    /**
     * 动作标签
     */
    public _activity_Flag = new Set<string>();

    updateActivityModifiers() {
        let parent = this.GetParent();
        if (parent == null) {
            return
        }
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

export enum EActivity_Flags {
    walk = 'walk',
    run = 'run',
    fast = "fast",
    faster = "faster",
    fastest = "fastest",
    attack_normal_range = "attack_normal_range",
    attack_short_range = "attack_short_range",
    attack_long_range = "attack_long_range",
    no_hammer = "no_hammer",
}

declare global {
    var Gmodifier_spawn_activity: typeof modifier_spawn_activity;
}
if (_G.Gmodifier_spawn_activity == null) {
    _G.Gmodifier_spawn_activity = modifier_spawn_activity;
}