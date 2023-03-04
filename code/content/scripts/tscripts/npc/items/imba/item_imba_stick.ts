
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    import globals from "./globals";
import { pairs } from "@wowts/lua";
function MagicStick(keys) {
    let caster = keys.caster;
    let ability = keys.ability;
    let ability_level = ability.GetLevel() - 1;
    let sound_cast = keys.sound_cast;
    let particle_cast = keys.particle_cast;
    let restore_per_charge = ability.GetLevelSpecialValueFor("restore_per_charge", ability_level);
    let current_charges = ability.GetCurrentCharges();
    caster.EmitSound(sound_cast);
    let stick_pfx = ResHelper.CreateParticleEx(particle_cast, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, caster);
    ParticleManager.SetParticleControl(stick_pfx, 0, caster.GetAbsOrigin());
    ParticleManager.SetParticleControl(stick_pfx, 1, Vector(10, 0, 0));
    caster.Heal(current_charges * restore_per_charge, ability);
    caster.GiveMana(current_charges * restore_per_charge);
    ability.SetCurrentCharges(0);
}
function MagicStickCharge(keys) {
    let caster = keys.caster;
    let target = keys.unit;
    let ability = keys.ability;
    let ability_level = ability.GetLevel() - 1;
    let cast_ability = keys.event_ability;
    let cast_ability_name = cast_ability.GetName();
    let max_charges = ability.GetLevelSpecialValueFor("max_charges", ability_level);
    let current_charges = ability.GetCurrentCharges();
    let mana_spent = cast_ability.GetManaCost(cast_ability.GetLevel() - 1);
    let procs_stick = cast_ability.ProcsMagicStick();
    let caster_visible = caster.CanEntityBeSeenByMyTeam(target);
    let special_abilities = {
        1: "storm_spirit_ball_lightning"
    }
    let special_ability_casted = false;
    for (const [_, special_ability] of ipairs(special_abilities)) {
        if (cast_ability_name == special_ability) {
            return undefined;
        }
    }
    if (mana_spent > 0 && procs_stick && caster_visible) {
        if (current_charges < max_charges) {
            ability.SetCurrentCharges(current_charges + 1);
        }
    }
}
function MagicWandSetCharges(keys) {
    let ability = keys.ability;
    if (!ability.initialized) {
        ability.initialized = true;
        ability.SetCurrentCharges(ability.GetSpecialValueFor("initial_charges"));
    }
}
