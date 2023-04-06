import { ResHelper } from "../../../helper/ResHelper";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerModifier } from "../../entityPlus/Base_Plus";
import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
import { modifier_combination_effect } from "./modifier_combination_effect";


@registerModifier()
export class modifier_sect_phyarm_down_base_a extends modifier_combination_effect {

    Init() {
        let parent = this.GetParentPlus();
        this.buff_fx = ResHelper.CreateParticleEx("particles/units/heroes/hero_skeletonking/wraith_king_ghosts_spirits_copy.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, parent);
        // ParticleManager.SetParticleControl(this.buff_fx, 0, Vector(100, 100, 200));
        this.AddParticle(this.buff_fx, false, false, -1, false, false);
        let phyarm_down = this.getSpecialData("phyarm_down");
        let duration = this.getSpecialData("duration");
        let t = parent.TempData().sect_phyarm_down || {
            phyarm_down: 0,
            duration: 0
        };
        t.phyarm_down += phyarm_down;
        t.duration += duration;
        parent.TempData().sect_phyarm_down = t;
        if (IsServer()) {
            let allenemy = this.getAllEnemy();
            allenemy.forEach(enemy => {
                if (GFuncEntity.IsValid(enemy)) {
                    let buff = modifier_sect_phyarm_down_enemy.applyOnly(enemy, parent);
                    buff.SetStackCount(math.abs(t.phyarm_down))
                }
            })
        }
    }

    @registerEvent(Enum_MODIFIER_EVENT.ON_DEATH)
    CC_ON_DEATH(keys: ModifierInstanceEvent): void {
        if (IsServer()) {
            let parent = this.GetParentPlus();
            let t = parent.TempData().sect_phyarm_down || { duration: 0 };
            if (t.duration > 0) {
                let summon = parent.CreateSummon(parent.GetUnitName(), parent.GetAbsOrigin(), t.duration);
                summon.AddNewModifier(parent, null, "modifier_skeleton_king_reincarnation_scepter_active", { duration: t.duration });
            }
        }
    }
}
@registerModifier()
export class modifier_sect_phyarm_down_base_b extends modifier_combination_effect {
    Init() {
        let parent = this.GetParentPlus();
        let phyarm_down = this.getSpecialData("phyarm_down");
        let duration = this.getSpecialData("duration");
        let t = parent.TempData().sect_phyarm_down || {
            phyarm_down: 0,
            duration: 0
        };
        t.phyarm_down += phyarm_down;
        t.duration += duration;
        parent.TempData().sect_phyarm_down = t;
        if (IsServer()) {
            let allenemy = this.getAllEnemy();
            allenemy.forEach(enemy => {
                if (GFuncEntity.IsValid(enemy)) {
                    let buff = modifier_sect_phyarm_down_enemy.applyOnly(enemy, parent);
                    buff.SetStackCount(math.abs(t.phyarm_down))
                }
            })
        }
    }
}
@registerModifier()
export class modifier_sect_phyarm_down_base_c extends modifier_sect_phyarm_down_base_b {
}


@registerModifier()
export class modifier_sect_phyarm_down_enemy extends BaseModifier_Plus {
    public particle: ParticleID;
    IsHidden(): boolean {
        return false;
    }
    IsDebuff(): boolean {
        return true;
    }
    IsPurgable(): boolean {
        return false;
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.PHYSICAL_ARMOR_BONUS)
    CC_PHYSICAL_ARMOR_BONUS(): number {
        return -this.GetStackCount();
    }

    BeCreated(p_0: any,): void {
        // let caster = this.GetCasterPlus();
        // let t = caster.TempData().sect_phyarm_down || { phyarm_down: 0 };
        // this.phyarm = t.phyarm_down;
        if (IsServer()) {
            // todo 碎甲特效
            // this.particle = ResHelper.CreateParticleEx("particles/items2_fx/radiance.vpcf", ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus(), this.GetCasterPlus());
            // ParticleManager.SetParticleControl(this.particle, 0, this.GetParentPlus().GetAbsOrigin());
            // ParticleManager.SetParticleControl(this.particle, 1, this.GetCasterPlus().GetAbsOrigin());
        }
    }
    BeDestroy(): void {
        if (IsServer()) {
            ParticleManager.ClearParticle(this.particle, false);
        }
    }

}