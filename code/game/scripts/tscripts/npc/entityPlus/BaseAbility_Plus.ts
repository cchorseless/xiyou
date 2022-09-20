import { GameFunc } from "../../GameFunc";
import { ResHelper } from "../../helper/ResHelper";
import { LogHelper } from "../../helper/LogHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { BaseAbility } from "./Base_Plus";
import { BaseNpc_Plus } from "./BaseNpc_Plus";
import { GameSetting } from "../../GameSetting";

export class BaseAbility_Plus extends BaseAbility {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__: string = null;
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: any = null;
    /**技能不能施法错误文本 */
    public errorStr: string;
    /**是否自动施法 */
    public IsAutoCast: boolean = false;
    public GetCustomCastError() {
        return this.errorStr
    }
    public OnUpgrade() {
        if (this.GetLevel() == 1 && this.IsAutoCast) {
            this.ToggleAutoCast()
        }
    }
    public IsHiddenWhenStolen() {
        return false
    }
    public GetPlayer() {
        let caster = this.GetCaster()
        if (caster) {
            let iPlayerID = caster.GetPlayerOwnerID();
            return PlayerResource.GetSelectedHeroEntity(iPlayerID)
        }
    }

    /**检查实体是否销毁 */
    private __checkIsNullTimer: string;
    /**自动释放技能计时器 */
    private __autoSpellTimer: string;
    private __allTimes: Array<string> = [];
    /**
     * 添加计时器
     * @param n
     * @param cb
     * @param desTroyWithOwnerDied 是否伴隨owener死亡銷毀
     * @returns
     */
    public addTimer(n: number, cb: (this: any) => void | number, desTroyWithOwnerDied = true) {
        if (this.__checkIsNullTimer == null) {
            //  检查销毁的计时器
            this.__checkIsNullTimer = TimerHelper.addTimer(0.1, () => {
                if (this == null || this.IsNull()) {
                    // 处理计时器
                    while (this.__allTimes.length > 0) {
                        TimerHelper.removeTimer(this.__allTimes.pop())
                    }
                    this.__checkIsNullTimer = null;
                }
                else {
                    return 1
                }
            }, this);
            this.__allTimes.push(this.__checkIsNullTimer);
        }
        let s = TimerHelper.addTimer(n, cb, this);
        if (desTroyWithOwnerDied) {
            this.__allTimes.push(s);
        }
        return s
    }

    public addFrameTimer(n: number, cb: (this: any) => void | number, desTroyWithOwnerDied = true) {
        if (this.__checkIsNullTimer == null) {
            //  检查销毁的计时器
            this.__checkIsNullTimer = TimerHelper.addTimer(0.1, () => {
                if (this == null || this.IsNull()) {
                    // 处理计时器
                    while (this.__allTimes.length > 0) {
                        TimerHelper.removeTimer(this.__allTimes.pop())
                    }
                    this.__checkIsNullTimer = null;
                }
                else {
                    return 1
                }
            }, this);
            this.__allTimes.push(this.__checkIsNullTimer);
        }
        let s = TimerHelper.addFrameTimer(n, cb, this);
        if (desTroyWithOwnerDied) {
            this.__allTimes.push(s);
        }
        return s
    }



    public GetSoundReplacement(s: string): string {
        let _s = ResHelper.GetSoundReplacement(s, this.GetCaster());
        if (_s == null) {
            _s = s
        }
        return _s;
    }

    /**技能ICON */
    public GetAbilityTextureName(): string {
        let iconpath = super.GetAbilityTextureName();
        if (iconpath == null || iconpath == '') {
            iconpath = this.__IN_DOTA_NAME__ || "";
        }
        return ResHelper.GetAbilityTextureReplacement(iconpath, this.GetCaster())
    }

    /**默认值 */
    public __DefaultSpecialValue__: { [k: string]: number | number[] };
    /**
     * 设置Special默认值
     * @param s
     * @param default_V
     * @returns
     */
    public SetDefaultSpecialValue(s: string, default_V: number | number[]) {
        this.__DefaultSpecialValue__ = this.__DefaultSpecialValue__ || {};
        this.__DefaultSpecialValue__[s] = default_V;
    }

    public GetSpecialValueFor(s: string, default_V = 0): number {
        let r = super.GetSpecialValueFor(s);
        if (r && r != 0) {
            return r
        }
        else if (this.__DefaultSpecialValue__ && this.__DefaultSpecialValue__[s] && this.__DefaultSpecialValue__[s] != 0) {
            let data = this.__DefaultSpecialValue__[s];
            if (type(data) == 'number') {
                return data as number
            }
            else {
                let level = this.GetLevel();
                return (data as number[])[level - 1] as number
            }
        }
        else {
            return default_V
        }
    }

    /**
     * 技能施法可以释放
     * @returns
     */
    public IsAbilityReady(): boolean {
        let hCaster = this.GetCaster()
        let iBehavior = this.GetBehaviorInt()
        if (this.IsHidden()) {
            return false
        }
        if (!hCaster) {
            return false
        }
        if (!(this.IsFullyCastable() && this.IsActivated() && this.IsCooldownReady() && this.GetLevel() > 0 && this.IsOwnersManaEnough())) {
            return false
        }
        if (hCaster.IsHexed() || hCaster.IsCommandRestricted()) {
            return false
        }
        // 被控是否可以施法
        if (hCaster.IsStunned() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE)[0]) {
            return false
        }
        if (hCaster.IsChanneling() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL)[0]) {
            return false
        }
        if (IsServer()) {
            if (this.IsItem()) {
                if (hCaster.IsMuted()) {
                    return false
                }
            }
            else {
                if (hCaster.IsSilenced()) {
                    return false
                }
            }
        }
        else {
            if (this.IsItem()) {
                if (this.CanBeUsedOutOfInventory()) {
                    return false
                }
                if (!this.IsPassive() && hCaster.IsMuted()) {
                    return false
                }
            }
            else {
                if (!this.IsPassive() && hCaster.IsSilenced()) {
                    return false
                }
                if (this.IsPassive() && hCaster.PassivesDisabled()) {
                    return false
                }
            }
        }
        return true

    }

    public GetCasterPlus() {
        return this.GetCaster() as BaseNpc_Plus
    }

    public GetOwnerPlus() {
        return this.GetOwner() as BaseNpc_Plus
    }
    /**
     * 自动施法后，调AI
     */
    public ToggleAutoCast() {
        if (!GameFunc.IsValid(this)) {
            return
        }
        let caster = this.GetCasterPlus()
        if (!GameFunc.IsValid(caster) || caster.IsTempestDouble() || caster.IsIllusion()) {
            return
        }
        super.ToggleAutoCast();
        if (IsServer()) {
            if (this.__autoSpellTimer != null) { return }
            this.__autoSpellTimer = this.addTimer(GameSetting.AI_TIMER_TICK_TIME_HERO, () => {
                if (!GameFunc.IsValid(this)) {
                    this.__autoSpellTimer = null;
                    return
                }
                if (!this.GetAutoCastState()) {
                    this.__autoSpellTimer = null;
                    return
                }
                let caster = this.GetCasterPlus()
                if (caster.IsTempestDouble() || caster.IsIllusion()) {
                    this.__autoSpellTimer = null;
                    return
                }
                // 开始自动放技能
                if (this.IsAbilityReady()) {
                    this.AutoSpellSelf()
                }
                return GameSetting.AI_TIMER_TICK_TIME_HERO
            })

        }
    }


    /**尝试智能施法,AI会调用 */
    public AutoSpellSelf() { };

    /**
     * 释放技能
     */
    public startCast() {
        let iBehavior = this.GetBehaviorInt()
        let info = GameFunc.IncludeArgs(iBehavior,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT,
            DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET)
        if (info[0]) {
            // GameFunc.ExecuteOrder(this.GetCaster(), dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET, null, this)
        }
        else if (info[1]) {
            // GameFunc.ExecuteOrder(this.GetCaster(), dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION, null, this)
        }
        else if (info[2]) {
            // GameFunc.ExecuteOrder(this.GetCaster(), dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET, null, this)
        }
    }

}




