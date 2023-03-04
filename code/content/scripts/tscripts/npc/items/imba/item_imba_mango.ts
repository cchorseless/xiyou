
    import { AI_ability } from "../../../ai/AI_ability";
    import { GameFunc } from "../../../GameFunc";
    import { ResHelper } from "../../../helper/ResHelper";
    import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
    import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
    import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
    import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
    import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
    function Mango(keys) {
    let caster = keys.caster;
    let target = keys.target;
    let ability = keys.ability;
    let ability_level = ability.GetLevel() - 1;
    let sound_cast = keys.sound_cast;
    if (!target) {
        target = caster;
    }
    let minimum_mana = ability.GetLevelSpecialValueFor("minimum_mana", ability_level);
    let mana_percent = ability.GetLevelSpecialValueFor("mana_percent", ability_level);
    let mana_to_restore = target.GetMaxMana() * mana_percent / 100;
    if (mana_to_restore < minimum_mana) {
        mana_to_restore = minimum_mana;
    }
    target.EmitSound(sound_cast);
    target.GiveMana(mana_to_restore);
}
