
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifierMotionHorizontal_Plus, BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 原力法杖
@registerAbility()
export class item_imba_force_staff extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_force_staff";
    }
    CastFilterResultTarget(target: CDOTA_BaseNPC): UnitFilterResult {
        if (this.GetCasterPlus() == target || target.HasModifier("modifier_imba_gyrocopter_homing_missile")) {
            return UnitFilterResult.UF_SUCCESS;
        } else {
            return UnitFilter(target, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CUSTOM, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NOT_MAGIC_IMMUNE_ALLIES, this.GetCasterPlus().GetTeamNumber());
        }
    }
    GetCastRange(location: Vector, target: CDOTA_BaseNPC | undefined): number {
        if (!target || target.GetTeamNumber() == this.GetCasterPlus().GetTeamNumber()) {
            return super.GetCastRange(location, target);
        } else {
            return this.GetSpecialValueFor("enemy_cast_range");
        }
    }
    OnSpellStart(): void {
        if (!IsServer()) {
            return;
        }
        let ability = this;
        let target = this.GetCursorTarget();
        if (target.TriggerSpellAbsorb(ability)) {
            return undefined;
        }
        EmitSoundOn("DOTA_Item.ForceStaff.Activate", target);
        target.AddNewModifier(this.GetCasterPlus(), ability, "modifier_item_imba_force_staff_active", {
            duration: ability.GetSpecialValueFor("duration")
        });
    }
}
@registerModifier()
export class modifier_item_imba_force_staff extends BaseModifier_Plus {
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
        this.OnIntervalThink();
        this.StartIntervalThink(1.0);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    CC_GetModifierConstantHealthRegen(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_health_regen");
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_INTELLECT_BONUS)
    CC_GetModifierBonusStats_Intellect(): number {
        return this.GetItemPlus().GetSpecialValueFor("bonus_intellect");
    }
}
@registerModifier()
export class modifier_item_imba_force_staff_active extends BaseModifierMotionHorizontal_Plus {
    public pfx: any;
    public angle: any;
    public distance: number;
    IsDebuff(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return true;
    }
    IsStunDebuff(): boolean {
        return false;
    }

    GetPriority() {
        return 2;
    }
    IgnoreTenacity() {
        return true;
    }
    BeCreated(p_0: any,): void {

        if (!IsServer()) {
            return;
        }
        this.BeginMotionOrDestroy();
        if (this.GetParentPlus().HasModifier("modifier_legion_commander_duel") || this.GetParentPlus().HasModifier("modifier_imba_enigma_black_hole") || this.GetParentPlus().HasModifier("modifier_imba_faceless_void_chronosphere_handler")) {
            this.Destroy();
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/items_fx/force_staff.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        this.GetParentPlus().StartGesture(GameActivity_t.ACT_DOTA_FLAIL);
        this.StartIntervalThink(FrameTime());
        this.angle = this.GetParentPlus().GetForwardVector().Normalized();
        this.distance = this.GetItemPlus().GetSpecialValueFor("push_length") / (this.GetDuration() / FrameTime());
    }
    BeDestroy(): void {
        if (!IsServer()) {
            return;
        }
        ParticleManager.DestroyParticle(this.pfx, false);
        ParticleManager.ReleaseParticleIndex(this.pfx);
        this.GetParentPlus().FadeGesture(GameActivity_t.ACT_DOTA_FLAIL);
        ResolveNPCPositions(this.GetParentPlus().GetAbsOrigin(), 128);
    }

    UpdateHorizontalMotion(unit: IBaseNpc_Plus, time: number) {
        if (!IsServer()) {
            return;
        }
        if (this.GetParentPlus().HasModifier("modifier_mars_arena_of_blood_leash") && this.GetParentPlus().findBuff("modifier_mars_arena_of_blood_leash").GetAuraOwner() && (this.GetParentPlus().GetAbsOrigin() - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetAuraOwner().GetAbsOrigin() as Vector).Length2D() >= this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("radius") - this.GetParentPlus().FindModifierByName("modifier_mars_arena_of_blood_leash").GetItemPlus().GetSpecialValueFor("width")) {
            this.Destroy();
            return;
        }
        let pos = unit.GetAbsOrigin();
        GridNav.DestroyTreesAroundPoint(pos, 80, false);
        let pos_p = this.angle * this.distance;
        let next_pos = GetGroundPosition(pos + pos_p as Vector, unit);
        unit.SetAbsOrigin(next_pos);
    }
}
