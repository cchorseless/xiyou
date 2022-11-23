
import { GameEnum } from "../../../../shared/GameEnum";
import { GameFunc } from "../../../../GameFunc";
import { GameSetting } from "../../../../GameSetting";
import { AoiHelper } from "../../../../helper/AoiHelper";
import { BattleHelper } from "../../../../helper/BattleHelper";
import { ResHelper } from "../../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../../entityPlus/Base_Plus";
import { modifier_building } from "../../../modifier/modifier_building";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../../propertystat/modifier_event";
import { modifier_kill } from "../../../modifier/modifier_kill";
import { ability1_shadow_shaman_ether_shock } from "./ability1_shadow_shaman_ether_shock";
import { ability3_shadow_shaman_shackles } from "./ability3_shadow_shaman_shackles";
/** dota原技能数据 */
export const Data_shadow_shaman_mass_serpent_ward = { "ID": "5081", "AbilityType": "DOTA_ABILITY_TYPE_ULTIMATE", "AbilityBehavior": "DOTA_ABILITY_BEHAVIOR_POINT | DOTA_ABILITY_BEHAVIOR_AOE", "AbilityUnitDamageType": "DAMAGE_TYPE_PHYSICAL", "SpellImmunityType": "SPELL_IMMUNITY_ENEMIES_YES", "FightRecapLevel": "2", "AbilitySound": "Hero_ShadowShaman.SerpentWard", "HasScepterUpgrade": "1", "AbilityCastRange": "550", "AbilityCastPoint": "0.3", "AbilityCastAnimation": "ACT_DOTA_CAST_ABILITY_4", "AbilityCooldown": "120", "AbilityManaCost": "200 350 600", "AbilitySpecial": { "01": { "var_type": "FIELD_INTEGER", "ward_count": "10" }, "02": { "var_type": "FIELD_INTEGER", "damage_tooltip": "50 85 120", "LinkedSpecialBonus": "special_bonus_unique_shadow_shaman_4", "CalculateSpellDamageTooltip": "0" }, "03": { "var_type": "FIELD_FLOAT", "duration": "45.0 45.0 45.0" }, "04": { "var_type": "FIELD_INTEGER", "scepter_range": "225", "RequiresScepter": "1" }, "05": { "var_type": "FIELD_INTEGER", "spawn_radius": "150" }, "06": { "var_type": "FIELD_INTEGER", "hits_to_destroy_tooltip": "2", "LinkedSpecialBonus": "special_bonus_unique_shadow_shaman_1" } } };

@registerAbility()
export class ability6_shadow_shaman_mass_serpent_ward extends BaseAbility_Plus {
    /**对应dota内的名字 */
    __IN_DOTA_NAME__ = "shadow_shaman_mass_serpent_ward";
    /**对应dota内的数据 */
    __IN_DOTA_DATA__: typeof Data_shadow_shaman_mass_serpent_ward = Data_shadow_shaman_mass_serpent_ward;
    Init() {
        this.SetDefaultSpecialValue("scepter_chance", 15);
        this.SetDefaultSpecialValue("min_damage", [40, 100, 160, 300, 450, 600]);
        this.SetDefaultSpecialValue("max_damage", [40, 100, 160, 300, 450, 600]);
        this.SetDefaultSpecialValue("attack_rate", [1.5, 1.4, 1.3, 1.2, 1.1, 1.0]);
        this.SetDefaultSpecialValue("ward_count", 6);
        this.SetDefaultSpecialValue("ward_duration", 12);
        this.SetDefaultSpecialValue("spawn_radius", 150);
        this.SetDefaultSpecialValue("bonus_damage_pct", [10, 20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("intellect_factor", [3, 3, 4, 5, 6, 7]);
        this.SetDefaultSpecialValue("scepter_arrow_count", 1);

    }

    Init_old() {
        this.SetDefaultSpecialValue("scepter_arrow_count", 1);
        this.SetDefaultSpecialValue("scepter_chance", 15);
        this.SetDefaultSpecialValue("min_damage", [40, 100, 160, 300, 450, 600]);
        this.SetDefaultSpecialValue("max_damage", [40, 100, 160, 300, 450, 600]);
        this.SetDefaultSpecialValue("attack_rate", [1.5, 1.4, 1.3, 1.2, 1.1, 1.0]);
        this.SetDefaultSpecialValue("ward_count", 6);
        this.SetDefaultSpecialValue("ward_duration", 12);
        this.SetDefaultSpecialValue("spawn_radius", 150);
        this.SetDefaultSpecialValue("bonus_damage_pct", [10, 20, 30, 40, 50, 60]);
        this.SetDefaultSpecialValue("intellect_factor", [0.3, 0.4, 0.5, 0.6, 0.7, 0.8]);

    }



    vLastPosition: Vector;

    Precache(context: any) {
        PrecacheUnitByNameSync("npc_dota_shadow_shaman_ward_custom", context, -1)
    }
    GetAOERadius() {
        return this.GetSpecialValueFor("spawn_radius")
    }
    OnSpellStart() {
        let hCaster = this.GetCasterPlus()
        let min_damage = this.GetSpecialValueFor("min_damage") + this.GetSpecialValueFor("intellect_factor") * hCaster.GetIntellect()
        let max_damage = this.GetSpecialValueFor("max_damage") + this.GetSpecialValueFor("intellect_factor") * hCaster.GetIntellect()
        let extra_ward_count = hCaster.GetTalentValue("special_bonus_unique_shadow_shaman_custom_5")
        let ward_count = this.GetSpecialValueFor("ward_count") + extra_ward_count
        let ward_duration = this.GetSpecialValueFor("ward_duration")
        let spawn_radius = this.GetSpecialValueFor("spawn_radius")
        let hHero = PlayerResource.GetSelectedHeroEntity(hCaster.GetPlayerOwnerID())
        let vLocation = this.GetCursorPosition()
        if (!vLocation) {
            vLocation = hCaster.GetAbsOrigin()
        }
        let hAbility = ability3_shadow_shaman_shackles.findIn(hCaster) as ability3_shadow_shaman_shackles;
        for (let i = 1; i <= ward_count; i++) {
            let vSummonLoc = (vLocation + GameFunc.VectorFunctions.Rotation2D(Vector(1, 0, 0), i * ((2 * math.pi) / ward_count)) * spawn_radius) as Vector
            let hWard = CreateUnitByName("npc_dota_shadow_shaman_ward_custom", vSummonLoc, false, hHero, hHero, hCaster.GetTeamNumber())
            hWard.SetBaseDamageMin(min_damage)
            hWard.SetBaseDamageMax(max_damage)
            hWard.SetForwardVector(hCaster.GetForwardVector())
            hWard.SetControllableByPlayer(hCaster.GetPlayerOwnerID(), true)

            modifier_shadow_shaman_6_summon.apply(hWard, hCaster, this, { duration: ward_duration })
            // hWard.FireSummonned(hCaster)
            if (GameFunc.IsValid(hAbility) && hAbility.FireTotem != null) {
                hAbility.FireTotem(hWard)
            }
        }
        EmitSoundOnLocationWithCaster(vLocation, ResHelper.GetSoundReplacement("Hero_ShadowShaman.SerpentWard", hCaster), hCaster)
        //  记录上一次释放的位置
        this.vLastPosition = vLocation
    }



    GetIntrinsicModifierName() {
        return "modifier_shadow_shaman_6"
    }
    OnStolen(hSourceAbility: ability6_shadow_shaman_mass_serpent_ward) {
        this.vLastPosition = hSourceAbility.vLastPosition
    }
}
// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
// Modifiers
@registerModifier()
export class modifier_shadow_shaman_6 extends BaseModifier_Plus {
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
        super.OnCreated(params);
        if (IsServer()) {
            this.StartIntervalThink(GameSetting.AI_TIMER_TICK_TIME_HERO)
        }
    }

    OnIntervalThink() {
        if (IsServer()) {
            let ability = this.GetAbilityPlus() as ability6_shadow_shaman_mass_serpent_ward
            if (!GameFunc.IsValid(ability)) {
                this.StartIntervalThink(-1)
                this.Destroy()
                return
            }

            let caster = ability.GetCasterPlus()

            if (!ability.GetAutoCastState()) {
                return
            }

            if (caster.IsTempestDouble() || caster.IsIllusion()) {
                this.StartIntervalThink(-1)
                return
            }

            if (!ability.IsAbilityReady()) {
                return
            }

            let teamFilter = DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY
            let typeFilter = DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC
            let flagFilter = DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS
            let order = FindOrder.FIND_CLOSEST

            let range = ability.GetCastRange(caster.GetAbsOrigin(), caster) + caster.GetCastRangeBonus()

            let radius = 650
            if (ability.vLastPosition != null && caster.IsPositionInRange(ability.vLastPosition, range)) {
                let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), ability.vLastPosition, radius, null, teamFilter, typeFilter, flagFilter, order)
                //  施法命令
                if (targets.length > 0) {
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                            Position: ability.vLastPosition,
                            AbilityIndex: ability.entindex()
                        }
                    )
                }
            }
            else {
                //  优先攻击目标
                let target = caster.GetAttackTarget()
                if (target != null && target.GetClassname() == "dota_item_drop") {
                    target = null
                }
                if (target != null && !target.IsPositionInRange(caster.GetAbsOrigin(), range)) {
                    target = null
                }

                //  搜索范围
                if (target == null) {
                    let targets = AoiHelper.FindEntityInRadius(caster.GetTeamNumber(), caster.GetAbsOrigin(), range, null, teamFilter, typeFilter, flagFilter, order)
                    target = targets[0]
                }

                //  施法命令
                if (target != null) {
                    let position = target.GetAbsOrigin()
                    ExecuteOrderFromTable(
                        {
                            UnitIndex: caster.entindex(),
                            OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                            AbilityIndex: ability.entindex(),
                            Position: position
                        }
                    )
                }
            }
        }
    }
}

// // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // // -
@registerModifier()
export class modifier_shadow_shaman_6_summon extends BaseModifier_Plus {
    attack_rate: number;
    scepter_chance: number;
    scepter_arrow_count: number;
    attack_range: number;
    modifier_kill: BaseModifier_Plus;
    has_scepter: boolean;
    IsHidden() {
        return false
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
    Init(params: ModifierTable) {
        let hCaster = this.GetCasterPlus()
        let extra_attack_rate = hCaster.GetTalentValue("special_bonus_unique_shadow_shaman_custom_3")
        this.attack_rate = this.GetSpecialValueFor("attack_rate") - extra_attack_rate
        this.scepter_chance = this.GetSpecialValueFor("scepter_chance")
        this.scepter_arrow_count = this.GetSpecialValueFor("scepter_arrow_count")
        this.attack_range = hCaster.GetTalentValue("special_bonus_unique_shadow_shaman_custom_1")
        if (IsServer()) {
            this.has_scepter = this.GetCasterPlus().HasScepter()
            if (params.IsOnCreated) {
                this.modifier_kill = modifier_kill.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), { duration: this.GetDuration() })
                modifier_building.apply(this.GetParentPlus(), this.GetCasterPlus(), this.GetAbilityPlus(), null)
            }
            if (params.IsOnRefresh) {
                this.modifier_kill.SetDuration(this.GetDuration(), true)
            }
        }

    }

    OnDestroy() {
        super.OnDestroy();
        if (IsServer()) {
            this.GetParentPlus().ForceKill(false)
            if (GameFunc.IsValid(this.GetCasterPlus())) {
                let hAblt = ability3_shadow_shaman_shackles.findIn(this.GetCasterPlus()) as ability3_shadow_shaman_shackles;
                if (GameFunc.IsValid(hAblt) && hAblt.RemoveTotem) {
                    hAblt.RemoveTotem(this.GetParentPlus())
                }
            }
        }
    }
    CheckState() {
        return {
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true
        }
    }

    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.MODEL_CHANGE)
    GetModelChange(params: ModifierTable) {
        return ResHelper.GetModelReplacement("models/heroes/shadowshaman/shadowshaman_totem.vmdl", this.GetCasterPlus())
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.BASE_ATTACK_TIME_CONSTANT)

    GetBaseAttackTimeConstant(params: ModifierTable) {
        return this.attack_rate
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    attack(params: ModifierAttackEvent) {
        if (params.target == null) {
            return
        }
        if (params.target.GetClassname() == "dota_item_drop") {
            return
        }
        if (this.has_scepter == false) {
            return
        }
        if (params.attacker == this.GetParentPlus() && !BattleHelper.AttackFilter(params.record, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK)) {
            if (GameFunc.IsValid(this) && GameFunc.IsValid(this.GetCasterPlus())) {
                let hAblt = ability3_shadow_shaman_shackles.findIn(this.GetCasterPlus()) as ability3_shadow_shaman_shackles;
                if (GameFunc.IsValid(hAblt) && hAblt.tTotems && hAblt.tTotems["shackles"] && (hAblt.tTotems["shackles"].length) > 0) {
                    let count = 0
                    let targets = AoiHelper.FindEntityInRadius(params.attacker.GetTeamNumber(), params.attacker.GetAbsOrigin(), params.attacker.Script_GetAttackRange() + params.attacker.GetHullRadius(), null, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ATTACK_IMMUNE, FindOrder.FIND_CLOSEST)
                    for (let target of (targets)) {
                        if (target != params.target) {
                            count = count + 1
                            BattleHelper.Attack(params.attacker, target, BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_USECASTATTACKORB + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NOT_PROCESSPROCS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOOLDOWN + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_IGNOREINVIS + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_CLEAVE + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_NO_EXTENDATTACK + BattleHelper.enum_ATTACK_STATE.ATTACK_STATE_SKIPCOUNTING)
                            if (count >= this.scepter_arrow_count) {
                                break
                            }
                        }
                    }
                }
            }
        }
        if (GameFunc.IsValid(this.GetCasterPlus()) && this.GetCasterPlus().HasScepter()) {
            let hAblt = ability3_shadow_shaman_shackles.findIn(this.GetCasterPlus()) as ability3_shadow_shaman_shackles;
            if (GameFunc.IsValid(hAblt) && hAblt.tTotems) {
                if (hAblt.tTotems["ether_shock"].length > 0 && GameFunc.mathUtil.PRD(this.scepter_chance, this.GetCasterPlus(), "shadow_shaman_3")) {
                    ability1_shadow_shaman_ether_shock.findIn(this.GetCasterPlus()).EtherShock(params.target, this.GetParentPlus())
                }
            }
        }
    }
    @registerProp(GameEnum.Property.Enum_MODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    GetAttackRangeBonus() {
        return this.attack_range
    }


}
