import { GameFunc } from "../../GameFunc";
import { GameSetting } from "../../GameSetting";
import { ResHelper } from "../../helper/ResHelper";
import { BaseAbility } from "./Base_Plus";

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
            // this.ToggleAutoCast()
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


    /**自动释放技能计时器 */
    private __autoSpellTimer: ITimerTask;
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
        if (iconpath == null || iconpath == this.constructor.name) {
            iconpath = this.__IN_DOTA_NAME__;
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
            if (hCaster.IsSilenced()) {
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
        return true

    }
    /**
     * @both
     * @returns 
     */
    public GetCasterPlus() {
        return this.GetCaster() as IBaseNpc_Plus
    }
    /**
     * @server
     * @returns 
     */
    public GetOwnerPlus() {
        return this.GetOwner() as IBaseNpc_Plus
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
            this.__autoSpellTimer = GTimerHelper.AddTimer(GameSetting.AI_TIMER_TICK_TIME_HERO, GHandler.create(this, () => {
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
            }))

        }
    }


    /**尝试智能施法,AI会调用 */
    public AutoSpellSelf(): boolean { return true };

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


declare global {
    type IBaseAbility_Plus = BaseAbility_Plus;
}

