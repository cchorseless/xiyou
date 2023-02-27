
import { ResHelper } from "../../../helper/ResHelper";
import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
@registerAbility()
export class imba_death_prophet_silence extends BaseAbility_Plus {
    GetAOERadius(): number {
        return this.GetSpecialValueFor("radius");
    }
    OnSpellStart(): void {
        if (IsClient()) {
            return;
        }
        this.GetCasterPlus().EmitSound("Hero_DeathProphet.Silence");
        let enemies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCursorPosition(), undefined, this.GetSpecialValueFor("radius"), this.GetAbilityTargetTeam(), this.GetAbilityTargetType(), this.GetAbilityTargetFlags(), FindOrder.FIND_ANY_ORDER, false);
        let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_silence.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, undefined, this.GetCasterPlus());
        ParticleManager.SetParticleControl(pfx, 0, this.GetCursorPosition());
        ParticleManager.SetParticleControl(pfx, 1, Vector(this.GetSpecialValueFor("radius"), 0, 1));
        ParticleManager.ReleaseParticleIndex(pfx);
        for (const [_, enemy] of ipairs(enemies)) {
            let pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_silence_impact.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, enemy, this.GetCasterPlus());
            ParticleManager.SetParticleControl(pfx, 0, enemy.GetAbsOrigin());
            ParticleManager.ReleaseParticleIndex(pfx);
            enemy.AddNewModifier(this.GetCasterPlus(), this, "modifier_imba_death_prophet_silence", {
                duration: this.GetDuration() * (1 - enemy.GetStatusResistance())
            });
        }
    }
}
@registerModifier()
export class modifier_imba_death_prophet_silence extends BaseModifier_Plus {
    public pfx: any;
    public pfx2: any;
    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_SILENCED]: true
        };
    }
    BeCreated(p_0: any,): void {
        if (IsClient()) {
            return;
        }
        this.pfx = ResHelper.CreateParticleEx("particles/units/heroes/hero_death_prophet/death_prophet_silence_custom.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.pfx, 0, this.GetParentPlus().GetAbsOrigin());
        this.pfx2 = ResHelper.CreateParticleEx("particles/generic_gameplay/generic_silenced.vpcf", ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
        ParticleManager.SetParticleControl(this.pfx2, 0, this.GetParentPlus().GetAbsOrigin());
    }
    BeDestroy(): void {
        if (IsClient()) {
            return;
        }
        if (this.pfx) {
            ParticleManager.DestroyParticle(this.pfx, false);
            ParticleManager.ReleaseParticleIndex(this.pfx);
        }
        if (this.pfx2) {
            ParticleManager.DestroyParticle(this.pfx2, false);
            ParticleManager.ReleaseParticleIndex(this.pfx2);
        }
    }
}
