import { BaseModifier_Plus } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";

/**嘲讽 */
@registerModifier()
export class modifier_generic_taunt extends BaseModifier_Plus {
    GetTexture() {
        return "harpy_storm_chain_lightning";
    }
    IsHidden() {
        return false;
    }
    IsDebuff() {
        return true;
    }
    IsPurgable() {
        return false;
    }
    IsPurgeException() {
        return false;
    }
    IsStunDebuff() {
        return false;
    }
    AllowIllusionDuplicate() {
        return false;
    }

    StatusEffectPriority() {
        return modifierpriority.MODIFIER_PRIORITY_HIGH;
    }
    TauntUnit: IBaseNpc_Plus;

    public Init(params?: object): void {
        if (IsServer()) {
            this.TauntUnit = this.GetCasterPlus();
            this.GetParentPlus().Stop();
            this.GetParentPlus().Interrupt();
        }
    }
    GetEffectName(): string {
        return "particles/generic/brd_taunt/brd_taunt_mark_base.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    GetStatusEffectName(): string {
        return "particles/status_fx/status_effect_beserkers_call.vpcf";
    }

    public BeDestroy(): void {
        this.TauntUnit = null;
    }

    /**
     * 触电
     * @param hCaster
     * @param hAbility
     * @param iShockStack
     */
    static Taunt(target: IBaseNpc_Plus, hCaster: IBaseNpc_Plus, hAbility: IBaseAbility_Plus, duration: number) {
        if (!IsServer()) {
            return;
        }
        modifier_generic_taunt.apply(target, hCaster, hAbility, {
            duration: duration,
        });
    }
}
