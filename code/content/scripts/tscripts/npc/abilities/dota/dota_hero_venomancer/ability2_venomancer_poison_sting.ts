
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { GameEnum } from "../../../../shared/GameEnum";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { BaseNpc_Hero_Plus } from "../../../entityPlus/BaseNpc_Hero_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_venomancer_3 } from "./ability3_venomancer_plague_ward";
import { ability6_venomancer_poison_nova } from "./ability6_venomancer_poison_nova";

/** dota原技能数据 */
export const Data_venomancer_poison_sting = { "ID": "5179", "AbilityType": "DOTA_ABILITY_TYPE_BASIC", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_PASSIVE", "AbilityUnitDamageType": "DAMAGE_TYPE_MAGICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_NO", "SpellDispellableType": "SPELL_DISPELLABLE_YES", "AbilitySpecial": { "01": { "var_type": "FIELD_FLOAT", "duration": "6.0 9.0 12.0 15.0" }, "02": { "var_type": "FIELD_INTEGER", "damage": "6 14 22 30" }, "03": { "var_type": "FIELD_INTEGER", "movement_speed": "-8 -10 -12 -14", "LinkedSpecialBonus": "special_bonus_unique_venomancer_2" } }, "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_2" };

@registerAbility()
export class ability2_venomancer_poison_sting extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "venomancer_poison_sting";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_venomancer_poison_sting = Data_venomancer_poison_sting;
    Init() {
        this.SetDefaultSpecialValue("health_percent", 100);
        this.SetDefaultSpecialValue("attack_percent", 100);
        this.SetDefaultSpecialValue("attack_speed_percent", 100);
        this.SetDefaultSpecialValue("ward_attack_range", 650);

    }

    Init_old() {
        this.SetDefaultSpecialValue("health_percent", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attack_percent", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("attack_speed_percent", [50, 60, 70, 80, 90, 100]);
        this.SetDefaultSpecialValue("ward_attack_range", 650);

    }

    tWards: any[];

    Precache(context: CScriptPrecacheContext) {
        PrecacheUnitByNameSync("npc_dota_venomancer_ward_custom", context, -1)
    }

    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let vPosition = this.GetCursorPosition()
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let max_count = this.GetSpecialValueFor("max_count") + hCaster.GetTalentValue('special_bonus_unique_venomancer_custom_8')
        let attack_percent = this.GetSpecialValueFor("attack_percent")

        let hWard = CreateUnitByName("npc_dota_venomancer_ward_custom", vPosition, false, hHero, hHero, hCaster.GetTeamNumber())
        hWard.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)
        modifier_venomancer_2_ward.apply(hWard, hCaster, this, null)
        modifier_venomancer_2_ward_attack_talent.apply(hWard, hCaster, this, null)
        // 继承攻击力
        let fAttackDamamge = hCaster.GetAverageTrueAttackDamage(null) * attack_percent / 100
        hWard.SetBaseDamageMax(fAttackDamamge)
        hWard.SetBaseDamageMin(fAttackDamamge)
        // hWard.FireSummonned(hCaster)
        EmitSoundOnLocationWithCaster(vPosition, ResHelper.GetSoundReplacement("Hero_Venomancer.Plague_Ward", hCaster), hCaster)
        if (this.tWards == null) {
            this.tWards = []
        }
        table.insert(this.tWards, hWard)
        while (this.tWards.length > max_count) {
            this.tWards[0].ForceKill(false)
            table.remove(this.tWards, 1)
        }
    }
    OnOwnerDied() {
        if (this.tWards != null) {
            for (let hWard of (this.tWards)) {
                if (GameFunc.IsValid(hWard)) {
                    hWard.ForceKill(false)
                }
            }
        }
    }

    GetIntrinsicModifierName() {
        return "modifier_venomancer_2"
    }

}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_2// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_2 extends BaseModifier_Plus {
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (!IsServer()) {
            return
        }
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hAbility)) {
            this.StartIntervalThink(-1)
            this.Destroy()
            return
        }

        let hCaster = hAbility.GetCasterPlus()

        if (hCaster.IsTempestDouble() || hCaster.IsIllusion()) {
            this.StartIntervalThink(-1)
            return
        }

        if (!hAbility.GetAutoCastState()) {
            return
        }

        if (!hAbility.IsAbilityReady()) {
            return
        }

        let fRange = hAbility.GetCastRange(hCaster.GetAbsOrigin(), hCaster) + hCaster.GetCastRangeBonus()
        let vPosition = AoiHelper.GetAOEMostTargetsPosition(
            hCaster.GetAbsOrigin(),
            fRange,
            hCaster.GetTeamNumber(),
            this.GetSpecialValueFor("ward_attack_range"),
            null,
            hAbility.GetAbilityTargetTeam(),
            hAbility.GetAbilityTargetType(),
            hAbility.GetAbilityTargetFlags() + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS,
            FindOrder.FIND_ANY_ORDER
        )

        //  施法命令
        if (vPosition && vPosition != vec3_invalid && hCaster.IsPositionInRange(vPosition, fRange)) {
            ExecuteOrderFromTable({
                UnitIndex: hCaster.entindex(),
                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                AbilityIndex: hAbility.entindex(),
                Position: vPosition,
            })
        }
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_2_ward// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_2_ward extends BaseModifier_Plus {
    fAttackTime: any;
    fAttackSpeed: number;
    ward_attack_range: any;
    health_percent: any;
    attack_percent: any;
    attack_speed_percent: any;
    fHealthChange: number;
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA
    }
    Init(params: ModifierTable) {
        this.health_percent = this.GetSpecialValueFor("health_percent")
        this.attack_percent = this.GetSpecialValueFor("attack_percent")
        this.attack_speed_percent = this.GetSpecialValueFor("attack_speed_percent")
        this.ward_attack_range = this.GetSpecialValueFor("ward_attack_range")
        let hCaster = this.GetCasterPlus()
        let hParent = this.GetParentPlus() as BaseNpc_Hero_Plus
        if (IsServer()) {
            let hAbility = ability6_venomancer_poison_nova.findIn(hCaster) as ability6_venomancer_poison_nova;
            if (hAbility != null && hAbility.GetLevel() > 0) {
                modifier_venomancer_3.apply(hParent, hCaster, hAbility)
            }
            // 继承的是创建单位时英雄的数据
            // 继承最大血量
            this.fHealthChange = hCaster.GetMaxHealth() * this.health_percent / 100 - hParent.GetMaxHealth()
            // hParent.ModifyMaxHealth(this.fHealthChange)
        }

        // 继承攻速
        this.fAttackSpeed = hCaster.GetIncreasedAttackSpeed() * this.attack_speed_percent / 100
        this.fAttackTime = hCaster.GetBaseAttackTime()
    }
    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            modifier_venomancer_3.remove(this.GetParentPlus());
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: ModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/venomancer/venomancer_ward.vmdl", this.GetCasterPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)
    GetBaseAttackTimeConstant(params: ModifierTable) {
        return this.fAttackTime
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    GetAttackSpeedBonus_Constant(params: ModifierTable) {
        return this.fAttackSpeed * 100
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BASE_OVERRIDE)
    GetAttackRangeOverride(params: ModifierTable) {
        return this.ward_attack_range
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_2_ward_attack_talent// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_2_ward_attack_talent extends BaseModifier_Plus {
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement('modifier_texture', this.GetCasterPlus())
    }
    IsHidden() {
        return true
    }
    IsDebuff() {
        return false
    }
    IsPurgable() {
        return false
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        if (IsServer()) {
            let hParent = this.GetParentPlus()
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    AttackLanded(params: ModifierAttackEvent) {
        let hTarget = params.target as IBaseNpc_Plus
        let hParent = this.GetParentPlus()
        let hCaster = this.GetCasterPlus()
        let hAbility = this.GetAbilityPlus()
        if (!GameFunc.IsValid(hTarget)
            || !GameFunc.IsValid(hCaster)
            || !GameFunc.IsValid(hAbility)
            || hTarget.GetClassname() == "dota_item_drop"
            || params.attacker != hParent
            || !hCaster.HasTalent('special_bonus_unique_venomancer_custom_4')
            || BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_FAKEATTACK)
        ) {
            return
        }
        let duration = hCaster.GetTalentValue('special_bonus_unique_venomancer_custom_4', 'duration')
        let armor = hCaster.GetTalentValue('special_bonus_unique_venomancer_custom_4', 'armor')
        modifier_venomancer_2_ward_armor_talent.apply(hTarget, hParent, hAbility, { duration: duration * hTarget.GetStatusResistanceFactor(hParent) })
    }
}
// // // // // // // // // // // // // // // // // // // -modifier_venomancer_2_ward_armor_talent// // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_venomancer_2_ward_armor_talent extends BaseModifier_Plus {
    armor: any;
    tData: any[];
    GetTexture() {
        return ResHelper.GetAbilityTextureReplacement("slardar_amplify_damage", this.GetCasterPlus())
    }
    IsHidden() {
        return false
    }
    IsDebuff() {
        return true
    }
    IsPurgable() {
        return true
    }
    IsPurgeException() {
        return false
    }
    IsStunDebuff() {
        return false
    }
    AllowIllusionDuplicate() {
        return false
    }
    OnCreated(params: ModifierTable) {
        super.OnCreated(params)
        // 技能的caster是英雄
        this.armor = this.GetAbilityPlus().GetCasterPlus().GetTalentValue('special_bonus_unique_venomancer_custom_4', "armor")
        if (IsServer()) {
            this.tData = []
            let hCaster = this.GetCasterPlus()// buff的caster是蛇棒
            table.insert(this.tData, { caster: hCaster, dieTime: this.GetDieTime() })
            this.IncrementStackCount()
            this.StartIntervalThink(0)
        }
    }
    OnRefresh(params: ModifierTable) {
        super.OnRefresh(params)
        this.armor = this.GetAbilityPlus().GetCasterPlus().GetTalentValue('special_bonus_unique_venomancer_custom_4', "armor")
        if (IsServer()) {
            let hCaster = this.GetCasterPlus()// buff的caster是蛇棒
            let bFind = false
            for (let v of (this.tData)) {
                if (v.caster == hCaster) {
                    v.dieTime = this.GetDieTime() //  刷新这个蛇棒施加的buff的持续时间
                    bFind = true
                    break
                }
            }
            if (!bFind) {
                table.insert(this.tData, { caster: hCaster, dieTime: this.GetDieTime() })
                this.IncrementStackCount()
            }
        }
    }
    OnDestroy() {
        super.Destroy()
        if (IsServer()) {
            for (let i = this.tData.length - 1; i >= 0; i--) {
                table.remove(this.tData, i)
                this.DecrementStackCount()
            }
        }
    }
    OnIntervalThink() {
        if (IsServer()) {
            let hParent = this.GetParentPlus()
            let fGameTime = GameRules.GetGameTime()

            for (let i = this.tData.length - 1; i >= 0; i--) {
                if (fGameTime >= this.tData[i].dieTime) {
                    table.remove(this.tData, i)
                    this.DecrementStackCount()
                }
            }
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    EOM_GetModifierPhysicalArmorBonus(params: ModifierTable) {
        return -this.armor * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    EOM_GetModifierMagicalArmorBonus(params: ModifierTable) {
        return -this.armor * this.GetStackCount()
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.TOOLTIP)
    Tooltip(params: any) {
        return this.armor * this.GetStackCount()
    }
}
