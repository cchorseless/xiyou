
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

/** dota原英雄数据 */
export const Data_dota_hero_wisp = { "Model": "models/heroes/wisp/wisp.vmdl", "SoundSet": "Hero_Wisp", "IdleSoundLoop": "Hero_Wisp.IdleLoop", "Enabled": "1", "Role": "Support,Escape,Nuker", "Rolelevels": "3,2,1", "Complexity": "3", "Team": "Good", "HeroID": "91", "HeroOrderID": "83", "ModelScale": "0.930000", "VersusScale": "0.770000", "workshop_guide_name": "Io", "PickSound": "wisp_move03", "BanSound": "wisp_shitty_crummy_wizard", "CMEnabled": "1", "SimilarHeroes": "50,57,111", "NameAliases": "wisp", "NoCombine": "1", "Legs": "0", "LastHitChallengeRival": "npc_dota_hero_zuus", "AbilityDraftDisabled": "0", "HeroSelectSoundEffect": "Hero_Wisp.Pick", "GibType": "ethereal", "GibTintColor": "171 230 255 255", "Ability1": "wisp_tether", "Ability2": "wisp_spirits", "Ability3": "wisp_overcharge", "Ability4": "wisp_spirits_in", "Ability5": "wisp_spirits_out", "Ability6": "wisp_relocate", "Ability7": "wisp_tether_break", "Ability10": "special_bonus_hp_regen_5", "Ability11": "special_bonus_attack_damage_30", "Ability12": "special_bonus_unique_wisp_3", "Ability13": "special_bonus_spell_lifesteal_15", "Ability14": "special_bonus_unique_wisp", "Ability15": "special_bonus_unique_wisp_6", "Ability16": "special_bonus_hp_900", "Ability17": "special_bonus_unique_wisp_4", "AbilityDraftIgnoreCount": "8", "ArmorPhysical": "1", "AttackCapabilities": "DOTA_UNIT_CAP_RANGED_ATTACK", "AttackDamageMin": "28", "AttackDamageMax": "34", "AttackRate": "1.700000", "AttackAnimationPoint": "0.30000", "AttackAcquisitionRange": "800", "AttackRange": "500", "ProjectileModel": "particles/units/heroes/hero_wisp/wisp_base_attack.vpcf", "ProjectileSpeed": "1200", "AttributePrimary": "DOTA_ATTRIBUTE_STRENGTH", "AttributeBaseStrength": "17", "AttributeStrengthGain": "3.000000", "AttributeBaseAgility": "14", "AttributeAgilityGain": "1.600000", "AttributeBaseIntelligence": "23", "AttributeIntelligenceGain": "1.700000", "MovementSpeed": "320", "MovementTurnRate": "0.700000", "particle_folder": "particles/units/heroes/hero_wisp", "GameSoundsFile": "soundevents/game_sounds_heroes/game_sounds_wisp.vsndevts", "VoiceFile": "soundevents/voscripts/game_sounds_vo_wisp.vsndevts", "RenderablePortrait": {}, "precache": { "model": "models/development/invisiblebox.vmdl" }, "ItemSlots": { "0": { "SlotIndex": "0", "SlotName": "head", "SlotText": "#LoadoutSlot_Head_Accessory", "TextureWidth": "256", "TextureHeight": "256", "MaxPolygonsLOD0": "2300", "MaxPolygonsLOD1": "2300" }, "1": { "SlotIndex": "1", "SlotName": "taunt", "SlotText": "#LoadoutSlot_Taunt" }, "2": { "SlotIndex": "2", "SlotName": "ambient_effects", "SlotText": "#LoadoutSlot_Ambient_Effects", "DisplayInLoadout": "0" } }, "Bot": { "HeroType": "DOTA_BOT_PURE_SUPPORT", "LaningInfo": { "SoloDesire": "0", "RequiresBabysit": "0", "ProvidesBabysit": "2", "SurvivalRating": "2", "RequiresFarm": "1", "ProvidesSetup": "0", "RequiresSetup": "2" } } };

@registerUnit()
export class dota_hero_wisp extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
        this.__IN_DOTA_NAME__ = "npc_dota_hero_wisp";
        this.__IN_DOTA_DATA__ = Data_dota_hero_wisp;
    }
}

