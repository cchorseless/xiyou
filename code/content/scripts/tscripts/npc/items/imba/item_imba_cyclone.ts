
import { GameFunc } from "../../../GameFunc";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class item_imba_cyclone_2 extends BaseItem_Plus {
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (target == this.GetCasterPlus()) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_cyclone_2";
    }
    OnSpellStart(): void {
        let target = this.GetCursorTarget();
        if (!target.TriggerSpellAbsorb(this)) {
            target.EmitSound("DOTA_Item.Cyclone.Activate");
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_cyclone_2_movement", {
                duration: this.GetSpecialValueFor("cyclone_duration")
            });
            target.AddNewModifier(this.GetCasterPlus(), this, "modifier_eul_cyclone", {
                duration: this.GetSpecialValueFor("cyclone_duration")
            }).SetDuration(this.GetSpecialValueFor("cyclone_duration"), true);
            if (target.GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
                target.Purge(true, false, false, false, false);
            } else {
                target.Purge(false, true, false, false, false);
            }
            for (let tornado = 1; tornado <= this.GetSpecialValueFor("tornado_count"); tornado += 1) {
                CreateModifierThinker(this.GetCasterPlus(), this, "modifier_item_imba_cyclone_2_thinker", {
                    duration: this.GetSpecialValueFor("cyclone_duration")
                }, target.GetAbsOrigin() + RotatePosition(Vector(0, 0, 0), QAngle(0, tornado * (360 / this.GetSpecialValueFor("tornado_count")), 0), this.GetCasterPlus().GetForwardVector() * this.GetSpecialValueFor("tornado_spacing") as Vector) as Vector, this.GetCasterPlus().GetTeamNumber(), false);
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_2 extends BaseModifier_Plus {
    public bonus_intellect: number;
    public bonus_mana_regen: number;
    public bonus_movement_speed: number;
    public bonus_spell_amp: number;
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
            this.bonus_intellect = this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
            this.bonus_mana_regen = this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
            this.bonus_movement_speed = this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed");
            this.bonus_spell_amp = this.GetItemPlus().GetSpecialValueFor("bonus_spell_amp");
        } else {
            this.bonus_intellect = 0;
            this.bonus_mana_regen = 0;
            this.bonus_movement_speed = 0;
            this.bonus_spell_amp = 0;
        }
        if (!IsServer()) {
            return;
        }
        for (const [_, mod] of ipairs(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, modifier] of ipairs(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            modifier.SetStackCount(_);
            modifier.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            2: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT,
            4: GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.bonus_intellect;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.bonus_mana_regen;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.bonus_movement_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.SPELL_AMPLIFY_PERCENTAGE)
    CC_GetModifierSpellAmplify_Percentage(p_0: ModifierAttackEvent,): number {
        if (this.GetItemPlus().GetSecondaryCharges() == 1 && !this.GetParentPlus().HasModifier("modifier_item_imba_armlet_of_dementor") && !this.GetParentPlus().HasModifier("modifier_item_imba_arcane_nexus_passive")) {
            return this.bonus_spell_amp;
        }
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_2_movement extends BaseModifier_Plus {
    public tornado_aura_duration: number;
    public disorient_duration: number;
    public displacement_distance: number;
    public interval: number;
    public angle: any;
    public rotation: any;
    IsHidden(): boolean {
        return true;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.tornado_aura_duration = this.GetItemPlus().GetSpecialValueFor("tornado_aura_duration");
        this.disorient_duration = this.GetItemPlus().GetSpecialValueFor("disorient_duration");
        this.displacement_distance = this.GetItemPlus().GetSpecialValueFor("displacement_distance") / this.GetDuration();
        if (!IsServer()) {
            return;
        }
        this.interval = FrameTime();
        this.angle = this.GetParentPlus().GetForwardVector();
        this.rotation = (360 / this.GetDuration()) * this.GetItemPlus().GetSpecialValueFor("tornado_self_rotations");
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
        if (this.GetParentPlus().GetTeamNumber() != this.GetCasterPlus().GetTeamNumber()) {
            this.GetParentPlus().AddNewModifier(this.GetCasterPlus(), this.GetItemPlus(), "modifier_item_imba_cyclone_2_disorient", {
                duration: this.disorient_duration
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_2_thinker extends BaseModifier_Plus {
    public effect_table: any;
    public effect: any;
    public tornado_radius: number;
    public tornado_aura_duration: number;
    GetEffectName(): string {
        return this.effect;
    }
    BeCreated(params: any): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.effect_table = {
            1: "particles/econ/events/ti5/cyclone_ti5.vpcf",
            2: "particles/econ/events/ti6/cyclone_ti6.vpcf",
            3: "particles/econ/events/fall_major_2016/cyclone_fm06.vpcf",
            4: "particles/econ/events/ti7/cyclone_ti7.vpcf",
            5: "particles/econ/events/winter_major_2017/cyclone_wm07.vpcf",
            6: "particles/econ/events/ti8/cyclone_ti8.vpcf",
            7: "particles/econ/events/ti9/cyclone_ti9.vpcf"
        }
        this.effect = this.effect_table[RandomInt(1, GameFunc.GetCount(this.effect_table))];
        this.tornado_radius = this.GetItemPlus().GetSpecialValueFor("tornado_radius");
        this.tornado_aura_duration = this.GetItemPlus().GetSpecialValueFor("tornado_aura_duration");
    }
    IsAura(): boolean {
        return true;
    }
    IsAuraActiveOnDeath(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        return this.tornado_radius;
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY;
    }
    GetAuraDuration(): number {
        return this.tornado_aura_duration;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_cyclone_2_thinker_aura";
    }
    GetAuraEntityReject(hEntity: CDOTA_BaseNPC): boolean {
        return hEntity.HasModifier("modifier_item_imba_cyclone_2_disorient");
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_2_thinker_aura extends BaseModifier_Plus {
    public tornado_pull_speed: number;
    public owner_origin: any;
    public interval: number;
    GetAttributes(): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.tornado_pull_speed = this.GetItemPlus().GetSpecialValueFor("tornado_pull_speed");
        if (!IsServer()) {
            return;
        }
        this.owner_origin = this.GetAuraOwner().GetAbsOrigin();
        this.interval = FrameTime();
        this.StartIntervalThink(this.interval);
    }
    OnIntervalThink(): void {
        this.GetParentPlus().SetAbsOrigin(this.GetParentPlus().GetAbsOrigin() + (this.owner_origin - this.GetParentPlus().GetAbsOrigin() as Vector).Normalized() * this.interval * this.tornado_pull_speed as Vector);
        FindClearSpaceForUnit(this.GetParentPlus(), this.GetParentPlus().GetAbsOrigin(), false);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_TETHERED]: true
        };
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_2_disorient extends BaseModifier_Plus {
    public disorient_status_resistance: any;
    IgnoreTenacity() {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_abaddon_frostmourne.vpcf";
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.GetItemPlus()) {
                this.Destroy();
            }
        }
        this.disorient_status_resistance = this.GetItemPlus().GetSpecialValueFor("disorient_status_resistance") * (-1);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING)
    CC_GetModifierStatusResistanceStacking(): number {
        return this.disorient_status_resistance;
    }
}
