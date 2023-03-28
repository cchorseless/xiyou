
import { GameFunc } from "../../../GameFunc";
import { NetTablesHelper } from "../../../helper/NetTablesHelper";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
export class imba_invoker {
    static update_orbs(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, invoked_orb: string, particle_path: string) {
        if (IsServer()) {
            // imba_invoker.orb_sync = false;
            let invokerinfo = caster.TempData()
            const max_count = 3;
            const attach_hitlocation = ["attach_orb1", "attach_orb2", "attach_orb3"];
            if (invokerinfo.invoked_orbs == undefined) {
                invokerinfo.invoked_orbs = []
            }
            if (invokerinfo.invoked_orbs_particle == undefined) {
                invokerinfo.invoked_orbs_particle = []
            }
            if (invokerinfo.invoked_orbs_particle_attachindex == undefined) {
                invokerinfo.invoked_orbs_particle_attachindex = 0
            }
            else {
                invokerinfo.invoked_orbs_particle_attachindex += 1
                if (invokerinfo.invoked_orbs_particle_attachindex >= 3) {
                    invokerinfo.invoked_orbs_particle_attachindex = 0
                }
            }
            let invoked_orbs = caster.TempData<IBaseAbility_Plus[]>().invoked_orbs;
            invoked_orbs.push(ability);
            let remove_orb: IBaseAbility_Plus;
            if (invoked_orbs.length > max_count) {
                remove_orb = invoked_orbs.shift();
            }
            let invoked_orbs_particle = caster.TempData<ParticleID[]>().invoked_orbs_particle;
            const attach_point = attach_hitlocation[invokerinfo.invoked_orbs_particle_attachindex]
            let p = ResHelper.CreateParticleEx(particle_path, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, caster, caster);
            invoked_orbs_particle.push(p);
            ParticleManager.SetParticleControlEnt(p, 1, caster, ParticleAttachment_t.PATTACH_POINT_FOLLOW, attach_point, caster.GetAbsOrigin(), false);
            if (invoked_orbs_particle.length > max_count) {
                ParticleManager.ClearParticle(invoked_orbs_particle.shift(), false);
            }
            this.update_orb_modifiers(caster, ability, remove_orb);
            this.update_base_attack(caster);
        }
    }
    static update_orb_modifiers(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, orb_to_remove: IBaseAbility_Plus) {
        let orb_modifier = undefined;
        if (orb_to_remove != null) {
            if (orb_to_remove.GetAbilityName() == "imba_invoker_quas") {
                orb_modifier = "modifier_imba_invoker_quas";
            } else if (orb_to_remove.GetAbilityName() == "imba_invoker_wex") {
                orb_modifier = "modifier_imba_invoker_wex";
            } else if (orb_to_remove.GetAbilityName() == "imba_invoker_exort") {
                orb_modifier = "modifier_imba_invoker_exort";
            }
        }
        if (orb_modifier != undefined) {
            let modifiers = caster.FindAllModifiersByName(orb_modifier);
            let oldest;
            for (let i = 0; i <= 2; i++) {
                if (oldest == undefined) {
                    oldest = modifiers[i];
                } else if (modifiers[i] != undefined && modifiers[i].GetCreationTime() > oldest.GetCreationTime()) {
                    oldest = modifiers[i];
                }
            }
            if (oldest) {
                caster.RemoveModifierByName(oldest.GetName());
            }
        }
        let new_orb = ability.GetAbilityName();
        if (new_orb == "imba_invoker_quas") {
            let bonus_strength = ability.GetSpecialValueFor("bonus_strength");
            let health_regen_per_instance = ability.GetSpecialValueFor("health_regen_per_instance");
            caster.AddNewModifier(caster, ability, "modifier_imba_invoker_quas", {
                duration: -1,
                bonus_strength: bonus_strength,
                health_regen_per_instance: health_regen_per_instance
            });
            NetTablesHelper.SetDotaEntityData(ability.GetEntityIndex(), {
                quas_bonus_strength: bonus_strength,
                quas_health_regen_per_instance: health_regen_per_instance
            }, "quas")
            // CustomNetTables.SetTableValue("player_table", "quas" + caster.GetPlayerID(), );
        } else if (new_orb == "imba_invoker_wex") {
            let bonus_agility = ability.GetSpecialValueFor("bonus_agility");
            let move_speed_per_instance = ability.GetSpecialValueFor("move_speed_per_instance");
            let attack_speed_per_instance = ability.GetSpecialValueFor("attack_speed_per_instance");
            caster.AddNewModifier(caster, ability, "modifier_imba_invoker_wex", {
                duration: -1,
                bonus_agility: bonus_agility,
                move_speed_per_instance: move_speed_per_instance,
                attack_speed_per_instance: attack_speed_per_instance
            });
            NetTablesHelper.SetDotaEntityData(ability.GetEntityIndex(), {
                // CustomNetTables.SetTableValue("player_table", "wex" + caster.GetPlayerID(), {
                wex_bonus_agility: bonus_agility,
                wex_move_speed_per_instance: move_speed_per_instance,
                wex_attack_speed_per_instance: attack_speed_per_instance
            }), "wex";
        } else if (new_orb == "imba_invoker_exort") {
            let bonus_intelligence = ability.GetSpecialValueFor("bonus_intelligence");
            let bonus_damage_per_instance = ability.GetSpecialValueFor("bonus_damage_per_instance");
            caster.AddNewModifier(caster, ability, "modifier_imba_invoker_exort", {
                duration: -1,
                bonus_intelligence: bonus_intelligence,
                bonus_damage_per_instance: bonus_damage_per_instance
            });
            NetTablesHelper.SetDotaEntityData(ability.GetEntityIndex(), {
                // CustomNetTables.SetTableValue("player_table", "exort" + caster.GetPlayerID(), {
                exort_bonus_intelligence: bonus_intelligence,
                exort_bonus_damage_per_instance: bonus_damage_per_instance
            }, "exort");
        }
    }
    static update_base_attack(caster: IBaseNpc_Plus) {
        let quas = 0;
        let wex = 0;
        let exort = 0;
        if ((!caster.GetRangedProjectileName().includes('invoker', 0))) {
            return;
        }
        let invoked_orbs = caster.TempData<IBaseAbility_Plus[]>().invoked_orbs;
        for (const orb of (invoked_orbs)) {
            let orb_type = orb.GetAbilityName();
            if (orb_type == 'imba_invoker_quas') {
                quas = quas + 1;
            } else if (orb_type == 'imba_invoker_wex') {
                wex = wex + 1;
            } else if (orb_type == 'imba_invoker_exort') {
                exort = exort + 1;
            }
        }
        let quas_attack = "particles/units/heroes/hero_invoker/invoker_base_attack.vpcf";
        let wex_attack = "particles/units/heroes/hero_invoker/invoker_base_attack.vpcf";
        let exort_attack = "particles/units/heroes/hero_invoker/invoker_base_attack.vpcf";
        let all_attack = "particles/units/heroes/hero_invoker/invoker_base_attack.vpcf";
        if ((caster as any).bPersona) {
            quas_attack = "particles/units/heroes/hero_invoker_kid/invoker_kid_base_attack_quas.vpcf";
            wex_attack = "particles/units/heroes/hero_invoker_kid/invoker_kid_base_attack_wex.vpcf";
            exort_attack = "particles/units/heroes/hero_invoker_kid/invoker_kid_base_attack_exort.vpcf";
            all_attack = "particles/units/heroes/hero_invoker_kid/invoker_kid_base_attack_all.vpcf";
        }
        if (quas >= 2) {
            caster.SetRangedProjectileName(quas_attack);
        } else if (wex >= 2) {
            caster.SetRangedProjectileName(wex_attack);
        } else if (exort >= 2) {
            caster.SetRangedProjectileName(exort_attack);
        } else if (quas == 1 && wex == 1 && exort == 1) {
            caster.SetRangedProjectileName(all_attack);
        }
    }
}
@registerAbility()
export class imba_invoker_quas extends BaseAbility_Plus {
    ProcsMagicStick(): boolean {
        return false;
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        // CustomNetTables.SetTableValue("player_table", "quas_level" + tostring(this.GetCasterPlus().GetPlayerID()), {
        //     1: this.GetLevel()
        // });
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (math.random(0, 100) >= 50) {
                caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
            } else {
                caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
            }
            imba_invoker.update_orbs(caster, this, "imba_invoker_quas", "particles/units/heroes/hero_invoker/invoker_quas_orb.vpcf");
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_quas extends BaseModifier_Plus {
    public bonus_strength: number;
    public health_regen_per_instance: any;
    IsBuff() {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.bonus_strength = kv.bonus_strength;
            this.health_regen_per_instance = kv.health_regen_per_instance;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.GetAbilityPlus().GetEntityIndex(), "quas") || {}
            this.bonus_strength = net_table.quas_bonus_strength;
            this.health_regen_per_instance = net_table.quas_health_regen_per_instance;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    CC_GetModifierBonusStats_Strength(): number {
        return this.bonus_strength;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.health_regen_per_instance;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerAbility()
export class imba_invoker_wex extends BaseAbility_Plus {
    ProcsMagicStick(): boolean {
        return false;
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        // CustomNetTables.SetTableValue("player_table", "wex_level" + tostring(this.GetCasterPlus().GetPlayerID()), {
        //     1: this.GetLevel()
        // });
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (math.random(0, 100) >= 50) {
                caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
            } else {
                caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
            }
            imba_invoker.update_orbs(caster, this, "imba_invoker_wex", "particles/units/heroes/hero_invoker/invoker_wex_orb.vpcf");
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_wex extends BaseModifier_Plus {
    public bonus_agility: number;
    public move_speed_per_instance: number;
    public attack_speed_per_instance: number;
    IsBuff() {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            3: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.bonus_agility = kv.bonus_agility;
            this.move_speed_per_instance = kv.move_speed_per_instance;
            this.attack_speed_per_instance = kv.attack_speed_per_instance;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.GetAbilityPlus().GetEntityIndex(), "wex") || {}
            this.bonus_agility = net_table.wex_bonus_agility;
            this.move_speed_per_instance = net_table.wex_move_speed_per_instance;
            this.attack_speed_per_instance = net_table.wex_attack_speed_per_instance;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    CC_GetModifierBonusStats_Agility(): number {
        return this.bonus_agility;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.move_speed_per_instance;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.attack_speed_per_instance;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerAbility()
export class imba_invoker_exort extends BaseAbility_Plus {
    ProcsMagicStick(): boolean {
        return false;
    }
    OnUpgrade(): void {
        if (!IsServer()) {
            return;
        }
        // CustomNetTables.SetTableValue("player_table", "exort_level" + tostring(this.GetCasterPlus().GetPlayerID()), {
        //     1: this.GetLevel()
        // });
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            if (math.random(0, 100) >= 50) {
                caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_1);
            } else {
                caster.StartGesture(GameActivity_t.ACT_DOTA_OVERRIDE_ABILITY_2);
            }
            imba_invoker.update_orbs(caster, this, "imba_invoker_exort", "particles/units/heroes/hero_invoker/invoker_exort_orb.vpcf");
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_exort extends BaseModifier_Plus {
    public bonus_intelligence: number;
    public bonus_damage_per_instance: number;
    IsBuff() {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.bonus_intelligence = kv.bonus_intelligence;
            this.bonus_damage_per_instance = kv.bonus_damage_per_instance;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.GetAbilityPlus().GetEntityIndex(), "exort") || {}
            this.bonus_intelligence = net_table.exort_bonus_intelligence;
            this.bonus_damage_per_instance = net_table.exort_bonus_damage_per_instance;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intelligence;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.BASEATTACK_BONUSDAMAGE)
    CC_GetModifierBaseAttack_BonusDamage(): number {
        return this.bonus_damage_per_instance;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
}
@registerModifier()
export class modifier_imba_invoker_aghanim_buff extends BaseModifier_Plus {
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return false;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let quas = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas");
            let wex = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex");
            let exort = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort");
            quas.SetLevel(quas.GetLevel() + 1);
            wex.SetLevel(wex.GetLevel() + 1);
            exort.SetLevel(exort.GetLevel() + 1);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        let quas = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas");
        let wex = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex");
        let exort = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort");
        quas.SetLevel(quas.GetLevel() - 1);
        wex.SetLevel(wex.GetLevel() - 1);
        exort.SetLevel(exort.GetLevel() - 1);
    }
}
@registerAbility()
export class imba_invoker_invoke extends BaseAbility_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    IsInnateAbility() {
        return true;
    }
    OnInventoryContentsChanged(): void {
        if (IsServer()) {
            if (this.GetCasterPlus().HasScepter() && (!this.GetCasterPlus().HasModifier("modifier_imba_invoker_aghanim_buff"))) {
                this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_invoker_aghanim_buff", {
                    duration: -1
                });
            } else if (!this.GetCasterPlus().HasScepter() && this.GetCasterPlus().HasModifier("modifier_imba_invoker_aghanim_buff")) {
                this.GetCasterPlus().RemoveModifierByName("modifier_imba_invoker_aghanim_buff");
            }
        }
    }
    GetCooldown(iLevel: number): number {
        let caster = this.GetCasterPlus();
        let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel();
        let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel();
        let exort_level = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel();
        let orb_levels = math.min(quas_level, 7) + math.min(wex_level, 7) + math.min(exort_level, 7);
        let cdr = this.GetSpecialValueFor("cooldown_reduction_per_orb");
        return super.GetCooldown(iLevel) - (cdr * orb_levels);
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability_level = this.GetLevel() - 1;
            let max_invoked_spells = this.GetLevelSpecialValueFor("max_invoked_spells", ability_level);
            let invoker_empty1 = "invoker_empty1";
            let invoker_empty2 = "invoker_empty2";
            let spell_to_be_invoked;
            let quas_orbs = caster.FindAllModifiersByName("modifier_imba_invoker_quas");
            let wex_orbs = caster.FindAllModifiersByName("modifier_imba_invoker_wex");
            let exort_orbs = caster.FindAllModifiersByName("modifier_imba_invoker_exort");
            let num_quas_orbs = (quas_orbs.length);
            let num_wex_orbs = (wex_orbs.length);
            let num_exort_orbs = (exort_orbs.length);
            caster.EmitSound("Hero_Invoker.Invoke");
            if (num_quas_orbs + num_wex_orbs + num_exort_orbs == 3) {
                let quas_particle_effect_color = Vector(0, 0, 255);
                let wex_particle_effect_color = Vector(255, 0, 255);
                let exort_particle_effect_color = Vector(255, 102, 0);
                let invoke_particle_effect = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_invoke.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
                ParticleManager.SetParticleControl(invoke_particle_effect, 2, ((quas_particle_effect_color * num_quas_orbs) + (wex_particle_effect_color * num_wex_orbs) + (exort_particle_effect_color * num_exort_orbs)) / 3 as Vector);
                if (num_quas_orbs == 3) {
                    spell_to_be_invoked = "imba_invoker_cold_snap";
                } else if (num_quas_orbs == 2 && num_wex_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_ghost_walk";
                } else if (num_quas_orbs == 2 && num_exort_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_ice_wall";
                } else if (num_wex_orbs == 3) {
                    spell_to_be_invoked = "imba_invoker_emp";
                } else if (num_wex_orbs == 2 && num_quas_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_tornado";
                } else if (num_wex_orbs == 2 && num_exort_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_alacrity";
                } else if (num_exort_orbs == 3) {
                    spell_to_be_invoked = "imba_invoker_sun_strike";
                } else if (num_exort_orbs == 2 && num_quas_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_forge_spirit";
                } else if (num_exort_orbs == 2 && num_wex_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_chaos_meteor";
                } else if (num_quas_orbs == 1 && num_wex_orbs == 1 && num_exort_orbs == 1) {
                    spell_to_be_invoked = "imba_invoker_deafening_blast";
                }
                let invoker_slot1 = caster.GetAbilityByIndex(3).GetAbilityName();
                if (max_invoked_spells == 1 && invoker_slot1 != spell_to_be_invoked) {
                    caster.SwapAbilities(invoker_slot1, spell_to_be_invoked, false, true);
                    caster.FindAbilityByName(spell_to_be_invoked).SetLevel(1);
                } else if (max_invoked_spells == 2 && invoker_slot1 != spell_to_be_invoked) {
                    if (invoker_slot1 != invoker_empty1) {
                        caster.SwapAbilities(invoker_empty1, invoker_slot1, true, false);
                    }
                    let invoker_slot2 = caster.GetAbilityByIndex(4).GetAbilityName();
                    if (invoker_slot2 != invoker_empty2) {
                        caster.SwapAbilities(invoker_empty2, invoker_slot2, true, false);
                    }
                    caster.SwapAbilities(spell_to_be_invoked, invoker_empty1, true, false);
                    caster.SwapAbilities(invoker_slot1, invoker_empty2, true, false);
                    let invoked_spell = caster.FindAbilityByName(spell_to_be_invoked);
                    if (invoked_spell != undefined) {
                        invoked_spell.SetLevel(1);
                    } else {
                    }
                    if (spell_to_be_invoked == invoker_slot1 && invoker_slot2 == invoker_empty2) {
                        this.EndCooldown();
                        caster.GiveMana(this.GetManaCost(-1));
                    } else if (spell_to_be_invoked == invoker_slot2) {
                        this.EndCooldown();
                        caster.GiveMana(this.GetManaCost(-1));
                    }
                } else {
                    this.EndCooldown();
                    caster.GiveMana(this.GetManaCost(-1));
                }
            } else {
                this.EndCooldown();
                caster.GiveMana(this.GetManaCost(-1));
            }
        }
    }
    OnUpgrade(): void {
        if (IsServer()) {
            if (this.caster == undefined) {
                this.caster = this.GetCasterPlus();
            }
            if (this.ability == undefined) {
                this.ability = this.caster.findAbliityPlus<imba_invoker_invoke>("imba_invoker_invoke");
            }
            if (this.caster.HasModifier("modifier_imba_invoker_invoke_buff")) {
                this.caster.RemoveModifierByName("modifier_imba_invoker_invoke_buff");
            }
            this.caster.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_invoke_buff", {
                duration: -1
            });
        }
    }
    // Invoke(caster:IBaseNpc_Plus) {
    //     if (IsServer()) {
    //         let ability = caster.findAbliityPlus("invoker_invoke");
    //         let ability_level = ability.GetLevel() - 1;
    //         let invoker_empty1 = "invoker_empty1";
    //         let invoker_empty2 = "invoker_empty2";
    //         let spell_to_be_invoked;
    //         let quas_orbs = caster.FindAllModifiersByName("modifier_invoker_quas_instance");
    //         let wex_orbs = caster.FindAllModifiersByName("modifier_invoker_wex_instance");
    //         let exort_orbs = caster.FindAllModifiersByName("modifier_invoker_exort_instance");
    //         let num_quas_orbs = table.getn(quas_orbs);
    //         let num_wex_orbs = table.getn(wex_orbs);
    //         let num_exort_orbs = table.getn(exort_orbs);
    //         if (num_quas_orbs + num_wex_orbs + num_exort_orbs == 3) {
    //             if (num_quas_orbs == 3) {
    //                 spell_to_be_invoked = "imba_invoker_cold_snap";
    //             } else if (num_quas_orbs == 2 && num_wex_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_ghost_walk";
    //             } else if (num_quas_orbs == 2 && num_exort_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_ice_wall";
    //             } else if (num_wex_orbs == 3) {
    //                 spell_to_be_invoked = "imba_invoker_emp";
    //             } else if (num_wex_orbs == 2 && num_quas_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_tornado";
    //             } else if (num_wex_orbs == 2 && num_exort_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_alacrity";
    //             } else if (num_exort_orbs == 3) {
    //                 spell_to_be_invoked = "imba_invoker_sun_strike";
    //             } else if (num_exort_orbs == 2 && num_quas_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_forge_spirit";
    //             } else if (num_exort_orbs == 2 && num_wex_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_chaos_meteor";
    //             } else if (num_quas_orbs == 1 && num_wex_orbs == 1 && num_exort_orbs == 1) {
    //                 spell_to_be_invoked = "imba_invoker_deafening_blast";
    //             }
    //             let invoker_slot1 = caster.GetAbilityByIndex(3).GetAbilityName();
    //             let invoker_slot2 = caster.GetAbilityByIndex(4).GetAbilityName();
    //             if (invoker_slot1 == invoker_empty1 && invoker_slot2 == invoker_empty2) {
    //                 caster.SwapAbilities(spell_to_be_invoked, invoker_slot2, true, false);
    //             } else if (invoker_slot1 == invoker_empty1) {
    //                 caster.SwapAbilities(spell_to_be_invoked, invoker_empty1, true, false);
    //             } else if (invoker_slot1 == invoker_empty2) {
    //                 caster.SwapAbilities(spell_to_be_invoked, invoker_empty2, true, false);
    //             } else if (invoker_slot2 == invoker_empty1) {
    //                 caster.SwapAbilities(spell_to_be_invoked, invoker_empty1, true, false);
    //             } else if (invoker_slot2 == invoker_empty2) {
    //                 caster.SwapAbilities(spell_to_be_invoked, invoker_empty2, true, false);
    //             } else {
    //                 caster.SwapAbilities(spell_to_be_invoked, invoker_slot2, true, false);
    //             }
    //             let invoked_spell = caster.FindAbilityByName(spell_to_be_invoked);
    //             if (invoked_spell != undefined) {
    //                 invoked_spell.SetLevel(1);
    //             } else {
    //             }
    //             if (spell_to_be_invoked == invoker_slot1 && invoker_slot2 == invoker_empty2) {
    //                 ability.EndCooldown();
    //                 caster.GiveMana(ability.GetManaCost(-1));
    //             }
    //             if (spell_to_be_invoked == invoker_slot2) {
    //                 ability.EndCooldown();
    //                 caster.GiveMana(ability.GetManaCost(-1));
    //             }
    //         }
    //     }
    // }
}
@registerModifier()
export class modifier_imba_invoker_invoke_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public spell_amp: any;
    public int_buff: any;
    public magic_resist: any;
    public cooldown_reduction: number;
    public spell_lifesteal: any;
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            if (this.ability == undefined) {
                // TODO
                this.ability = this.caster.findAbliityPlus("invoker_invoke");
            }
            let invoke_lvl = this.ability.GetLevel() - 1;
            this.spell_amp = this.ability.GetLevelSpecialValueFor("bonus_spellpower", invoke_lvl);
            this.int_buff = this.ability.GetLevelSpecialValueFor("bonus_intellect", invoke_lvl);
            this.magic_resist = this.ability.GetLevelSpecialValueFor("magic_resistance_pct", invoke_lvl);
            this.cooldown_reduction = this.ability.GetLevelSpecialValueFor("cooldown_reduction_pct", invoke_lvl);
            this.spell_lifesteal = this.ability.GetLevelSpecialValueFor("spell_lifesteal", invoke_lvl);
            // CustomGameEventManager.Send_ServerToPlayer(PlayerResource.GetPlayer(this.caster.GetPlayerID()), "invoker_helper", {
            //     ability_index: this.ability.GetAbilityIndex()
            // });
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            4: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        return this.spell_amp;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_RESISTANCE_BONUS)
    CC_GetModifierMagicalResistanceBonus(p_0: ModifierAttackEvent,): number {
        return this.magic_resist;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.int_buff;
    }
    GetCustomCooldownReductionStacking() {
        return this.cooldown_reduction;
    }
    GetModifierSpellLifesteal() {
        return this.spell_lifesteal;
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(kv: ModifierAbilityEvent): void {
        if (IsServer()) {
            let caster = this.GetParentPlus();
            if (kv.unit == caster) {
                if (kv.ability.GetAbilityName() == "invoker_invoke") {
                    // imba_invoker_invoke.Invoke(caster);
                }
            }
        }
    }
}
@registerAbility()
export class imba_invoker_sun_strike extends BaseAbility_Plus {
    ability_particle_effect = "particles/units/heroes/hero_invoker/invoker_sun_strike.vpcf"
    ability_outer_beam_effect = "particles/hero/invoker/sunstrike/imba_invoker_sun_strike_outer_beam.vpcf"
    ability_team_particle_effect = "particles/units/heroes/hero_invoker/invoker_sun_strike_team.vpcf"
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_SUN_STRIKE;
    }
    GetBehavior(): DOTA_ABILITY_BEHAVIOR | Uint64 {
        if (IsServer()) {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        } else {
            return DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_OPTIONAL_UNIT_TARGET + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AOE + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_IGNORE_BACKSWING;
        }
    }
    OnSpellStart(): void {
        if (!this.GetCasterPlus().HasAbility("imba_invoker_exort")) {
            return;
        }
        this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_SUN_STRIKE);
        let bCataclysm = this.GetCursorTarget() == this.GetCasterPlus();
        if (bCataclysm && this.GetCasterPlus().HasScepter()) {
            bCataclysm = true;
            this.StartCooldown(this.GetSpecialValueFor("cataclysm_cooldown") * this.GetCasterPlus().GetCooldownReduction());
        } else {
            bCataclysm = false;
        }
        BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_imba_invoker_sun_strike_thinker", {
            duration: this.GetSpecialValueFor("delay"),
            area_of_effect: this.GetSpecialValueFor("area_of_effect"),
            target_point_x: this.GetCursorPosition().x,
            target_point_y: this.GetCursorPosition().y,
            target_point_z: this.GetCursorPosition().z,
            incinerate_duration: this.GetSpecialValueFor("incinerate_duration"),
            damage: this.GetLevelSpecialValueFor("damage", this.GetCasterPlus().findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1),
            bCataclysm: bCataclysm ? 1 : 0,
        }, this.GetCursorPosition(), this.GetCasterPlus().GetTeamNumber(), false);
    }
    CastSunStrike(kv: any) {
        let caster = kv.caster;
        let caster_team = kv.caster_team;
        let target_point = kv.target_point;
        let ability = kv.ability;
        let delay = kv.delay;
        let area_of_effect = kv.area_of_effect;
        let vision_distance = kv.vision_distance;
        let vision_duration = kv.vision_duration;
        let all_heroes: IBaseNpc_Plus[] = kv.all_heroes;
        let duration = delay + vision_duration;
        ability.CreateVisibilityNode(target_point, vision_distance, vision_duration);
        EmitSoundOnLocationWithCaster(target_point, "Hero_Invoker.SunStrike.Charge", caster);
        for (const hero of (all_heroes)) {
            if (hero.IsRealUnit()) {
                if (hero.GetTeam() == caster_team) {
                    if (hero.GetPlayerID() == caster.GetPlayerID()) {
                        BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike", {
                            duration: delay,
                            area_of_effect: area_of_effect,
                            target: hero.entindex()
                        }, target_point, caster.GetTeamNumber(), false);
                    } else {
                        BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike_beam_only", {
                            duration: delay,
                            area_of_effect: area_of_effect,
                            target: hero.entindex(),
                            show_beam: "true",
                            show_crater: "true"
                        }, target_point, caster.GetTeamNumber(), false);
                    }
                } else {
                    BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike_beam_only", {
                        duration: delay,
                        area_of_effect: area_of_effect,
                        target: hero.entindex(),
                        show_crater: "true"
                    }, target_point, caster.GetTeamNumber(), false);
                }
            }
        }
    }
    CastCataclysmSunStrike(kv: any) {
        let caster = kv.caster;
        let caster_team = kv.caster_team;
        let target_point: Vector = kv.target_point;
        let ability = kv.ability;
        let delay = kv.delay;
        let area_of_effect = kv.area_of_effect;
        let damage = kv.damage;
        let vision_distance = kv.vision_distance;
        let vision_duration = kv.vision_duration;
        let all_heroes: IBaseNpc_Plus[] = kv.all_heroes;
        let cooldown = kv.cooldown;
        let minimum_range = kv.minimum_range;
        let maximum_range = kv.maximum_range;
        let current_cooldown = ability.GetCooldownTime();
        let unaltered_cooldown = ability.GetCooldown(1);
        let cooldown_reduction_pct = current_cooldown / unaltered_cooldown;
        ability.StartCooldown(cooldown * cooldown_reduction_pct);
        EmitSoundOnLocationWithCaster(target_point, "Hero_Invoker.SunStrike.Charge", caster);
        for (const hero of (all_heroes)) {
            if (hero.IsRealUnit()) {
                if (hero.GetPlayerID() && hero.GetTeam() != caster.GetTeam() && hero.IsAlive()) {
                    let target_point1 = hero.GetAbsOrigin() + RandomVector(math.random(minimum_range, maximum_range)) as Vector;
                    let target_point2 = hero.GetAbsOrigin() - RandomVector(math.random(minimum_range, maximum_range)) as Vector;
                    ability.CreateVisibilityNode(target_point1, vision_distance, vision_duration);
                    ability.CreateVisibilityNode(target_point2, vision_distance, vision_duration);
                    EmitSoundOnLocationWithCaster(target_point1, "Hero_Invoker.Cataclysm.Ignite", caster);
                    EmitSoundOnLocationWithCaster(target_point2, "Hero_Invoker.Cataclysm.Ignite", caster);
                    for (const [_, hero2] of GameFunc.iPair(all_heroes)) {
                        if (hero2.GetPlayerID() == caster.GetPlayerID()) {
                            BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike_cataclysm", {
                                duration: delay,
                                area_of_effect: area_of_effect,
                                target: hero2.entindex()
                            }, target_point1, caster.GetTeamNumber(), false);
                            BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike_cataclysm", {
                                duration: delay,
                                area_of_effect: area_of_effect,
                                target: hero2.entindex()
                            }, target_point2, caster.GetTeamNumber(), false);
                        } else {
                            BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike_beam_only", {
                                duration: delay,
                                area_of_effect: area_of_effect,
                                target: hero2.entindex(),
                                show_beam: "true",
                                show_crater: "true"
                            }, target_point1, caster.GetTeamNumber(), false);
                            BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_sun_strike_beam_only", {
                                duration: delay,
                                area_of_effect: area_of_effect,
                                target: hero2.entindex(),
                                show_beam: "true",
                                show_crater: "true"
                            }, target_point2, caster.GetTeamNumber(), false);
                        }
                    }
                }
            }
        }
    }
    OnHit(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, enemies_hit: IBaseNpc_Plus[], damage: number) {
        let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
        damage_table.attacker = caster;
        damage_table.ability = ability;
        damage_table.damage_type = ability.GetAbilityDamageType();
        damage_table.damage = damage / enemies_hit.length;
        for (const hero of (enemies_hit)) {
            damage_table.victim = hero;
            ApplyDamage(damage_table);
        }
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("area_of_effect");
    }
}
@registerModifier()
export class modifier_imba_invoker_sun_strike_thinker extends BaseModifier_Plus {
    public area_of_effect: any;
    public damage: number;
    public vision_distance: number;
    public vision_duration: number;
    public cataclysm_min_range: number;
    public cataclysm_max_range: number;
    public incinerate_duration: number;
    public mini_beam_radius: number;
    public bCataclysm: any;
    public sun_strike_points: Vector[];
    public target_point: any;
    public cataclysm_point: any;
    BeCreated(kv: any): void {
        if (!IsServer()) {
            return;
        }
        this.area_of_effect = this.GetSpecialValueFor("area_of_effect");
        this.damage = this.GetAbilityPlus().GetLevelSpecialValueFor("damage", this.GetCasterPlus().findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel());
        this.vision_distance = this.GetSpecialValueFor("vision_distance");
        this.vision_duration = this.GetSpecialValueFor("vision_duration");
        this.cataclysm_min_range = this.GetSpecialValueFor("cataclysm_min_range");
        this.cataclysm_max_range = this.GetSpecialValueFor("cataclysm_max_range");
        this.incinerate_duration = this.GetSpecialValueFor("incinerate_duration");
        this.mini_beam_radius = this.GetSpecialValueFor("incinerate_beam_radius");
        this.bCataclysm = kv.bCataclysm;
        this.sun_strike_points = [];
        if ((kv.target_point_x && kv.target_point_y && kv.target_point_z)) {
            this.target_point = Vector(kv.target_point_x, kv.target_point_y, kv.target_point_z);
        }
        if (!this.target_point || this.target_point == this.GetCasterPlus().GetAbsOrigin()) {
            this.target_point = this.GetCasterPlus().GetAbsOrigin() + this.GetCasterPlus().GetForwardVector();
        }
        if (!this.bCataclysm || this.bCataclysm == 0) {
            EmitSoundOnLocationForAllies(this.target_point, "Hero_Invoker.SunStrike.Charge", this.GetCasterPlus());
            AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.target_point, this.vision_distance, this.vision_duration, false);
            let sun_strike_beam = undefined;
            if (this.target_point) {
                sun_strike_beam = ParticleManager.CreateParticleForTeam("particles/units/heroes/hero_invoker/invoker_sun_strike_team.vpcf", ParticleAttachment_t.PATTACH_POINT, this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
                ParticleManager.SetParticleControl(sun_strike_beam, 0, this.target_point);
                ParticleManager.SetParticleControl(sun_strike_beam, 1, Vector(this.area_of_effect, 0, 0));
                this.AddParticle(sun_strike_beam, false, false, -1, false, false);
                this.sun_strike_points.push(this.target_point);
            } else {
            }
        } else {
            this.cataclysm_point = undefined;
            let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, FIND_UNITS_EVERYWHERE, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE, FindOrder.FIND_ANY_ORDER, false) as IBaseNpc_Plus[];
            for (const enemy of (enemies)) {
                if ((enemy.IsRealUnit() || enemy.IsTempestDouble())) {
                    for (let beam = 1; beam <= 2; beam++) {
                        if (beam == 1) {
                            this.cataclysm_point = enemy.GetAbsOrigin() + RandomVector(this.cataclysm_min_range);
                        } else if (beam == 2) {
                            this.cataclysm_point = RotatePosition(enemy.GetAbsOrigin(), QAngle(0, RandomInt(120, 240), 0), this.cataclysm_point);
                        }
                        EmitSoundOnLocationWithCaster(this.cataclysm_point, "Hero_Invoker.SunStrike.Charge", this.GetCasterPlus());
                        AddFOWViewer(this.GetCasterPlus().GetTeamNumber(), this.cataclysm_point, this.vision_distance, this.vision_duration, false);
                        let sun_strike_beam = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_sun_strike_team.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                        ParticleManager.SetParticleControl(sun_strike_beam, 0, this.cataclysm_point);
                        ParticleManager.SetParticleControl(sun_strike_beam, 1, Vector(this.area_of_effect, 0, 0));
                        this.AddParticle(sun_strike_beam, false, false, -1, false, false);
                        this.sun_strike_points.push(this.cataclysm_point);
                    }
                }
            }
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (let location = 0; location < GameFunc.GetCount(this.sun_strike_points); location++) {
            EmitSoundOnLocationWithCaster(this.sun_strike_points[location], "Hero_Invoker.SunStrike.Ignite", this.GetCasterPlus());
            let sun_strike_crater = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_sun_strike.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(sun_strike_crater, 0, this.sun_strike_points[location]);
            ParticleManager.SetParticleControl(sun_strike_crater, 1, Vector(this.area_of_effect, 0, 0));
            ParticleManager.ReleaseParticleIndex(sun_strike_crater);
            let nearby_enemy_units = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.sun_strike_points[location], undefined, this.area_of_effect + (this.mini_beam_radius / 2), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            let incinerate_modifier = undefined;
            if (GameFunc.GetCount(nearby_enemy_units) > 0) {
                for (const [_, enemy] of GameFunc.iPair(nearby_enemy_units)) {
                    if ((GetGroundPosition(enemy.GetAbsOrigin(), undefined) - this.sun_strike_points[location] as Vector).Length2D() <= this.area_of_effect) {
                        ApplyDamage({
                            victim: enemy,
                            damage: this.damage / GameFunc.GetCount(nearby_enemy_units),
                            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE,
                            damage_flags: DOTADamageFlag_t.DOTA_DAMAGE_FLAG_NONE,
                            attacker: this.GetCasterPlus(),
                            ability: this.GetAbilityPlus()
                        });
                    }
                    incinerate_modifier = enemy.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_invoker_sun_strike_incinerate", {
                        duration: this.incinerate_duration,
                        damage: this.damage
                    });
                    if (incinerate_modifier) {
                        incinerate_modifier.SetDuration(this.incinerate_duration * (1 - enemy.GetStatusResistance()), true);
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_sun_strike extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public target_point: any;
    public direction: any;
    public target: IBaseNpc_Plus;
    public ability: imba_invoker_sun_strike;
    public damage: number;
    public incinerate_duration: number;
    public mini_beam_radius: number;
    public area_of_effect: any;
    public degrees: any;
    public fierd_sunstrikes: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.target_point = this.GetParentPlus().GetAbsOrigin();
            this.direction = (this.target_point - this.caster.GetAbsOrigin() as Vector).Normalized();
            this.target = EntIndexToHScript(kv.target) as IBaseNpc_Plus;
            this.direction.z = 0;
            let invoker_exort = this.caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort");
            let exort_level = invoker_exort.GetLevel() - 1;
            this.ability = this.GetAbilityPlus();
            this.damage = this.ability.GetLevelSpecialValueFor("damage", exort_level);
            this.incinerate_duration = this.ability.GetSpecialValueFor("incinerate_duration");
            this.mini_beam_radius = this.ability.GetSpecialValueFor("incinerate_beam_radius");
            this.area_of_effect = kv.area_of_effect;
            this.degrees = 180 / 6;
            let sun_strike_beam = ParticleManager.CreateParticleForPlayer(this.ability.ability_team_particle_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
            ParticleManager.SetParticleControl(sun_strike_beam, 0, this.target_point);
            ParticleManager.SetParticleControl(sun_strike_beam, 1, Vector(this.area_of_effect, 0, 0));
            this.fierd_sunstrikes = 0;
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let small_target_point = this.target_point + (this.direction * this.mini_beam_radius);
            let sun_strike_beam = ParticleManager.CreateParticleForPlayer(this.ability.ability_outer_beam_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
            ParticleManager.SetParticleControl(sun_strike_beam, 0, small_target_point);
            let small_target_point2 = this.target_point - (this.direction * this.mini_beam_radius) as Vector;
            let sun_strike_beam2 = ParticleManager.CreateParticleForPlayer(this.ability.ability_outer_beam_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
            ParticleManager.SetParticleControl(sun_strike_beam2, 0, small_target_point2);
            this.fierd_sunstrikes = this.fierd_sunstrikes + 2;
            this.direction = RotatePosition(Vector(0, 0, 0), QAngle(0, this.degrees, 0), this.direction);
            if (this.fierd_sunstrikes == 12) {
                this.StartIntervalThink(-1);
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            let search_area = this.area_of_effect + (this.mini_beam_radius / 2);
            let nearby_enemy_units = FindUnitsInRadius(this.caster.GetTeam(), this.target_point, undefined, search_area, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            let hit_table: IBaseNpc_Plus[] = []
            if (nearby_enemy_units != undefined) {
                for (const [_, hero] of GameFunc.iPair(nearby_enemy_units)) {
                    hero.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_sun_strike_incinerate", {
                        duration: this.incinerate_duration,
                        damage: this.damage
                    });
                    if ((this.target_point - hero.GetAbsOrigin() as Vector).Length2D() <= this.area_of_effect) {
                        hit_table.push(hero);
                    }
                }
            }
            if (hit_table.length > 1) {
                this.ability.OnHit(this.caster, this.ability, hit_table, this.damage);
            }
            EmitSoundOnLocationWithCaster(this.target_point, "Hero_Invoker.SunStrike.Ignite", this.caster);
            this.caster.StopSound("Hero_Invoker.SunStrike.Charge");
            let sun_strike_crater = ParticleManager.CreateParticleForPlayer(this.ability.ability_particle_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
            ParticleManager.SetParticleControl(sun_strike_crater, 0, this.target_point);
            ParticleManager.SetParticleControl(sun_strike_crater, 1, Vector(this.area_of_effect, 0, 0));
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_sun_strike_cataclysm extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public target_point: any;
    public target: IBaseNpc_Plus;
    public ability: imba_invoker_sun_strike;
    public damage: number;
    public incinerate_duration: number;
    public area_of_effect: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.target_point = this.GetParentPlus().GetAbsOrigin();
            this.target = EntIndexToHScript(kv.target) as IBaseNpc_Plus;
            let invoker_exort = this.caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort");
            let exort_level = invoker_exort.GetLevel() - 1;
            this.ability = this.GetAbilityPlus();
            this.damage = this.ability.GetLevelSpecialValueFor("damage", exort_level);
            this.incinerate_duration = this.ability.GetSpecialValueFor("incinerate_duration");
            this.area_of_effect = kv.area_of_effect;
            let sun_strike_beam = ParticleManager.CreateParticleForPlayer(this.ability.ability_team_particle_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
            ParticleManager.SetParticleControl(sun_strike_beam, 0, this.target_point);
            ParticleManager.SetParticleControl(sun_strike_beam, 1, Vector(this.area_of_effect, 0, 0));
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            let sun_strike_crater = ParticleManager.CreateParticleForPlayer(this.ability.ability_team_particle_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
            ParticleManager.SetParticleControl(sun_strike_crater, 0, this.target_point);
            ParticleManager.SetParticleControl(sun_strike_crater, 1, Vector(this.area_of_effect, 0, 0));
            let nearby_enemy_units = FindUnitsInRadius(this.caster.GetTeam(), this.target_point, undefined, this.area_of_effect, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            if (nearby_enemy_units != undefined) {
                for (const [_, hero] of GameFunc.iPair(nearby_enemy_units)) {
                    hero.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_sun_strike_incinerate", {
                        duration: this.incinerate_duration,
                        damage: this.damage
                    });
                }
                this.ability.OnHit(this.caster, this.ability, nearby_enemy_units, this.damage);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_sun_strike_incinerate extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public incinerate_damage: number;
    public damage: number;
    public burn_dps: any;
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_fire_spirit_burn.vpcf";
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.SetStackCount(this.GetStackCount() + 1);
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.incinerate_damage = this.ability.GetSpecialValueFor("incinerate_dmg");
            this.damage = kv.damage;
            this.burn_dps = ((this.damage / 100) * this.incinerate_damage) / 5;
            this.StartIntervalThink(0.2 * (1 - this.GetParentPlus().GetStatusResistance()));
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
            damage_table.attacker = this.caster;
            damage_table.victim = this.GetParentPlus();
            damage_table.ability = this.ability;
            damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_PURE;
            damage_table.damage = this.burn_dps * this.GetStackCount();
            ApplyDamage(damage_table);
        }
    }
    BeRefresh(p_0: any,): void {
        if (IsServer()) {
            this.SetStackCount(this.GetStackCount() + 1);
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_sun_strike_beam_only extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public target_point: any;
    public ability: imba_invoker_sun_strike;
    public show_beam: any;
    public show_crater: any;
    public target: IBaseNpc_Plus;
    public area_of_effect: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.target_point = this.GetParentPlus().GetAbsOrigin();
            this.ability = this.GetAbilityPlus() as imba_invoker_sun_strike;
            this.show_beam = kv.show_beam;
            this.show_crater = kv.show_crater;
            this.target = EntIndexToHScript(kv.target) as IBaseNpc_Plus;
            this.area_of_effect = kv.area_of_effect;
            if (this.show_beam != undefined) {
                let sun_strike_beam = ParticleManager.CreateParticleForPlayer(this.ability.ability_team_particle_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
                ParticleManager.SetParticleControl(sun_strike_beam, 0, this.target_point);
                ParticleManager.SetParticleControl(sun_strike_beam, 1, Vector(this.area_of_effect, 0, 0));
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.show_crater != undefined) {
                let sun_strike_crater = ParticleManager.CreateParticleForPlayer(this.ability.ability_particle_effect, ParticleAttachment_t.PATTACH_POINT, this.target, PlayerResource.GetPlayer(this.target.GetPlayerID()));
                ParticleManager.SetParticleControl(sun_strike_crater, 0, this.target_point);
                ParticleManager.SetParticleControl(sun_strike_crater, 1, Vector(this.area_of_effect, 0, 0));
            }
        }
    }
}
@registerAbility()
export class imba_invoker_cold_snap extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_COLD_SNAP;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let ability = caster.findAbliityPlus<imba_invoker_cold_snap>("imba_invoker_cold_snap");
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let cold_snap_duration = ability.GetLevelSpecialValueFor("duration", quas_level);
            let freeze_duration = ability.GetLevelSpecialValueFor("freeze_duration", quas_level);
            let freeze_cooldown = ability.GetLevelSpecialValueFor("freeze_cooldown", quas_level);
            let freeze_damage = ability.GetLevelSpecialValueFor("freeze_damage", quas_level);
            let damage_trigger = ability.GetSpecialValueFor("damage_trigger");
            caster.EmitSound("Hero_Invoker.ColdSnap.Cast");
            target.EmitSound("Hero_Invoker.ColdSnap");
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_COLD_SNAP);
            if (target.GetTeam() != caster.GetTeam()) {
                if (target.TriggerSpellAbsorb(this)) {
                    return undefined;
                }
                target.AddNewModifier(caster, ability, "modifier_imba_invoker_cold_snap", {
                    duration: cold_snap_duration
                });
                target.AddNewModifier(caster, ability, "modifier_imba_invoker_cold_snap_stun_duration", {
                    duration: freeze_duration * (1 - target.GetStatusResistance())
                });
                target.AddNewModifier(caster, ability, "modifier_imba_invoker_cold_snap_cooldown", {
                    duration: freeze_cooldown * (1 - target.GetStatusResistance())
                });
                let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
                damage_table.attacker = caster;
                damage_table.victim = target;
                damage_table.ability = ability;
                damage_table.damage_type = ability.GetAbilityDamageType();
                damage_table.damage = freeze_damage;
                ApplyDamage(damage_table);
            } else {
                ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_cold_snap.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, caster);
                target.AddNewModifier(caster, ability, "modifier_imba_invoker_cold_snap_buff", {
                    duration: cold_snap_duration
                });
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_cold_snap extends BaseModifier_Plus {
    IsBuff() {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_cold_snap_status.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_TAKEDAMAGE
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_TAKEDAMAGE)
    CC_OnTakeDamage(kv: ModifierInstanceEvent): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = kv.unit;
            let ability = caster.findAbliityPlus<imba_invoker_cold_snap>("imba_invoker_cold_snap");
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            if (caster != target && target.HasModifier("modifier_imba_invoker_cold_snap")) {
                let freeze_duration = ability.GetLevelSpecialValueFor("freeze_duration", quas_level);
                let freeze_cooldown = ability.GetLevelSpecialValueFor("freeze_cooldown", quas_level);
                let freeze_damage = ability.GetLevelSpecialValueFor("freeze_damage", quas_level);
                let damage_trigger = ability.GetSpecialValueFor("damage_trigger");
                if (kv.damage >= damage_trigger && !target.HasModifier("modifier_imba_invoker_cold_snap_cooldown") && target.IsAlive()) {
                    target.AddNewModifier(caster, ability, "modifier_imba_invoker_cold_snap_stun_duration", {
                        duration: freeze_duration * (1 - target.GetStatusResistance())
                    });
                    target.AddNewModifier(caster, ability, "modifier_imba_invoker_cold_snap_cooldown", {
                        duration: freeze_cooldown * (1 - target.GetStatusResistance())
                    });
                    let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
                    damage_table.attacker = caster;
                    damage_table.victim = target;
                    damage_table.ability = ability;
                    damage_table.damage_type = ability.GetAbilityDamageType();
                    damage_table.damage = freeze_damage;
                    ApplyDamage(damage_table);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_cold_snap_cooldown extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
}
@registerModifier()
export class modifier_imba_invoker_cold_snap_stun_duration extends BaseModifier_Plus {
    public stun_effect: any;
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_cold_snap.vpcf";
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            let target = this.GetParentPlus();
            this.stun_effect = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_stunned.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, target);
            target.EmitSound("Hero_Invoker.ColdSnap.Freeze");
        }
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
        return state;
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.stun_effect != undefined) {
                ParticleManager.DestroyParticle(this.stun_effect, false);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_cold_snap_buff extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public quas_level: any;
    public freeze_duration: number;
    public freeze_damage: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_cold_snap_status.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = kv.attacker;
            let target = kv.target;
            if (target == this.GetParentPlus() && attacker.GetTeam() != this.GetCasterPlus().GetTeam() && attacker != this.GetParentPlus() && !attacker.IsOther() && !attacker.IsBuilding() && !attacker.IsMagicImmune()) {
                attacker.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_cold_snap_stun_duration", {
                    duration: this.freeze_duration * (1 - attacker.GetStatusResistance())
                });
                let damage_table: ApplyDamageOptions = {} as any
                damage_table.attacker = this.caster;
                damage_table.victim = attacker;
                damage_table.ability = this.ability;
                damage_table.damage_type = this.ability.GetAbilityDamageType();
                damage_table.damage = this.freeze_damage;
                ApplyDamage(damage_table);
            }
        }
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.quas_level = this.caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            this.freeze_duration = this.ability.GetLevelSpecialValueFor("freeze_duration", this.quas_level);
            this.freeze_damage = this.ability.GetLevelSpecialValueFor("freeze_damage", this.quas_level);
        }
    }
}
@registerAbility()
export class imba_invoker_ghost_walk extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_GHOST_WALK;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = caster.findAbliityPlus<imba_invoker_ghost_walk>("imba_invoker_ghost_walk");
            let ghost_walk_duration = ability.GetSpecialValueFor("duration");
            let area_of_effect = ability.GetSpecialValueFor("area_of_effect");
            let aura_fade_time = ability.GetSpecialValueFor("aura_fade_time");
            let invis_fade_time = ability.GetSpecialValueFor("invis_fade_time");
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            let self_slow = ability.GetLevelSpecialValueFor("self_slow", wex_level);
            let enemy_slow = ability.GetLevelSpecialValueFor("enemy_slow", quas_level);
            let aura_think_interval = ability.GetSpecialValueFor("aura_update_interval");
            let increase_max_movement_speed = ability.GetSpecialValueFor("increase_max_movement_speed");
            caster.StartGesture(GameActivity_t.ACT_DOTA_CAST_GHOST_WALK);
            caster.EmitSound("Hero_Invoker.GhostWalk");
            caster.AddNewModifier(caster, this, "modifier_imba_invoker_ghost_walk", {
                duration: ghost_walk_duration,
                self_slow: self_slow,
                enemy_slow: enemy_slow,
                max_movement_speed: increase_max_movement_speed,
                aura_fade_time: aura_fade_time,
                aura_think_interval: aura_think_interval,
                area_of_effect: area_of_effect,
                invis_fade_time: invis_fade_time
            });
            NetTablesHelper.SetDotaEntityData(this.GetEntityIndex(), {
                ghost_walk_self_slow: self_slow,
                ghost_walk_enemy_slow: enemy_slow
            })
            // CustomNetTables.SetTableValue("player_table", tostring(caster.GetPlayerID()), {
            // ghost_walk_self_slow: self_slow,
            // ghost_walk_enemy_slow: enemy_slow
            // });
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_ghost_walk extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public area_of_effect: any;
    public aura_fade_time: number;
    public enemy_slow: any;
    public self_slow: any;
    public ghost_walk_fade_time: number;
    public max_movement_speed: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_ghost_walk.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: Enum_MODIFIER_EVENT.ON_ATTACK,
            3: Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED,
            4: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL,
            5: MODIFIER_PROPERTY_MOVESPEED_MAX
        }
        return Object.values(funcs);
    } */
    GetModifierMoveSpeed_Max() {
        return this.max_movement_speed;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 100;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.area_of_effect = kv.area_of_effect;
            this.aura_fade_time = kv.aura_fade_time;
            this.enemy_slow = kv.enemy_slow;
            this.self_slow = kv.self_slow;
            this.ghost_walk_fade_time = kv.invis_fade_time;
            this.max_movement_speed = kv.max_movement_speed;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.GetAbilityPlus().GetEntityIndex()) || {}
            this.self_slow = net_table.ghost_walk_self_slow;
        }
    }
    BeRefresh(kv: any): void {
        if (IsServer()) {
            this.area_of_effect = kv.area_of_effect;
            this.aura_fade_time = kv.aura_fade_time;
            this.enemy_slow = kv.enemy_slow;
            this.self_slow = kv.self_slow;
            this.ghost_walk_fade_time = kv.invis_fade_time;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK)
    CC_OnAttack(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            if (this.parent == kv.attacker) {
                if (this.caster.HasModifier("modifier_imba_invoker_ghost_walk")) {
                    this.caster.RemoveModifierByName("modifier_imba_invoker_ghost_walk");
                }
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_EXECUTED)
    CC_OnAbilityExecuted(kv: ModifierAbilityEvent): void {
        if (IsServer()) {
            let caster = kv.unit;
            if (this.parent == caster) {
                if (caster.HasModifier("modifier_imba_invoker_ghost_walk")) {
                    this.caster.RemoveModifierByName("modifier_imba_invoker_ghost_walk");
                    caster.AddNewModifier(this.caster, this.GetAbilityPlus(), "modifier_invis_fade_ghost_walk", {
                        duration: this.ghost_walk_fade_time
                    });
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.self_slow;
    }
    IsAura(): boolean {
        return true;
    }
    GetModifierAura(): string {
        return "modifier_imba_invoker_ghost_walk_aura";
    }
    GetAuraRadius(): number {
        return this.area_of_effect;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    IsAuraActiveOnDeath(): boolean {
        return false;
    }
    GetAuraDuration(): number {
        return this.aura_fade_time;
    }
}
@registerModifier()
export class modifier_invis_fade_ghost_walk extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL
        }
        return Object.values(funcs);
    } */
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_INVISIBLE]: true,
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        }
        return state;
    }
    GetPriority(): modifierpriority {
        return modifierpriority.MODIFIER_PRIORITY_NORMAL;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INVISIBILITY_LEVEL)
    CC_GetModifierInvisibilityLevel(): number {
        return 100;
    }
}
@registerModifier()
export class modifier_imba_invoker_ghost_walk_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ghost_walk_effect_frost: any;
    public enemy_slow: any;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_ghost_walk_debuff.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            if (this.caster != this.parent) {
                this.ghost_walk_effect_frost = ResHelper.CreateParticleEx("particles/status_fx/status_effect_frost.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            }
            let quas_level = this.caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            this.enemy_slow = this.GetAbilityPlus().GetLevelSpecialValueFor("enemy_slow", quas_level);
            this.SetStackCount(this.enemy_slow);
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.ghost_walk_effect_frost != undefined) {
                ParticleManager.DestroyParticle(this.ghost_walk_effect_frost, false);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_invoker_alacrity extends BaseAbility_Plus {
    static ability_effect_path = "particles/hero/invoker/alacrity/imba_invoker_alacrity.vpcf"
    static buff_effect_path = "particles/units/heroes/hero_invoker/invoker_alacrity_buff.vpcf"
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ALACRITY;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let target = this.GetCursorTarget();
            let ability = this;
            let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            let exort_level = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            let alacrity_duration = ability.GetSpecialValueFor("duration");
            let bonus_attack_speed = ability.GetLevelSpecialValueFor("bonus_attack_speed", wex_level);
            let bonus_damage = ability.GetLevelSpecialValueFor("bonus_damage", exort_level);
            EmitSoundOn("Hero_Invoker.Alacrity", caster);
            if (caster.HasTalent("special_bonus_imba_unique_invoker_6") && target == caster) {
                let allHeroes = caster.GetPlayerRoot().BattleUnitManagerComp().GetAllBattleUnitAliveNpc(caster.GetTeam());
                for (const [_, hero] of GameFunc.iPair(allHeroes)) {
                    if (hero == caster) {
                        hero.AddNewModifier(caster, ability, "modifier_imba_invoker_alacrity", {
                            duration: alacrity_duration * 2,
                            bonus_attack_speed: bonus_attack_speed,
                            bonus_damage: bonus_damage
                        });
                    } else if (hero.GetTeam() == caster.GetTeam()) {
                        hero.AddNewModifier(caster, ability, "modifier_imba_invoker_alacrity", {
                            duration: alacrity_duration,
                            bonus_attack_speed: bonus_attack_speed,
                            bonus_damage: bonus_damage
                        });
                    }
                }
                let cooldown = caster.GetTalentValue("special_bonus_imba_unique_invoker_6", "alacrity_cooldown");
                let current_cooldown = ability.GetCooldownTime();
                let unaltered_cooldown = ability.GetCooldown(1);
                let cooldown_reduction_pct = current_cooldown / unaltered_cooldown;
                ability.StartCooldown(cooldown * cooldown_reduction_pct);
            } else {
                target.AddNewModifier(caster, ability, "modifier_imba_invoker_alacrity", {
                    duration: alacrity_duration,
                    bonus_attack_speed: bonus_attack_speed,
                    bonus_damage: bonus_damage
                });
            }
            NetTablesHelper.SetDotaEntityData(this.GetEntityIndex(), {
                alacrity_bonus_damage: bonus_damage,
                alacrity_attack_speed: bonus_attack_speed
            })
            // CustomNetTables.SetTableValue("player_table", tostring(caster.GetPlayerID()), {
            //     alacrity_bonus_damage: bonus_damage,
            //     alacrity_attack_speed: bonus_attack_speed
            // });
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            let ability = this;
            let chains = ExtraData.chains;
            let attacker = EntIndexToHScript(ExtraData.attacker) as IBaseNpc_Plus;
            let chain_distance = ability.GetSpecialValueFor("chain_distance");
            let damage_table: ApplyDamageOptions = {} as any;
            damage_table.attacker = attacker;
            damage_table.victim = target;
            damage_table.ability = ability;
            damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
            damage_table.damage = (ExtraData.damage / 100) * ability.GetSpecialValueFor("chain_damage_pct");
            ApplyDamage(damage_table);
            if (chains != undefined && chains > 0) {
                let caster = this.GetCasterPlus();
                let chain_particle = attacker.GetRangedProjectileName();
                let chain_enemies = FindUnitsInRadius(caster.GetTeam(), target.GetAbsOrigin(), undefined, chain_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(chain_enemies)) {
                    if (enemy != target) {
                        chains = chains - 1;
                        let attack_projectile;
                        attack_projectile = {
                            Target: enemy,
                            Source: target,
                            Ability: ability,
                            EffectName: chain_particle,
                            iMoveSpeed: 1200,
                            bDodgeable: true,
                            bVisibleToEnemies: true,
                            bReplaceExisting: false,
                            bProvidesVision: false,
                            ExtraData: {
                                damage: ExtraData.damage,
                                attacker: ExtraData.attacker,
                                3: chains
                            }
                        }
                        ProjectileManager.CreateTrackingProjectile(attack_projectile);
                        return;
                    }
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_alacrity extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public number_of_chains: number;
    public alacrity_effect: any;
    public bonus_damage: number;
    public bonus_attack_speed: number;
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsBuff() {
        return true;
    }
    GetEffectName(): string {
        return imba_invoker_alacrity.ability_effect_path;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE,
            3: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        this.ability = this.GetAbilityPlus();
        if (IsServer()) {
            this.parent = this.GetParentPlus();
            this.number_of_chains = this.ability.GetSpecialValueFor("number_of_chains");
            this.alacrity_effect = ResHelper.CreateParticleEx(imba_invoker_alacrity.buff_effect_path, ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.parent);
            this.bonus_damage = kv.bonus_damage;
            this.bonus_attack_speed = kv.bonus_attack_speed;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.ability.GetEntityIndex()) || {}
            this.bonus_damage = net_table.alacrity_bonus_damage || 0;
            this.bonus_attack_speed = net_table.alacrity_attack_speed || 0;
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            if (kv.attacker == parent && (!parent.IsIllusion())) {
                let caster = this.GetCasterPlus();
                let target = kv.target;
                if (parent.IsRangedAttacker()) {
                    this.Ranged_Chain_Attack(caster, parent, this.ability, kv.target, kv.damage, this.number_of_chains);
                } else {
                    this.Melee_Chain_lightning(caster, parent, this.ability, kv.target, kv.damage, this.number_of_chains);
                }
            }
        }
    }
    Ranged_Chain_Attack(caster: IBaseNpc_Plus, attacker: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, damage: number, chains: number) {

        if (IsServer()) {
            if (chains != undefined && chains > 0) {
                let chain_particle = attacker.GetRangedProjectileName();
                let chain_distance = ability.GetSpecialValueFor("chain_distance");
                let chain_enemies = FindUnitsInRadius(caster.GetTeam(), target.GetAbsOrigin(), undefined, chain_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(chain_enemies)) {
                    if (enemy != target) {
                        chains = chains - 1;
                        let attack_projectile;
                        attack_projectile = {
                            Target: enemy,
                            Source: target,
                            Ability: ability,
                            EffectName: chain_particle,
                            iMoveSpeed: 1200,
                            bDodgeable: true,
                            bVisibleToEnemies: true,
                            bReplaceExisting: false,
                            bProvidesVision: false,
                            ExtraData: {
                                damage: damage,
                                attacker: attacker.entindex(),
                                chains: chains
                            }
                        }
                        ProjectileManager.CreateTrackingProjectile(attack_projectile);
                        return;
                    }
                }
            }
        }
    }
    Melee_Chain_lightning(caster: IBaseNpc_Plus, attacker: IBaseNpc_Plus, ability: IBaseAbility_Plus, target: IBaseNpc_Plus, damage: number, chains: number) {
        if (IsServer()) {
            if (chains < ability.GetSpecialValueFor("number_of_chains")) {
                let damage_table: ApplyDamageOptions = {} as any;
                damage_table.attacker = attacker;
                damage_table.victim = target;
                damage_table.ability = ability;
                damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                damage_table.damage = (damage / 100) * ability.GetSpecialValueFor("chain_damage_pct");
                ApplyDamage(damage_table);
            }
            if (chains != undefined && chains > 0) {
                let chain_particle = "particles/hero/invoker/alacrity/imba_invoker_alacrity_chain_lightning.vpcf";
                let chain_distance = ability.GetSpecialValueFor("chain_distance");
                let chain_enemies = FindUnitsInRadius(caster.GetTeam(), target.GetAbsOrigin(), undefined, chain_distance, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_CLOSEST, false);
                for (const [_, enemy] of GameFunc.iPair(chain_enemies)) {
                    if (enemy != target) {
                        let chain_pfx = ResHelper.CreateParticleEx(chain_particle, ParticleAttachment_t.PATTACH_WORLDORIGIN, target);
                        ParticleManager.SetParticleControl(chain_pfx, 0, Vector(target.GetAbsOrigin().x, target.GetAbsOrigin().y, target.GetAbsOrigin().z + target.GetBoundingMaxs().z));
                        ParticleManager.SetParticleControl(chain_pfx, 1, Vector(enemy.GetAbsOrigin().x, enemy.GetAbsOrigin().y, enemy.GetAbsOrigin().z + enemy.GetBoundingMaxs().z));
                        ParticleManager.ReleaseParticleIndex(chain_pfx);
                        chains = chains - 1;
                        this.Melee_Chain_lightning(caster, attacker, ability, enemy, damage, chains);
                        return;
                    }
                }
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.alacrity_effect != undefined) {
                ParticleManager.DestroyParticle(this.alacrity_effect, false);
            }
        }
    }
    BeRefresh(kv: any): void {
        if (IsServer()) {
            this.bonus_damage = kv.bonus_damage;
            this.bonus_attack_speed = kv.bonus_attack_speed;
        } else {
            let net_table = NetTablesHelper.GetDotaEntityData(this.ability.GetEntityIndex()) || {}
            this.bonus_damage = net_table.alacrity_bonus_damage || 0;
            this.bonus_attack_speed = net_table.alacrity_attack_speed || 0;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PREATTACK_BONUS_DAMAGE)
    CC_GetModifierPreAttack_BonusDamage(): number {
        return this.bonus_damage;
    }
}
@registerAbility()
export class imba_invoker_forge_spirit extends BaseAbility_Plus {
    forged_spirits: IBaseNpc_Plus[];
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_FORGE_SPIRIT;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let exort_level = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            let spirit_name = "npc_imba_invoker_forged_spirit";
            let spirit_level = 3;
            let spirit_damage = this.GetLevelSpecialValueFor("spirit_damage", exort_level);
            let spirit_hp = this.GetLevelSpecialValueFor("spirit_hp", quas_level);
            let spirit_armor = this.GetLevelSpecialValueFor("spirit_armor", exort_level);
            let spirit_attack_range = this.GetLevelSpecialValueFor("spirit_attack_range", quas_level);
            let spirit_mana = this.GetLevelSpecialValueFor("spirit_mana", exort_level);
            let spirit_duration = this.GetLevelSpecialValueFor("spirit_duration", quas_level);
            let spirit_count_quas = this.GetLevelSpecialValueFor("spirit_count", quas_level);
            let spirit_count_exort = this.GetLevelSpecialValueFor("spirit_count", exort_level);
            if (this.forged_spirits == undefined) {
                this.forged_spirits = []
            }
            caster.EmitSound("Hero_Invoker.ForgeSpirit");
            let spirit_count;
            if (spirit_count_quas < spirit_count_exort) {
                spirit_count = spirit_count_quas;
            } else {
                spirit_count = spirit_count_exort;
            }
            if (caster.HasTalent("special_bonus_imba_unique_invoker_3")) {
                let additional_spirits = caster.GetTalentValue("special_bonus_imba_unique_invoker_3", "additional_spirits");
                spirit_count = spirit_count + additional_spirits;
                let reduced_duration = caster.GetTalentValue("special_bonus_imba_unique_invoker_3", "reduced_duration");
                spirit_duration = spirit_duration - reduced_duration;
            }
            let updated_spirit_array: IBaseNpc_Plus[] = []
            for (const spirit of (this.forged_spirits)) {
                if (!spirit.IsNull()) {
                    updated_spirit_array.push(spirit);
                }
            }
            this.forged_spirits = updated_spirit_array;
            for (let i = 0; i < spirit_count; i++) {
                let forged_spirit = caster.CreateSummon(spirit_name, caster.GetAbsOrigin() + RandomVector(100) as Vector, spirit_duration, true);
                if (caster.TempData().bPersona) {
                    forged_spirit.SetOriginalModel("models/heroes/invoker_kid/invoker_kid_trainer_dragon.vmdl");
                    forged_spirit.SetModel("models/heroes/invoker_kid/invoker_kid_trainer_dragon.vmdl");
                    forged_spirit.SetRangedProjectileName("particles/units/heroes/hero_invoker_kid/invoker_kid_forged_spirit_projectile.vpcf");
                }
                forged_spirit.AddAbility("imba_forged_spirit_melting_strike");
                forged_spirit.findAbliityPlus<imba_forged_spirit_melting_strike>("imba_forged_spirit_melting_strike").SetLevel(1);
                forged_spirit.AddAbility("imba_forged_spirit_death");
                forged_spirit.findAbliityPlus<imba_forged_spirit_death>("imba_forged_spirit_death").SetLevel(1);
                let melt_duration = forged_spirit.findAbliityPlus<imba_forged_spirit_melting_strike>("imba_forged_spirit_melting_strike").GetSpecialValueFor("duration");
                let max_armor_removed = forged_spirit.findAbliityPlus<imba_forged_spirit_melting_strike>("imba_forged_spirit_melting_strike").GetSpecialValueFor("max_armor_removed");
                let melt_armor_removed = forged_spirit.findAbliityPlus<imba_forged_spirit_melting_strike>("imba_forged_spirit_melting_strike").GetSpecialValueFor("armor_removed");
                let melt_strike_mana_cost = forged_spirit.findAbliityPlus<imba_forged_spirit_melting_strike>("imba_forged_spirit_melting_strike").GetManaCost(1);
                forged_spirit.AddNewModifier(caster, this, "modifier_imba_invoker_forge_spirit", {
                    duration: spirit_duration,
                    melt_duration: melt_duration,
                    melt_armor_removed: melt_armor_removed,
                    melt_strike_mana_cost: melt_strike_mana_cost,
                    max_armor_removed: max_armor_removed
                });
                forged_spirit.AddNewModifier(caster, this, "modifier_phased", {
                    duration: 0.03
                });
                forged_spirit.SetUnitOnClearGround();
                // forged_spirit.SetManaGain(spirit_mana);
                // forged_spirit.CreatureLevelUp(1);
                forged_spirit.SetBaseDamageMin(spirit_damage);
                forged_spirit.SetBaseDamageMax(spirit_damage);
                forged_spirit.SetBaseMaxHealth(spirit_hp);
                forged_spirit.SetPhysicalArmorBaseValue(spirit_armor);
                // forged_spirit.SetControllableByPlayer(caster.GetPlayerID(), true);
                this.forged_spirits.push(forged_spirit);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_forge_spirit extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public parent: IBaseNpc_Plus;
    public spirit_attack_range: number;
    public death_damage: number;
    public death_radius: number;
    public melt_duration: number;
    public melt_strike_mana_cost: any;
    public max_armor_removed: any;
    public melt_armor_removed: any;
    IsHidden(): boolean {
        return true;
    }
    IsPassive(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS,
            2: Enum_MODIFIER_EVENT.ON_ATTACK_LANDED
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.parent = this.GetParentPlus();
            let quas_level = this.caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let exort_level = this.caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            this.spirit_attack_range = this.ability.GetLevelSpecialValueFor("spirit_attack_range", quas_level);
            this.death_damage = this.ability.GetLevelSpecialValueFor("death_damage", exort_level);
            this.death_radius = this.ability.GetSpecialValueFor("death_radius");
            this.melt_duration = kv.melt_duration;
            this.melt_strike_mana_cost = kv.melt_strike_mana_cost;
            this.max_armor_removed = kv.max_armor_removed;
            this.melt_armor_removed = kv.melt_armor_removed;
            this.SetStackCount(this.spirit_attack_range);
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_ATTACK_LANDED)
    CC_OnAttackLanded(kv: ModifierAttackEvent): void {
        if (IsServer()) {
            let attacker = kv.attacker;
            let target = kv.target;
            if (attacker == this.parent && target.IsRealUnit() || target.IsIllusion()) {
                if (attacker.GetMana() >= this.melt_strike_mana_cost) {
                    if (target.HasModifier("modifier_imba_forged_spirit_melting_strike")) {
                        let debuff_count = target.findBuffStack("modifier_imba_forged_spirit_melting_strike", this.caster);
                        if (debuff_count > this.max_armor_removed) {
                            debuff_count = this.max_armor_removed;
                        }
                    }
                    target.AddNewModifier(this.parent, this.ability, "modifier_imba_forged_spirit_melting_strike", {
                        duration: this.melt_duration * (1 - target.GetStatusResistance()),
                        max_armor_removed: this.max_armor_removed,
                        melt_strike_mana_cost: this.melt_strike_mana_cost,
                        melt_armor_removed: this.melt_armor_removed
                    });
                }
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACK_RANGE_BONUS)
    CC_GetModifierAttackRangeBonus(): number {
        return this.GetStackCount();
    }
    BeRemoved(): void {
        if (IsServer()) {
            let pfxName = "particles/units/heroes/hero_phoenix/phoenix_supernova_death.vpcf";
            let pfx = ResHelper.CreateParticleEx(pfxName, ParticleAttachment_t.PATTACH_WORLDORIGIN, undefined);
            let attach_point = this.GetParentPlus().ScriptLookupAttachment("attach_hitloc");
            ParticleManager.SetParticleControl(pfx, 0, this.GetParentPlus().GetAttachmentOrigin(attach_point));
            ParticleManager.SetParticleControl(pfx, 1, this.GetParentPlus().GetAttachmentOrigin(attach_point));
            ParticleManager.SetParticleControl(pfx, 3, this.GetParentPlus().GetAttachmentOrigin(attach_point));
            ParticleManager.ReleaseParticleIndex(pfx);
            let nearby_enemy_units = FindUnitsInRadius(this.caster.GetTeam(), this.GetParentPlus().GetAbsOrigin(), undefined, this.death_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_ILLUSIONS, FindOrder.FIND_ANY_ORDER, false);
            if (nearby_enemy_units != undefined) {
                for (const [_, enemy] of GameFunc.iPair(nearby_enemy_units)) {
                    let damage_table: ApplyDamageOptions = {} as any;
                    damage_table.attacker = this.caster;
                    damage_table.victim = enemy;
                    damage_table.ability = this.ability;
                    damage_table.damage_type = DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL;
                    damage_table.damage = this.death_damage;
                    ApplyDamage(damage_table);
                }
            }
        }
    }
}
@registerAbility()
export class imba_forged_spirit_melting_strike extends BaseAbility_Plus {
    OnSpellStart(): void {
    }
}
@registerModifier()
export class modifier_imba_forged_spirit_melting_strike extends BaseModifier_Plus {
    public max_armor_removed: any;
    public melt_strike_mana_cost: any;
    public melt_armor_removed: any;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS
        }
        return Object.values(funcs);
    } */
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.max_armor_removed = kv.max_armor_removed;
            this.melt_strike_mana_cost = kv.melt_strike_mana_cost;
            this.melt_armor_removed = kv.melt_armor_removed;
            this.SetStackCount(this.melt_armor_removed);
        }
    }
    BeRefresh(kv: any): void {
        if (IsServer()) {
            let curr_stacks = this.GetStackCount();
            if (curr_stacks + this.melt_armor_removed < this.max_armor_removed) {
                this.SetStackCount(curr_stacks + this.melt_armor_removed);
                this.GetCasterPlus().SpendMana(this.melt_strike_mana_cost, undefined);
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_GetModifierPhysicalArmorBonus(p_0: ModifierAttackEvent,): number {
        return this.GetStackCount() * -1;
    }
}
@registerAbility()
export class imba_forged_spirit_death extends BaseAbility_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsPassive(): boolean {
        return true;
    }
}
@registerAbility()
export class imba_invoker_tornado extends BaseAbility_Plus {
    static loop_interval = 0.03
    static ability_effect_path = "particles/units/heroes/hero_invoker/invoker_tornado.vpcf"
    // static ability_effect_path = "particles/econ/items/invoker/invoker_ti6/invoker_tornado_ti6.vpcf"
    static ability_effect_cyclone_path = "particles/units/heroes/hero_invoker/invoker_tornado_child.vpcf"
    // static ability_effect_cyclone_path = "particles/econ/items/invoker/invoker_ti6/invoker_tornado_child_ti6.vpcf"
    GetCooldown(invoke_level: number): number {
        if (this.GetCasterPlus().HasTalent("special_bonus_imba_unique_invoker_8")) {
            let cooldown = super.GetCooldown(invoke_level) - this.GetCasterPlus().GetTalentValue("special_bonus_imba_unique_invoker_8", "cooldown_reduction");
            return cooldown;
        } else {
            return super.GetCooldown(invoke_level);
        }
    }
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_TORNADO;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = caster.findAbliityPlus<imba_invoker_tornado>("imba_invoker_tornado");
            let caster_location = caster.GetAbsOrigin();
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            let tornado_travel_distance = ability.GetLevelSpecialValueFor("travel_distance", wex_level);
            let wex_land_damage = ability.GetLevelSpecialValueFor("wex_damage", wex_level);
            let tornado_lift_duration = ability.GetLevelSpecialValueFor("lift_duration", quas_level);
            let area_of_effect = ability.GetSpecialValueFor("area_of_effect");
            let base_damage = ability.GetSpecialValueFor("base_damage");
            let travel_speed = ability.GetSpecialValueFor("travel_speed");
            let end_vision_duration = ability.GetSpecialValueFor("end_vision_duration");
            let vision_distance = ability.GetSpecialValueFor("vision_distance");
            let cyclone_initial_height = ability.GetSpecialValueFor("cyclone_initial_height");
            let cyclone_min_height = ability.GetSpecialValueFor("cyclone_min_height");
            let cyclone_max_height = ability.GetSpecialValueFor("cyclone_max_height");
            let tornado_duration = tornado_travel_distance / travel_speed;
            let daze_duration = 0;
            if (caster.HasTalent("special_bonus_imba_unique_invoker_8")) {
                let current_cooldown = ability.GetCooldownTime();
                let unaltered_cooldown = ability.GetCooldown(1);
                let cooldown_reduction_pct = current_cooldown / unaltered_cooldown;
                ability.StartCooldown(unaltered_cooldown * cooldown_reduction_pct);
                daze_duration = caster.GetTalentValue("special_bonus_imba_unique_invoker_8", "daze_duration");
            }
            let tornado_dummy_unit = BaseModifier_Plus.CreateBuffThinker(caster, this, undefined, {}, caster_location, caster.GetTeamNumber(), false);
            tornado_dummy_unit.EmitSound("Hero_Invoker.Tornado");
            let tornado_projectile_table: CreateLinearProjectileOptions = {
                EffectName: imba_invoker_tornado.ability_effect_path,
                Ability: ability,
                vSpawnOrigin: caster_location,
                fDistance: tornado_travel_distance,
                fStartRadius: area_of_effect,
                fEndRadius: area_of_effect,
                Source: tornado_dummy_unit,
                bHasFrontalCone: false,
                // iMoveSpeed: travel_speed,
                // bReplaceExisting: false,
                bProvidesVision: true,
                iVisionTeamNumber: caster.GetTeam(),
                iVisionRadius: vision_distance,
                bDrawsOnMinimap: false,
                bVisibleToEnemies: true,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP,
                fExpireTime: GameRules.GetGameTime() + tornado_duration + 20,
                ExtraData: {
                    tornado_lift_duration: tornado_lift_duration,
                    end_vision_duration: end_vision_duration,
                    base_damage: base_damage,
                    wex_land_damage: wex_land_damage,
                    cyclone_initial_height: cyclone_initial_height,
                    cyclone_min_height: cyclone_min_height,
                    cyclone_max_height: cyclone_max_height,
                    daze_duration: daze_duration,
                    cyclone_effect_path: imba_invoker_tornado.ability_effect_cyclone_path,
                    vision_distance: vision_distance,
                    tornado_dummy_unit: tornado_dummy_unit.entindex()
                }
            }
            let target_point = this.GetCursorPosition();
            let caster_point = caster_location;
            let point_difference_normalized = (target_point - caster_point as Vector).Normalized();
            let projectile_vvelocity = point_difference_normalized * travel_speed as Vector;
            projectile_vvelocity.z = 0;
            tornado_projectile_table.vVelocity = projectile_vvelocity;
            let tornado_projectile = ProjectileManager.CreateLinearProjectile(tornado_projectile_table);
        }
    }
    OnProjectileThink_ExtraData(vLocation: Vector, ExtraData: any): void {
        if (IsServer()) {
            EntIndexToHScript(ExtraData.tornado_dummy_unit).SetAbsOrigin(vLocation);
        }
    }
    OnProjectileHit_ExtraData(target: IBaseNpc_Plus | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (target != undefined) {
                let caster = this.GetCasterPlus();
                let base_damage = ExtraData.base_damage;
                let wex_land_damage = ExtraData.wex_land_damage;
                let tornado_lift_duration = ExtraData.tornado_lift_duration;
                let cyclone_initial_height = ExtraData.cyclone_initial_height;
                let cyclone_min_height = ExtraData.cyclone_min_height;
                let cyclone_max_height = ExtraData.cyclone_max_height;
                let tornado_start = GameRules.GetGameTime();
                let vision_distance = ExtraData.vision_distance;
                let end_vision_duration = ExtraData.end_vision_duration;
                if (tornado_lift_duration != undefined) {
                    target.TempData().invoker_tornado_forward_vector = target.GetForwardVector();
                    target.AddNewModifier(caster, this, "modifier_imba_invoker_tornado_cyclone", {
                        duration: tornado_lift_duration * (1 - target.GetStatusResistance())
                    });
                    let cyclone_effect = ResHelper.CreateParticleEx(ExtraData.cyclone_effect_path, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
                    target.EmitSound("Hero_Invoker.Tornado.Target");
                    let flying_z_modifier = target.findBuff<modifier_imba_invoker_tornado_cyclone>("modifier_imba_invoker_tornado_cyclone");
                    let z_position = 0;
                    tornado_lift_duration = flying_z_modifier.GetDuration();
                    let time_to_reach_initial_height = 2 / 10;
                    let initial_ascent_height_per_frame = ((cyclone_initial_height) / time_to_reach_initial_height) * imba_invoker_tornado.loop_interval;
                    let up_down_cycle_height_per_frame = initial_ascent_height_per_frame / 3;
                    if (up_down_cycle_height_per_frame > 7.5) {
                        up_down_cycle_height_per_frame = 7.5;
                    }
                    let final_descent_height_per_frame: number = undefined;
                    let time_to_stop_fly = tornado_lift_duration - time_to_reach_initial_height;
                    let going_up = true;
                    this.AddTimer(0, () => {
                        let time_in_air = GameRules.GetGameTime() - tornado_start;
                        this.spinn({
                            target: target,
                            tornado_lift_duration: tornado_lift_duration
                        });
                        if (z_position < cyclone_initial_height && time_in_air <= time_to_reach_initial_height) {
                            z_position = z_position + initial_ascent_height_per_frame;
                            flying_z_modifier.SetStackCount(z_position);
                            return imba_invoker_tornado.loop_interval;
                        } else if (time_in_air > time_to_stop_fly && time_in_air <= tornado_lift_duration) {
                            if (final_descent_height_per_frame == undefined) {
                                let descent_initial_height_above_ground = cyclone_initial_height;
                                let rounding_coeff = math.floor(time_to_reach_initial_height / imba_invoker_tornado.loop_interval);
                                final_descent_height_per_frame = descent_initial_height_above_ground / rounding_coeff;
                            }
                            z_position = z_position - final_descent_height_per_frame;
                            flying_z_modifier.SetStackCount(z_position);
                            return imba_invoker_tornado.loop_interval;
                        } else if (time_in_air <= tornado_lift_duration) {
                            if (z_position < cyclone_max_height && going_up) {
                                z_position = z_position + up_down_cycle_height_per_frame;
                                flying_z_modifier.SetStackCount(z_position);
                                return imba_invoker_tornado.loop_interval;
                            } else if (z_position >= cyclone_min_height) {
                                going_up = false;
                                z_position = z_position - up_down_cycle_height_per_frame;
                                flying_z_modifier.SetStackCount(z_position);
                                return imba_invoker_tornado.loop_interval;
                            } else {
                                going_up = true;
                                return imba_invoker_tornado.loop_interval;
                            }
                            return imba_invoker_tornado.loop_interval;
                        }
                        target.StopSound("Hero_Invoker.Tornado.Target");
                        ParticleManager.DestroyParticle(cyclone_effect, false);
                        if (target.HasModifier("modifier_imba_invoker_tornado")) {
                            target.RemoveModifierByName("modifier_imba_invoker_tornado");
                        }
                        if (target.HasModifier("modifier_imba_invoker_tornado_cyclone")) {
                            target.RemoveModifierByName("modifier_imba_invoker_tornado_cyclone");
                            target.SetAbsOrigin(GetGroundPosition(target.GetAbsOrigin(), caster));
                        }
                        this.LandDamage(target, caster, this, {
                            base_damage: base_damage,
                            wex_land_damage: wex_land_damage
                        });
                        if (ExtraData.daze_duration > 0) {
                            target.AddNewModifier(caster, this, "modifier_imba_invoker_tornado_empower_debuff", {
                                duration: ExtraData.daze_duration * (1 - target.GetStatusResistance())
                            });
                        }
                    });
                }
            } else {
                EntIndexToHScript(ExtraData.tornado_dummy_unit).StopSound("Hero_Invoker.Tornado");
                EntIndexToHScript(ExtraData.tornado_dummy_unit).RemoveSelf();
                this.CreateVisibilityNode(location, ExtraData.vision_distance, ExtraData.end_vision_duration);
            }
        }
    }
    spinn(kv: { target: IBaseNpc_Plus, tornado_lift_duration: number }) {
        let target = kv.target;
        let total_degrees = 20;
        if (kv.target.TempData().invoker_tornado_degrees_to_spin == undefined && kv.tornado_lift_duration != undefined) {
            let ideal_degrees_per_second = 666.666;
            let ideal_full_spins = (ideal_degrees_per_second / 360) * kv.tornado_lift_duration;
            ideal_full_spins = math.floor(ideal_full_spins + .5);
            let degrees_per_second_ending_in_same_forward_vector = (360 * ideal_full_spins) / kv.tornado_lift_duration;
            kv.target.TempData().invoker_tornado_degrees_to_spin = degrees_per_second_ending_in_same_forward_vector * imba_invoker_tornado.loop_interval;
        }
        target.SetForwardVector(RotatePosition(Vector(0, 0, 0), QAngle(0, kv.target.TempData().invoker_tornado_degrees_to_spin, 0), target.GetForwardVector()));
    }
    LandDamage(target: IBaseNpc_Plus, attacker: IBaseNpc_Plus, ability: IBaseAbility_Plus, kv: { base_damage: number, wex_land_damage: number }) {
        let damage_type = this.GetAbilityDamageType();
        target.EmitSound("Hero_Invoker.Tornado.LandDamage");
        if (target.TempData().invoker_tornado_forward_vector != undefined) {
            target.SetForwardVector(target.TempData().invoker_tornado_forward_vector);
        }
        let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
        damage_table.attacker = attacker;
        damage_table.victim = target;
        damage_table.ability = ability;
        damage_table.damage_type = ability.GetAbilityDamageType();
        damage_table.damage = kv.base_damage + kv.wex_land_damage;
        ApplyDamage(damage_table);
    }
}
@registerModifier()
export class modifier_imba_invoker_tornado extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsBuff() {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPassive(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_MOVE_TO]: true,
            [modifierstate.MODIFIER_STATE_NO_TEAM_SELECT]: true,
            [modifierstate.MODIFIER_STATE_COMMAND_RESTRICTED]: true,
            [modifierstate.MODIFIER_STATE_ATTACK_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_MAGIC_IMMUNE]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NOT_ON_MINIMAP]: true,
            [modifierstate.MODIFIER_STATE_UNSELECTABLE]: true,
            [modifierstate.MODIFIER_STATE_OUT_OF_GAME]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_invoker_tornado_cyclone extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsBuff() {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
    IsPassive(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true,
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_ROOTED]: true,
            [modifierstate.MODIFIER_STATE_DISARMED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true,
            [modifierstate.MODIFIER_STATE_FLYING]: true
        }
        return state;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.VISUAL_Z_DELTA)
    CC_GetVisualZDelta(): number {
        return this.GetStackCount();
    }
    BeCreated(kv: any): void {
    }
    BeRemoved(): void {
        this.SetStackCount(0);
    }
}
@registerModifier()
export class modifier_imba_invoker_tornado_empower_debuff extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsBuff() {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPassive(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_PASSIVES_DISABLED]: true
        }
        return state;
    }
}
@registerAbility()
export class imba_invoker_emp extends BaseAbility_Plus {
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_EMP;
    }
    GetAOERadius(): number {
        return this.GetSpecialValueFor("area_of_effect");
    }
    OnSpellStart(): void {
        if (IsServer()) {
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_EMP);
            let target_point = this.GetCursorPosition();
            this.CastEMP({
                caster: this.GetCasterPlus(),
                ability: this,
                target_point: target_point,
                current_charge: 1
            });
        }
    }
    CastEMP(kv: { caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target_point: Vector, current_charge: number }) {
        let caster = kv.caster;
        let ability = kv.ability;
        let target_point = kv.target_point;
        let current_charge = kv.current_charge;
        let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
        let delay = ability.GetLevelSpecialValueFor("delay", wex_level);
        BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_emp", {
            duration: delay,
            current_charge: current_charge
        }, target_point, caster.GetTeamNumber(), false);
    }
}
@registerModifier()
export class modifier_imba_invoker_emp extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: imba_invoker_emp;
    public target_point: Vector;
    public current_charge: any;
    public mana_burned: any;
    public after_shock_duration: number;
    public area_of_effect: any;
    public damage_per_mana_pct: number;
    public mana_gain_per_mana_pct: number;
    public emp_recharge_threshold: any;
    public emp_effect_reduction: any;
    public emp_total_charges: any;
    public emp_effect: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.target_point = this.GetParentPlus().GetAbsOrigin();
            this.current_charge = kv.current_charge;
            let invoker_wex = this.caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex");
            let wex_level = invoker_wex.GetLevel() - 1;
            this.mana_burned = this.ability.GetLevelSpecialValueFor("mana_burned", wex_level);
            this.after_shock_duration = this.ability.GetSpecialValueFor("after_shock_duration");
            this.area_of_effect = this.ability.GetSpecialValueFor("area_of_effect");
            this.damage_per_mana_pct = this.ability.GetSpecialValueFor("damage_per_mana_pct");
            this.mana_gain_per_mana_pct = this.ability.GetSpecialValueFor("mana_gain_per_mana_pct");
            this.emp_recharge_threshold = 0;
            this.emp_effect_reduction = 0;
            this.emp_total_charges = 0;
            if (this.caster.HasTalent("special_bonus_imba_unique_invoker_1")) {
                this.emp_recharge_threshold = this.caster.GetTalentValue("special_bonus_imba_unique_invoker_1", "threshold");
                this.emp_effect_reduction = this.caster.GetTalentValue("special_bonus_imba_unique_invoker_1", "effect_reduction");
                this.emp_total_charges = this.caster.GetTalentValue("special_bonus_imba_unique_invoker_1", "charges");
            }
            EmitSoundOnLocationWithCaster(this.caster.GetAbsOrigin(), "Hero_Invoker.EMP.Cast", this.caster);
            EmitSoundOnLocationWithCaster(this.target_point, "Hero_Invoker.EMP.Charge", this.caster);
            this.emp_effect = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_emp.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(this.emp_effect, 0, this.target_point);
            ParticleManager.SetParticleControl(this.emp_effect, 1, Vector(this.area_of_effect, 0, 0));
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.emp_effect, false);
            let emp_explosion_effect = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_emp_explode.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
            ParticleManager.SetParticleControl(emp_explosion_effect, 0, this.target_point);
            ParticleManager.SetParticleControl(emp_explosion_effect, 1, Vector(this.area_of_effect, 0, 0));
            EmitSoundOnLocationWithCaster(this.target_point, "Hero_Invoker.EMP.Discharge", this.caster);
            let nearby_enemy_units = FindUnitsInRadius(this.caster.GetTeam(), this.target_point, undefined, this.area_of_effect, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MANA_ONLY, FindOrder.FIND_ANY_ORDER, false);
            let enemy_heroes_hit = 0;
            for (const [i, individual_enemy] of GameFunc.iPair(nearby_enemy_units)) {
                if (this.OnHit(this.caster, this.ability, individual_enemy, this.mana_burned, this.after_shock_duration, this.damage_per_mana_pct, this.mana_gain_per_mana_pct) && individual_enemy.IsRealUnit()) {
                    enemy_heroes_hit = enemy_heroes_hit + 1;
                }
            }
            if (this.current_charge < this.emp_total_charges) {
                if (this.emp_recharge_threshold > 0 && this.emp_recharge_threshold <= enemy_heroes_hit) {
                    this.mana_burned = this.mana_burned * ((100 - this.emp_effect_reduction) / 100);
                    let next_charge = this.current_charge + 1;
                    this.ability.CastEMP({
                        caster: this.caster,
                        ability: this.ability,
                        target_point: this.target_point,
                        current_charge: next_charge
                    });
                }
            }
        }
    }
    OnHit(caster: IBaseNpc_Plus,
        ability: IBaseAbility_Plus,
        enemy: IBaseNpc_Plus,
        mana_to_burn: number,
        after_shock_duration: number,
        damage_per_mana_pct: number,
        mana_gain_per_mana_pct: number) {
        let full_mana_burn = false;
        let enemy_mana_to_burn = enemy.GetMana();
        if (mana_to_burn < enemy_mana_to_burn) {
            enemy_mana_to_burn = mana_to_burn;
            full_mana_burn = true;
        }
        enemy.ReduceMana(enemy_mana_to_burn);
        ApplyDamage({
            victim: enemy,
            attacker: caster,
            damage: enemy_mana_to_burn * (damage_per_mana_pct / 100),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
        });
        if (enemy.IsRealUnit()) {
            enemy.AddNewModifier(caster, ability, "modifier_imba_invoker_emp_overload", {
                duration: after_shock_duration * (1 - enemy.GetStatusResistance())
            });
            caster.GiveMana(enemy_mana_to_burn * (mana_gain_per_mana_pct / 100));
        }
        return full_mana_burn;
    }
}
@registerModifier()
export class modifier_imba_invoker_emp_overload extends BaseModifier_Plus {
    IsPassive(): boolean {
        return false;
    }
    IsBuff() {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: Enum_MODIFIER_EVENT.ON_MANA_GAINED
        }
        return Object.values(funcs);
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_MANA_GAINED)
    CC_OnManaGained(kv: ModifierHealEvent): void {
        if (kv.unit == this.GetParentPlus()) {
            let current_mana = kv.unit.GetMana();
            kv.unit.SetMana(current_mana - kv.gain);
        }
    }
}
@registerAbility()
export class imba_invoker_ice_wall extends BaseAbility_Plus {
    ice_wall_effect = "particles/units/heroes/hero_invoker/invoker_ice_wall.vpcf"
    endpoint_distance_from_center: Vector;
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_ICE_WALL;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_point = caster.GetAbsOrigin();
            let caster_direction = caster.GetForwardVector();
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let exort_level = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            let cast_direction = Vector(-caster_direction.y, caster_direction.x, caster_direction.z);
            let ice_wall_placement_distance = this.GetSpecialValueFor("wall_placement_distance");
            let ice_wall_length = this.GetSpecialValueFor("wall_length");
            let ice_wall_slow_duration = this.GetSpecialValueFor("slow_duration");
            let ice_wall_damage_interval = this.GetSpecialValueFor("damage_interval");
            let ice_wall_area_of_effect = this.GetSpecialValueFor("wall_area_of_effect");
            let ice_wall_duration = this.GetLevelSpecialValueFor("duration", quas_level);
            let ice_wall_slow = this.GetLevelSpecialValueFor("slow", quas_level);
            let attack_slow = this.GetSpecialValueFor("attack_slow");
            let ice_wall_damage_per_second = this.GetLevelSpecialValueFor("damage_per_second", exort_level);
            let ice_wall_effects = "";
            let ice_wall_spike_effects = "";
            this.endpoint_distance_from_center = (cast_direction * ice_wall_length) / 2 as Vector;
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_ICE_WALL);
            EmitSoundOn("Hero_Invoker.IceWall.Cast", caster);
            let ice_walls = 1;
            let ice_wall_offset = 0;
            let z_offset = 0;
            if (caster.HasTalent("special_bonus_imba_unique_invoker_4")) {
                ice_walls = caster.GetTalentValue("special_bonus_imba_unique_invoker_4", "ice_walls");
                ice_wall_offset = caster.GetTalentValue("special_bonus_imba_unique_invoker_4", "ice_wall_offset");
                z_offset = 75;
                this.ice_wall_effect = "particles/hero/invoker/icewall/imba_invoker_ice_wall.vpcf";
            }
            for (let i = 0; i <= (ice_walls - 1); i++) {
                let target_point = caster_point + (caster_direction * ice_wall_placement_distance + (ice_wall_offset * i)) as Vector;
                target_point = GetGroundPosition(target_point, caster);
                let ice_wall_point = target_point;
                ice_wall_point.z = ice_wall_point.z - z_offset;
                let ice_wall_particle_effect = ResHelper.CreateParticleEx(this.ice_wall_effect, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControl(ice_wall_particle_effect, 0, ice_wall_point - this.endpoint_distance_from_center as Vector);
                ParticleManager.SetParticleControl(ice_wall_particle_effect, 1, ice_wall_point + this.endpoint_distance_from_center as Vector);
                let ice_wall_particle_effect_spikes = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_ice_wall_b.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined);
                ParticleManager.SetParticleControl(ice_wall_particle_effect_spikes, 0, target_point - this.endpoint_distance_from_center as Vector);
                ParticleManager.SetParticleControl(ice_wall_particle_effect_spikes, 1, target_point + this.endpoint_distance_from_center as Vector);
                if (ice_wall_effects == "") {
                    ice_wall_effects = string.format("%d", ice_wall_particle_effect);
                } else {
                    ice_wall_effects = string.format("%s %d", ice_wall_effects, ice_wall_particle_effect);
                }
                if (ice_wall_effects == "") {
                    ice_wall_spike_effects = string.format("%d", ice_wall_particle_effect_spikes);
                } else {
                    ice_wall_spike_effects = string.format("%s %d", ice_wall_spike_effects, ice_wall_particle_effect_spikes);
                }
            }
            let thinker_point = caster_point as Vector;
            let thinger_area = ice_wall_area_of_effect;
            if (ice_walls - 1 == 0) {
                thinker_point = thinker_point + (caster_direction * ice_wall_placement_distance) as Vector;
            } else {
                thinker_point = thinker_point + (caster_direction * ice_wall_placement_distance + (ice_wall_offset * ((ice_walls - 1) / 2))) as Vector;
                ice_wall_area_of_effect = ice_wall_area_of_effect + (100 * ((ice_walls - 1) / 2));
            }
            BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_invoker_ice_wall", {
                duration: ice_wall_duration,
                ice_wall_damage_interval: ice_wall_damage_interval,
                ice_wall_slow_duration: ice_wall_slow_duration,
                ice_wall_slow: ice_wall_slow,
                attack_slow: attack_slow,
                ice_wall_damage_per_second: ice_wall_damage_per_second,
                ice_wall_area_of_effect: ice_wall_area_of_effect,
                ice_wall_length: ice_wall_length,
                ice_wall_particle_effect: ice_wall_effects,
                ice_wall_particle_effect_spikes: ice_wall_spike_effects
            }, thinker_point, caster.GetTeamNumber(), false);
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_ice_wall extends BaseModifier_Plus {
    static npc_radius_constant = 65
    public slow_duration: number;
    public ice_wall_slow: any;
    public attack_slow: any;
    public ice_wall_damage_per_second: number;
    public ice_wall_area_of_effect: any;
    public ice_wall_length: any;
    public search_area: any;
    public GetTeam: any;
    public origin: any;
    public ability: imba_invoker_ice_wall;
    public endpoint_distance_from_center: number;
    public ice_wall_start_point: any;
    public ice_wall_end_point: any;
    public ice_wall_particle_effect: any;
    public ice_wall_particle_effect_spikes: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            let ice_wall_damage_interval = kv.ice_wall_damage_interval;
            this.slow_duration = kv.ice_wall_slow_duration;
            this.ice_wall_slow = kv.ice_wall_slow;
            this.attack_slow = kv.attack_slow;
            this.ice_wall_damage_per_second = kv.ice_wall_damage_per_second * kv.ice_wall_damage_interval;
            this.ice_wall_area_of_effect = kv.ice_wall_area_of_effect;
            this.ice_wall_length = kv.ice_wall_length;
            this.search_area = kv.ice_wall_length + (kv.ice_wall_area_of_effect * 2);
            this.GetTeam = this.GetParentPlus().GetTeam();
            this.origin = this.GetParentPlus().GetAbsOrigin();
            this.ability = this.GetAbilityPlus();
            this.endpoint_distance_from_center = this.ability.endpoint_distance_from_center;
            this.ice_wall_start_point = this.origin - this.endpoint_distance_from_center;
            this.ice_wall_end_point = this.origin + this.endpoint_distance_from_center;
            this.ice_wall_particle_effect = kv.ice_wall_particle_effect;
            this.ice_wall_particle_effect_spikes = kv.ice_wall_particle_effect_spikes;
            this.StartIntervalThink(ice_wall_damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let nearby_enemy_units = FindUnitsInRadius(this.GetTeam, this.origin, undefined, this.search_area, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(nearby_enemy_units)) {
                if (enemy != undefined && enemy.IsAlive()) {
                    let target_position = enemy.GetAbsOrigin();
                    if (modifier_imba_invoker_ice_wall.IsUnitInProximity(this.ice_wall_start_point, this.ice_wall_end_point, target_position, this.ice_wall_area_of_effect)) {
                        enemy.AddNewModifier(this.GetCasterPlus(), this.ability, "modifier_imba_invoker_ice_wall_slow", {
                            duration: this.slow_duration,
                            enemy_slow: this.ice_wall_slow * (1 - enemy.GetStatusResistance())
                        });
                        enemy.AddNewModifier(this.GetCasterPlus(), this.ability, "modifier_imba_invoker_ice_wall_attack_slow", {
                            duration: this.slow_duration,
                            enemy_slow: this.attack_slow * (1 - enemy.GetStatusResistance())
                        });
                        let damage_table: ApplyDamageOptions = {} as any;
                        damage_table.attacker = this.GetParentPlus();
                        damage_table.victim = enemy;
                        damage_table.ability = this.ability;
                        damage_table.damage_type = this.ability.GetAbilityDamageType();
                        damage_table.damage = this.ice_wall_damage_per_second;
                        ApplyDamage(damage_table);
                    }
                }
            }
        }
    }
    BeRemoved(): void {
        if (this.ice_wall_particle_effect != undefined) {
            for (const [effect] of string.gmatch(this.ice_wall_particle_effect, "([^ ]+)")) {
                ParticleManager.DestroyParticle(tonumber(effect) as ParticleID, false);
            }
        }
        if (this.ice_wall_particle_effect_spikes != undefined) {
            for (const [effect] of string.gmatch(this.ice_wall_particle_effect_spikes, "([^ ]+)")) {
                ParticleManager.DestroyParticle(tonumber(effect) as ParticleID, false);
            }
        }
    }
    static IsUnitInProximity(start_point: Vector, end_point: Vector, target_position: Vector, ice_wall_radius: number) {
        let ice_wall = end_point - start_point as Vector;
        let target_vector = target_position - start_point as Vector;
        let ice_wall_normalized = ice_wall.Normalized();
        let ice_wall_dot_vector = target_vector.Dot(ice_wall_normalized);
        let search_point;
        if (ice_wall_dot_vector <= 0) {
            search_point = start_point;
        } else if (ice_wall_dot_vector >= ice_wall.Length2D()) {
            search_point = end_point;
        } else {
            search_point = start_point + (ice_wall_normalized * ice_wall_dot_vector);
        }
        let distance = target_position - search_point as Vector;
        return distance.Length2D() <= ice_wall_radius + modifier_imba_invoker_ice_wall.npc_radius_constant;
    }
}
@registerModifier()
export class modifier_imba_invoker_ice_wall_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    ice_wall_effect_aura: number
    IsPassive(): boolean {
        return false;
    }
    IsBuff() {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_invoker/invoker_ice_wall_debuff.vpcf";
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    GetTexture(): string {
        return "invoker_ice_wall";
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.SetStackCount(kv.enemy_slow);
        }
    }
    BeRefresh(kv: any): void {
        if (IsServer()) {
            this.SetStackCount(kv.enemy_slow);
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            if (this.ice_wall_effect_aura != undefined) {
            }
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerModifier()
export class modifier_imba_invoker_ice_wall_attack_slow extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsPurgeException(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    GetTexture(): string {
        return "invoker_ice_wall";
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.SetStackCount(kv.enemy_slow);
        }
    }
    BeRefresh(kv: any): void {
        if (IsServer()) {
            this.SetStackCount(kv.enemy_slow);
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.GetStackCount();
    }
}
@registerAbility()
export class imba_invoker_chaos_meteor extends BaseAbility_Plus {
    static loop_interval = 0.03
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_CHAOS_METEOR;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let ability = this;
            let target_point = this.GetCursorPosition();
            let number_of_meteors = 1;
            if (caster.HasTalent("special_bonus_imba_unique_invoker_2")) {
                number_of_meteors = caster.GetTalentValue("special_bonus_imba_unique_invoker_2", "number_of_meteors");
            }
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_CHAOS_METEOR);
            this.CastMeteor(caster, ability, target_point, number_of_meteors);
            if (number_of_meteors > 1) {
                let fiered_meteors = 1;
                let endTime = GameRules.GetGameTime() + 1;
                this.AddTimer(0.1, () => {
                    fiered_meteors = fiered_meteors + 1;
                    let new_target_point = target_point + RandomVector(math.random(150, 300) - 150) as Vector;
                    this.CastMeteor(caster, ability, new_target_point, number_of_meteors);
                    if (fiered_meteors == number_of_meteors) {
                        return;
                    } else if (fiered_meteors == number_of_meteors - 1) {
                        return 0.2;
                    } else {
                        return 0.1;
                    }

                });
            }
        }
    }
    CastMeteor(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target_point: Vector, number_of_meteors: number) {
        if (IsServer()) {
            let chaos_meteor_land_time = ability.GetSpecialValueFor("land_time");
            BaseModifier_Plus.CreateBuffThinker(caster, ability, "modifier_imba_invoker_chaos_meteor", {
                duration: chaos_meteor_land_time
            }, target_point, caster.GetTeamNumber(), false);
        }
    }
    OnProjectileThink_ExtraData(location: Vector, ExtraData: any): void {
        if (IsServer()) {
            EntIndexToHScript(ExtraData.meteor_dummy).SetAbsOrigin(location);
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (target == undefined) {
                EntIndexToHScript(ExtraData.meteor_dummy).StopSound("Hero_Invoker.ChaosMeteor.Loop");
                EntIndexToHScript(ExtraData.meteor_dummy).RemoveSelf();
                this.CreateVisibilityNode(location, ExtraData.vision_distance, ExtraData.vision_duration);
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_chaos_meteor extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public target_point: any;
    public caster_location: any;
    public caster_location_ground: any;
    public wex_level: any;
    public exort_level: any;
    public chaos_meteor_travel_distance: number;
    public chaos_meteor_main_dmg: any;
    public chaos_meteor_burn_dps: any;
    public chaos_meteor_travel_speed: number;
    public chaos_meteor_burn_duration: number;
    public chaos_meteor_burn_dps_inverval: any;
    public chaos_meteor_damage_interval: number;
    public chaos_meteor_vision_distance: number;
    public chaos_meteor_end_vision_duration: number;
    public chaos_meteor_area_of_effect: any;
    public location_difference_normalized: any;
    public chaos_meteor_land_time: number;
    public chaos_meteor_velocity: any;
    public chaos_meteor_duration: number;
    public meteor_dummy: any;
    public chaos_meteor_fly_particle_effect: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.target_point = this.GetParentPlus().GetAbsOrigin();
            this.caster_location = this.caster.GetAbsOrigin();
            this.caster_location_ground = GetGroundPosition(this.caster.GetAbsOrigin(), this.caster);
            this.wex_level = this.caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            this.exort_level = this.caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            this.chaos_meteor_travel_distance = this.ability.GetLevelSpecialValueFor("travel_distance", this.wex_level);
            this.chaos_meteor_main_dmg = this.ability.GetLevelSpecialValueFor("main_damage", this.exort_level);
            this.chaos_meteor_burn_dps = this.ability.GetLevelSpecialValueFor("burn_dps", this.exort_level);
            this.chaos_meteor_travel_speed = this.ability.GetSpecialValueFor("travel_speed");
            this.chaos_meteor_burn_duration = this.ability.GetSpecialValueFor("burn_duration");
            this.chaos_meteor_burn_dps_inverval = this.ability.GetSpecialValueFor("burn_dps_inverval");
            this.chaos_meteor_damage_interval = this.ability.GetSpecialValueFor("damage_interval");
            this.chaos_meteor_vision_distance = this.ability.GetSpecialValueFor("vision_distance");
            this.chaos_meteor_end_vision_duration = this.ability.GetSpecialValueFor("end_vision_duration");
            this.chaos_meteor_area_of_effect = this.ability.GetSpecialValueFor("area_of_effect");
            this.location_difference_normalized = (this.target_point - this.caster_location_ground as Vector).Normalized();
            this.chaos_meteor_land_time = this.ability.GetSpecialValueFor("land_time");
            this.chaos_meteor_velocity = this.location_difference_normalized * this.chaos_meteor_travel_speed;
            this.chaos_meteor_duration = this.chaos_meteor_travel_distance / this.chaos_meteor_travel_speed;
            this.caster.EmitSound("Hero_Invoker.ChaosMeteor.Cast");
            this.meteor_dummy = BaseModifier_Plus.CreateBuffThinker(this.caster, this.ability, undefined, {}, this.target_point, this.caster.GetTeamNumber(), false);
            this.meteor_dummy.EmitSound("Hero_Invoker.ChaosMeteor.Loop");
            let chaos_meteor_fly_original_point = (this.target_point - (this.chaos_meteor_velocity * this.chaos_meteor_land_time)) + Vector(0, 0, 1000) as Vector;
            this.chaos_meteor_fly_particle_effect = ResHelper.CreateParticleEx("particles/units/heroes/hero_invoker/invoker_chaos_meteor_fly.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.caster);
            ParticleManager.SetParticleControl(this.chaos_meteor_fly_particle_effect, 0, chaos_meteor_fly_original_point);
            ParticleManager.SetParticleControl(this.chaos_meteor_fly_particle_effect, 1, this.target_point);
            ParticleManager.SetParticleControl(this.chaos_meteor_fly_particle_effect, 2, Vector(this.chaos_meteor_land_time, 0, 0));
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            this.meteor_dummy.EmitSound("Hero_Invoker.ChaosMeteor.Impact");
            this.meteor_dummy.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_chaos_meteor_aura", {
                duration: -1,
                chaos_meteor_duration: this.chaos_meteor_duration,
                burn_duration: this.chaos_meteor_burn_duration,
                main_dmg: this.chaos_meteor_main_dmg,
                burn_dps: this.chaos_meteor_burn_dps,
                burn_dps_inverval: this.chaos_meteor_burn_dps_inverval,
                damage_interval: this.chaos_meteor_damage_interval,
                area_of_effect: this.chaos_meteor_area_of_effect
            });
            let meteor_projectile_obj: CreateLinearProjectileOptions = {
                EffectName: "particles/hero/invoker/chaosmeteor/imba_invoker_chaos_meteor.vpcf",
                Ability: this.ability,
                vSpawnOrigin: this.target_point,
                fDistance: this.chaos_meteor_travel_distance,
                fStartRadius: this.chaos_meteor_area_of_effect,
                fEndRadius: this.chaos_meteor_area_of_effect,
                Source: this.meteor_dummy,
                bHasFrontalCone: false,
                // iMoveSpeed: this.chaos_meteor_travel_speed,
                // bReplaceExisting: false,
                bProvidesVision: true,
                iVisionTeamNumber: this.caster.GetTeam(),
                iVisionRadius: this.chaos_meteor_vision_distance,
                bDrawsOnMinimap: false,
                bVisibleToEnemies: true,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_NONE,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_NONE,
                fExpireTime: GameRules.GetGameTime() + this.chaos_meteor_land_time + this.chaos_meteor_duration + this.chaos_meteor_end_vision_duration,
                ExtraData: {
                    meteor_dummy: this.meteor_dummy.entindex(),
                    vision_distance: this.chaos_meteor_vision_distance,
                    vision_duration: this.chaos_meteor_end_vision_duration
                }
            }
            meteor_projectile_obj.vVelocity = this.chaos_meteor_velocity;
            meteor_projectile_obj.vVelocity.z = 0;
            ProjectileManager.CreateLinearProjectile(meteor_projectile_obj);
            ParticleManager.DestroyParticle(this.chaos_meteor_fly_particle_effect, false);
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_chaos_meteor_aura extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public GetTeam: any;
    public chaos_meteor_duration: number;
    public damage_interval: number;
    public main_dmg: any;
    public burn_duration: number;
    public burn_dps: any;
    public burn_dps_inverval: any;
    public area_of_effect: any;
    public direction: any;
    public hit_table: { [k: string]: IBaseNpc_Plus };
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.GetTeam = this.GetParentPlus().GetTeam();
            this.chaos_meteor_duration = kv.chaos_meteor_duration;
            this.damage_interval = kv.damage_interval;
            this.main_dmg = kv.main_dmg;
            this.burn_duration = kv.burn_duration;
            this.burn_dps = kv.burn_dps;
            this.burn_dps_inverval = kv.burn_dps_inverval;
            this.area_of_effect = kv.area_of_effect;
            if (this.caster.HasTalent("special_bonus_imba_unique_invoker_2")) {
                let number_of_meteors = this.caster.GetTalentValue("special_bonus_imba_unique_invoker_2", "number_of_meteors");
                this.burn_dps = this.burn_dps / number_of_meteors;
                this.main_dmg = this.main_dmg / number_of_meteors;
            }
            this.direction = (this.GetParentPlus().GetAbsOrigin() - this.caster.GetAbsOrigin() as Vector).Normalized();
            this.direction.z = 0;
            this.hit_table = {}
            this.StartIntervalThink(kv.damage_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let start_point = this.GetParentPlus().GetAbsOrigin();
            let end_point = start_point - (this.direction * 500) as Vector;
            for (const [_, enemy] of GameFunc.Pair(this.hit_table)) {
                if (enemy.IsNull() == false && enemy.HasModifier("modifier_imba_invoker_chaos_meteor_burn")) {
                    if (modifier_imba_invoker_ice_wall.IsUnitInProximity(start_point, end_point, enemy.GetAbsOrigin(), 300)) {
                        let burn_modifiers = enemy.FindAllModifiersByName("modifier_imba_invoker_chaos_meteor_burn");
                        for (const [_, modifier] of GameFunc.iPair(burn_modifiers)) {
                            modifier.ForceRefresh();
                        }
                        let burn_effect_modifier = enemy.findBuff<modifier_imba_invoker_chaos_meteor_burn_effect>("modifier_imba_invoker_chaos_meteor_burn_effect");
                        if (burn_effect_modifier != undefined) {
                            burn_effect_modifier.ForceRefresh();
                        }
                    }
                }
            }
            let nearby_enemy_units = FindUnitsInRadius(this.GetTeam, this.GetParentPlus().GetAbsOrigin(), undefined, this.area_of_effect, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, FindOrder.FIND_ANY_ORDER, false);
            for (const [_, enemy] of GameFunc.iPair(nearby_enemy_units)) {
                if (this.hit_table[enemy.GetUnitName()] == undefined) {
                    this.hit_table[enemy.GetUnitName()] = enemy;
                }
                if (enemy != undefined) {
                    enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_chaos_meteor_burn", {
                        duration: this.burn_duration,
                        burn_dps: this.burn_dps,
                        burn_dps_inverval: this.burn_dps_inverval
                    });
                    enemy.AddNewModifier(this.caster, this.ability, "modifier_imba_invoker_chaos_meteor_burn_effect", {
                        duration: this.burn_duration
                    });
                    let damage_table: ApplyDamageOptions = {} as any;
                    damage_table.attacker = this.caster;
                    damage_table.victim = enemy;
                    damage_table.ability = this.ability;
                    damage_table.damage_type = this.ability.GetAbilityDamageType();
                    damage_table.damage = this.main_dmg;
                    ApplyDamage(damage_table);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_chaos_meteor_burn extends BaseModifier_Plus {
    public caster: IBaseNpc_Plus;
    public parent: IBaseNpc_Plus;
    public ability: IBaseAbility_Plus;
    public damage_type: number;
    public burn_dps_inverval: any;
    public burn_dps: any;
    IsDebuff(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.caster = this.GetCasterPlus();
            this.parent = this.GetParentPlus();
            this.ability = this.GetAbilityPlus();
            this.damage_type = this.ability.GetAbilityDamageType();
            this.burn_dps_inverval = kv.burn_dps_inverval;
            this.burn_dps = kv.burn_dps;
            this.StartIntervalThink(this.burn_dps_inverval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let damage_table: ApplyDamageOptions = {} as any;
            damage_table.attacker = this.caster;
            damage_table.victim = this.parent;
            damage_table.ability = this.ability;
            damage_table.damage_type = this.damage_type;
            damage_table.damage = this.burn_dps;
            ApplyDamage(damage_table);
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_chaos_meteor_burn_effect extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_phoenix/phoenix_fire_spirit_burn.vpcf";
    }
}
@registerAbility()
export class imba_invoker_deafening_blast extends BaseAbility_Plus {
    static knockback_interval = 0.03
    static ability_effect_path = "particles/units/heroes/hero_invoker/invoker_deafening_blast.vpcf"
    //		static ability_effect_path 			= "particles/econ/items/invoker/invoker_ti6/invoker_deafening_blast_ti6.vpcf"
    static ability_effect_path_aoe = "particles/hero/invoker/deafeningblast/imba_invoker_deafening_blast.vpcf"
    static ability_disarm_effect_path = "particles/units/heroes/hero_invoker/invoker_deafening_blast_disarm_debuff.vpcf"
    static ability_knockback_effect_path = "particles/units/heroes/hero_invoker/invoker_deafening_blast_knockback_debuff.vpcf"
    hit_table: EntityIndex[];
    GetCastAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_CAST_DEAFENING_BLAST;
    }
    OnSpellStart(): void {
        if (IsServer()) {
            let caster = this.GetCasterPlus();
            let caster_location = caster.GetAbsOrigin();
            let target_point = this.GetCursorPosition();
            let direction = (target_point - caster_location as Vector).Normalized();
            direction.z = 0;
            this.GetCasterPlus().StartGesture(GameActivity_t.ACT_DOTA_CAST_DEAFENING_BLAST);
            EmitSoundOnLocationWithCaster(caster_location, "Hero_Invoker.DeafeningBlast", caster);
            this.hit_table = [];
            if (caster.HasTalent("special_bonus_imba_unique_invoker_7")) {
                let num_deafening_blasts = caster.GetTalentValue("special_bonus_imba_unique_invoker_7", "number_of_blasts");
                BaseModifier_Plus.CreateBuffThinker(caster, this, "modifier_imba_invoker_deafening_blast", {
                    num_deafening_blasts: num_deafening_blasts
                }, target_point, caster.GetTeamNumber(), false);
            } else {
                this.CastDeafeningBlast(caster, this, target_point);
            }
        }
    }
    CastDeafeningBlast(caster: IBaseNpc_Plus, ability: IBaseAbility_Plus, target_point: Vector) {
        if (IsServer()) {
            let caster_location = caster.GetAbsOrigin();
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let exort_level = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            let deafening_blast_damage = ability.GetLevelSpecialValueFor("damage", exort_level);
            let deafening_blast_knockback_duration = ability.GetLevelSpecialValueFor("knockback_duration", quas_level) + 0.1;
            let deafening_blast_knockback_distance = ability.GetLevelSpecialValueFor("knockback_distance", quas_level) + 0.1;
            let deafening_blast_disarm_duration = ability.GetLevelSpecialValueFor("disarm_duration", wex_level);
            let deafening_blast_travel_distance = ability.GetSpecialValueFor("travel_distance");
            let deafening_blast_travel_speed = ability.GetSpecialValueFor("travel_speed");
            let deafening_blast_radius_start = ability.GetSpecialValueFor("radius_start");
            let deafening_blast_radius_end = ability.GetSpecialValueFor("radius_end");
            let direction = (target_point - caster_location as Vector).Normalized();
            direction.z = 0;
            let deafening_blast_projectile_table: CreateLinearProjectileOptions = {
                EffectName: imba_invoker_deafening_blast.ability_effect_path,
                Ability: ability,
                vSpawnOrigin: caster.GetAbsOrigin(),
                vVelocity: direction * deafening_blast_travel_speed as Vector,
                fDistance: deafening_blast_travel_distance,
                fStartRadius: deafening_blast_radius_start,
                fEndRadius: deafening_blast_radius_end,
                Source: caster,
                bHasFrontalCone: true,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                ExtraData: {
                    deafening_blast_damage: deafening_blast_damage,
                    deafening_blast_knockback_duration: deafening_blast_knockback_duration,
                    deafening_blast_knockback_distance: deafening_blast_knockback_distance,
                    deafening_blast_disarm_duration: deafening_blast_disarm_duration,
                    disarm_effect_path: imba_invoker_deafening_blast.ability_disarm_effect_path,
                    knockback_effect_path: imba_invoker_deafening_blast.ability_knockback_effect_path
                }
            }
            ProjectileManager.CreateLinearProjectile(deafening_blast_projectile_table);
        }
    }
    static RadialDeafeningBlast(caster: IBaseNpc_Plus, ability: imba_invoker_deafening_blast, target_point: Vector, num_blasts: number) {
        if (IsServer()) {
            ability.hit_table = []
            let caster_location = caster.GetAbsOrigin();
            let quas_level = caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            let exort_level = caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            let wex_level = caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            let deafening_blast_damage = ability.GetLevelSpecialValueFor("damage", exort_level);
            let deafening_blast_knockback_duration = ability.GetLevelSpecialValueFor("knockback_duration", quas_level) + 0.1;
            let deafening_blast_knockback_distance = ability.GetLevelSpecialValueFor("knockback_distance", quas_level) + 0.1;
            let deafening_blast_disarm_duration = ability.GetLevelSpecialValueFor("disarm_duration", wex_level);
            let deafening_blast_travel_distance = ability.GetSpecialValueFor("travel_distance");
            let deafening_blast_travel_speed = ability.GetSpecialValueFor("travel_speed");
            let deafening_blast_radius_start = ability.GetSpecialValueFor("radius_start");
            let deafening_blast_radius_end = ability.GetSpecialValueFor("radius_end");
            if (caster.HasTalent("special_bonus_imba_unique_invoker_7")) {
                let damage_reduction = caster.GetTalentValue("special_bonus_imba_unique_invoker_7", "damage_reduction");
                deafening_blast_damage = deafening_blast_damage * ((100 - damage_reduction) / 100);
            }
            let direction = (target_point - caster_location as Vector).Normalized();
            direction.z = 0;
            let degrees = 360 / num_blasts;
            EmitSoundOnLocationWithCaster(caster_location, "Hero_Invoker.DeafeningBlast", caster);
            for (let index = 1; index <= num_blasts; index++) {
                let deafening_blast_projectile_table: CreateLinearProjectileOptions = {
                    EffectName: imba_invoker_deafening_blast.ability_effect_path_aoe,
                    Ability: ability,
                    vSpawnOrigin: caster.GetAbsOrigin(),
                    vVelocity: direction * deafening_blast_travel_speed as Vector,
                    fDistance: deafening_blast_travel_distance,
                    fStartRadius: deafening_blast_radius_start,
                    fEndRadius: deafening_blast_radius_end,
                    Source: caster,
                    bHasFrontalCone: true,
                    // bReplaceExisting: false,
                    iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                    iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                    iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                    ExtraData: {
                        deafening_blast_damage: deafening_blast_damage,
                        deafening_blast_knockback_duration: deafening_blast_knockback_duration,
                        deafening_blast_knockback_distance: deafening_blast_knockback_distance,
                        deafening_blast_disarm_duration: deafening_blast_disarm_duration,
                        disarm_effect_path: imba_invoker_deafening_blast.ability_disarm_effect_path,
                        knockback_effect_path: imba_invoker_deafening_blast.ability_knockback_effect_path
                    }
                }
                ProjectileManager.CreateLinearProjectile(deafening_blast_projectile_table);
                direction = RotatePosition(Vector(0, 0, 0), QAngle(0, degrees, 0), direction);
            }
        }
    }
    OnProjectileHit_ExtraData(target: CDOTA_BaseNPC | undefined, location: Vector, ExtraData: any): boolean | void {
        if (IsServer()) {
            if (target) {
                let caster = this.GetCasterPlus();
                let target_entity_index = target.GetEntityIndex();
                if (!this.hit_table.includes(target_entity_index)) {
                    this.hit_table.push(target_entity_index);
                    this.KnockBackAndDisarm(caster, target, ExtraData.deafening_blast_knockback_duration, ExtraData.deafening_blast_disarm_duration, ExtraData.disarm_effect_path, ExtraData.knockback_effect_path);
                    let damage_table: ApplyDamageOptions = {} as ApplyDamageOptions;
                    damage_table.attacker = caster;
                    damage_table.victim = target;
                    damage_table.ability = this;
                    damage_table.damage_type = this.GetAbilityDamageType();
                    damage_table.damage = ExtraData.deafening_blast_damage;
                    ApplyDamage(damage_table);
                }
            }
        }
    }
    CheckHitList(target_entity_id: IBaseNpc_Plus) {
        // if (this.hit_table[target_entity_id] == undefined) {
        //     this.hit_table[target_entity_id] = true;
        //     return true;
        // } else {
        //     return false;
        // }
    }
    KnockBackAndDisarm(caster: IBaseNpc_Plus, target: IBaseNpc_Plus, knockback_duration: number, disarm_duration: number, disarm_effect_path: string, knockback_effect_path: string) {
        target.AddNewModifier(caster, this, "modifier_imba_invoker_deafening_blast_knockback", {
            duration: knockback_duration * (1 - target.GetStatusResistance())
        });
        target.AddNewModifier(caster, this, "modifier_imba_invoker_deafening_blast_frozen", {
            duration: knockback_duration + disarm_duration * (1 - target.GetStatusResistance())
        });
    }
}
@registerModifier()
export class modifier_imba_invoker_deafening_blast extends BaseModifier_Plus {
    public target_point: any;
    public caster_location: any;
    public caster: IBaseNpc_Plus;
    public ability: imba_invoker_deafening_blast;
    public quas_level: any;
    public exort_level: any;
    public wex_level: any;
    public deafening_blast_damage: number;
    public deafening_blast_knockback_duration: number;
    deafening_blast_knockback_distance: number;
    public deafening_blast_disarm_duration: number;
    public deafening_blast_travel_distance: number;
    public deafening_blast_travel_speed: number;
    public deafening_blast_radius_start: number;
    public deafening_blast_radius_end: number;
    public num_deafening_blasts: any;
    public remaining_deafening_blast: any;
    public direction: any;
    public degrees: any;
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.target_point = this.GetParentPlus().GetAbsOrigin();
            this.caster_location = this.GetCasterPlus().GetAbsOrigin();
            this.caster = this.GetCasterPlus();
            this.ability = this.GetAbilityPlus();
            this.quas_level = this.caster.findAbliityPlus<imba_invoker_quas>("imba_invoker_quas").GetLevel() - 1;
            this.exort_level = this.caster.findAbliityPlus<imba_invoker_exort>("imba_invoker_exort").GetLevel() - 1;
            this.wex_level = this.caster.findAbliityPlus<imba_invoker_wex>("imba_invoker_wex").GetLevel() - 1;
            this.deafening_blast_damage = this.ability.GetLevelSpecialValueFor("damage", this.exort_level);
            this.deafening_blast_knockback_duration = this.ability.GetLevelSpecialValueFor("knockback_duration", this.quas_level) + 0.1;
            this.deafening_blast_knockback_distance = this.ability.GetLevelSpecialValueFor("knockback_distance", this.quas_level) + 0.1;
            this.deafening_blast_disarm_duration = this.ability.GetLevelSpecialValueFor("disarm_duration", this.wex_level);
            this.deafening_blast_travel_distance = this.ability.GetSpecialValueFor("travel_distance");
            this.deafening_blast_travel_speed = this.ability.GetSpecialValueFor("travel_speed");
            this.deafening_blast_radius_start = this.ability.GetSpecialValueFor("radius_start");
            this.deafening_blast_radius_end = this.ability.GetSpecialValueFor("radius_end");
            this.num_deafening_blasts = kv.num_deafening_blasts;
            this.remaining_deafening_blast = kv.num_deafening_blasts + 1;
            this.direction = (this.target_point - this.caster_location as Vector).Normalized();
            this.direction.z = 0;
            this.degrees = 360 / this.num_deafening_blasts;
            this.StartIntervalThink(0.05);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let deafening_blast_projectile_table: CreateLinearProjectileOptions = {
                EffectName: imba_invoker_deafening_blast.ability_effect_path_aoe,
                Ability: this.ability,
                vSpawnOrigin: this.caster.GetAbsOrigin(),
                vVelocity: this.direction * this.deafening_blast_travel_speed as Vector,
                fDistance: this.deafening_blast_travel_distance,
                fStartRadius: this.deafening_blast_radius_start,
                fEndRadius: this.deafening_blast_radius_end,
                Source: this.caster,
                bHasFrontalCone: true,
                // bReplaceExisting: false,
                iUnitTargetTeam: DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY,
                iUnitTargetFlags: DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE,
                iUnitTargetType: DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC,
                ExtraData: {
                    deafening_blast_damage: this.deafening_blast_damage,
                    deafening_blast_knockback_duration: this.deafening_blast_knockback_duration,
                    deafening_blast_knockback_distance: this.deafening_blast_knockback_distance,
                    deafening_blast_disarm_duration: this.deafening_blast_disarm_duration,
                    disarm_effect_path: imba_invoker_deafening_blast.ability_disarm_effect_path,
                    knockback_effect_path: imba_invoker_deafening_blast.ability_knockback_effect_path
                }
            }
            ProjectileManager.CreateLinearProjectile(deafening_blast_projectile_table);
            this.direction = RotatePosition(Vector(0, 0, 0), QAngle(0, this.degrees, 0), this.direction);
            this.remaining_deafening_blast = this.remaining_deafening_blast - 1;
            if (this.remaining_deafening_blast == 0) {
                this.GetParentPlus().RemoveModifierByName("modifier_imba_invoker_deafening_blast");
            }
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            imba_invoker_deafening_blast.RadialDeafeningBlast(this.caster, this.ability, this.target_point, this.num_deafening_blasts);
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_deafening_blast_frozen extends BaseModifier_Plus {
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetEffectName(): string {
        return "particles/status_fx/status_effect_frost.vpcf";
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_FROZEN]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_imba_invoker_deafening_blast_knockback extends BaseModifier_Plus {
    public knockback_effect: any;
    public knockback_direction: any;
    public knockback_speed: number;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_ROOTED]: true
        }
        return state;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.OVERRIDE_ANIMATION)
    CC_GetOverrideAnimation(): GameActivity_t {
        return GameActivity_t.ACT_DOTA_DISABLED;
    }
    BeCreated(kv: any): void {
        if (IsServer()) {
            this.knockback_effect = ResHelper.CreateParticleEx(kv.knockback_effect_path, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
            this.knockback_direction = (this.GetParentPlus().GetAbsOrigin() - this.GetCasterPlus().GetAbsOrigin() as Vector).Normalized();
            this.knockback_speed = 6;
            this.StartIntervalThink(imba_invoker_deafening_blast.knockback_interval);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let new_location = this.GetParentPlus().GetAbsOrigin() + this.knockback_direction * this.knockback_speed as Vector;
            this.GetParentPlus().SetAbsOrigin(GetGroundPosition(new_location, this.GetParentPlus()));
        }
    }
    BeRemoved(): void {
        if (IsServer()) {
            ParticleManager.DestroyParticle(this.knockback_effect, false);
            FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), true);
        }
    }
}
@registerModifier()
export class modifier_imba_invoker_deafening_blast_disarm extends BaseModifier_Plus {
    IsHidden(): boolean {
        return true;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    StatusEffectPriority(): modifierpriority {
        return 15;
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_DISARMED]: true
        }
        return state;
    }
}
