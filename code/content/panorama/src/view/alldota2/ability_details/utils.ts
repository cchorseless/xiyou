// export function isActive(iBehavior: DOTA_ABILITY_BEHAVIOR) {
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) {
// 		return true;
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) {
// 		return true;
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) {
// 		return true;
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
// 		return true;
// 	}
// 	return false;
// }

// export function getCastType(iBehavior: DOTA_ABILITY_BEHAVIOR) {
// 	// "DOTA_ToolTip_Ability_NoTarget" "无目标"
// 	// "DOTA_ToolTip_Ability_Passive" "被动"
// 	// "DOTA_ToolTip_Ability_Channeled" "持续施法"
// 	// "DOTA_ToolTip_Ability_AutoCast" "自动施放"
// 	// "DOTA_ToolTip_Ability_Aura" "光环"
// 	// "DOTA_ToolTip_Ability_Toggle" "切换"
// 	// "DOTA_ToolTip_Ability_Target" "单位目标"
// 	// "DOTA_ToolTip_Ability_Point" "点目标"
// 	// "DOTA_ToolTip_Ability_UnitOrPoint_Target" "点目标"

// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AURA) {
// 		return "DOTA_ToolTip_Ability_Aura";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_AUTOCAST) {
// 		return "DOTA_ToolTip_Ability_AutoCast";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_PASSIVE) {
// 		return "DOTA_ToolTip_Ability_Passive";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_TOGGLE) {
// 		return "DOTA_ToolTip_Ability_Toggle";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_CHANNELLED) {
// 		return "DOTA_ToolTip_Ability_Channeled";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_NO_TARGET) {
// 		return "DOTA_ToolTip_Ability_NoTarget";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT + DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
// 		return "DOTA_ToolTip_Ability_UnitOrPoint_Target";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_POINT) {
// 		return "DOTA_ToolTip_Ability_Point";
// 	}
// 	if ((iBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) == DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_UNIT_TARGET) {
// 		return "DOTA_ToolTip_Ability_Target";
// 	}
// 	return "";
// }

// export function getTargetType(iTeam: DOTA_UNIT_TARGET_TEAM, iType: DOTA_UNIT_TARGET_TYPE) {
// 	if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_TREE) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_TREE) {
// 		return "DOTA_ToolTip_Targeting_Trees";
// 	}
// 	if (iTeam == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_FRIENDLY) {
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
// 			return "DOTA_ToolTip_Targeting_AlliedUnitsAndBuildings";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
// 			return "DOTA_ToolTip_Targeting_AlliedHeroesAndBuildings";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
// 			return "DOTA_ToolTip_Targeting_AlliedUnits";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
// 			return "DOTA_ToolTip_Targeting_AlliedHeroes";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) {
// 			return "DOTA_ToolTip_Targeting_AlliedCreeps";
// 		}
// 		return "DOTA_ToolTip_Targeting_Allies";
// 	}
// 	if (iTeam == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_ENEMY) {
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
// 			return "DOTA_ToolTip_Targeting_EnemyUnitsAndBuildings";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_BUILDING) {
// 			return "DOTA_ToolTip_Targeting_EnemyHeroesAndBuildings";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP + DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
// 			return "DOTA_ToolTip_Targeting_EnemyUnits";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
// 			return "DOTA_ToolTip_Targeting_EnemyHero";
// 		}
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_CREEP) {
// 			return "DOTA_ToolTip_Targeting_EnemyCreeps";
// 		}
// 		return "DOTA_ToolTip_Targeting_Enemy";
// 	}
// 	if (iTeam == DOTA_UNIT_TARGET_TEAM.DOTA_UNIT_TARGET_TEAM_BOTH) {
// 		if ((iType & DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) == DOTA_UNIT_TARGET_TYPE.DOTA_UNIT_TARGET_HERO) {
// 			return "DOTA_Tooltip_Targeting_All_Heroes";
// 		}
// 		return "DOTA_ToolTip_Targeting_Units";
// 	}
// 	return "";
// }

// export function getDamageType(iDamageType: DAMAGE_TYPES) {
// 	if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_PHYSICAL) {
// 		return "DOTA_ToolTip_Damage_Physical";
// 	}
// 	if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
// 		return "DOTA_ToolTip_Damage_Magical";
// 	}
// 	if (iDamageType == DAMAGE_TYPES.DAMAGE_TYPE_PURE) {
// 		return "DOTA_ToolTip_Damage_Pure";
// 	}
// 	return "";
// }

// export function getSpellImmunity(iSpellImmunityType: SPELL_IMMUNITY_TYPES) {
// 	if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES) {
// 		return "DOTA_ToolTip_PiercesSpellImmunity_Yes";
// 	}
// 	if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_NO) {
// 		return "DOTA_ToolTip_PiercesSpellImmunity_No";
// 	}
// 	if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_YES) {
// 		return "DOTA_ToolTip_PiercesSpellImmunity_Yes";
// 	}
// 	if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ENEMIES_NO) {
// 		return "DOTA_ToolTip_PiercesSpellImmunity_No";
// 	}
// 	if (iSpellImmunityType == SPELL_IMMUNITY_TYPES.SPELL_IMMUNITY_ALLIES_YES_ENEMIES_NO) {
// 		return "DOTA_ToolTip_PiercesSpellImmunity_AlliesYesEnemiesNo";
// 	}
// 	return "";
// }

// export function getDispelType(sSpellDispellableType: string) {
// 	if (sSpellDispellableType == "SPELL_DISPELLABLE_YES") {
// 		return "DOTA_ToolTip_Dispellable_Yes_Soft";
// 	}
// 	if (sSpellDispellableType == "SPELL_DISPELLABLE_NO") {
// 		return "DOTA_ToolTip_Dispellable_No";
// 	}
// 	if (sSpellDispellableType == "SPELL_DISPELLABLE_YES_STRONG") {
// 		return "DOTA_ToolTip_Dispellable_Yes_Strong";
// 	}
// 	return "";
// }

// export function getCustomAbilityType(sCustomAbilityType: string) {
// 	let result: string[] = [];
// 	let CustomAbilityType: { [key: string]: string; } = {
// 		CUSTOM_TYPE_SURROUND: "Surround",
// 		CUSTOM_TYPE_SPLIT: "Split",
// 		CUSTOM_TYPE_POISON: "Poison",
// 		CUSTOM_TYPE_IGNITE: "Ignite",
// 		CUSTOM_TYPE_STUN: "Stun",
// 		CUSTOM_TYPE_ENERGY_STRIKE: "EnergyStrike",
// 		CUSTOM_TYPE_MAGIC_PROJECTILE: "MagicProjectile",
// 	};
// 	if (sCustomAbilityType != "") {
// 		let types = sCustomAbilityType.split(",");

// 		for (let index = 0; index < types.length; index++) {
// 			const element = types[index];
// 			result.push(CustomAbilityType[element]);
// 		}
// 	}
// 	return result;
// }

// export function getItemDispelType(sSpellDispellableType: string) {
// 	if (sSpellDispellableType == "SPELL_DISPELLABLE_YES") {
// 		return "DOTA_ToolTip_Dispellable_Item_Yes_Soft";
// 	}
// 	if (sSpellDispellableType == "SPELL_DISPELLABLE_YES_STRONG") {
// 		return "DOTA_ToolTip_Dispellable_Item_Yes_Strong";
// 	}
// 	return "";
// }

// export function compose(aValues: number[], iLevel: number = -1, bOnlyNowLevelValue: boolean = false) {
// 	let sTemp = "";
// 	let sTempPS = "";
// 	if (iLevel != -1 && bOnlyNowLevelValue && aValues.length > 0) {
// 		let value = aValues[Clamp(iLevel, 0, aValues.length - 1)];
// 		let sValue = FormatNumber(Float(Math.abs(value)));
// 		let sValuePS = sValue + "%";
// 		sTemp = "<span class='GameplayVariable GameplayVariable'>" + sValue + "</span>";
// 		sTempPS = "<span class='GameplayVariable GameplayVariable'>" + sValuePS + "</span>";
// 	} else {
// 		for (let level = 0; level < aValues.length; level++) {
// 			const value = aValues[level];
// 			if (sTemp != "") {
// 				sTemp = sTemp + " / ";
// 				sTempPS = sTempPS + " / ";
// 			}
// 			let sValue = FormatNumber(Float(Math.abs(value)));
// 			let sValuePS = sValue + "%";
// 			if (iLevel != -1 && (level + 1 == Math.min(iLevel, aValues.length))) {
// 				sValue = "<span class='GameplayVariable'>" + sValue + "</span>";
// 				sValuePS = "<span class='GameplayVariable'>" + sValuePS + "</span>";
// 			}
// 			sTemp = sTemp + sValue;
// 			sTempPS = sTempPS + sValuePS;
// 		}
// 	}
// 	if (iLevel == -1) {
// 		sTemp = "<span class='GameplayValues GameplayVariable'>" + sTemp + "</span>";
// 		sTempPS = "<span class='GameplayValues GameplayVariable'>" + sTempPS + "</span>";
// 	} else {
// 		sTemp = "<span class='GameplayValues'>" + sTemp + "</span>";
// 		sTempPS = "<span class='GameplayValues'>" + sTempPS + "</span>";
// 	}
// 	return [sTemp, sTempPS];
// }

// export function replaceValues({ sStr, bShowExtra, sAbilityName, iLevel, iEntityIndex = -1 as EntityIndex, bIsDescription = false, bOnlyNowLevelValue = false }: { sStr: string, bShowExtra: boolean, sAbilityName: string, iLevel: number, iEntityIndex?: EntityIndex, bIsDescription?: boolean, bOnlyNowLevelValue?: boolean; }) {
// 	let tAbility = GameUI.CustomUIConfig().AbilitiesKv[sAbilityName];
// 	let tItem = GameUI.CustomUIConfig().ItemsKv[sAbilityName];
// 	let tData = tAbility || tItem;
// 	let aValueNames = GetSpecialNames(sAbilityName, iEntityIndex);
// 	for (let index = 0; index < aValueNames.length; index++) {
// 		const sValueName = aValueNames[index];
// 		let block = new RegExp("%" + sValueName + "%", "g");
// 		let blockPS = new RegExp("%" + sValueName + "%%", "g");
// 		let iResult = sStr.search(block);
// 		let iResultPS = sStr.search(blockPS);
// 		if (iResult == -1 && iResultPS == -1) continue;

// 		let tResult = GetSpecialValuesWithCalculated(sAbilityName, sValueName, iEntityIndex);
// 		let aValues: number[];
// 		switch (sValueName) {
// 			case "abilitycastrange":
// 				aValues = StringToValues(tData.AbilityCastRange || "");
// 				break;
// 			case "abilitycastpoint":
// 				aValues = StringToValues(tData.AbilityCastPoint || "");
// 				break;
// 			case "abilityduration":
// 				aValues = StringToValues(tData.AbilityDuration || "");
// 				break;
// 			case "abilitychanneltime":
// 				aValues = StringToValues(tData.AbilityChannelTime || "");
// 				break;
// 			case "abilitydamage":
// 				aValues = StringToValues(tData.AbilityDamage || "");
// 				break;
// 			default:
// 				if (bIsDescription) {
// 					aValues = tResult.aValues;
// 				} else {
// 					aValues = tResult.aOriginalValues;
// 				}
// 				break;
// 		}
// 		if (!bIsDescription) {
// 			let CalculateSpellDamageTooltip = GetSpecialValueProperty(sAbilityName, sValueName, "CalculateSpellDamageTooltip", iEntityIndex);
// 			let bCalculateSpellDamage = CalculateSpellDamageTooltip != undefined ? Number(CalculateSpellDamageTooltip) == 1 : sValueName.indexOf("damage") != -1;
// 			bCalculateSpellDamage = bCalculateSpellDamage && iEntityIndex && Entities.IsValidEntity(iEntityIndex);
// 			let fSpellAmplify = Entities.GetSpellAmplify(iEntityIndex) * 0.01;
// 			if (bShowExtra && bCalculateSpellDamage) {
// 				for (let j = 0; j < aValues.length; j++) {
// 					const value = aValues[j];
// 					aValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
// 				}
// 				for (let j = 0; j < tResult.aValues.length; j++) {
// 					const value = tResult.aValues[j];
// 					tResult.aValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
// 				}
// 				if (tResult.aMinValues) {
// 					for (let j = 0; j < tResult.aMinValues.length; j++) {
// 						const value = tResult.aMinValues[j];
// 						tResult.aMinValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
// 					}
// 				}
// 				if (tResult.aMaxValues) {
// 					for (let j = 0; j < tResult.aMaxValues.length; j++) {
// 						const value = tResult.aMaxValues[j];
// 						tResult.aMaxValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
// 					}
// 				}
// 				for (const key in tResult.tAddedValues) {
// 					const aAddedValues = tResult.tAddedValues[key];
// 					if (aAddedValues) {
// 						for (let j = 0; j < aAddedValues.length; j++) {
// 							const value = aAddedValues[j];
// 							aAddedValues[j] = Math.round(value * (1 + fSpellAmplify) * 100) / 100;
// 						}
// 					}
// 				}
// 			}
// 		}
// 		let [sValues, sValuesPS] = compose(aValues, iLevel, bOnlyNowLevelValue);
// 		if (!bIsDescription) {
// 			if (!bShowExtra || !(iEntityIndex && Entities.IsValidEntity(iEntityIndex))) {
// 				let tAddedFactors = tResult.tAddedFactors;
// 				Object.keys(tAddedFactors).forEach((key, n) => {
// 					const aAddedFactors = tAddedFactors[key];
// 					if (aAddedFactors) {
// 						if (key == "_ulti") {
// 							sValues = sValues.replace("GameplayValues", "UltimateValues");
// 						} else {
// 							let [sTemp, sTempPS] = compose(aAddedFactors, iLevel, bOnlyNowLevelValue);
// 							if (aValues.length == 1 && aValues[0] == 0) {
// 								if (n == 0) {
// 									sValues = $.Localize("#dota_ability_variable" + key) + "×" + sTemp;
// 									sValuesPS = $.Localize("#dota_ability_variable" + key) + "×" + sTempPS;
// 								} else {
// 									sValues = sValues + " + " + $.Localize("#dota_ability_variable" + key) + "×" + sTemp;
// 									sValuesPS = sValuesPS + " + " + $.Localize("#dota_ability_variable" + key) + "×" + sTempPS;
// 								}
// 							} else {
// 								sValues = sValues + "[+" + $.Localize("#dota_ability_variable" + key) + "×" + sTemp + "]";
// 								sValuesPS = sValuesPS + "[+" + $.Localize("#dota_ability_variable" + key) + "×" + sTempPS + "]";
// 							}
// 						}
// 					}
// 				});
// 			} else {
// 				let tAddedValues = tResult.tAddedValues;
// 				let bHasOperation = false;
// 				Object.keys(tAddedValues).forEach((key, n) => {
// 					const aAddedValues = tAddedValues[key];
// 					if (aAddedValues) {
// 						let [sTemp, sTempPS] = compose(aAddedValues, iLevel, bOnlyNowLevelValue);
// 						if (aValues.length == 1 && aValues[0] == 0) {
// 							if (n == 0) {
// 								sValues = sTemp;
// 								sValuesPS = sTempPS;
// 							} else {
// 								bHasOperation = true;
// 								sValues = sValues + " + " + sTemp;
// 								sValuesPS = sValuesPS + " + " + sTempPS;
// 							}
// 						} else {
// 							bHasOperation = true;
// 							sValues = sValues + "[+" + sTemp + "]";
// 							sValuesPS = sValuesPS + "[+" + sTempPS + "]";
// 						}
// 					}
// 				});
// 				let [sTemp, sTempPS] = compose(tResult.aValues, iLevel, bOnlyNowLevelValue);
// 				if (bHasOperation) {
// 					sValues = sValues + " = " + sTemp;
// 					sValuesPS = sValuesPS + " = " + sTempPS;
// 				} else {
// 					sValues = sTemp;
// 					sValuesPS = sTempPS;
// 				}
// 			}
// 			if (bShowExtra && (tResult.aMinValues || tResult.aMaxValues)) {
// 				if (tResult.aMinValues) {
// 					let [sTemp, sTempPS] = compose(tResult.aMinValues, iLevel, bOnlyNowLevelValue);
// 					sValues = sValues + "[" + $.Localize("#dota_ability_variable_min") + sTemp + "]";
// 					sValuesPS = sValuesPS + "[" + $.Localize("#dota_ability_variable_min") + sTempPS + "]";
// 				}
// 				if (tResult.aMaxValues) {
// 					let [sTemp, sTempPS] = compose(tResult.aMaxValues, iLevel, bOnlyNowLevelValue);
// 					sValues = sValues + "[" + $.Localize("#dota_ability_variable_max") + sTemp + "]";
// 					sValuesPS = sValuesPS + "[" + $.Localize("#dota_ability_variable_max") + sTempPS + "]";
// 				}
// 			}
// 		}
// 		sStr = sStr.replace(blockPS, sValuesPS);
// 		sStr = sStr.replace(block, sValues);
// 	}
// 	return sStr;
// }