import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { modifier_combination_effect } from "./modifier_combination_effect";



@registerModifier()
export class modifier_sect_assault_base_a extends modifier_combination_effect {

    Init() {
        let phyarm = this.getSpecialData("phyarm");
        let magicarm = this.getSpecialData("magicarm");
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_assault || {
            phyarm: 0,
            magicarm: 0,
        };
        t.phyarm += phyarm;
        t.magicarm += magicarm;
        parent.TempData().sect_assault = t;
        modifier_sect_assault_stampede_haste.applyOnly(this.GetParentPlus(), this.GetParentPlus(), null, {
            duration: duration
        });
    }
}

@registerModifier()
export class modifier_sect_assault_base_b extends modifier_combination_effect {
    Init() {
        let phyarm = this.getSpecialData("phyarm");
        let magicarm = this.getSpecialData("magicarm");
        let duration = this.getSpecialData("duration");
        let parent = this.GetParentPlus();
        let t = parent.TempData().sect_assault || {
            phyarm: 0,
            magicarm: 0,
            // duration: 0
        };
        t.phyarm += phyarm;
        t.magicarm += magicarm;
        // t.duration = duration;
        parent.TempData().sect_assault = t;
    }
}
@registerModifier()
export class modifier_sect_assault_base_c extends modifier_sect_assault_base_b {
}



@registerModifier()
export class modifier_sect_assault_stampede_haste extends BaseModifier_Plus {
    public parent: IBaseNpc_Plus;
    public particle_stampede: string;
    public stun_duration: number;
    public radius: number;
    public absolute_move_speed: number;
    public particle_stampede_fx: ParticleID;
    BeCreated(p_0: any,): void {
        this.parent = this.GetParentPlus();
        this.particle_stampede = "particles/units/heroes/hero_centaur/centaur_stampede.vpcf";
        this.stun_duration = 1;
        this.radius = 100;
        this.absolute_move_speed = 500;
        let sound_cast = "Hero_Centaur.Stampede.Cast";
        EmitSoundOn(sound_cast, this.parent);
        if (IsServer()) {
            this.particle_stampede_fx = ResHelper.CreateParticleEx(this.particle_stampede, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.parent);
            ParticleManager.SetParticleControl(this.particle_stampede_fx, 0, this.parent.GetAbsOrigin());
            this.AddParticle(this.particle_stampede_fx, false, false, -1, false, false);
            this.StartIntervalThink(0.1);
        }
    }
    OnIntervalThink(): void {
        if (IsServer()) {
            let enemies = this.parent.FindUnitsInRadiusPlus(this.radius);
            for (const [_, enemy] of GameFunc.iPair(enemies)) {
                if (!enemy.IsMagicImmune() && !enemy.TempData().trampled_in_stampede) {
                    enemy.TempData().trampled_in_stampede = true;
                    enemy.ApplyStunned(null, this.parent, this.stun_duration);
                }
            }

        }
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN,
            2: GPropertyConfig.EMODIFIER_PROPERTY.STATUS_RESISTANCE_STACKING
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_ABSOLUTE_MIN)
    CC_GetModifierMoveSpeed_AbsoluteMin(): number {
        return this.absolute_move_speed;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS(): number {
        let t = this.GetParentPlus().TempData().sect_assault;
        if (t) {
            return t.phyarm;
        }
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MAGICAL_ARMOR_BONUS)
    CC_MAGICAL_ARMOR_BONUS(): number {
        let t = this.GetParentPlus().TempData().sect_assault;
        if (t) {
            return t.magicarm;
        }
    }

    CheckState(): Partial<Record<modifierstate, boolean>> {
        return {
            [modifierstate.MODIFIER_STATE_NO_UNIT_COLLISION]: true
        };
    }
    GetEffectName(): string {
        return "particles/units/heroes/hero_centaur/centaur_stampede_overhead.vpcf";
    }
    GetEffectAttachType(): ParticleAttachment_t {
        return ParticleAttachment_t.PATTACH_OVERHEAD_FOLLOW;
    }
    IsPurgable(): boolean {
        return false;
    }
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return false;
    }
}






