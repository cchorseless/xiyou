
//     import { AI_ability } from "../../../ai/AI_ability";
//     import { GameFunc } from "../../../GameFunc";
//     import { ResHelper } from "../../../helper/ResHelper";
//     import { BaseAbility_Plus } from "../../entityPlus/BaseAbility_Plus";
//     import { BaseItem_Plus } from "../../entityPlus/BaseItem_Plus";
//     import { BaseModifier_Plus, registerProp } from "../../entityPlus/BaseModifier_Plus";
//     import { registerAbility, registerModifier } from "../../entityPlus/Base_Plus";
//     import { Enum_MODIFIER_EVENT, registerEvent } from "../../propertystat/modifier_event";
//     import globals from "./globals";
// import { pairs } from "@wowts/lua";
// function BattleFury(keys) {
//     let caster = keys.caster;
//     let target = keys.target_points[0];
//     let ability = keys.ability;
//     let ability_level = ability.GetLevel() - 1;
//     let chop_radius = ability.GetLevelSpecialValueFor("chop_radius", ability_level);
//     GridNav.DestroyTreesAroundPoint(target, chop_radius, false);
//     let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target, undefined, chop_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_ALL, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
//     for (const [_, enemy] of GameFunc.iPair(enemies)) {
//         if (IsWardOrBomb(enemy)) {
//             enemy.Kill(ability, caster);
//         }
//     }
// }
// function BattleFuryHit(keys) {
//     let caster = keys.caster;
//     let target = keys.target;
//     let damage = keys.damage;
//     let ability = keys.ability;
//     let ability_level = ability.GetLevel() - 1;
//     let modifier_cleave = keys.modifier_cleave;
//     let particle_cleave = keys.particle_cleave;
//     if (target.IsBuilding()) {
//         return undefined;
//     }
//     let cleave_damage = ability.GetLevelSpecialValueFor("ranged_cleave_damage", ability_level);
//     let quelling_bonus = ability.GetLevelSpecialValueFor("quelling_bonus", ability_level);
//     let cleave_radius = ability.GetLevelSpecialValueFor("cleave_radius", ability_level);
//     let target_loc = target.GetAbsOrigin();
//     if (!caster.IsRangedAttacker() || caster.HasModifier("modifier_imba_berserkers_rage")) {
//         cleave_damage = ability.GetLevelSpecialValueFor("melee_cleave_damage", ability_level);
//     }
//     let cleave_stacks = caster.findBuffStack(modifier_cleave, caster);
//     cleave_damage = cleave_damage * cleave_stacks;
//     quelling_bonus = quelling_bonus * cleave_stacks;
//     if (!(target.IsRealUnit() || target.IsBuilding() || target.IsRoshan())) {
//         ApplyDamage({
//             attacker: caster,
//             victim: target,
//             ability: ability,
//             damage: damage * quelling_bonus * 0.01,
//             damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL
//         });
//     }
//     damage = damage * cleave_damage * 0.01;
//     let cleave_pfx = ResHelper.CreateParticleEx(particle_cleave, ParticleAttachment_t.PATTACH_ABSORIGIN, target);
//     ParticleManager.SetParticleControl(cleave_pfx, 0, target_loc);
//     let enemies = FindUnitsInRadius(caster.GetTeamNumber(), target_loc, undefined, cleave_radius, DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY, DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BASIC, DOTA_UNIT_TARGET_FLAGS.DOTA_UNIT_TARGET_FLAG_MAGIC_IMMUNE_ENEMIES, FindOrder.FIND_ANY_ORDER, false);
//     for (const [_, enemy] of GameFunc.iPair(enemies)) {
//         if (enemy != target && !enemy.IsAttackImmune()) {
//             ApplyDamage({
//                 attacker: caster,
//                 victim: enemy,
//                 ability: ability,
//                 damage: damage,
//                 damage_type: DAMAGE_TYPES.DAMAGE_TYPE_PURE
//             });
//         }
//     }
// }
// function BattleFuryStackUp(keys) {
//     let caster = keys.caster;
//     let ability = keys.ability;
//     let modifier_cleave = keys.modifier_cleave;
//     AddStacks(ability, caster, caster, modifier_cleave, 1, true);
// }
// function BattleFuryStackDown(keys) {
//     let caster = keys.caster;
//     let ability = keys.ability;
//     let modifier_cleave = keys.modifier_cleave;
//     let current_stacks = caster.findBuffStack(modifier_cleave, caster);
//     if (current_stacks <= 1) {
//         caster.RemoveModifierByName(modifier_cleave);
//     } else {
//         caster.SetModifierStackCount(modifier_cleave, caster, current_stacks - 1);
//     }
// }
