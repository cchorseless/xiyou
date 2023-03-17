import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

@registerModifier()
export class modifier_generic_barrier extends BaseModifier_Plus {
    public barrier: number;
    public nfx: ParticleID;
    IsHidden(): boolean {
        return false;
    }
    BeCreated(kv: any): void {
        this.barrier = kv.barrier || 0;
        this.StartIntervalThink(0.3);
        this.nfx = ResHelper.CreateParticleEx("particles/items3_fx/lotus_orb_shield.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.nfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
    }
    OnIntervalThink(): void {
        this.barrier = math.max(0, this.barrier - math.max(1, this.barrier * this.ModifierBarrier_DegradeRate()));
        if (this.ModifierBarrier_Bonus() <= 0) {
            this.Destroy();
        }
    }
    BeRefresh(kv: any): void {
        this.barrier = (this.barrier || 0) + kv.barrier;
        this.ModifierBarrier_Bonus = () => {
            return this.barrier;
        }
        this.nfx = ResHelper.CreateParticleEx("particles/items3_fx/lotus_orb_shield.vpcf", ParticleAttachment_t.PATTACH_POINT_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControlEnt(this.nfx, 0, this.GetParentPlus(), ParticleAttachment_t.PATTACH_POINT_FOLLOW, "attach_hitloc", this.GetParentPlus().GetAbsOrigin(), true);
    }
    BeRemoved(): void {
        ParticleManager.DestroyParticle(this.nfx, false);
    }
    GetAttributes( /** kv */): DOTAModifierAttribute_t {
        return DOTAModifierAttribute_t.MODIFIER_ATTRIBUTE_MULTIPLE;
    }
    /** DeclareFunctions():modifierfunction[] {
        let funcs = {
            1: GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE
        }
        return Object.values(funcs);
    } */
    ModifierBarrier_Bonus() {
        return (this.barrier || 0);
    }
    ModifierBarrier_DegradeRate() {
        return 0.01;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.INCOMING_DAMAGE_PERCENTAGE)
    CC_GetModifierIncomingDamage_Percentage(params: ModifierAttackEvent): number {
        if (params.damage < this.ModifierBarrier_Bonus()) {
            this.barrier = (this.ModifierBarrier_Bonus() || 0) - params.damage;
            return -100;
        } else if (this.ModifierBarrier_Bonus() > 0) {
            let dmgRed = (params.damage / this.ModifierBarrier_Bonus()) * (-1);
            this.barrier = 0;
            return dmgRed;
        } else {
            this.Destroy();
        }
    }
}
