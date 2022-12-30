
import { LogHelper } from "../../../helper/LogHelper";
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";
import { modifier_test } from "../../modifier/modifier_test";

/** dota原英雄数据 */
export const Data_dota_hero_abyssal_underlord = { "Model": "models/heroes/abyssal_underlord/abyssal_underlord_v2.vmdl", "IdleExpression": "scenes/abyssal_underlord/abyssal_underlord_exp_idle_01.vcd", "SoundSet": "Hero_AbyssalUnderlord", "PickSound": "abyssal_underlord_abys_spawn_01", "BanSound": "abyssal_underlord_abys_anger_01", "HeroSelectSoundEffect": "Hero_Underlord.Pick", "GibType": "default", "Enabled": "1", "CMEnabled": "1", "new_player_enable": "1", "SimilarHeroes": "29,98,43", "Team": "Bad", "HeroID": "108", "HeroOrderID": "112", "Role": "Support,Nuker,Disabler,Durable,Escape", "Rolelevels": "1,1,1,1,2", "Complexity": "2", "ModelScale": "0.85", "VersusScale": "0.700000", "LoadoutScale": "0.70", "SpectatorLoadoutScale": "0.785", "NameAliases": "PitLord,Azgalor", "workshop_guide_name": "Underlord", "Ability1": "abyssal_underlord_firestorm", "Ability2": "abyssal_underlord_pit_of_malice", "Ability3": "abyssal_underlord_atrophy_aura", "Ability4": "generic_hidden", "Ability5": "generic_hidden", "Ability6": "abyssal_underlord_dark_rift", "Ability7": "abyssal_underlord_cancel_dark_rift", "Ability10": "special_bonus_armor_5", "Ability11": "special_bonus_unique_underlord_8", "Ability12": "special_bonus_unique_underlord_6", "Ability13": "special_bonus_unique_underlord_5", "Ability14": "special_bonus_attack_speed_60", "Ability15": "special_bonus_hp_regen_20", "Ability16": "special_bonus_unique_underlord", "Ability17": "special_bonus_unique_underlord_9", "AbilityDraftIgnoreCount": "7", "ArmorPhysical": "3.000000", "AttackCapabilities": "DOTA_UNIT_CAP_MELEE_ATTACK", "AttackDamageMin": "37", "AttackDamageMax": "43", "AttackRate": "1.700000", "AttackAnimationPoint": "0.450000", "AttackSpeedActivityModifiers": { "fast": "170", "faster": "275", "fastest": "350" }, "AttackAcquisitionRange": "600", "AttackRange": "200", "AttributePrimary": "DOTA_ATTRIBUTE_STRENGTH", "AttributeBaseStrength": "25", "AttributeStrengthGain": "3", "AttributeBaseAgility": "12", "AttributeAgilityGain": "1.600000", "AttributeBaseIntelligence": "17", "AttributeIntelligenceGain": "2.300000", "MovementSpeed": "295", "MovementSpeedActivityModifiers": { "walk": "0", "run": "395" }, "particle_folder": "particles/units/heroes/heroes_underlord", "GameSoundsFile": "soundevents/game_sounds_heroes/game_sounds_abyssal_underlord.vsndevts", "VoiceFile": "soundevents/voscripts/game_sounds_vo_abyssal_underlord.vsndevts", "VisionDaytimeRange": "1800", "ItemSlots": { "0": { "SlotIndex": "0", "SlotName": "weapon", "SlotText": "#LoadoutSlot_Weapon", "TextureWidth": "256", "TextureHeight": "256", "MaxPolygonsLOD0": "2500", "MaxPolygonsLOD1": "1000" }, "1": { "SlotIndex": "1", "SlotName": "head", "SlotText": "#LoadoutSlot_Head_Accessory", "TextureWidth": "512", "TextureHeight": "512", "MaxPolygonsLOD0": "3000", "MaxPolygonsLOD1": "1200" }, "2": { "SlotIndex": "2", "SlotName": "armor", "SlotText": "#LoadoutSlot_Armor", "TextureWidth": "512", "TextureHeight": "512", "MaxPolygonsLOD0": "6000", "MaxPolygonsLOD1": "2400" }, "3": { "SlotIndex": "3", "SlotName": "taunt", "SlotText": "#LoadoutSlot_Taunt" }, "4": { "SlotIndex": "4", "SlotName": "ambient_effects", "SlotText": "#LoadoutSlot_Ambient_Effects", "DisplayInLoadout": "0" }, "5": { "SlotIndex": "5", "SlotName": "body_head", "SlotText": "#LoadoutSlot_Head", "DisplayInLoadout": "0" } }, "Bot": { "HeroType": "DOTA_BOT_TANK | DOTA_BOT_PUSH_SUPPORT", "LaningInfo": { "SoloDesire": "0", "RequiresBabysit": "0", "ProvidesBabysit": "1", "SurvivalRating": "1", "RequiresFarm": "0", "ProvidesSetup": "1", "RequiresSetup": "0" } } };

@registerUnit()
export class dota_hero_abyssal_underlord extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
        this.__IN_DOTA_NAME__ = "npc_dota_hero_abyssal_underlord";
        this.__IN_DOTA_DATA__ = Data_dota_hero_abyssal_underlord;
    }
    onSpawned(ev: any) {
        if (!IsServer()) { return }
        modifier_test.apply(this, this)
    }
}

