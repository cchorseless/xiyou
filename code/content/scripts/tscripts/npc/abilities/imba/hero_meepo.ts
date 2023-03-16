
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
@registerModifier()
export class modifier_meepo_divided_we_stand_lua extends BaseModifier_Plus {
    public cloned_boots: any;
    IsHidden(): boolean {
        return true;
    }
    RemoveOnDeath(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return false;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            this.StartIntervalThink(FrameTime() * 2);
        }
    }
    OnIntervalThink(): void {
        let boots = {
            "1": "item_imba_guardian_greaves",
            "2": "item_imba_origin_treads",
            "3": "item_imba_arcane_boots",
            "4": "item_imba_lifesteal_boots",
            "5": "item_imba_blink_boots",
            "6": "item_imba_transient_boots"
        }
        let all_boots = {
            "1": "item_boots",
            "2": "item_travel_boots",
            "3": "item_travel_boots_2",
            "4": "item_tranquil_boots",
            "5": "item_imba_guardian_greaves",
            "6": "item_imba_origin_treads",
            "7": "item_imba_arcane_boots",
            "8": "item_imba_lifesteal_boots",
            "9": "item_imba_blink_boots",
            "10": "item_imba_transient_boots"
        }
        let break_loop = false;
        let ignore_custom_boots = false;
        if (this.GetParentPlus().IsClone()) {
            for (const [_, boots] of GameFunc.Pair(all_boots)) {
                if (this.GetParentPlus().HasItemInInventory(boots)) {
                    ignore_custom_boots = true;
                    return;
                }
            }
            if (ignore_custom_boots == false) {
                for (const [_, boots_name] of GameFunc.Pair(boots)) {
                    for (let i = 0; i <= 5; i++) {
                        this.GetParentPlus().GetCloneSource().TempData().main_boots = undefined;
                        let item = this.GetParentPlus().GetCloneSource().GetItemInSlot(i);
                        if (item) {
                            if (item.GetAbilityName() == boots_name) {
                                this.GetParentPlus().GetCloneSource().TempData().main_boots = item;
                                break_loop = true;
                                return;
                            }
                        }
                    }
                    if (break_loop) {
                        return;
                    }
                }
            }
            let found_boots = this.GetParentPlus().GetCloneSource().TempData().main_boots;
            if (break_loop) {
                if (!this.GetParentPlus().HasItemInInventory(found_boots.GetAbilityName())) {
                    this.cloned_boots = this.GetParentPlus().AddItemByName(found_boots.GetAbilityName());
                    if (this.cloned_boots && this.GetParentPlus().HasItemInInventory(found_boots.GetAbilityName()) && this.cloned_boots.GetItemSlot() != found_boots.GetItemSlot()) {
                        this.GetParentPlus().SwapItems(this.cloned_boots.GetItemSlot(), found_boots.GetItemSlot());
                    }
                }
            } else {
                for (const [_, boots_name] of GameFunc.Pair(boots)) {
                    this.GetParentPlus().RemoveItemByName(boots_name);
                }
            }
            if (found_boots && found_boots.GetAbilityName() == "item_imba_origin_treads") {
                if (found_boots.state != (this.GetParentPlus().FindItemInInventory("item_imba_origin_treads") as any).state) {
                    if (this.GetParentPlus().HasModifier("modifier_item_imba_origin_treads") && this.GetParentPlus().GetCloneSource().HasModifier("modifier_item_imba_origin_treads")) {
                        this.GetParentPlus().findBuff("modifier_item_imba_origin_treads").SetStackCount(this.GetParentPlus().GetCloneSource().FindModifierByName("modifier_item_imba_origin_treads").GetStackCount());
                    }
                }
            }
            // this.GetParentPlus().CalculateStatBonus(true);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST,
            2: Enum_MODIFIER_EVENT.ON_DEATH
        });
    } */
    @registerEvent(Enum_MODIFIER_EVENT.ON_ABILITY_FULLY_CAST)
    CC_OnAbilityFullyCast(keys: ModifierAbilityEvent): void {
        if (!IsServer()) {
            return;
        }
        if (keys.ability && keys.ability.IsItem && keys.ability.IsItem() && this.GetParentPlus().GetCloneSource && (keys.unit && keys.unit == this.GetParentPlus().GetCloneSource() || (keys.target && keys.target == this.GetParentPlus().GetCloneSource() && keys.unit.GetTeamNumber() == this.GetParentPlus().GetCloneSource().GetTeamNumber()))) {
            let modifier_name = undefined;
            let modifier_duration = undefined;
            if (keys.ability.GetAbilityName() == "item_imba_white_queen_cape" || keys.ability.GetAbilityName() == "item_minotaur_horn") {
                modifier_name = "modifier_black_king_bar_immune";
                modifier_duration = keys.ability.GetSpecialValueFor("duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_black_king_bar") {
                modifier_name = "modifier_item_imba_black_king_bar_buff";
                modifier_duration = keys.ability.GetSpecialValueFor("duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_angelic_alliance") {
                modifier_name = "modifier_imba_angelic_alliance_buff";
                modifier_duration = keys.ability.GetSpecialValueFor("duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_blade_mail" || keys.ability.GetAbilityName() == "item_imba_bladestorm_mail") {
                modifier_name = "modifier_item_imba_blade_mail_active";
                modifier_duration = keys.ability.GetSpecialValueFor("duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_butterfly") {
                modifier_name = "modifier_item_imba_butterfly_flutter";
                modifier_duration = keys.ability.GetSpecialValueFor("flutter_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_jarnbjorn") {
                modifier_name = "modifier_item_imba_static_charge";
                modifier_duration = keys.ability.GetSpecialValueFor("static_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_sange") {
                modifier_name = "modifier_item_imba_sange_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_heavens_halberd") {
                modifier_name = "modifier_item_imba_heavens_halberd_ally_buff";
                modifier_duration = keys.ability.GetSpecialValueFor("buff_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_yasha") {
                modifier_name = "modifier_item_imba_yasha_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_kaya" || keys.ability.GetAbilityName() == "item_imba_arcane_nexus") {
                modifier_name = "modifier_item_imba_kaya_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_sange_yasha") {
                modifier_name = "modifier_item_imba_sange_yasha_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_kaya_and_sange") {
                modifier_name = "modifier_item_imba_kaya_and_sange_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_yasha_and_kaya") {
                modifier_name = "modifier_item_imba_yasha_and_kaya_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_sange_yasha") {
                modifier_name = "modifier_item_imba_sange_yasha_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_sphere") {
                modifier_name = "modifier_item_sphere_target";
                modifier_duration = keys.ability.GetSpecialValueFor("block_cooldown");
            } else if (keys.ability.GetAbilityName() == "item_imba_lotus_orb") {
                modifier_name = "modifier_item_imba_lotus_orb_active";
                modifier_duration = keys.ability.GetSpecialValueFor("active_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_mask_of_madness") {
                modifier_name = "modifier_imba_mask_of_madness_berserk";
                modifier_duration = keys.ability.GetSpecialValueFor("berserk_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_mjollnir") {
                modifier_name = "modifier_item_imba_static_charge";
                modifier_duration = keys.ability.GetSpecialValueFor("static_duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_spirit_vessel") {
                modifier_name = "modifier_item_imba_spirit_vessel_heal";
                modifier_duration = keys.ability.GetSpecialValueFor("duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_urn_of_shadows") {
                modifier_name = "modifier_imba_urn_of_shadows_active_ally";
                modifier_duration = keys.ability.GetSpecialValueFor("duration");
            } else if (keys.ability.GetAbilityName() == "item_imba_valiance" && !this.GetParentPlus().GetCloneSource().HasModifier("modifier_item_imba_valiance_counter")) {
                modifier_name = "modifier_item_imba_valiance_guard";
                modifier_duration = keys.ability.GetSpecialValueFor("guard_duration");
            }
            if (modifier_name && modifier_duration) {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, modifier_name, {
                    duration: modifier_duration
                });
            }
            if (keys.ability.GetAbilityName() == "item_imba_the_triumvirate_v2") {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_the_triumvirate_v2_sange", {
                    duration: keys.ability.GetSpecialValueFor("active_duration")
                });
                this.AddTimer(FrameTime(), () => {
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_the_triumvirate_v2_yasha", {
                        duration: keys.ability.GetSpecialValueFor("active_duration")
                    });
                    this.AddTimer(FrameTime(), () => {
                        this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_the_triumvirate_v2_kaya", {
                            duration: keys.ability.GetSpecialValueFor("active_duration")
                        });
                    });
                });
            } else if (keys.ability.GetAbilityName() == "item_imba_black_queen_cape") {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_imba_black_queen_cape_active_bkb", {
                    duration: keys.ability.GetSpecialValueFor("bkb_duration")
                });
                if (keys.ability.GetCurrentCharges() >= 1) {
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_imba_black_queen_cape_active_heal", {
                        duration: keys.ability.GetSpecialValueFor("heal_duration")
                    });
                }
            } else if (keys.ability.GetAbilityName() == "item_imba_satanic") {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_imba_satanic", {
                    duration: keys.ability.GetSpecialValueFor("unholy_rage_duration")
                });
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_imba_satanic_active", {
                    duration: keys.ability.GetSpecialValueFor("unholy_rage_duration")
                });
            } else if (keys.ability.GetAbilityName() == "item_imba_bloodstone_720") {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_bloodstone_active_720", {
                    duration: keys.ability.GetSpecialValueFor("restore_duration")
                });
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_bloodstone_active_cdr_720", {
                    duration: keys.ability.GetSpecialValueFor("active_duration")
                });
            } else if (keys.ability.GetAbilityName() == "item_imba_glimmerdark_shield") {
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_glimmerdark_shield_prism", {
                    duration: keys.ability.GetSpecialValueFor("prism_duration")
                });
                this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_gem_of_true_sight", {
                    duration: keys.ability.GetSpecialValueFor("prism_duration")
                });
            } else if (keys.ability.GetAbilityName() == "item_imba_shadow_blade") {
                this.AddTimer(keys.ability.GetSpecialValueFor("invis_fade_time"), () => {
                    let particle_invis_start_fx = ResHelper.CreateParticleEx("particles/generic_hero_status/status_invisibility_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
                    ParticleManager.SetParticleControl(particle_invis_start_fx, 0, this.GetParentPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_invis_start_fx);
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_shadow_blade_invis", {
                        duration: keys.ability.GetSpecialValueFor("invis_duration")
                    });
                });
            } else if (keys.ability.GetAbilityName() == "item_imba_silver_edge") {
                this.AddTimer(keys.ability.GetSpecialValueFor("invis_fade_time"), () => {
                    let particle_invis_start_fx = ResHelper.CreateParticleEx("particles/generic_hero_status/status_invisibility_start.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN, this.GetParentPlus());
                    ParticleManager.SetParticleControl(particle_invis_start_fx, 0, this.GetParentPlus().GetAbsOrigin());
                    ParticleManager.ReleaseParticleIndex(particle_invis_start_fx);
                    this.GetParentPlus().AddNewModifier(this.GetParentPlus().GetCloneSource(), keys.ability, "modifier_item_imba_silver_edge_invis", {
                        duration: keys.ability.GetSpecialValueFor("invis_duration")
                    });
                });
            }
        }
    }
    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_OnDeath(keys: ModifierInstanceEvent): void {
        if (keys.unit.GetPlayerID() == this.GetParentPlus().GetPlayerID() && keys.unit.GetUnitName() == this.GetParentPlus().GetUnitName() && !keys.unit.IsIllusion()) {
            let cloned = this.GetParentPlus().GetCloneSource() as IBaseNpc_Plus;
            if (this.GetParentPlus().IsAlive()) {
                this.GetParentPlus().TrueKilled(this.GetParentPlus(), this.GetAbilityPlus());
            }
            else if (cloned && cloned.IsAlive()) {
                cloned.TrueKilled(cloned, this.GetAbilityPlus());
            }
        }
    }
}
