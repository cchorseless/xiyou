import { GameFunc } from "../../GameFunc";
import { KVHelper } from "../../helper/KVHelper";
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

    public GetPlayer() {
        let caster = this.GetCaster()
        if (caster) {
            let iPlayerID = caster.GetPlayerOwnerID();
            return PlayerResource.GetSelectedHeroEntity(iPlayerID)
        }
    }
    /**
     * @both
     * 流派特殊BUFF名称
     * @param level 
     * @returns 
     */
    public GetSectSpeEffectName(level: ISectLevel) {
        return GJsonConfigHelper.GetAbilitySectSpeEffectName(this.GetAbilityName(), level);
    }

    /**
     * @both
     * 流派特殊BUFF名称
     * @param level 
     * @returns 
     */
    public GetSectSpeEffectValue(level: ISectLevel, key: string) {
        let buffname = this.GetSectSpeEffectName(level);
        if (buffname) {
            return GJSONConfig.BuffEffectConfig.get(buffname).propinfo.get(key);
        }
        GLogHelper.warn("GetSectSpeEffectValue Miss", this.GetAbilityName(), buffname, key)
    }

    /**
     * @both
     * 流派特殊BUFF是否存在
     * @param level 
     * @returns 
     */
    public IsSectSpeEffectActive(level: ISectLevel) {
        let buffname = this.GetSectSpeEffectName(level);
        return this.GetCasterPlus().HasModifier(buffname);
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
        let abilityname = this.GetAbilityName();
        if (abilityname == null) { return "" }
        let config = KVHelper.KvAbilitys[this.GetAbilityName()];
        let iconpath = "";
        if (config && config.AbilityTextureName) {
            iconpath = config.AbilityTextureName;
        }
        if (iconpath == "") {
            iconpath = this.__IN_DOTA_NAME__;
        }
        return ResHelper.GetAbilityTextureReplacement(iconpath as string, this.GetCaster())
    }

    // /**
    //  * 技能施法可以释放
    //  * @returns
    //  */
    // public IsAbilityReady(): boolean {
    //     let hCaster = this.GetCaster()
    //     let iBehavior = this.GetBehaviorInt()
    //     if (this.IsHidden()) {
    //         return false
    //     }
    //     if (!hCaster) {
    //         return false
    //     }
    //     if (!(this.IsFullyCastable() && this.IsActivated() && this.IsCooldownReady() && this.GetLevel() > 0 && this.IsOwnersManaEnough())) {
    //         return false
    //     }
    //     if (hCaster.IsHexed() || hCaster.IsCommandRestricted()) {
    //         return false
    //     }
    //     // 被控是否可以施法
    //     if (hCaster.IsStunned() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_PSEUDO_QUEUE)[0]) {
    //         return false
    //     }
    //     if (hCaster.IsChanneling() && !GameFunc.IncludeArgs(iBehavior, DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_CHANNEL)[0]) {
    //         return false
    //     }
    //     if (IsServer()) {
    //         if (hCaster.IsSilenced()) {
    //             return false
    //         }
    //     }
    //     else {
    //         if (!this.IsPassive() && hCaster.IsSilenced()) {
    //             return false
    //         }
    //         if (this.IsPassive() && hCaster.PassivesDisabled()) {
    //             return false
    //         }
    //     }
    //     return true

    // }

    /**
     * 自动施法后，调AI
     */
    // public ToggleAutoCast() {
    //     if (!GFuncEntity.IsValid(this)) {
    //         return
    //     }
    //     let caster = this.GetCasterPlus()
    //     if (!GFuncEntity.IsValid(caster) || caster.IsTempestDouble() || caster.IsIllusion()) {
    //         return
    //     }
    //     super.ToggleAutoCast();
    //     if (IsServer()) {
    //         if (this.__autoSpellTimer != null) { return }
    //         this.__autoSpellTimer = GTimerHelper.AddTimer(GameSetting.AI_TIMER_TICK_TIME_HERO,
    //             GHandler.create(this, () => {
    //                 if (!GFuncEntity.IsValid(this)) {
    //                     this.__autoSpellTimer = null;
    //                     return
    //                 }
    //                 if (!this.GetAutoCastState()) {
    //                     this.__autoSpellTimer = null;
    //                     return
    //                 }
    //                 let caster = this.GetCasterPlus()
    //                 if (caster.IsTempestDouble() || caster.IsIllusion()) {
    //                     this.__autoSpellTimer = null;
    //                     return
    //                 }
    //                 // 开始自动放技能
    //                 if (this.IsAbilityReady()) {
    //                     this.AutoSpellSelf()
    //                 }
    //                 return GameSetting.AI_TIMER_TICK_TIME_HERO
    //             }))

    //     }
    // }

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
            // GFuncEntity.ExecuteOrder(this.GetCaster(), dotaunitorder_t.DOTA_UNIT_ORDER_CAST_NO_TARGET, null, this)
        }
        else if (info[0]) {
            // GFuncEntity.ExecuteOrder(this.GetCaster(), dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION, null, this)
        }
        else if (info[2]) {
            // GFuncEntity.ExecuteOrder(this.GetCaster(), dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TARGET, null, this)
        }
    }


}

/**
 * 法球技能
 */
export class BaseOrbAbility_Plus extends BaseAbility_Plus {
    /**
     * 获取法球名称
     */
    public GetProjectileName?(): string;
    public OnOrbRecord?(params: ModifierAttackEvent): void;
    public OnOrbFire?(params: ModifierAttackEvent): void;
    public OnOrbImpact?(params: ModifierAttackEvent): number;
    public OnOrbFail?(params: ModifierAttackEvent): void;
    public OnOrbRecordDestroy?(params: ModifierAttackEvent): void;
}
declare global {
    type IBaseAbility_Plus = BaseAbility_Plus;
    type IBaseOrbAbility_Plus = BaseOrbAbility_Plus;

}

