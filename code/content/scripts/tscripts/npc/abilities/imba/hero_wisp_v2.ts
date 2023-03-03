
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    @registerAbility()
export class imba_wisp_spirits_v2 extends BaseAbility_Plus {
OnSpellStart():void {
    this.GetCasterPlus().RemoveModifierByName("modifier_imba_wisp_spirits_v2");
    this.GetCasterPlus().AddNewModifier(this.GetCasterPlus(),this, "modifier_imba_wisp_spirits_v2", {
        duration: this.GetDuration()
    });
}
}
@registerModifier()
export class modifier_imba_wisp_spirits_v2 extends BaseModifier_Plus {
public creep_damage : number; 
public revolution_time : number; 
public min_range : number; 
public hero_hit_radius : number; 
public explode_radius : number; 
public hit_radius : number; 
public spirit_movement_rate : any; 
public spirit_duration : number; 
public number_of_spirits : any; 
public spawn_interval : number; 
public hero_damage : number; 
public max_range : number; 
public ability_duration : number; 
public spirits_spawned : any; 
BeCreated(p_0:any,):void {
    if (!this.GetAbilityPlus()) {
        this.Destroy();
        return;
    }
    this.creep_damage = this.GetSpecialValueFor("creep_damage");
    this.revolution_time = this.GetSpecialValueFor("revolution_time");
    this.min_range = this.GetSpecialValueFor("min_range");
    this.hero_hit_radius = this.GetSpecialValueFor("hero_hit_radius");
    this.explode_radius = this.GetSpecialValueFor("explode_radius");
    this.hit_radius = this.GetSpecialValueFor("hit_radius");
    this.spirit_movement_rate = this.GetSpecialValueFor("spirit_movement_rate");
    this.spirit_duration = this.GetSpecialValueFor("spirit_duration");
    this.number_of_spirits = this.GetSpecialValueFor("number_of_spirits");
    this.spawn_interval = this.GetSpecialValueFor("spawn_interval");
    if (!IsServer()) {
        return;
    }
    this.hero_damage = this.GetAbilityPlus().GetTalentSpecialValueFor("hero_damage");
    this.max_range = this.GetAbilityPlus().GetTalentSpecialValueFor("min_range");
    this.ability_duration = this.GetAbilityPlus().GetDuration();
    this.spirits_spawned = 0;
    this.StartIntervalThink(this.spawn_interval);
}
OnIntervalThink():void {
    let spirit = BaseNpc_Plus.CreateUnitByName("npc_dota_wisp_spirit", this.GetCasterPlus().GetAbsOrigin() + Vector(0, this.max_range, 0), false, this.GetCasterPlus(), this.GetCasterPlus(), this.GetCasterPlus().GetTeamNumber());
    spirit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_imba_wisp_spirit_v2_invulnerable", {});
    spirit.AddNewModifier(this.GetCasterPlus(), this.GetAbilityPlus(), "modifier_kill", {
        duration: this.ability_duration
    });
    this.spirits_spawned = this.spirits_spawned + 1;
    if (this.spirits_spawned >= this.number_of_spirits) {
    }
}
}
@registerModifier()
export class modifier_imba_wisp_spirit_v2_invulnerable extends BaseModifier_Plus {
}
@registerModifier()
export class modifier_imba_wisp_spirits_v2_slow extends BaseModifier_Plus {
}
@registerAbility()
export class imba_wisp_spirits_in_v2 extends BaseAbility_Plus {
}
