import { GameFunc } from "../../../GameFunc";
import { ResHelper } from "../../../helper/ResHelper";
import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
// 宽容之靴
@registerAbility()
export class item_imba_boots_of_bearing extends BaseItem_Plus {
    GetIntrinsicModifierName(): string {
        return "modifier_item_imba_boots_of_bearing";
    }

    OnSpellStart(): void {
        EmitSoundOn("DOTA_Item.DoE.Activate", this.GetCasterPlus());
        let allies = FindUnitsInRadius(this.GetCasterPlus().GetTeamNumber(), this.GetCasterPlus().GetAbsOrigin(), undefined, this.GetSpecialValueFor("radius"), DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_INVULNERABLE + DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_OUT_OF_WORLD, FindOrder.FIND_ANY_ORDER, false);
        let stacks = 0;
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (ally.IsRealUnit()) {
                stacks = stacks + this.GetSpecialValueFor("hero_multiplier");
            } else {
                stacks = stacks + 1;
            }
        }
        for (const [_, ally] of GameFunc.iPair(allies)) {
            if (!ally.HasModifier("modifier_item_imba_boots_of_bearing_active")) {
                let modifier_active_handler = ally.AddNewModifier(this.GetCasterPlus(), this, "modifier_item_imba_boots_of_bearing_active", {
                    duration: this.GetSpecialValueFor("duration")
                });
                if (modifier_active_handler) {
                    modifier_active_handler.SetStackCount(stacks);
                }
            }
        }
    }
}
@registerModifier()
export class modifier_item_imba_boots_of_bearing extends BaseModifier_Plus {
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_STRENGTH_BONUS)
    bonus_strength: number;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.STATS_AGILITY_BONUS)
    bonus_agility: number;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    bonus_movement_speed: number;

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.HEALTH_REGEN_CONSTANT)
    bonus_hp_regen: number;


    public Init(params?: IModifierTable): void {
        this.bonus_strength = this.GetSpecialValueFor("bonus_strength");
        this.bonus_agility = this.GetSpecialValueFor("bonus_agility");
        this.bonus_movement_speed = this.GetSpecialValueFor("bonus_movement_speed");
        this.bonus_hp_regen = this.GetSpecialValueFor("bonus_hp_regen");

    }
    IsAura(): boolean {
        return true;
    }
    GetAuraRadius(): number {
        if (this.GetItemPlus()) {
            return this.GetItemPlus().GetSpecialValueFor("radius");
        }
    }
    GetAuraSearchFlags(): DOTA_UNIT_TARGET_FLAGS {
        return DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_NONE;
    }
    GetAuraSearchTeam(): DOTA_UNIT_TARGET_TEAM {
        return DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY;
    }
    GetAuraSearchType(): DOTA_UNIT_TARGET_TYPE {
        return DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC;
    }
    GetModifierAura(): string {
        return "modifier_item_imba_boots_of_bearing_aura_effect";
    }
}

@registerModifier()
export class modifier_item_imba_boots_of_bearing_aura_effect extends BaseModifier_Plus {

    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_CONSTANT)
    aura_bonus_movement_speed: number;

    public Init(params?: IModifierTable): void {
        this.aura_bonus_movement_speed = this.GetSpecialValueFor("aura_bonus_movement_speed");

    }
}

@registerModifier()
export class modifier_item_imba_boots_of_bearing_active extends BaseModifier_Plus {
    public particle_buff: any;
    public bonus_attack_speed_pct: number;
    public bonus_movement_speed_pct: number;
    public active_as_per_ally: number = 0;
    public active_ms_per_ally: number = 0;
    BeCreated(p_0: any,): void {
        this.particle_buff = "particles/items_fx/drum_of_endurance_buff.vpcf";
        this.bonus_attack_speed_pct = this.GetItemPlus().GetSpecialValueFor("bonus_attack_speed_pct");
        this.bonus_movement_speed_pct = this.GetItemPlus().GetSpecialValueFor("bonus_movement_speed_pct");
        // this.active_as_per_ally = this.GetItemPlus().GetSpecialValueFor("active_as_per_ally");
        // this.active_ms_per_ally = this.GetItemPlus().GetSpecialValueFor("active_ms_per_ally");
        let particle_buff_fx = ResHelper.CreateParticleEx(this.particle_buff, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, this.GetParentPlus());
        ParticleManager.SetParticleControl(particle_buff_fx, 0, this.GetParentPlus().GetAbsOrigin());
        ParticleManager.SetParticleControl(particle_buff_fx, 1, Vector(0, 0, 0));
        this.AddParticle(particle_buff_fx, false, false, -1, false, false);
    }
    /** DeclareFunctions():modifierfunction[] {
        return Object.values({
            1: GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE,
            2: GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT
        });
    } */
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.MOVESPEED_BONUS_PERCENTAGE)
    CC_GetModifierMoveSpeedBonus_Percentage(): number {
        return this.bonus_movement_speed_pct /**+ this.active_ms_per_ally * this.GetStackCount();*/
    }
    @registerProp(GPropertyConfig.EMODIFIER_PROPERTY.ATTACKSPEED_BONUS_CONSTANT)
    CC_GetModifierAttackSpeedBonus_Constant(): number {
        return this.bonus_attack_speed_pct /**+ this.active_as_per_ally * this.GetStackCount();*/
    }
}