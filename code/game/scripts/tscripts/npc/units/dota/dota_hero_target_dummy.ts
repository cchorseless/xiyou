
import { PrecacheHelper } from "../../../helper/PrecacheHelper";
import { BaseNpc_Plus } from "../../entityPlus/BaseNpc_Plus";
import { registerUnit } from "../../entityPlus/Base_Plus";

/** dota原英雄数据 */
export const Data_dota_hero_target_dummy = { "Model": "models/props_gameplay/dummy/dummy.vmdl", "ModelScale": "2.500000", "LoadoutScale": "1.000000", "Enabled": "0", "BotImplemented": "0", "Role": "Nuker,Disabler", "Rolelevels": "3,1", "Team": "Good", "NewHero": "0", "HeroPool1": "0", "HeroUnlockOrder": "1", "CMEnabled": "0", "CMTournamentIgnore": "0", "new_player_enable": "0", "HeroID": "127", "Legs": "6", "Ability1": "", "Ability2": "", "Ability3": "", "Ability4": "", "Ability5": "", "Ability6": "", "ArmorPhysical": "0", "AttackCapabilities": "DOTA_UNIT_CAP_RANGED_ATTACK", "AttackDamageMin": "0", "AttackDamageMax": "0", "AttackDamageType": "DAMAGE_TYPE_ArmorPhysical", "AttackRate": "1.700000", "AttackAnimationPoint": "0.500000", "AttackAcquisitionRange": "0", "AttackRange": "700", "ProjectileSpeed": "900", "AttributePrimary": "DOTA_ATTRIBUTE_AGILITY", "AttributeBaseStrength": "31", "AttributeStrengthGain": "0.0", "AttributeBaseIntelligence": "30", "AttributeIntelligenceGain": "0.0", "AttributeBaseAgility": "0", "AttributeAgilityGain": "0.0", "BoundsHullName": "DOTA_HULL_SIZE_HERO", "RingRadius": "70", "StatusHealth": "5000", "StatusMana": "5000", "StatusManaRegen": "100", "MovementCapabilities": "DOTA_UNIT_CAP_MOVE_GROUND", "MovementSpeed": "270", "HasAggressiveStance": "0", "TeamName": "DOTA_TEAM_GOODGUYS", "CombatClassAttack": "DOTA_COMBAT_CLASS_ATTACK_HERO", "CombatClassDefend": "DOTA_COMBAT_CLASS_DEFEND_HERO", "UnitRelationshipClass": "DOTA_NPC_UNIT_RELATIONSHIP_TYPE_HERO", "VisionDaytimeRange": "1", "VisionNighttimeRange": "1" };

@registerUnit()
export class dota_hero_target_dummy extends BaseNpc_Plus {
    Spawn(entityKeyValues: CScriptKeyValues) {
        // PrecacheHelper.precachResByKV(entityKeyValues);
        this.__IN_DOTA_NAME__ = "npc_dota_hero_target_dummy";
        this.__IN_DOTA_DATA__ = Data_dota_hero_target_dummy;
    }
}

