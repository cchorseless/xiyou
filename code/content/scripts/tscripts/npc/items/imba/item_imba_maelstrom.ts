
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";

// 漩涡
@registerAbility()
export class item_imba_maelstrom extends BaseItem_Plus {
    public bTargetingTree: any;
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_maelstrom";
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("chop_tree_radius");
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (this.GetAbilityName() == "item_imba_jarnbjorn") {
            return super.GetBehaviorInt() + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE;
        } else {
            return super.GetBehavior();
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (IsClient()) {
            return super.GetCastRange(location, target);
        } else {
            if ((this.GetAbilityName() == "item_imba_jarnbjorn" && this.GetCursorTarget() && ((this.GetCursorTarget() as any as CDOTA_MapTree).CutDown || !this.GetCursorTarget().IsCreep)) || this.bTargetingTree) {
                this.bTargetingTree = true;
                return this.GetSpecialValueFor("chop_tree_cast_range");
            } else {
                return super.GetCastRange(location, target);
            }
        }
    }
    GetCooldown(level: number): number {
        if (IsServer() && this.GetAbilityName() == "item_imba_jarnbjorn" && this.GetCursorTarget() && ((this.GetCursorTarget() as any as CDOTA_MapTree).CutDown || !this.GetCursorTarget().IsCreep)) {
            return this.GetSpecialValueFor("chop_tree_cooldown");
        } else {
            return super.GetCooldown(level);
        }
    }
    OnSpellStart(): void {
        this.bTargetingTree = false;
        let target = this.GetCursorTarget();
        if (this.GetAbilityName() == "item_imba_mjollnir" || this.GetAbilityName() == "item_imba_jarnbjorn") {
            if (this.GetAbilityName() == "item_imba_jarnbjorn" && target.GetUnitName == undefined) {
                if ((target as any as CDOTA_MapTree).CutDown) {
                    (target as any as CDOTA_MapTree).CutDown(-1);
                } else {
                    target.ForceKill(false);
                }
                GridNav.DestroyTreesAroundPoint(target.GetAbsOrigin(), this.GetSpecialValueFor("chop_tree_radius"), true);
            } else {
                target.EmitSound("DOTA_Item.Mjollnir.Activate");
                target.EmitSound("DOTA_Item.Mjollnir.Loop");
                target.AddNewModifier(target, this, "modifier_item_imba_static_charge", {
                    duration: this.GetSpecialValueFor("static_duration")
                });
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_maelstrom extends BaseModifier_Plus {
    public bonus_damage: number;
    public bonus_attack_speed: number;
    public bonus_health_regen: number;
    public bonus_mana_regen: number;
    public chain_chance: number;
    public chain_cooldown: number;
    public cleave_damage_percent: number;
    public quelling_bonus: number;
    public quelling_bonus_ranged: number;
    public cleave_starting_width: any;
    public cleave_ending_width: any;
    public cleave_distance: number;
    public bonus_range: number;
    public bChainCooldown: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (this.GetItemPlus()) {
            this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
            this.bonus_attack_speed = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed");
            this.bonus_health_regen = this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
            this.bonus_mana_regen = this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
            this.chain_chance = this.GetItemPlus().GetSpecialValueFor("chain_chance");
            this.chain_cooldown = this.GetItemPlus().GetSpecialValueFor("chain_cooldown");
            this.cleave_damage_percent = this.GetItemPlus().GetSpecialValueFor("cleave_damage_percent");
            this.quelling_bonus = this.GetItemPlus().GetSpecialValueFor("quelling_bonus");
            this.quelling_bonus_ranged = this.GetItemPlus().GetSpecialValueFor("quelling_bonus_ranged");
            this.cleave_starting_width = this.GetItemPlus().GetSpecialValueFor("cleave_starting_width");
            this.cleave_ending_width = this.GetItemPlus().GetSpecialValueFor("cleave_ending_width");
            this.cleave_distance = this.GetItemPlus().GetSpecialValueFor("cleave_distance");
            this.bonus_range = this.GetItemPlus().GetSpecialValueFor("bonus_range");
        } else {
            this.bonus_damage = 0;
            this.bonus_attack_speed = 0;
            this.bonus_health_regen = 0;
            this.bonus_mana_regen = 0;
            this.chain_chance = 0;
            this.chain_cooldown = 0;
            this.cleave_damage_percent = 0;
            this.quelling_bonus = 0;
            this.quelling_bonus_ranged = 0;
            this.cleave_starting_width = 0;
            this.cleave_ending_width = 0;
            this.cleave_distance = 0;
            this.bonus_range = 0;
        }
        this.bChainCooldown = false;
        if (!IsServer()) {
            return;
        }
        let maelstroms = 0;
        let mjollnirs = 0;
        let jarnbjorns = 0;
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            if (mod.GetItemPlus().GetAbilityName() == "item_imba_maelstrom") {
                mod.GetItemPlus().SetSecondaryCharges(maelstroms + 1);
                maelstroms = maelstroms + 1;
            } else if (mod.GetItemPlus().GetAbilityName() == "item_imba_mjollnir") {
                mod.GetItemPlus().SetSecondaryCharges(mjollnirs + 1);
                mjollnirs = mjollnirs + 1;
            } else if (mod.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn") {
                mod.GetItemPlus().SetSecondaryCharges(jarnbjorns + 1);
                jarnbjorns = jarnbjorns + 1;
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let maelstroms = 0;
        let mjollnirs = 0;
        let jarnbjorns = 0;
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            if (mod.GetItemPlus().GetAbilityName() == "item_imba_maelstrom") {
                mod.GetItemPlus().SetSecondaryCharges(maelstroms + 1);
                maelstroms = maelstroms + 1;
            } else if (mod.GetItemPlus().GetAbilityName() == "item_imba_mjollnir") {
                mod.GetItemPlus().SetSecondaryCharges(mjollnirs + 1);
                mjollnirs = mjollnirs + 1;
            } else if (mod.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn") {
                mod.GetItemPlus().SetSecondaryCharges(jarnbjorns + 1);
                jarnbjorns = jarnbjorns + 1;
            }
        }
    }
    OnIntervalThink(): void {
        this.bChainCooldown = false;
        this.StartIntervalThink(-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            5: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            6: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED,
            7: Enum_MODIFIER_EVENT.ON_ORDER
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {

        if (IsServer() && this.GetParentPlus().FindItemInInventory("item_imba_jarnbjorn") == this.GetItemPlus()) {
            if (!this.GetParentPlus().IsRangedAttacker()) {
                return this.bonus_damage + this.quelling_bonus;
            } else {
                return this.bonus_damage + this.quelling_bonus_ranged;
            }
        } else {
            return this.bonus_damage;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.bonus_health_regen;
    }

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        if (!this.GetParentPlus().IsRangedAttacker() && ((this.GetItemPlus().GetAbilityName() == "item_imba_maelstrom" && this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasItemInInventory("item_imba_mjollnir") && !this.GetParentPlus().HasItemInInventory("item_imba_jarnbjorn") && !this.GetParentPlus().HasItemInInventory("item_imba_monkey_king_bar")) || (this.GetItemPlus().GetAbilityName() == "item_imba_mjollnir" && this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasItemInInventory("item_imba_jarnbjorn") && !this.GetParentPlus().HasItemInInventory("item_imba_monkey_king_bar")) || (this.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn" && this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasItemInInventory("item_imba_monkey_king_bar")))) {
            return this.bonus_range;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(keys: ModifierAttackEvent): void {
        if (keys.attacker == this.GetParentPlus() && this.GetParentPlus().IsAlive() && !this.bChainCooldown && !this.GetParentPlus().IsIllusion() && !keys.target.IsMagicImmune() && !keys.target.IsBuilding() && !keys.target.IsOther() && this.GetParentPlus().GetTeamNumber() != keys.target.GetTeamNumber() && GFuncRandom.PRD(this.chain_chance, this.GetItemPlus())) {
            this.GetParentPlus().EmitSound("Item.Maelstrom.Chain_Lightning");
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_chain_lightning", {
                starting_unit_entindex: keys.target.entindex()
            });
            this.bChainCooldown = true;
            this.StartIntervalThink(this.chain_cooldown);
        }
        if (this.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn" && keys.attacker == this.GetParentPlus() && !this.GetParentPlus().IsRangedAttacker() && this.GetParentPlus().IsAlive() && !this.GetParentPlus().IsIllusion() && !keys.target.IsBuilding() && !keys.target.IsOther() && this.GetParentPlus().GetTeamNumber() != keys.target.GetTeamNumber()) {
            DoCleaveAttack(this.GetParentPlus(), keys.target, keys.inflictor, keys.damage * this.cleave_damage_percent * 0.01, this.cleave_starting_width, this.cleave_ending_width, this.cleave_distance, "particles/econ/items/sven/sven_ti7_sword/sven_ti7_sword_spell_great_cleave.vpcf");
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ORDER)
    CC_OnOrder(keys: ModifierUnitEvent): void {
        if (keys.unit == this.GetParentPlus() && this.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn") {
            this.GetItemPlus<item_imba_maelstrom>().bTargetingTree = false;
        }
    }
}
@registerModifier()
export class modifier_item_imba_chain_lightning extends BaseModifier_Plus {
    public bonus_damage: number;
    public chain_damage: number;
    public chain_strikes: any;
    public chain_radius: number;
    public chain_delay: number;
    public starting_unit_entindex: any;
    public current_unit: any;
    public units_affected: IBaseNpc_Plus[];
    public unit_counter: number;
    public zapped: any;
    public zap_particle: any;
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(keys: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (!IsServer()) {
            return;
        }
        if (this.GetItemPlus()) {
            this.bonus_damage = this.GetItemPlus().GetSpecialValueFor("bonus_damage");
            this.chain_damage = this.GetItemPlus().GetSpecialValueFor("chain_damage");
            this.chain_strikes = this.GetItemPlus().GetSpecialValueFor("chain_strikes");
            this.chain_radius = this.GetItemPlus().GetSpecialValueFor("chain_radius");
            this.chain_delay = this.GetItemPlus().GetSpecialValueFor("chain_delay");
        } else {
            this.bonus_damage = 0;
            this.chain_damage = 0;
            this.chain_strikes = 0;
            this.chain_radius = 0;
            this.chain_delay = 0;
        }
        this.starting_unit_entindex = keys.starting_unit_entindex;
        if (this.starting_unit_entindex && EntIndexToHScript(this.starting_unit_entindex)) {
            this.current_unit = EntIndexToHScript(this.starting_unit_entindex);
        } else {
            this.Destroy();
            return;
        }
        this.units_affected = []
        this.unit_counter = 0;
        this.OnIntervalThink();
        this.StartIntervalThink(this.chain_delay);
    }
    OnIntervalThink(): void {
        this.zapped = false;
        for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.current_unit.GetAbsOrigin(), undefined, this.chain_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS, FindOrder.FIND_CLOSEST, false))) {
            if (!this.units_affected.includes(enemy)) {
                enemy.EmitSound("Item.Maelstrom.Chain_Lightning.Jump");
                this.zap_particle = ResHelper.CreateParticleEx("particles/items_fx/chain_lightning.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.current_unit, this.GetCasterPlus());
                if (this.unit_counter == 0) {
                    ParticleManager.SetParticleControlEnt(this.zap_particle, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
                } else {
                    ParticleManager.SetParticleControlEnt(this.zap_particle, 0, this.current_unit, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.current_unit.GetAbsOrigin(), true);
                }
                ParticleManager.SetParticleControlEnt(this.zap_particle, 1, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                ParticleManager.SetParticleControl(this.zap_particle, 2, Vector(1, 1, 1));
                ParticleManager.ReleaseParticleIndex(this.zap_particle);
                this.unit_counter = this.unit_counter + 1;
                this.current_unit = enemy;
                this.units_affected.push(this.current_unit);
                this.zapped = true;
                ApplyDamage({
                    victim: enemy,
                    damage: this.chain_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetItemPlus()
                });
                return;
            }
        }
        if ((this.unit_counter >= this.chain_strikes && this.chain_strikes > 0) || !this.zapped) {
            this.StartIntervalThink(-1);
            this.Destroy();
        }
    }
}
@registerModifier()
export class modifier_item_imba_chain_lightning_cooldown extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_item_imba_static_charge extends BaseModifier_Plus {
    public static_chance: number;
    public static_strikes: any;
    public static_damage: number;
    public static_radius: number;
    public static_cooldown: number;
    public static_slow: any;
    public static_slow_duration: number;
    public bStaticCooldown: any;
    public shield_particle: any;
    GetTexture(): string {
        if (this.GetItemPlus()) {
            if (this.GetItemPlus().GetAbilityName() == "item_imba_mjollnir") {
                return "item_mjollnir";
            } else if (this.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn") {
                return "modifiers/imba_jarnbjorn";
            }
        }
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_mjollnir_shield.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (this.GetItemPlus()) {
            this.static_chance = this.GetItemPlus().GetSpecialValueFor("static_chance");
            this.static_strikes = this.GetItemPlus().GetSpecialValueFor("static_strikes");
            this.static_damage = this.GetItemPlus().GetSpecialValueFor("static_damage");
            this.static_radius = this.GetItemPlus().GetSpecialValueFor("static_radius");
            this.static_cooldown = this.GetItemPlus().GetSpecialValueFor("static_cooldown");
            this.static_slow = this.GetItemPlus().GetSpecialValueFor("static_slow");
            this.static_slow_duration = this.GetItemPlus().GetSpecialValueFor("static_slow_duration");
        } else {
            this.static_chance = 0;
            this.static_strikes = 0;
            this.static_damage = 0;
            this.static_radius = 0;
            this.static_cooldown = 0;
            this.static_slow = 0;
            this.static_slow_duration = 0;
        }
        if (!IsServer()) {
            return;
        }
        this.bStaticCooldown = false;
        this.shield_particle = ResHelper.CreateParticleEx("particles/items2_fx/mjollnir_shield.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.AddParticle(this.shield_particle, false, false, -1, false, false);
    }
    OnIntervalThink(): void {
        this.bStaticCooldown = false;
        this.StartIntervalThink(-1);
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        this.GetParentPlus().StopSound("DOTA_Item.Mjollnir.Loop");
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(keys: ModifierInstanceEvent): void {
        if (keys.unit == this.GetParentPlus() && keys.attacker != this.GetParentPlus() && !this.bStaticCooldown && keys.damage >= 5 && GFuncRandom.PRD(this.static_chance, this.GetItemPlus())) {
            this.GetParentPlus().EmitSound("Item.Maelstrom.Chain_Lightning.Jump");
            if ((keys.attacker.GetAbsOrigin() - this.GetParentPlus().GetAbsOrigin() as Vector).Length2D() <= this.static_radius && !keys.attacker.IsBuilding() && !keys.attacker.IsOther() && keys.attacker.GetTeamNumber() != this.GetParentPlus().GetTeamNumber()) {
                let static_particle = undefined;
                static_particle = ResHelper.CreateParticleEx("particles/item/mjollnir/static_lightning_bolt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, keys.attacker, this.GetCasterPlus());
                ParticleManager.SetParticleControlEnt(static_particle, 0, keys.attacker, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", keys.attacker.GetAbsOrigin(), true);
                ParticleManager.SetParticleControlEnt(static_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
                ParticleManager.ReleaseParticleIndex(static_particle);
                ApplyDamage({
                    victim: keys.attacker,
                    damage: this.static_damage,
                    damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                    damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                    attacker: this.GetCasterPlus(),
                    ability: this.GetItemPlus()
                });
                keys.attacker.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_static_charge_slow", {
                    duration: this.static_slow_duration * (1 - keys.attacker.GetStatusResistance())
                });
            }
            let unit_count = 0;
            for (const [_, enemy] of GameFunc.iPair(FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetParentPlus().GetAbsOrigin(), undefined, this.static_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NO_INVIS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_FOW_VISIBLE, FindOrder.FIND_ANY_ORDER, false))) {
                if (enemy != keys.attacker) {
                    let static_particle = ResHelper.CreateParticleEx("particles/item/mjollnir/static_lightning_bolt.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
                    ParticleManager.SetParticleControlEnt(static_particle, 0, enemy, ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", enemy.GetAbsOrigin(), true);
                    ParticleManager.SetParticleControlEnt(static_particle, 1, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
                    ParticleManager.ReleaseParticleIndex(static_particle);
                    ApplyDamage({
                        victim: enemy,
                        damage: this.static_damage,
                        damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
                        damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                        attacker: this.GetCasterPlus(),
                        ability: this.GetItemPlus()
                    });
                    enemy.AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_static_charge_slow", {
                        duration: this.static_slow_duration * (1 - enemy.GetStatusResistance())
                    });
                    unit_count = unit_count + 1;
                    if ((unit_count >= this.static_strikes && this.static_strikes > 0)) {
                        return;
                    }
                }
            }
            this.bStaticCooldown = true;
            this.StartIntervalThink(this.static_cooldown);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.TOOLTIP)
    CC_OnTooltip(): number {
        return this.static_chance;
    }
}
@registerModifier()
export class modifier_item_imba_static_charge_slow extends BaseModifier_Plus {
    public static_slow: any;
    GetTexture(): string {
        if (this.GetItemPlus()) {
            if (this.GetItemPlus().GetAbilityName() == "item_imba_mjollnir") {
                return "item_mjollnir";
            } else if (this.GetItemPlus().GetAbilityName() == "item_imba_jarnbjorn") {
                return "modifiers/imba_jarnbjorn";
            }
        }
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        if (this.GetItemPlus()) {
            this.static_slow = this.GetItemPlus().GetSpecialValueFor("static_slow") * (-1);
        } else {
            this.static_slow = 0;
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.static_slow;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.static_slow;
    }
}

