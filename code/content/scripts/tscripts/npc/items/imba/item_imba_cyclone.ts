
import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// Eul的神圣法杖
@registerAbility()
export class item_imba_cyclone extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_cyclone";
    }
    CastFilterResultTarget(hTarget: CDOTA_BaseNPC): UnitFilterResult {
        if (!IsServer()) {
            return;
        }
        let caster = this.GetCasterPlus();
        if (caster.GetTeamNumber() == hTarget.GetTeamNumber() && caster != hTarget) {
            return UnitFilterResult.UF_FAIL_FRIENDLY;
        }
        if (caster != hTarget && hTarget.IsMagicImmune()) {
            return UnitFilterResult.UF_FAIL_MAGIC_IMMUNE_ENEMY;
        }
    }
    OnSpellStart(): void {
        let caster = this.GetCasterPlus();
        let target = this.GetCursorTarget();
        if (caster.GetTeamNumber() != target.GetTeamNumber()) {
            target.Purge(true, false, false, false, false);
            target.AddNewModifier(caster, this, "modifier_item_imba_cyclone_active_debuff", {
                duration: this.GetSpecialValueFor("cyclone_duration")
            });
        } else {
            caster.Purge(false, true, false, false, false);
            target.AddNewModifier(caster, this, "modifier_item_imba_cyclone_active", {
                duration: this.GetSpecialValueFor("cyclone_duration")
            });
        }
    }
}
@registerModifier()
export class modifier_item_imba_cyclone extends BaseModifier_Plus {
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
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS,
            3: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT
        }
        return Object.values(funcs);
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MANA_REGEN_CONSTANT)
    CC_GetModifierConstantManaRegen(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_mana_regen");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    CC_GetModifierMoveSpeedBonus_Constant(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed");
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_active extends BaseModifierMotionHorizontal_Plus {
    public angle: QAngle;
    public abs: any;
    public cyc_pos: any;
    public pfx_name: any;
    public pfx: any;
    public step: any;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }

    GetPriority() {
        return modifierpriority.MODIFIER_PRIORITY_ULTRA;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.BeginMotionOrDestroy()) {
                return
            }
        }

        EmitSoundOn("DOTA_Item.Cyclone.Activate", this.GetParentPlus());
        if (IsServer()) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
            this.angle = this.GetParentPlus().GetAngles();
            this.abs = this.GetParentPlus().GetAbsOrigin();
            this.cyc_pos = this.GetParentPlus().GetAbsOrigin();
            this.pfx_name = "particles/items_fx/cyclone.vpcf";
            this.pfx = ResHelper.CreateParticleEx(this.pfx_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.pfx, 0, this.abs);
        }
    }

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        let angle = this.GetParentPlus().GetAngles();
        let new_angle = RotateOrientation(angle, QAngle(0, 20, 0));
        this.GetParentPlus().SetAngles(new_angle.x, new_angle.y, new_angle.z);
        if (this.GetElapsedTime() <= 0.3) {
            this.cyc_pos.z = this.cyc_pos.z + 50;
            this.GetParentPlus().SetAbsOrigin(this.cyc_pos);
        } else if (this.GetDuration() - this.GetElapsedTime() < 0.3) {
            this.step = this.step || (this.cyc_pos.z - this.abs.z) / ((this.GetDuration() - this.GetElapsedTime()) / FrameTime());
            this.cyc_pos.z = this.cyc_pos.z - this.step;
            this.GetParentPlus().SetAbsOrigin(this.cyc_pos);
        } else {
            let pos = GFuncVector.GetRandomPosition2D(this.GetParentPlus().GetAbsOrigin(), 5);
            while (((pos - this.abs as Vector).Length2D() > 50)) {
                pos = GFuncVector.GetRandomPosition2D(this.GetParentPlus().GetAbsOrigin(), 5);
            }
            this.GetParentPlus().SetAbsOrigin(pos);
        }
    }
    BeDestroy(): void {
        StopSoundOn("DOTA_Item.Cyclone.Activate", this.GetParentPlus());
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.GetParentPlus().SetAbsOrigin(this.abs);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
        this.GetParentPlus().SetAngles(this.angle.x, this.angle.y, this.angle.z);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return state;
    }
}
@registerModifier()
export class modifier_item_imba_cyclone_active_debuff extends BaseModifierMotionHorizontal_Plus {
    public angle: any;
    public abs: any;
    public cyc_pos: any;
    public pfx_name: any;
    public pfx: any;
    public step: any;
    IsDebuff(): boolean {
        return true;
    }
    IsHidden(): boolean {
        return false;
    }
    IsPurgable(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return true;
    }

    GetPriority() {
        return 3;
    }
    BeCreated(p_0: any,): void {
        if (IsServer()) {
            if (!this.BeginMotionOrDestroy()) {
                return
            }
        }
        EmitSoundOn("DOTA_Item.Cyclone.Activate", this.GetParentPlus());
        if (IsServer()) {
            this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
            this.angle = this.GetParentPlus().GetAngles();
            this.abs = this.GetParentPlus().GetAbsOrigin();
            this.cyc_pos = this.GetParentPlus().GetAbsOrigin();
            this.pfx_name = "particles/items_fx/cyclone.vpcf";
            this.pfx = ResHelper.CreateParticleEx(this.pfx_name, ParticleAttachment_t.PATTACH_CUSTOMORIGIN, this.GetParentPlus());
            ParticleManager.SetParticleControl(this.pfx, 0, this.abs);
        }
    }

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        let angle = this.GetParentPlus().GetAngles();
        let new_angle = RotateOrientation(angle, QAngle(0, 20, 0));
        this.GetParentPlus().SetAngles(new_angle.x, new_angle.y, new_angle.z);
        if (this.GetElapsedTime() <= 0.3) {
            this.cyc_pos.z = this.cyc_pos.z + 50;
            this.GetParentPlus().SetAbsOrigin(this.cyc_pos);
        } else if (this.GetDuration() - this.GetElapsedTime() < 0.3) {
            this.step = this.step || (this.cyc_pos.z - this.abs.z) / ((this.GetDuration() - this.GetElapsedTime()) / FrameTime());
            this.cyc_pos.z = this.cyc_pos.z - this.step;
            this.GetParentPlus().SetAbsOrigin(this.cyc_pos);
        } else {
            let pos = GFuncVector.GetRandomPosition2D(this.GetParentPlus().GetAbsOrigin(), 5);
            while (((pos - this.abs as Vector).Length2D() > 50)) {
                pos = GFuncVector.GetRandomPosition2D(this.GetParentPlus().GetAbsOrigin(), 5);
            }
            this.GetParentPlus().SetAbsOrigin(pos);
        }
    }
    BeDestroy(): void {
        StopSoundOn("DOTA_Item.Cyclone.Activate", this.GetParentPlus());
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.GetParentPlus().SetAbsOrigin(this.abs);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
        this.GetParentPlus().SetAngles(this.angle[0], this.angle[1], this.angle[2]);
        let damageTable = {
            victim: this.GetParentPlus(),
            attacker: this.GetCasterPlus(),
            damage: this.GetItemPlus().GetSpecialValueFor("tooltip_drop_damage"),
            damage_type: DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL,
            ability: this.GetItemPlus()
        }
        ApplyDamage(damageTable);
    }
    CheckState(): Partial<Record<modifierstate, boolean>> {
        let state = {
            [modifierstate.MODIFIER_STATE_STUNNED]: true,
            [modifierstate.MODIFIER_STATE_INVULNERABLE]: true,
            [modifierstate.MODIFIER_STATE_NO_HEALTH_BAR]: true
        }
        return state;
    }
}

// Eul的神圣法杖（2级）
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
            for (let tornado = 1; tornado <= this.GetSpecialValueFor("tornado_count"); tornado++) {
                BaseModifier_Plus.CreateBuffThinker(this.GetCasterPlus(), this, "modifier_item_imba_cyclone_2_thinker", {
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
        for (const [_, mod] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
            mod.GetItemPlus().SetSecondaryCharges(_);
        }
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        for (const [_, modifier] of GameFunc.iPair(this.GetParentPlus().FindAllModifiersByName(this.GetName()))) {
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
            "1": "particles/econ/events/ti5/cyclone_ti5.vpcf",
            "2": "particles/econ/events/ti6/cyclone_ti6.vpcf",
            "3": "particles/econ/events/fall_major_2016/cyclone_fm06.vpcf",
            "4": "particles/econ/events/ti7/cyclone_ti7.vpcf",
            "5": "particles/econ/events/winter_major_2017/cyclone_wm07.vpcf",
            "6": "particles/econ/events/ti8/cyclone_ti8.vpcf",
            "7": "particles/econ/events/ti9/cyclone_ti9.vpcf"
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
