
function Mango(keys: any) {
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
