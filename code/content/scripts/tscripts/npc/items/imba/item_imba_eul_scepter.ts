
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
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
    public angle: any;
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
        this.GetParentPlus().SetAngles(this.angle[0], this.angle[1], this.angle[2]);
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
