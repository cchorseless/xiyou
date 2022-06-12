// import React, { useCallback, useEffect, useRef, useState } from "react";
// import { render, useGameEvent, useNetTableKey, useNetTableValues } from "@demon673/react-panorama";
// import { AbilityPanel, InventorySlot, SecondaryAbilityPanel } from "../elements/AbilityPanel";
// import "./stats.ts";
// import { DialogEventsButton } from "../elements/DialogEventsButton/DialogEventsButton";
// import { HotKeyContainer } from "../elements/HotKey";
// import { DOTAHideTextTooltip, DOTAHideTitleTextTooltip, DOTAShowTextTooltip, DOTAShowTitleTextTooltip, useHeartBeat, useToggle } from "../utils/utils";
// import classNames from "classnames";
// import { EOM_CommonTextButton, EOM_ImageNumber, EOM_Label, EOM_LabelStyle } from "../elements/Common/Common";
// import Popups from "../utils/popup";
// import { RewardPanelFragments } from "../elements/RewardPanel/RewardPanel";

// var CustomUIConfig = GameUI.CustomUIConfig();
// var tSettings = CustomNetTables.GetTableValue("common", "settings");
// CustomNetTables.SubscribeNetTableListener("common", () => {
// 	tSettings = CustomNetTables.GetTableValue("common", "settings");
// });
// let aUpdateFunc: Function[] = [];
// // 经验条
// if (true) {
// 	function CustoXP() {
// 		const [level, setLevel] = useState(1);
// 		const [exp, setExp] = useState(0);
// 		const [maxExp, setMaxExp] = useState(100);
// 		useEffect(() => {
// 			let func = () => {
// 				let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 				let iLocalPortraitUnitLevel = Entities.GetLevel(iLocalPortraitUnit);
// 				setLevel(iLocalPortraitUnitLevel);
// 				if (Entities.IsRealHero(iLocalPortraitUnit) && iLocalPortraitUnitLevel < tSettings.HERO_MAX_LEVEL) {
// 					setExp(Entities.GetCurrentXP(iLocalPortraitUnit) - tSettings.HERO_XP_PER_LEVEL_TABLE[iLocalPortraitUnitLevel]);
// 					setMaxExp(Entities.GetNeededXPToLevel(iLocalPortraitUnit) - tSettings.HERO_XP_PER_LEVEL_TABLE[iLocalPortraitUnitLevel]);
// 				} else {
// 					setExp(100);
// 					setMaxExp(100);
// 				}
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 				GameEvents.Subscribe("custom_exp_change", func),
// 				GameEvents.Subscribe("dota_player_gained_level", func),
// 			];

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 			};
// 		}, []);
// 		return (
// 			<>
// 				<Panel id="level_bg" />
// 				<Label id="level_label" text={level} />
// 				<CircularProgressBar id="custom_xp_bar" min={0} max={maxExp} value={exp} />
// 			</>
// 		);
// 	}
// 	render(<CustoXP />, $("#custom_xp"));
// }

// // 单位技能栏
// if (true) {
// 	if ($("#DeleteAbilityDragEndArea").IsDraggable() == false) {
// 		$("#DeleteAbilityDragEndArea").SetDraggable(true);
// 		$.RegisterEventHandler("DragEnter", $("#DeleteAbilityDragEndArea"), () => {
// 			$("#DeleteAbilityDragEndArea").AddClass("potential_drop_target");
// 		});
// 		$.RegisterEventHandler("DragLeave", $("#DeleteAbilityDragEndArea"), () => {
// 			$("#DeleteAbilityDragEndArea").RemoveClass("potential_drop_target");
// 		});
// 		$.RegisterEventHandler("DragDrop", $("#DeleteAbilityDragEndArea"), (_, pDraggedPanel: Panel) => {
// 			if (LoadData(pDraggedPanel, "m_DragType") == "AbilitySlot") {
// 				let iAbilityIndex = LoadData(pDraggedPanel, "overrideentityindex");
// 				if (iAbilityIndex != -1) {
// 					GameEvents.SendCustomEventToServer("delete_ability", {
// 						ability_index: iAbilityIndex,
// 					});
// 				}
// 			}
// 		});
// 	}
// 	function AbilitiesContainer() {
// 		function updateAbilityList() {
// 			let aAbilities = [];
// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();

// 			for (let i = 0; i < Entities.GetAbilityCount(iLocalPortraitUnit); i++) {
// 				let iAbilityEntIndex = Entities.GetAbility(iLocalPortraitUnit, i) as ItemEntityIndex;

// 				if (iAbilityEntIndex == -1) continue;
// 				if (!Abilities.IsDisplayedAbility(iAbilityEntIndex)) continue;
// 				if (finiteNumber(Number(GameUI.CustomUIConfig().AbilitiesKv[Abilities.GetAbilityName(iAbilityEntIndex)]?.OnCastbar), 1) == 0) continue;

// 				aAbilities.push({
// 					overrideentityindex: iAbilityEntIndex,
// 				});
// 			}

// 			return aAbilities;
// 		}

// 		const [abilities, setAbilities] = useState(() => {
// 			return updateAbilityList();
// 		});

// 		let update = () => {
// 			for (let index = 0; index < $("#abilities").GetChildCount(); index++) {
// 				const element = $("#abilities").GetChild<AbilityPanel>(index);
// 				if (element && typeof LoadData(element, "update") == "function") {
// 					LoadData(element, "update")();
// 				}
// 			}
// 		};

// 		useEffect(() => {
// 			let func = () => {
// 				setAbilities(updateAbilityList());
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_portrait_ability_layout_changed", func),
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 				GameEvents.Subscribe("dota_ability_changed", func),
// 				GameEvents.Subscribe("dota_hero_ability_points_changed", func),
// 			];

// 			aUpdateFunc.push(update);

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 				let index = aUpdateFunc.indexOf(update);
// 				if (index != -1) {
// 					aUpdateFunc.splice(index, 1);
// 				}
// 			};
// 		}, []);

// 		useEffect(() => {
// 			let iAbilityCount = abilities.length;
// 			$("#abilities").SetHasClass("FiveAbilities", iAbilityCount == 5);
// 			$("#abilities").SetHasClass("SixAbilities", iAbilityCount == 6);
// 			$("#abilities").SetHasClass("SevenAbilities", iAbilityCount == 7);
// 			$("#abilities").SetHasClass("EightAbilities", iAbilityCount == 8);
// 			$("#abilities").SetHasClass("NineAbilities", iAbilityCount == 9);
// 		}, [abilities]);

// 		return (
// 			<>
// 				{abilities.map((tAbilityData, key) => {
// 					return <AbilityPanel key={key} {...tAbilityData} hittest={false} draggable={true} dragtype="AbilitySlot" dragstartcallback={(tDragCallbacks, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
// 						let iAbilityIndex = overrideentityindex;
// 						if (iAbilityIndex != -1 && Entities.IsValidEntity(iAbilityIndex)) {
// 							let iCasterIndex = Abilities.GetCaster(iAbilityIndex);
// 							if (!Entities.IsValidEntity(iCasterIndex) || !Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer()) || !Entities.IsRealHero(iCasterIndex)) {
// 								return false;
// 							}
// 							let sAbilityName = Abilities.GetAbilityName(iAbilityIndex);
// 							if (sAbilityName.indexOf("empty_") != -1) {
// 								return false;
// 							}

// 							let tKV = CustomUIConfig.AbilitiesKv[sAbilityName];
// 							if (tKV && tKV.Rarity) {
// 								$.GetContextPanel().AddClass("AbilityDragging");
// 							}
// 						}

// 						return true;
// 					}} dragdropcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
// 						let iAbilityIndex = LoadData(pDraggedPanel, "overrideentityindex");
// 						if (iAbilityIndex != -1 && overrideentityindex != -1 && iAbilityIndex != overrideentityindex) {
// 							GameEvents.SendCustomEventToServer("swap_abilities", {
// 								ability_index_1: iAbilityIndex,
// 								ability_index_2: overrideentityindex,
// 							});
// 							return true;
// 						}
// 						return false;
// 					}} dragendcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
// 						$.GetContextPanel().RemoveClass("AbilityDragging");
// 					}} />;
// 				})}
// 			</>
// 		);
// 	}
// 	render(<AbilitiesContainer />, $("#abilities"));
// }

// // 单位物品栏相关
// if (true) {
// 	/**
// 	 * 拖动物品图标
// 	 */
// 	const DOTA_ITEM_INVENTORY_MIN = 0;
// 	const DOTA_ITEM_INVENTORY_MAX = 5;
// 	function InventoryItems() {
// 		function updateSlots() {
// 			let aSlots = [];
// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();

// 			for (let index = DOTA_ITEM_INVENTORY_MIN; index <= DOTA_ITEM_INVENTORY_MAX; index++) {
// 				let iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, index);

// 				aSlots.push({
// 					overrideentityindex: iItemIndex,
// 					slot: index,
// 				});
// 			}

// 			return aSlots;
// 		}

// 		const [slots, setSlots] = useState(() => {
// 			return updateSlots();
// 		});


// 		let update = () => {
// 			for (let index = 0; index < $("#inventory_list_container").GetChildCount(); index++) {
// 				const element = $("#inventory_list_container").GetChild(index);
// 				if (element) {
// 					for (let _index = 0; _index < element.GetChildCount(); _index++) {
// 						const _element = element.GetChild(_index);
// 						if (_element && typeof LoadData(_element, "update") == "function") {
// 							LoadData(_element, "update")();
// 						}
// 					}
// 				}
// 			}
// 		};

// 		useEffect(() => {
// 			let func = () => {
// 				setSlots(updateSlots());
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_inventory_changed", func),
// 				GameEvents.Subscribe("dota_inventory_item_changed", func),
// 				GameEvents.Subscribe("m_event_dota_inventory_changed_query_unit", func),
// 				GameEvents.Subscribe("m_event_keybind_changed", func),
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 			];

// 			aUpdateFunc.push(update);

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 				let index = aUpdateFunc.indexOf(update);
// 				if (index != -1) {
// 					aUpdateFunc.splice(index, 1);
// 				}
// 			};
// 		}, []);

// 		return (
// 			<>
// 				<Panel id="inventory_list" className="inventory_list" hittest={false} >
// 					{[...Array(3).keys()].map((key) => {
// 						return <InventorySlot key={key} id={"inventory_slot_" + key} {...slots[key]} />;
// 					})}
// 				</Panel>
// 				<Panel id="inventory_list2" className="inventory_list" hittest={false} >
// 					{[...Array(3).keys()].map((key) => {
// 						return <InventorySlot key={key + 3} id={"inventory_slot_" + (key + 3)} {...slots[key + 3]} />;
// 					})}
// 				</Panel>
// 			</>
// 		);
// 	}
// 	render(<InventoryItems />, $("#inventory_list_container"));


// 	// 背包栏
// 	const DOTA_ITEM_BACKPACK_MIN = 6;
// 	const DOTA_ITEM_BACKPACK_MAX = 8;
// 	function BackpackItems() {
// 		function updateSlots() {
// 			let aSlots = [];
// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();

// 			for (let index = DOTA_ITEM_BACKPACK_MIN; index <= DOTA_ITEM_BACKPACK_MAX; index++) {
// 				let iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, index);

// 				aSlots.push({
// 					overrideentityindex: iItemIndex,
// 					slot: index,
// 					overridedisplaykeybind: -1,
// 				});
// 			}

// 			return aSlots;
// 		}

// 		const [slots, setSlots] = useState(() => {
// 			return updateSlots();
// 		});

// 		let update = () => {
// 			for (let index = 0; index < $("#inventory_backpack_list").GetChildCount(); index++) {
// 				const element = $("#inventory_backpack_list").GetChild(index);
// 				if (element && typeof LoadData(element, "update") == "function") {
// 					LoadData(element, "update")();
// 				}
// 			}
// 		};

// 		useEffect(() => {
// 			let func = () => {
// 				setSlots(updateSlots());
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_inventory_changed", func),
// 				GameEvents.Subscribe("dota_inventory_item_changed", func),
// 				GameEvents.Subscribe("m_event_dota_inventory_changed_query_unit", func),
// 				GameEvents.Subscribe("m_event_keybind_changed", func),
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 			];

// 			aUpdateFunc.push(update);

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 				let index = aUpdateFunc.indexOf(update);
// 				if (index != -1) {
// 					aUpdateFunc.splice(index, 1);
// 				}
// 			};
// 		}, []);

// 		return (
// 			<>
// 				{slots.map((slot, key) => {
// 					return <InventorySlot key={key} id={"inventory_slot_" + (key + DOTA_ITEM_BACKPACK_MIN)} {...slot} isBackpack={true} />;
// 				})}
// 			</>
// 		);
// 	}
// 	render(<BackpackItems />, $("#inventory_backpack_list"));

// 	// TP栏
// 	const DOTA_ITEM_TPSCROLL_SLOT = 15;
// 	function TPScroll() {
// 		const [iItemIndex, setItemIndex] = useState(() => {
// 			return updateSlot();
// 		});

// 		function updateSlot() {
// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 			let _iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, DOTA_ITEM_TPSCROLL_SLOT);

// 			return _iItemIndex;
// 		}

// 		let update = () => {
// 			for (let index = 0; index < $("#inventory_tpscroll_container").GetChildCount(); index++) {
// 				const element = $("#inventory_tpscroll_container").GetChild(index);
// 				if (element && typeof LoadData(element, "update") == "function") {
// 					LoadData(element, "update")();
// 				}
// 			}

// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 			let _iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, DOTA_ITEM_TPSCROLL_SLOT);
// 			let pContainer = $("#inventory_tpscroll_container");

// 			let sHotkey = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORYTP);
// 			if (sHotkey == "") {
// 				sHotkey = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORYTP_QUICKCAST);
// 			}

// 			let bControllable = Entities.IsControllableByPlayer(iLocalPortraitUnit, Players.GetLocalPlayer());
// 			let pAbilityPanel = pContainer.FindChildTraverse("inventory_tpscroll_slot");
// 			if (pAbilityPanel) {
// 				pContainer.SetHasClass("no_hotkey", sHotkey == "" || !bControllable || !((!pAbilityPanel.BHasClass("no_level") && !pAbilityPanel.BHasClass("is_passive")) || pAbilityPanel.BHasClass("show_level_up_frame") || (GameUI.IsControlDown() && pAbilityPanel.BHasClass("could_level_up"))));
// 			}
// 			pContainer.RemoveClass("hotkey_alt");
// 			pContainer.RemoveClass("hotkey_ctrl");
// 			let aHotkeys = sHotkey.split("-");
// 			if (aHotkeys) {
// 				let pHotkeyContainer = pContainer.FindChildTraverse("inventory_tpscroll_HotkeyContainer");
// 				for (const sKey of aHotkeys) {
// 					if (sKey.toUpperCase().indexOf("ALT") != -1) {
// 						pContainer.AddClass("hotkey_alt");
// 					} else if (sKey.toUpperCase().indexOf("CTRL") != -1) {
// 						pContainer.AddClass("hotkey_ctrl");
// 					} else {
// 						pHotkeyContainer?.SetDialogVariable("hotkey", Abilities.GetKeybind(_iItemIndex));
// 					}
// 				}
// 			}

// 			let pCharges = pContainer.FindChildTraverse("tpCharges");
// 			pContainer.SetHasClass("no_charges", !Items.AlwaysDisplayCharges(_iItemIndex));
// 			pCharges?.SetDialogVariableInt("charge_count", Items.GetCurrentCharges(_iItemIndex));
// 		};

// 		useEffect(() => {
// 			let func = () => {
// 				setItemIndex(updateSlot());
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_inventory_changed", func),
// 				GameEvents.Subscribe("dota_inventory_item_changed", func),
// 				GameEvents.Subscribe("m_event_dota_inventory_changed_query_unit", func),
// 				GameEvents.Subscribe("m_event_keybind_changed", func),
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 			];

// 			aUpdateFunc.push(update);

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 				let index = aUpdateFunc.indexOf(update);
// 				if (index != -1) {
// 					aUpdateFunc.splice(index, 1);
// 				}
// 			};
// 		}, []);

// 		return (
// 			<>
// 				<InventorySlot id="inventory_tpscroll_slot" overrideentityindex={iItemIndex} slot={DOTA_ITEM_TPSCROLL_SLOT} overridedisplaykeybind={-1} draggable={false} />
// 				<Panel id="inventory_tpscroll_HotkeyContainer" hittest={false}>
// 					<Panel id="Hotkey" hittest={false}>
// 						<Label id="HotkeyText" localizedText="{s:hotkey}" hittest={false} />
// 					</Panel>
// 					<Panel id="HotkeyModifier" hittest={false}>
// 						<Label id="AltText" localizedText="#DOTA_Keybind_ALT" hittest={false} />
// 					</Panel>
// 					<Panel id="HotkeyCtrlModifier" hittest={false}>
// 						<Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" hittest={false} />
// 					</Panel>
// 				</Panel>
// 				<Label id="tpCharges" localizedText="{d:charge_count}" hittest={false} />
// 				<Label id="tpDescription" localizedText="#Teleport" hittest={false} />
// 			</>
// 		);
// 	}
// 	render(<TPScroll />, $("#inventory_tpscroll_container"));

// 	// 中立物品栏
// 	const DOTA_ITEM_NEUTRAL_SLOT = 16;
// 	function NeutralSlot() {
// 		const [iItemIndex, setItemIndex] = useState(() => {
// 			return updateSlot();
// 		});

// 		function updateSlot() {
// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 			let _iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, DOTA_ITEM_NEUTRAL_SLOT);

// 			return _iItemIndex;
// 		}

// 		let update = () => {
// 			for (let index = 0; index < $("#inventory_neutral_slot_container").GetChildCount(); index++) {
// 				const element = $("#inventory_neutral_slot_container").GetChild(index);
// 				if (element && typeof LoadData(element, "update") == "function") {
// 					LoadData(element, "update")();
// 				}
// 			}

// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 			let _iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, DOTA_ITEM_NEUTRAL_SLOT);
// 			let pContainer = $("#inventory_neutral_slot_container");

// 			let sHotkey = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORYNEUTRAL);
// 			if (sHotkey == "") {
// 				sHotkey = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORYNEUTRAL_QUICKCAST);
// 			}

// 			let bControllable = Entities.IsControllableByPlayer(iLocalPortraitUnit, Players.GetLocalPlayer());
// 			let pAbilityPanel = pContainer.FindChildTraverse("inventory_neutral_slot");
// 			if (pAbilityPanel) {
// 				pContainer.SetHasClass("no_hotkey", sHotkey == "" || !bControllable || !((!pAbilityPanel.BHasClass("no_level") && !pAbilityPanel.BHasClass("is_passive")) || pAbilityPanel.BHasClass("show_level_up_frame") || (GameUI.IsControlDown() && pAbilityPanel.BHasClass("could_level_up"))));
// 			}
// 			pContainer.RemoveClass("hotkey_alt");
// 			pContainer.RemoveClass("hotkey_ctrl");
// 			let aHotkeys = sHotkey.split("-");
// 			if (aHotkeys) {
// 				let pHotkeyContainer = pContainer.FindChildTraverse("inventory_neutral_slot_HotkeyContainer");
// 				for (const sKey of aHotkeys) {
// 					if (sKey.toUpperCase().indexOf("ALT") != -1) {
// 						pContainer.AddClass("hotkey_alt");
// 					} else if (sKey.toUpperCase().indexOf("CTRL") != -1) {
// 						pContainer.AddClass("hotkey_ctrl");
// 					} else {
// 						pHotkeyContainer?.SetDialogVariable("hotkey", Abilities.GetKeybind(_iItemIndex));
// 					}
// 				}
// 			}

// 			let pCharges = pContainer.FindChildTraverse("neutralCharges");
// 			pContainer.SetHasClass("no_charges", !Items.AlwaysDisplayCharges(_iItemIndex));
// 			pCharges?.SetDialogVariableInt("charge_count", Items.GetCurrentCharges(_iItemIndex));
// 		};

// 		useEffect(() => {
// 			let func = () => {
// 				setItemIndex(updateSlot());
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_inventory_changed", func),
// 				GameEvents.Subscribe("dota_inventory_item_changed", func),
// 				GameEvents.Subscribe("m_event_dota_inventory_changed_query_unit", func),
// 				GameEvents.Subscribe("m_event_keybind_changed", func),
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 			];

// 			aUpdateFunc.push(update);

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 				let index = aUpdateFunc.indexOf(update);
// 				if (index != -1) {
// 					aUpdateFunc.splice(index, 1);
// 				}
// 			};
// 		}, []);

// 		return (
// 			<>
// 				<InventorySlot id="inventory_neutral_slot" overrideentityindex={iItemIndex} slot={DOTA_ITEM_NEUTRAL_SLOT} overridedisplaykeybind={-1} draggable={false} />
// 				<Panel id="inventory_neutral_slot_HotkeyContainer" hittest={false}>
// 					<Panel id="Hotkey" hittest={false}>
// 						<Label id="HotkeyText" localizedText="{s:hotkey}" hittest={false} />
// 					</Panel>
// 					<Panel id="HotkeyModifier" hittest={false}>
// 						<Label id="AltText" localizedText="#DOTA_Keybind_ALT" hittest={false} />
// 					</Panel>
// 					<Panel id="HotkeyCtrlModifier" hittest={false}>
// 						<Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" hittest={false} />
// 					</Panel>
// 				</Panel>
// 				<Label id="neutralCharges" localizedText="{d:charge_count}" hittest={false} />
// 				<Label id="neutralDescription" localizedText="#TrainingRoom" hittest={false} />
// 			</>
// 		);
// 	}
// 	render(<NeutralSlot />, $("#inventory_neutral_slot_container"));

// 	function CosmeticItems() {
// 		function updateAbilityList() {
// 			let aAbilities = [];
// 			let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();

// 			for (let i = 0; i < Entities.GetAbilityCount(iLocalPortraitUnit); i++) {
// 				let iAbilityEntIndex = Entities.GetAbility(iLocalPortraitUnit, i) as ItemEntityIndex;

// 				if (iAbilityEntIndex == -1) continue;
// 				// if (!Abilities.IsDisplayedAbility(iAbilityEntIndex)) continue;

// 				let abilityData = GameUI.CustomUIConfig().AbilitiesKv[Abilities.GetAbilityName(iAbilityEntIndex)];
// 				if (abilityData && abilityData.CustomAbilityType && abilityData.CustomAbilityType == "CUSTOM_ABILITY_TYPE_COSMETIC") {
// 					aAbilities.push({
// 						overrideentityindex: iAbilityEntIndex,
// 						abilityname: Abilities.GetAbilityName(iAbilityEntIndex)
// 					});
// 				}

// 			}

// 			return aAbilities;
// 		}

// 		const [abilities, setAbilities] = useState(() => {
// 			return updateAbilityList();
// 		});

// 		// let update = () => {
// 		// 	for (let index = 0; index < $("#abilities").GetChildCount(); index++) {
// 		// 		const element = $("#abilities").GetChild(index);
// 		// 		if (element && typeof LoadData(element, "update") == "function") {
// 		// 			LoadData(element, "update")();
// 		// 		}
// 		// 	}
// 		// };

// 		useEffect(() => {
// 			let func = () => {
// 				setAbilities(updateAbilityList());
// 			};
// 			const listeners: GameEventListenerID[] = [
// 				GameEvents.Subscribe("dota_portrait_ability_layout_changed", func),
// 				GameEvents.Subscribe("dota_player_update_selected_unit", func),
// 				GameEvents.Subscribe("dota_player_update_query_unit", func),
// 				GameEvents.Subscribe("dota_ability_changed", func),
// 				GameEvents.Subscribe("dota_hero_ability_points_changed", func),
// 			];

// 			// let iScheduleHandle: ScheduleID;
// 			// let think = () => {
// 			// 	iScheduleHandle = $.Schedule(Game.GetGameFrameTime(), think);
// 			// 	update();
// 			// };
// 			// think();

// 			return () => {
// 				listeners.forEach((listener) => {
// 					GameEvents.Unsubscribe(listener);
// 				});
// 				// $.CancelScheduled(iScheduleHandle);
// 			};
// 		}, []);
// 		return (
// 			<>
// 				{abilities.map((tAbilityData, key) => {
// 					return <SecondaryAbilityPanel id={tAbilityData.abilityname} key={tAbilityData.abilityname} overrideentityindex={tAbilityData.overrideentityindex} />;
// 				})}
// 			</>
// 		);
// 	}
// 	render(<CosmeticItems />, $("#TertiaryAbilitiesBar").FindChildTraverse("AbilityButtons") as Panel);
// }

// // 消耗品
// function PlayerConsumables() {
// 	const playerConsumables = useNetTableKey("service", "PlayerConsumables")?.[Players.GetLocalPlayer()] ?? {
// 		"4100001": 0,
// 		"4100002": 0,
// 		"4100003": 0,
// 	};
// 	const playerConsumablesFree = useNetTableKey("service", "PlayerConsumablesFree")?.[Players.GetLocalPlayer()] ?? {};
// 	const player_consumables_use_state = useNetTableKey("common", "player_consumables_use_state")?.[Players.GetLocalPlayer()] ?? {
// 		["4100001"]: { iUsedCount: 0, iMaxCount: 0 },
// 		["4100002"]: { iUsedCount: 0, iMaxCount: 0 },
// 		["4100003"]: { iUsedCount: 0, iMaxCount: 0 },
// 	};

// 	let useConsumable = (self: Panel, itemID: number) => {
// 		if (finiteNumber(Number(playerConsumables[String(itemID)] ?? 0)) > 0) {
// 			self.enabled = false;
// 			Request("UseConsumables", {
// 				cid: itemID,
// 				unit: Players.GetLocalPlayerPortraitUnit(),
// 			}, (data) => {
// 				if (itemID == 4100003) {
// 					if (player_consumables_use_state["4100003"].iUsedCount < player_consumables_use_state["4100003"].iMaxCount - 1) {
// 						self.enabled = true;
// 					}
// 				}
// 			});
// 		} else {
// 			ErrorMessage("error_not_enough_count");
// 		}
// 	};

// 	let free_4100001 = false;
// 	let free_4100002 = false;
// 	let free_4100003 = false;
// 	for (const key in playerConsumablesFree) {
// 		const element = playerConsumablesFree[key];
// 		if (element == 4100001) {
// 			free_4100001 = true;
// 		}
// 		if (element == 4100002) {
// 			free_4100002 = true;
// 		}
// 		if (element == 4100003) {
// 			free_4100003 = true;
// 		}
// 	}

// 	const getDescription = useCallback((itemID: "4100001" | "4100002" | "4100003") => {
// 		let usedCount = player_consumables_use_state[itemID].iUsedCount;
// 		let maxCount = player_consumables_use_state[itemID].iMaxCount;
// 		return $.Localize("#" + itemID + "_description") + "<br><br>" + $.Localize("#consumable_limit") + usedCount + "/" + maxCount;
// 	}, [player_consumables_use_state]);

// 	return (
// 		<Panel className="PlayerConsumables">
// 			<Button className="Consumable" enabled={player_consumables_use_state["4100001"].iUsedCount < player_consumables_use_state["4100001"].iMaxCount} onactivate={self => useConsumable(self, 4100001)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#4100001", getDescription("4100001"))} onmouseout={self => DOTAHideTitleTextTooltip(self)}>
// 				<Panel className={"ItemIcon_" + 4100001} />
// 				<Label className="ItemCount" text={playerConsumables["4100001"]} />
// 				{free_4100001 &&
// 					<Panel className={"FreeIcon"} />
// 				}
// 			</Button>
// 			<Button className="Consumable" enabled={player_consumables_use_state["4100002"].iUsedCount < player_consumables_use_state["4100002"].iMaxCount} onactivate={self => useConsumable(self, 4100002)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#4100002", getDescription("4100002"))} onmouseout={self => DOTAHideTitleTextTooltip(self)}>
// 				<Panel className={"ItemIcon_" + 4100002} />
// 				<Label className="ItemCount" text={playerConsumables["4100002"]} />
// 				{free_4100002 &&
// 					<Panel className={"FreeIcon"} />
// 				}
// 			</Button>
// 			<Button className="Consumable" enabled={player_consumables_use_state["4100003"].iUsedCount < player_consumables_use_state["4100003"].iMaxCount} onactivate={self => useConsumable(self, 4100003)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#4100003", getDescription("4100003"))} onmouseout={self => DOTAHideTitleTextTooltip(self)}>
// 				<Panel className={"ItemIcon_" + 4100003} />
// 				<Label className="ItemCount" text={playerConsumables["4100003"]} />
// 				{free_4100003 &&
// 					<Panel className={"FreeIcon"} />
// 				}
// 			</Button>
// 		</Panel>
// 	);
// }
// if (!(Players.GetLocalPlayer() == -1 || Players.IsSpectator(Players.GetLocalPlayer()) || Players.IsLocalPlayerLiveSpectating())) {
// 	render(<PlayerConsumables />, $("#ConsumablesContainer"));
// }

// // 团队Boss
// function TeamBoss() {
// 	let teamBossNet = useNetTableKey("common", "team_boss");
// 	const [teamMin, setTeamMin] = useState([0, 0, 0, 0]);
// 	const [teamMax, setTeamMax] = useState([100, 100, 100, 100]);
// 	useEffect(() => {
// 		if (teamBossNet) {
// 			setTeamMin([teamBossNet["team_boss_1"].flStartTime, teamBossNet["team_boss_2"].flStartTime, teamBossNet["team_boss_3"].flStartTime, teamBossNet["team_boss_4"].flStartTime]);
// 			setTeamMax([teamBossNet["team_boss_1"].flEndTime, teamBossNet["team_boss_2"].flEndTime, teamBossNet["team_boss_3"].flEndTime, teamBossNet["team_boss_4"].flEndTime]);
// 		}
// 	}, [teamBossNet]);
// 	useHeartBeat(1);
// 	let summon = (str: string, index: number) => {
// 		if (Game.GetGameTime() >= teamMax[index]) {
// 			Popups.Show("team_boss_confirm", { title: "#" + str, unit_name: str, data: teamBossNet[str] });
// 		} else {
// 			ErrorMessage("error_teamboss_cooldown");
// 		}
// 	};
// 	return (
// 		<Panel className="TeamBoss">
// 			<Panel>
// 				<CircularProgressBar id="TeamBossSummonButton" className={classNames("team_boss_1", { enable: Game.GetGameTime() >= teamMax[0] })} value={Game.GetGameTime()} min={teamMin[0]} max={teamMax[0]} onactivate={() => summon("team_boss_1", 0)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#team_boss_1", "#TeamBoss1")} onmouseout={self => DOTAHideTitleTextTooltip(self)} oncontextmenu={() => GameEvents.SendCustomEventToServer("team_boss_summon", { unit_name: "team_boss_1" })} />
// 				<DOTAScenePanel style={{ width: "100%", height: "100%", opacity: Game.GetGameTime() >= teamMax[0] ? "1" : "0" }} map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
// 			</Panel>
// 			<Panel>
// 				<CircularProgressBar id="TeamBossSummonButton" className={classNames("team_boss_2", { enable: Game.GetGameTime() >= teamMax[1] })} value={Game.GetGameTime()} min={teamMin[1]} max={teamMax[1]} onactivate={() => summon("team_boss_2", 1)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#team_boss_2", "#TeamBoss2")} onmouseout={self => DOTAHideTitleTextTooltip(self)} oncontextmenu={() => GameEvents.SendCustomEventToServer("team_boss_summon", { unit_name: "team_boss_2" })} />
// 				<DOTAScenePanel style={{ width: "100%", height: "100%", opacity: Game.GetGameTime() >= teamMax[1] ? "1" : "0" }} map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
// 			</Panel>
// 			<Panel>
// 				<CircularProgressBar id="TeamBossSummonButton" className={classNames("team_boss_3", { enable: Game.GetGameTime() >= teamMax[2] })} value={Game.GetGameTime()} min={teamMin[2]} max={teamMax[2]} onactivate={() => summon("team_boss_3", 2)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#team_boss_3", "#TeamBoss3")} onmouseout={self => DOTAHideTitleTextTooltip(self)} oncontextmenu={() => GameEvents.SendCustomEventToServer("team_boss_summon", { unit_name: "team_boss_3" })} />
// 				<DOTAScenePanel style={{ width: "100%", height: "100%", opacity: Game.GetGameTime() >= teamMax[2] ? "1" : "0" }} map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
// 			</Panel>
// 			<Panel>
// 				<CircularProgressBar id="TeamBossSummonButton" className={classNames("team_boss_4", { enable: Game.GetGameTime() >= teamMax[3] })} value={Game.GetGameTime()} min={teamMin[3]} max={teamMax[3]} onactivate={() => summon("team_boss_4", 3)} onmouseover={self => DOTAShowTitleTextTooltip(self, "#team_boss_4", "#TeamBoss4")} onmouseout={self => DOTAHideTitleTextTooltip(self)} oncontextmenu={() => GameEvents.SendCustomEventToServer("team_boss_summon", { unit_name: "team_boss_4" })} />
// 				<DOTAScenePanel style={{ width: "100%", height: "100%", opacity: Game.GetGameTime() >= teamMax[3] ? "1" : "0" }} map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
// 			</Panel>
// 		</Panel>
// 	);
// }
// render(<TeamBoss />, $("#TeamBossContainer"));
// // 冻结
// function FreezePanel() {
// 	let pauseSettingsNet = useNetTableKey("common", "custom_pause");
// 	const [bGameFreezed, setGameFreezed] = useState(false);
// 	useEffect(() => {
// 		if (pauseSettingsNet) {
// 			setGameFreezed(pauseSettingsNet.frozen == 1);
// 		}
// 	}, [pauseSettingsNet]);
// 	return (
// 		<Panel className="FreezePanel" style={{ visibility: bGameFreezed ? "visible" : "collapse" }}>
// 			<Label className="FreezePanelText" text="已冻结" />
// 			<Button className="FreezePanelButton" onactivate={() => {
// 				GameEvents.SendCustomEventToServer("toggle_game_frozen", {});
// 			}}>
// 				<Label text="解除" />
// 			</Button>
// 		</Panel>
// 	);
// }
// render(<FreezePanel />, $("#FreezePanelContainer"));
// // NPC面板
// let NPCDialogEventsFragments = (() => {
// 	function Fragments() {
// 		let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 		let tData = CustomNetTables.GetTableValue("npc", iLocalPortraitUnit) ?? {};
// 		let tNPCDialogEvents = tData.tDialogEvents ?? {};
// 		let iNPCPlayerID = tData.iPlayerID ?? -1;

// 		return (
// 			<>
// 				{Object.keys(tNPCDialogEvents).map((key, index) => {
// 					let sNPCDialogEvent = tNPCDialogEvents[Number(key)];
// 					if (sNPCDialogEvent != "") {
// 						let sHotkey = "";
// 						let iAbilityEntIndex = -1 as AbilityEntityIndex;
// 						let iPrimaryKeybind = DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1 + index;
// 						let iSecondaryKeybind = DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST + index;
// 						if (index > 5) {
// 							iPrimaryKeybind = DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1 + index - 6;
// 							iSecondaryKeybind = DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST + index - 6;
// 							iAbilityEntIndex = Entities.GetItemInSlot(iLocalPortraitUnit, index - 6);
// 						} else {
// 							iAbilityEntIndex = Entities.GetAbility(iLocalPortraitUnit, index);
// 						}
// 						sHotkey = Game.GetKeybindForCommand(iPrimaryKeybind);
// 						if (sHotkey == "") {
// 							sHotkey = Game.GetKeybindForCommand(iSecondaryKeybind);
// 						}

// 						return <Panel className="NPCDialogEvent" key={index} hittest={false} >
// 							<DialogEventsButton id="NPCDialogEventButton" enabled={Entities.IsControllableByPlayer(iLocalPortraitUnit, Players.GetLocalPlayer()) && iNPCPlayerID == Players.GetLocalPlayer()} dialog_event_name={sNPCDialogEvent} onactivate={() => {
// 								GameEvents.SendCustomEventToServer("on_dialog_events_activate", { dialog_event_name: sNPCDialogEvent });
// 							}} />
// 							{(Entities.IsControllableByPlayer(iLocalPortraitUnit, Players.GetLocalPlayer()) && iNPCPlayerID == Players.GetLocalPlayer()) && <HotKeyContainer id="NPCDialogEventHotkey" hittest={false} abilityEntIndex={iAbilityEntIndex} primaryKeybind={iPrimaryKeybind} secondaryKeybind={iSecondaryKeybind} />}
// 						</Panel>;
// 					}
// 				})}
// 			</>
// 		);
// 	}
// 	return Fragments;
// })();

// //资源面板
// let PlayerResourceFragments = (() => {
// 	let tPlayerData: NetworkedData<NetTablePlayerData> | undefined = CustomNetTables.GetTableValue("player_data", String(Players.GetLocalPlayer()));
// 	let iLastGold = tPlayerData?.iGold ?? 0;
// 	let iLastCrystal = tPlayerData?.iCrystal ?? 0;
// 	let iLastScore = tPlayerData?.iScore ?? 0;

// 	function Fragments({ pPlayerResource }: { pPlayerResource: Panel; }) {
// 		let iPlayerID = Players.GetLocalPlayer();
// 		let tPlayerData: NetworkedData<NetTablePlayerData> | undefined = CustomNetTables.GetTableValue("player_data", String(iPlayerID));

// 		let iGold = tPlayerData?.iGold ?? 0;
// 		let iCrystal = tPlayerData?.iCrystal ?? 0;
// 		let iScore = tPlayerData?.iScore ?? 0;

// 		pPlayerResource.FindChildTraverse("Gold")?.SetDialogVariable("gold", String(Math.floor(iGold == -1 ? 0 : iGold)));
// 		pPlayerResource.FindChildTraverse("Crystal")?.SetDialogVariable("crystal", String(Math.floor(iCrystal == -1 ? 0 : iCrystal)));
// 		pPlayerResource.FindChildTraverse("Score")?.SetDialogVariable("score", String(Math.floor(iScore == -1 ? 0 : iScore)));

// 		let pGoldLabel = pPlayerResource.FindChildTraverse("GoldLabel");
// 		if (pGoldLabel != null && iLastGold != iGold && typeof (CustomUIConfig.FireChangeGold) == "function") {
// 			CustomUIConfig.FireChangeGold(pGoldLabel, Math.floor(iGold) - Math.floor(iLastGold));
// 		}

// 		let pCrystalLabel = pPlayerResource.FindChildTraverse("CrystalLabel");
// 		if (pCrystalLabel != null && iLastCrystal != iCrystal && typeof (CustomUIConfig.FireChangeCrystal) == "function") {
// 			CustomUIConfig.FireChangeCrystal(pCrystalLabel, Math.floor(iCrystal) - Math.floor(iLastCrystal));
// 		}

// 		let pScoreLabel = pPlayerResource.FindChildTraverse("ScoreLabel");
// 		if (pScoreLabel != null && iLastScore != iScore && typeof (CustomUIConfig.FireChangeScore) == "function") {
// 			CustomUIConfig.FireChangeScore(pScoreLabel, Math.floor(iScore) - Math.floor(iLastScore));
// 		}

// 		iLastGold = iGold;
// 		iLastCrystal = iCrystal;
// 		iLastScore = iScore;

// 		return (
// 			<>
// 				<Panel id="Gold" >
// 					<Button id="GoldButton" onmouseover={(pSelf) => $.DispatchEvent("DOTAShowTextTooltip", pSelf, $.Localize("#PlayerGoldTooltip", pSelf))} onmouseout={(pSelf) => $.DispatchEvent("DOTAHideTextTooltip", pSelf)} >
// 						<Panel id="GoldIcon" className="PlayerResourceIcon" hittest={false} />
// 						<Label id="GoldLabel" hittest={false} className="PlayerResourceLabel MonoNumbersFont ShopButtonValueLabel" localizedText="{s:gold}" />
// 					</Button>
// 				</Panel>
// 				<Panel id="Crystal" >
// 					<Button id="CrystalButton" onactivate={() => $.DispatchEvent("DOTAHUDToggleShop")} onmouseover={(pSelf) => $.DispatchEvent("DOTAShowTextTooltip", pSelf, $.Localize("#PlayerCrystalTooltip", pSelf))} onmouseout={(pSelf) => $.DispatchEvent("DOTAHideTextTooltip", pSelf)} >
// 						<Panel id="CrystalIcon" className="PlayerResourceIcon" hittest={false} />
// 						<Label id="CrystalLabel" hittest={false} className="PlayerResourceLabel MonoNumbersFont ShopButtonValueLabel" localizedText="{s:crystal}" />
// 					</Button>
// 				</Panel>
// 				<Panel id="Score" >
// 					<Button id="ScoreButton" onmouseover={(pSelf) => $.DispatchEvent("DOTAShowTextTooltip", pSelf, $.Localize("#PlayerScoreTooltip", pSelf))} onmouseout={(pSelf) => $.DispatchEvent("DOTAHideTextTooltip", pSelf)} >
// 						<Panel id="ScoreIcon" className="PlayerResourceIcon" hittest={false} />
// 						<Label id="ScoreLabel" hittest={false} className="PlayerResourceLabel MonoNumbersFont ShopButtonValueLabel" localizedText="{s:score}" />
// 					</Button>
// 				</Panel>
// 			</>
// 		);
// 	}

// 	return Fragments;
// })();

// // 主线任务
// {
// 	function MainTask() {
// 		const tPlayerData = useNetTableKey("common", "player_main_tasks");
// 		let iIndex = finiteNumber(Number(tPlayerData?.[Players.GetLocalPlayer()]?.iIndex), 0) - 1;
// 		let tTaskData: Table | undefined;
// 		if (iIndex != -1) {
// 			tTaskData = CustomUIConfig.TaskManager[iIndex];
// 			$("#MainTask").SetHasClass("Hidden", tTaskData == undefined);
// 		}
// 		return (
// 			tTaskData ? <>
// 				<Label id="MainTaskTitle" text={$.Localize("#task_" + tTaskData.TaskName)} />
// 				<Label id="MainTaskDescription" text={$.Localize("#task_" + tTaskData.TaskName + "_Description")} />
// 				<Label id="MainTaskRequire" text={$.Localize("#MainTaskRequire")} />
// 				<Panel id="MainTaskStages" >
// 					{(() => {
// 						let a: JSX.Element[] = [];
// 						for (let i = 0; i < 10; i++) {
// 							const tStage = tTaskData["TaskStage" + i];
// 							if (tStage) {
// 								let iNow = finiteNumber(Number(tPlayerData?.[Players.GetLocalPlayer()].tProgress?.[String(i)]));
// 								let iTaskStageCount = finiteNumber(Number(tStage.TaskStageCount));
// 								let sTaskStageType = tStage.TaskStageType;
// 								let sTaskStageTarget = tStage.TaskStageTarget;

// 								let sTargetName = "";
// 								switch (sTaskStageType) {
// 									case "TASK_STAGE_TYPE_PICK":
// 										sTargetName = $.Localize("#DOTA_Tooltip_Ability_" + sTaskStageTarget);
// 										break;
// 									default:
// 										sTargetName = $.Localize("#" + sTaskStageTarget);
// 										break;
// 								}

// 								a.push(<Panel className="MainTaskStage" key={a.length}>
// 									<Label id="MainTaskStageProgress" text={`${iNow}/${iTaskStageCount}`} />
// 									<Label key={sTaskStageType} localizedText={"#" + sTaskStageType} dialogVariables={{ task_target_name: sTargetName }} />
// 								</Panel>);
// 							}
// 						}
// 						return a;
// 					})()}
// 				</Panel>
// 				<TextButton id="MainTaskDialogEvent" localizedText="#MainTaskDialogEventButton" onactivate={() => {
// 					let sNPCDialogEvent = tTaskData?.DialogEventName;
// 					if (sNPCDialogEvent) {
// 						GameEvents.SendCustomEventToServer("on_dialog_events_activate", { dialog_event_name: sNPCDialogEvent });
// 					}
// 				}} />
// 			</> : <></>
// 		);
// 	}
// 	render(<MainTask />, $("#MainTask"));
// }
// // 右侧面板
// {
// 	function NpcContainer() {
// 		let npcNetTable = useNetTableValues("npc");
// 		const [npcEnhancementData, setNpcEnhancementData] = useState<any>({});
// 		const [npcDungeonData, setNpcDungeonData] = useState<any>({});
// 		const [npcDrawData, setNpcDrawData] = useState<any>({});
// 		const [npcExchangeData, setNpcExchangeData] = useState<any>({});
// 		useEffect(() => {
// 			for (const sEntIndex in npcNetTable) {
// 				const tData = npcNetTable[sEntIndex];
// 				if (tData.iPlayerID == Players.GetLocalPlayer()) {
// 					if (tData.sUnitName == "npc_enhancement") {
// 						setNpcEnhancementData({ ...tData, iEntIndex: Number(sEntIndex) });
// 					}
// 					if (tData.sUnitName == "npc_dungeon") {
// 						setNpcDungeonData({ ...tData, iEntIndex: Number(sEntIndex) });
// 					}
// 					if (tData.sUnitName == "npc_draw") {
// 						setNpcDrawData({ ...tData, iEntIndex: Number(sEntIndex) });
// 					}
// 					if (tData.sUnitName == "npc_exchange") {
// 						setNpcExchangeData({ ...tData, iEntIndex: Number(sEntIndex) });
// 					}
// 				}
// 			}
// 		}, [npcNetTable]);
// 		return (
// 			<>
// 				{npcEnhancementData.sUnitName &&
// 					<NpcButton entindex={npcEnhancementData.iEntIndex} unitName={npcEnhancementData.sUnitName} />
// 				}
// 				{npcDungeonData.sUnitName &&
// 					<NpcButton entindex={npcDungeonData.iEntIndex} unitName={npcDungeonData.sUnitName} />
// 				}
// 				{npcDrawData.sUnitName &&
// 					<NpcButton entindex={npcDrawData.iEntIndex} unitName={npcDrawData.sUnitName} />
// 				}
// 				{npcExchangeData.sUnitName &&
// 					<NpcButton entindex={npcExchangeData.iEntIndex} unitName={npcExchangeData.sUnitName} />
// 				}
// 			</>
// 		);
// 	}
// 	function NpcButton({ entindex, unitName }: { entindex: EntityIndex, unitName: string; }) {
// 		let selectNpc = useCallback(() => {
// 			if (Entities.IsValidEntity(entindex) && Entities.IsControllableByPlayer(entindex, Players.GetLocalPlayer())) {
// 				if (Players.IsEntitySelected(entindex)) {
// 					GameUI.MoveCameraToEntity(entindex);
// 				} else {
// 					GameUI.SelectUnit(entindex, false);
// 				}
// 			}
// 		}, [entindex]);
// 		return (
// 			<Button id={"SideBtn_" + unitName} className="NpcButton" onactivate={selectNpc}>
// 				<Image className="NpcIcon" src={"file://{images}/custom_game/hud/" + unitName + ".png"} />
// 				<Label className="NpcLabel" text={$.Localize("#" + unitName + "_lite")} />
// 			</Button>
// 		);
// 	}
// 	render(<NpcContainer />, $("#NpcContainer"));
// }
// // 玩家头像
// let PlayerContainer = (() => {
// 	function PlayerPanel({ iPlayerID }: { iPlayerID: PlayerID; }) {
// 		let tPlayerInfo = Game.GetPlayerInfo(iPlayerID);
// 		let iHeroEntIndex = Players.GetPlayerHeroEntityIndex(iPlayerID);
// 		let fPowerValue = finiteNumber(Number(Entities.GetUnitData(iHeroEntIndex, "GetPowerValue")));
// 		const IsPlus = () => {
// 			let aPlayerIDs: PlayerID[] = Game.GetAllPlayerIDs();
// 			for (let i = 0; i < aPlayerIDs.length; i++) {
// 				const _iPlayerID = aPlayerIDs[i];
// 				if (Players.IsValidPlayerID(_iPlayerID) && !Players.IsSpectator(_iPlayerID) && iPlayerID != _iPlayerID) {
// 					let _iHeroEntIndex = Players.GetPlayerHeroEntityIndex(_iPlayerID);
// 					let _fPowerValue = finiteNumber(Number(Entities.GetUnitData(_iHeroEntIndex, "GetPowerValue")));
// 					if (_fPowerValue > fPowerValue) {
// 						return false;
// 					}
// 				}
// 			}
// 			return false;
// 		};
// 		return (
// 			<Panel className="PlayerPanel">
// 				<Panel className="AvatarContainer">
// 					<DOTAAvatarImage style={{ width: "50px", height: "50px", borderRadius: "50%", align: "center center" }} steamid={tPlayerInfo?.player_steamid} />
// 				</Panel>
// 				<Panel className="PlayerNameContainer">
// 					<Label id="PlayerNameLabel" text={tPlayerInfo?.player_name} />
// 				</Panel>
// 				<Panel className={classNames("PlayerPowerContainer", { Plus: IsPlus() })}>
// 					<Image className="HeroPowerIcon" />
// 					<Label className="HeroPowerLabel" text={FormatNumber(Round(fPowerValue))} />
// 				</Panel>
// 				{/* <Panel id="PlayerMedalList" onmouseover={(self) => CustomUIConfig.ShowMedalWallTooltip(self, iPlayerID)} onmouseout={self => CustomUIConfig.HideMedalWallTooltip(self)}>
// 					<Image className="PlayerMedal" src="file://{images}/custom_game/cosmetic/7800101.png" />
// 					<Image className="PlayerMedal" src="file://{images}/custom_game/cosmetic/7800102.png" />
// 				</Panel> */}
// 			</Panel>
// 		);
// 	}

// 	function Fragments({ pPlayerContainer }: { pPlayerContainer: Panel; }) {
// 		return (
// 			<>
// 				{(() => {
// 					let a: JSX.Element[] = [];

// 					let aPlayerIDs: PlayerID[] = Game.GetAllPlayerIDs();
// 					for (let i = 0; i < aPlayerIDs.length; i++) {
// 						const iPlayerID = aPlayerIDs[i];
// 						if (Players.IsValidPlayerID(iPlayerID) && !Players.IsSpectator(iPlayerID)) {
// 							a.push(<PlayerPanel key={a.length} iPlayerID={iPlayerID} />);
// 						}
// 					}

// 					return a;
// 				})()}
// 			</>
// 		);
// 	}
// 	return Fragments;
// })();

// //吞噬面板查看属性的按钮
// {
// 	function DevouredButton() {
// 		useEffect(() => {
// 			let sHotkey = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_SCOREBOARD_TOGGLE);
// 			let pContainer = $("#left_attribute_container");
// 			pContainer.RemoveClass("hotkey_alt");
// 			pContainer.RemoveClass("hotkey_ctrl");
// 			let aHotkeys = sHotkey.split("-");
// 			if (aHotkeys) {
// 				let pHotkeyContainer = pContainer.FindChildTraverse("attribute_HotkeyContainer");
// 				for (const sKey of aHotkeys) {
// 					if (sKey.toUpperCase().indexOf("ALT") != -1) {
// 						pContainer.AddClass("hotkey_alt");
// 					} else if (sKey.toUpperCase().indexOf("CTRL") != -1) {
// 						pContainer.AddClass("hotkey_ctrl");
// 					} else {
// 						pHotkeyContainer?.SetDialogVariable("hotkey", sKey);
// 					}
// 				}
// 			}
// 		}, []);

// 		return (
// 			<>
// 				<Button id="attribute_slot_icon" className="slotImage" onactivate={() => $.DispatchEvent("DOTAHUDToggleScoreboard")} />
// 				<Panel id="attribute_HotkeyContainer" hittest={false}>
// 					<Panel id="Hotkey" hittest={false}>
// 						<Label id="HotkeyText" localizedText="{s:hotkey}" hittest={false} />
// 					</Panel>
// 					<Panel id="HotkeyModifier" hittest={false}>
// 						<Label id="AltText" localizedText="#DOTA_Keybind_ALT" hittest={false} />
// 					</Panel>
// 					<Panel id="HotkeyCtrlModifier" hittest={false}>
// 						<Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" hittest={false} />
// 					</Panel>
// 				</Panel>
// 				<Label className="slotDescription" localizedText="#ToggleAttribute" hittest={false} />
// 			</>
// 		);
// 	}
// 	render(<DevouredButton />, $("#left_attribute_container"));
// }/** 顶部 */
// function TopBar({ round }: { round: number; }) {
// 	return (
// 		<>
// 			<Image id="DifficultyImage" src={"file://{images}/custom_game/hero_selection/difficulty_" + Game.GetCustomGameDifficulty() + ".png"} onmouseover={self => DOTAShowTextTooltip(self, $.Localize("#Tooltip_current_difficulty", self) + $.Localize("#Difficulty_" + Game.GetCustomGameDifficulty(), self))} onmouseout={self => DOTAHideTextTooltip(self)} />
// 			{/* <Label id="TopBarRoundNumber" localizedText="{d:round_number}" onmouseover={self => DOTAShowTextTooltip(self, "RoundRumber")} onmouseout={self => DOTAHideTextTooltip(self)} /> */}
// 			<EOM_ImageNumber id="TopBarRoundNumber" value={round} type={3} />
// 			<Label id="TopBarRoundTime" localizedText="{d:round_time}" onmouseover={self => DOTAShowTextTooltip(self, "#RoundCountdownTime")} onmouseout={self => DOTAHideTextTooltip(self)} />
// 			{/* <Label id="TopBarGameTime" localizedText="{s:game_time_minutes}:{s:game_time_seconds}" /> */}
// 		</>
// 	);
// }

// // 副本投票
// let DungeonVoteFragments = (() => {
// 	function DungeonVoteMain({ tDungeonVote }: { tDungeonVote: NetworkedData<CustomNetTableDeclarations["common"]["dungeon_vote"]>; }) {
// 		let tSelection: Record<string, PlayerID[]> = {};
// 		if (tDungeonVote.tPlayerVotes) {
// 			for (const sPlayerID in tDungeonVote.tPlayerVotes) {
// 				const iPlayerID = Number(sPlayerID) as PlayerID;
// 				const tVoteData = tDungeonVote.tPlayerVotes[sPlayerID];
// 				if (!tSelection[tVoteData.sSelection]) tSelection[tVoteData.sSelection] = [];
// 				tSelection[tVoteData.sSelection].push(iPlayerID);
// 			}
// 		}
// 		let sPossibleSelection = "";
// 		let iMax = 0;
// 		let iDungeonDifficult = 0;
// 		for (const sDungeonName in tSelection) {
// 			const a = tSelection[sDungeonName];
// 			if (a.length >= iMax) {
// 				let iDifficulty = CustomUIConfig.DungeonsKvs?.[sDungeonName]?.Difficulty ?? 1;
// 				if (iDifficulty > iDungeonDifficult) {
// 					iMax = a.length;
// 					iDungeonDifficult = iDifficulty;
// 					sPossibleSelection = sDungeonName;
// 				}
// 			}
// 		}

// 		return <Panel id="DungeonVoteMain" onactivate={() => { }}>
// 			<Panel id="DungeonVoteHeader" >
// 				<EOM_ImageNumber id="DungeonVoteCountdown" value={Math.ceil(Math.max(tDungeonVote.fEndTime - Game.GetGameTime(), 0))} type={2} />
// 				<Label id="DungeonVoteTitle" localizedText="#DungeonVoteTitle" />
// 			</Panel>
// 			<Panel id="DungeonVoteContainer" >
// 				{CustomUIConfig.DungeonsKvs && Object.keys(CustomUIConfig.DungeonsKvs).map((sDungeonName, index) => {
// 					const tData = CustomUIConfig.DungeonsKvs[sDungeonName];
// 					let iDifficulty = tData?.Difficulty;

// 					return <Panel key={index} className={classNames("DungeonSelection", { "Selected": sDungeonName == sPossibleSelection })} enabled={tDungeonVote.tDungeonList && FindKey(tDungeonVote.tDungeonList, sDungeonName) != undefined} onactivate={() => {
// 						GameEvents.SendCustomEventToServer("dungeon_selected", {
// 							dungeon_name: sDungeonName,
// 						});
// 					}} >
// 						<Panel id="DungeonSelectionBorder" />
// 						<Panel id="DungeonSelectionPlayerContainer" >
// 							{tSelection[sDungeonName] && tSelection[sDungeonName].map(iPlayerID => {
// 								let tPlayerInfo = Game.GetPlayerInfo(iPlayerID);
// 								return <Panel key={iPlayerID} className={classNames("DungeonSelectionPlayer", { "IsConfirm": tDungeonVote.tPlayerVotes[iPlayerID].bIsDefault == 0 })} >
// 									<Panel id="DungeonSelectionPlayerStateIcon" />
// 									<DOTAAvatarImage steamid={tPlayerInfo.player_steamid} style={{
// 										verticalAlign: "center",
// 										width: "46px",
// 										height: "46px",
// 										borderRadius: "50%",
// 									}} />
// 								</Panel>;
// 							})}
// 						</Panel>
// 						<Image id="DungeonSelectionImage" src={`file://{images}/custom_game/dungeon/selection/${sDungeonName}.png`} />
// 						<Label id="DungeonSelectionName" text={$.Localize("#" + sDungeonName)} />
// 						<Image id="DungeonSelectionDifficultyImage" src={"file://{images}/custom_game/hero_selection/difficulty_" + iDifficulty + ".png"} scaling="stretch-to-fit-preserve-aspect" />
// 						<Panel id="DungeonSelectionLock" hittest={false} />
// 						<Label id="DungeonSelectionLockLabel" hittest={false} localizedText="#DungeonSelectionLockLabel" dialogVariables={{ difficulty_name: $.Localize("#Difficulty_" + iDifficulty) }} />
// 					</Panel>;
// 				})}
// 			</Panel>
// 			<Panel id="DungeonVoteConfirmBG" hittest={false} />
// 			<EOM_CommonTextButton id="DungeonVoteConfirm" enabled={tDungeonVote.tPlayerVotes[Players.GetLocalPlayer()].bIsDefault == 1} localizedText="#DungeonVoteConfirm" onactivate={() => {
// 				GameEvents.SendCustomEventToServer("dungeon_confirm", { exiting: 0 });
// 			}} />
// 			<TextButton id="DungeonVoteExit" localizedText="#DungeonVoteExit" onactivate={() => {
// 				GameEvents.SendCustomEventToServer("dungeon_confirm", { exiting: 1 });
// 			}} />
// 		</Panel>;
// 	}

// 	function Fragments({ pDungeonVote }: { pDungeonVote: Panel; }) {
// 		let tDungeonVote = CustomNetTables.GetTableValue("common", "dungeon_vote") ?? {};
// 		return ((Object.values(tDungeonVote).length > 0 && tDungeonVote.tPlayerVotes[Players.GetLocalPlayer()].bIsExited == 0) ? <DungeonVoteMain tDungeonVote={tDungeonVote} /> : <></>);
// 	}

// 	return Fragments;
// })();

// // 右上角按钮
// {
// 	function MenuButtons() {
// 		const NextRound = useCallback((self: Panel) => {
// 			GameEvents.SendCustomEventToServer("NextRound", {});
// 		}, []);
// 		const roundData = useNetTableKey("common", "round_data");
// 		let bSkipRoundEnabled = roundData?.skip_round_enabled == 1;
// 		let bEnable = false;
// 		if (roundData.round_number && (roundData.round_number < 30 || (roundData.round_number == 30 && roundData.round_state == 0))) {
// 			bEnable = true;
// 		}
// 		const [hasMark, setHasMark] = useState(false);
// 		useGameEvent("custom_ui_exclamation", (event) => {
// 			if (event.name == "rewards") {
// 				setHasMark(true);
// 			}
// 		}, []);
// 		const OnActive = () => {
// 			ToggleWindows("rewards");
// 			setHasMark(false);
// 		};
// 		return (
// 			<>
// 				<Button className={classNames("RightMenuButton", "rewards")} onmouseover={self => DOTAShowTextTooltip(self, "#MenuButton_rewards_description")} onmouseout={self => DOTAHideTextTooltip(self)} onactivate={self => OnActive()}>
// 					<Image className="MenuIcon Reward" />
// 					<Label className="MenuLabel" localizedText={"#MenuButton_rewards"} />
// 					{hasMark &&
// 						<Image className="MenuExclamationMark" />
// 					}
// 				</Button>
// 				<Button className={classNames("RightMenuButton", "rewards")} enabled={bEnable && bSkipRoundEnabled} onmouseover={self => DOTAShowTextTooltip(self, "#MenuButton_next_round_description")} onmouseout={self => DOTAHideTextTooltip(self)} onactivate={self => NextRound(self)}>
// 					<Image className="MenuIcon NextRound" />
// 					<Label className="MenuLabel" localizedText={"#MenuButton_next_round"} />
// 				</Button>
// 			</>
// 		);
// 	}

// 	render(<MenuButtons />, $("#RightTopButtons"));

// 	interface RewardItemData extends AddItemData {
// 		way: string;
// 	}

// 	let fDelayTime = 0.25;

// 	function RewardsToastContianer() {
// 		const refToastManager = useRef<ToastManager>(null);
// 		useEffect(() => {
// 			const listener = GameEvents.Subscribe("ReceiveRewards", (tData) => {
// 				if (typeof tData.json == "string") {
// 					let pToastManager = refToastManager.current;
// 					if (pToastManager) {
// 						let t: RewardItemData[] = JSON.parseSafe(tData.json);
// 						if (Array.isArray(t)) {
// 							for (let i = 0; i < t.length; i++) {
// 								const tData = t[i];
// 								$.Schedule(i * fDelayTime, () => {
// 									let pToastManager = refToastManager.current;
// 									if (pToastManager) {
// 										let p = $.CreatePanel("Panel", pToastManager, "");
// 										render(<RewardPanelFragments tData={tData} pParent={p} />, p);
// 										pToastManager.QueueToast(p);
// 									}
// 								});
// 							}
// 						}
// 					}
// 				}
// 			});

// 			return () => GameEvents.Unsubscribe(listener);
// 		}, []);

// 		return (
// 			<>
// 				<Panel id="RewardsToastWrapper" hittest={false}>
// 					<GenericPanel type="ToastManager" id="RewardsToastManager" ref={refToastManager} toastduration="5s" maxtoastsvisible={10} maxtoastbehavior="deleteoldest" delaytime={0} />
// 				</Panel>
// 			</>
// 		);
// 	}

// 	render(<RewardsToastContianer />, $("#RewardsToastContianer"));
// }

// // 顶部进攻提示
// {
// 	function RoundStart() {
// 		const [show, toggle, setValue] = useToggle(false);
// 		useGameEvent("RoundStart", () => {
// 			Particles.CreateParticle("particles/generic_gameplay/round_notice.vpcf", 6, 0 as EntityIndex);
// 			setValue(true);
// 			$.Schedule(10, () => {
// 				setValue(false);
// 			});
// 		}, []);
// 		return (
// 			<>
// 				{show &&
// 					<Label className="RoundStartLabel" localizedText="#NotificationRoundStart" />
// 				}
// 			</>
// 		);
// 	}
// 	render(<RoundStart />, $("#RoundStart"));
// }

// /** 黄泉路显示 */
// {
// 	function PostGame() {
// 		const PostGameNet = useNetTableKey("common", "post_game") ?? {
// 			sStageName: "HadesDoor",
// 			iLevel: 1,
// 			flStartTime: 1,
// 			flEndTime: 2,
// 			bEnable: 0,
// 		};
// 		const DamageRecordNet = CustomNetTables.GetTableValue("common", "post_game_damage") ?? {};
// 		let maxDamage = 0;
// 		Object.keys(DamageRecordNet).map((iUnitIndex) => {
// 			maxDamage += DamageRecordNet[iUnitIndex];
// 		});
// 		useHeartBeat(1);
// 		return (
// 			<>
// 				{PostGameNet.bEnable > 0 &&
// 					<Panel id="PostGameContainer">
// 						<Panel style={{ flowChildren: "down" }}>
// 							<Panel id="PostGameLevel" >
// 								<EOM_ImageNumber id="PostGameLevelNumbers" value={PostGameNet.iLevel - 1} type={4} />
// 							</Panel>
// 							<EOM_Label labelStyle={EOM_LabelStyle.Menu} localizedText={"#PostGameLevel"} dialogVariables={{ level: PostGameNet.iLevel - 1 }} />
// 						</Panel>
// 						<Panel className="ProgressContainer">
// 							<EOM_Label key={PostGameNet.sStageName} className="Title" labelStyle={EOM_LabelStyle.Menu} localizedText={"#" + PostGameNet.sStageName} />
// 							<Panel id="ProfileLevelProgressBar" >
// 								<Panel id="ProfileLevelProgressBar_BG" />
// 								<Panel id="ProfileLevelProgressBar_Up" style={{ width: ((PostGameNet.flEndTime - Game.GetGameTime()) / (PostGameNet.flEndTime - PostGameNet.flStartTime)) * 100 + "%" }} />
// 							</Panel>
// 							<EOM_Label id="TimeLabel" labelStyle={EOM_LabelStyle.Menu} text={Round(PostGameNet.flEndTime - Game.GetGameTime())} />
// 						</Panel>
// 						<Panel id="DamageRecord">
// 							{Object.keys(DamageRecordNet).sort((a, b) => { return DamageRecordNet[b] - DamageRecordNet[a]; }).map((iUnitIndex) => {
// 								let fDamage = finiteNumber(DamageRecordNet[iUnitIndex]);
// 								return (
// 									<Panel key={iUnitIndex} className="DamageRecordRow">
// 										<DOTAAvatarImage style={{ width: "32px", height: "32px" }} steamid={Game.GetPlayerInfo(Entities.GetPlayerOwnerID(Number(iUnitIndex) as EntityIndex))?.player_steamid} />
// 										{/* <DOTAHeroImage style={{ width: "32px", height: "32px" }} heroimagestyle="icon" heroname={Entities.GetUnitName(Number(iUnitIndex) as EntityIndex)} /> */}
// 										<Panel className="DamageCol">
// 											<EOM_Label className="DamageLabel" labelStyle={EOM_LabelStyle.GOLD} text={FormatNumber(Round(fDamage))} />
// 											<ProgressBar id="DamageProgressBar" min={0} max={Round(maxDamage)} value={Round(fDamage)} />
// 										</Panel>
// 									</Panel>
// 								);
// 							})}
// 						</Panel>
// 					</Panel>
// 				}
// 			</>
// 		);
// 	}
// 	render(<PostGame />, $("#PostGame"));
// }

// (() => {
// 	GameUI.SetDefaultUIEnabled(DotaDefaultUIElement_t.DOTA_DEFAULT_UI_CUSTOMUI_BEHIND_HUD_ELEMENTS, false);

// 	let pHud: Panel | null = $.GetContextPanel();
// 	while (pHud != null && pHud.id != "Hud") {
// 		pHud = pHud.GetParent();
// 	}
// 	let minimap_container = pHud?.FindChildTraverse("minimap_container");
// 	if (minimap_container) {
// 		minimap_container.style.opacity = "0";
// 	}
// 	let pNeutralCampPullTimes = pHud?.FindChildTraverse("NeutralCampPullTimes");
// 	if (pNeutralCampPullTimes) {
// 		pNeutralCampPullTimes.style.opacity = "0";
// 	}
// 	let pLevelLabel = $.GetContextPanel().FindChildTraverse("LevelLabel");
// 	if (pLevelLabel) {
// 		pLevelLabel.style.height = "24px";
// 		pLevelLabel.style.textOverflow = "shrink";
// 	}
// 	let pHealthLabel = $.GetContextPanel().FindChildTraverse<LabelPanel>("HealthLabel");
// 	if (pHealthLabel) {
// 		pHealthLabel.style.opacity = "0";
// 	}
// 	let pHealthRegenLabel = $.GetContextPanel().FindChildTraverse<LabelPanel>("HealthRegenLabel");
// 	if (pHealthRegenLabel) {
// 		pHealthRegenLabel.style.opacity = "0";
// 	}
// 	let pCustomHealthLabel = $.GetContextPanel().FindChildTraverse<LabelPanel>("CustomHealthLabel");
// 	let pCustomHealthRegenLabel = $.GetContextPanel().FindChildTraverse<LabelPanel>("CustomHealthRegenLabel");

// 	let fPrepTime = -1;
// 	let fPrepTimeEnd = -1;
// 	let fTimedRoundDuration = -1;
// 	let fTimedRoundDurationEnd = -1;

// 	function Update() {
// 		let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
// 		let bAltPressed = GameUI.IsAltDown();

// 		let iLocalPlayerID = Players.GetLocalPlayer();
// 		let iLocalHero = Players.GetPlayerHeroEntityIndex(iLocalPlayerID);
// 		let aPlayerSelectedEntities = Players.GetSelectedEntities(iLocalPlayerID) || [];

// 		$("#lower_hud").SetHasClass("HasAbilityToSpend", false);

// 		$("#buffs").SetHasClass("AltPressed", bAltPressed);
// 		$("#debuffs").SetHasClass("AltPressed", bAltPressed);
// 		$("#death_panel_buyback").SetHasClass("AltPressed", bAltPressed);
// 		// $("#xp").SetHasClass("AltPressed", bAltPressed);
// 		$("#Stats").SetHasClass("AltPressed", bAltPressed);

// 		$("#center_block").SetHasClass("IsLocalHero", iLocalHero == iLocalPortraitUnit);
// 		$("#center_block").SetHasClass("NonHero", !Entities.IsHero(iLocalPortraitUnit));
// 		$("#center_block").SetHasClass("Hidden", Entities.HasBuff(iLocalPortraitUnit, "modifier_no_action_panel"));

// 		$("#multiunit").SetHasClass("Hidden", aPlayerSelectedEntities.length <= 1);
// 		$("#multiunit").SetHasClass("ShowMultiUnit", aPlayerSelectedEntities.length > 1);
// 		$("#portraitHUD").SetHasClass("Hidden", aPlayerSelectedEntities.length > 1);
// 		$("#center_block").SetHasClass("MultiUnit", aPlayerSelectedEntities.length > 1);

// 		// 非英雄不显示tp栏
// 		$("#inventory_composition_layer_container").SetHasClass("Hidden", (!Entities.IsHero(iLocalPortraitUnit) && !Entities.HasBuff(iLocalPortraitUnit, "modifier_courier")));
// 		// 非英雄不显示属性查看栏
// 		$("#left_composition_layer_container").SetHasClass("Hidden", (!Entities.IsHero(iLocalPortraitUnit)));

// 		$.GetContextPanel().SetHasClass("AltPressed", bAltPressed);

// 		$.GetContextPanel().SetHasClass("IsNPC", Entities.HasBuff(iLocalPortraitUnit, "modifier_npc"));
// 		if ($.GetContextPanel().BHasClass("IsNPC")) {
// 			if (Entities.IsControllableByPlayer(iLocalPortraitUnit, iLocalPlayerID)) {
// 				if (aPlayerSelectedEntities.length > 1) {
// 					GameUI.SelectUnit(-1 as EntityIndex, false);
// 					for (let index = 0; index < aPlayerSelectedEntities.length; index++) {
// 						let iEntIndex = aPlayerSelectedEntities[index];
// 						if (iLocalPortraitUnit == iEntIndex) {
// 							GameUI.SelectUnit(iEntIndex, true);
// 						}
// 					}
// 				}
// 			}

// 			// 对话框
// 			let pNPCDialogEvents = $("#NPCDialogEvents");
// 			{
// 				render(<NPCDialogEventsFragments />, pNPCDialogEvents);
// 			}
// 		}

// 		GameEvents.SendEventClientSide("custom_get_active_ability", { entindex: Abilities.GetLocalPlayerActiveAbility() });

// 		// 时间
// 		// let pGameTime = $("#TopBarGameTime");
// 		// if (pGameTime) {
// 		// 	let fDOTATime = Math.abs(Math.floor(Game.GetDOTATime(false, true)));
// 		// 	let fSeconds = Math.floor(fDOTATime % 60);
// 		// 	let fMinutes = Math.floor(fDOTATime / 60);
// 		// 	pGameTime.SetDialogVariable("game_time_seconds", fSeconds >= 10 ? String(fSeconds) : "0" + String(fSeconds));
// 		// 	pGameTime.SetDialogVariable("game_time_minutes", String(fMinutes));
// 		// }
// 		// 回合
// 		let pRounds = $("#TopBarRoundTime");
// 		if (pRounds) {
// 			let fPercent = 0;
// 			if (fPrepTimeEnd != -1) {
// 				let fTime = Math.max(fPrepTimeEnd - Game.GetGameTime(), 0);
// 				fPercent = finiteNumber(fTime / fPrepTime);
// 				pRounds.SetDialogVariableInt("round_time", fTime);
// 			} else if (fTimedRoundDurationEnd != -1) {
// 				let fTime = Math.max(fTimedRoundDurationEnd - Game.GetGameTime(), 0);
// 				fPercent = finiteNumber(fTime / fPrepTime);
// 				pRounds.SetDialogVariableInt("round_time", fTime);
// 			} else {
// 				pRounds.SetDialogVariableInt("round_time", 0);
// 			}
// 			let pRoundProgressBar = pRounds.FindChildTraverse<ProgressBar>("RoundProgressBar");
// 			if (pRoundProgressBar) {
// 				pRoundProgressBar.value = fPercent;
// 			}
// 		}

// 		// 玩家资源
// 		let pPlayerResource = $("#PlayerResource");
// 		if (pPlayerResource) {
// 			render(<PlayerResourceFragments pPlayerResource={pPlayerResource} />, $("#PlayerResource"));
// 		}

// 		// 玩家资源
// 		let pDungeonVote = $("#DungeonVote");
// 		if (pDungeonVote) {
// 			render(<DungeonVoteFragments pDungeonVote={pDungeonVote} />, $("#DungeonVote"));
// 		}

// 		// 生命值显示
// 		{
// 			let fHealthPercent = Entities.GetHealth(iLocalPortraitUnit) / Entities.GetMaxHealth(iLocalPortraitUnit);
// 			let iMaxHealth = finiteNumber(Number(Entities.GetUnitData(iLocalPortraitUnit, "GetHealth")));
// 			let fHealthRegen = finiteNumber(Number(Entities.GetUnitData(iLocalPortraitUnit, "GetHealthRegen")));
// 			if (pCustomHealthLabel) {
// 				pCustomHealthLabel.text = `${FormatNumber(Math.floor(fHealthPercent * iMaxHealth))} / ${FormatNumber(Math.floor(iMaxHealth))}`;
// 			}
// 			if (pCustomHealthRegenLabel) {
// 				let s = FormatNumber(fHealthRegen, 1);
// 				if (fHealthRegen > 0) s = "+" + s;
// 				pCustomHealthRegenLabel.text = s;
// 				if (Entities.IsEnemy(iLocalPortraitUnit)) {
// 					pCustomHealthRegenLabel.style.color = "#ff4433";
// 				} else {
// 					pCustomHealthRegenLabel.style.color = "#3ED038";
// 				}
// 			}
// 		}

// 		// 战斗力
// 		let pHeroPowerValue = $("#HeroPowerValue");
// 		if (pHeroPowerValue && Entities.IsValidEntity(iLocalHero)) {
// 			let fPowerValue = finiteNumber(Number(Entities.GetUnitData(iLocalHero, "GetPowerValue")));
// 			pHeroPowerValue.SetDialogVariable("power_value", FormatNumber(Round(fPowerValue)));
// 		}

// 		let pPlayerContainer = $("#PlayerContainer");
// 		{
// 			render(<PlayerContainer pPlayerContainer={pPlayerContainer} />, pPlayerContainer);
// 		}

// 		for (let i = 0; i < aUpdateFunc.length; i++) {
// 			const element = aUpdateFunc[i];
// 			element();
// 		}
// 	}

// 	function Think() {
// 		$.Schedule(Game.GetGameFrameTime(), Think);
// 		Update();
// 	}

// 	Think();

// 	GameEvents.Subscribe("dota_player_update_selected_unit", Update);
// 	GameEvents.Subscribe("dota_player_update_query_unit", Update);

// 	function UpdateCommonNetTable(tableName: string, tableKeyName: string | number, table: any) {
// 		if (tableKeyName == "round_data") {
// 			// let pRounds = $("#TopBarRoundNumber");
// 			// pRounds?.SetDialogVariableInt("round_number", Math.max((table.round_number || 0) - 1, 1));
// 			fPrepTime = table.prep_time || -1;
// 			fPrepTimeEnd = table.prep_time_end || -1;
// 			fTimedRoundDuration = table.timed_round_duration || -1;
// 			fTimedRoundDurationEnd = table.timed_round_duration_end || -1;
// 			render(<TopBar round={Math.max((table.round_number || 0) - 1, 1)} />, $("#top_bar"));
// 		}
// 	};

// 	CustomNetTables.SubscribeNetTableListener("common", UpdateCommonNetTable);
// 	UpdateCommonNetTable("common", "round_data", CustomNetTables.GetTableValue("common", "round_data"));

// 	// 鼠标事件
// 	GameUI.CustomUIConfig().SubscribeMouseEvent("camera", (tData) => {
// 		let sEventName = tData.event_name;
// 		let iValue = tData.value;

// 		if (GameUI.GetClickBehaviors() != CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_NONE) return;

// 		// 按下事件
// 		if (sEventName === "pressed") {
// 			// 鼠标右键
// 			if (iValue == 1) {
// 				// 选择NPC时，按下鼠标右键跳转选择为英雄
// 				{
// 					let iLocalPlayerID = Players.GetLocalPlayer();
// 					let aPlayerSelectedEntities = Players.GetSelectedEntities(iLocalPlayerID) || [];
// 					let iLocalHero = Players.GetPlayerHeroEntityIndex(iLocalPlayerID);
// 					if (aPlayerSelectedEntities.length == 1 && Entities.HasBuff(aPlayerSelectedEntities[0], "modifier_npc") && Entities.IsControllableByPlayer(aPlayerSelectedEntities[0], iLocalPlayerID)) {
// 						GameUI.SelectUnit(iLocalHero, false);
// 					}
// 				}
// 			}
// 		}
// 	});

// 	// 信使选择
// 	{
// 		let sHotkey = Game.GetKeybindForCommand(DOTAKeybindCommand_t.DOTA_KEYBIND_COURIER_SELECT);
// 		let aHotkeys = sHotkey.split("-");
// 		let sKeyName = aHotkeys[aHotkeys.length - 1];
// 		Game.CreateCustomKeyBind(sKeyName, "+" + sKeyName);
// 		Game.AddCommand("+" + sKeyName, () => {
// 			let aCreatures = Entities.GetAllEntitiesByName("npc_dota_creature");
// 			for (let i = 0; i < aCreatures.length; i++) {
// 				const iEntIndex = aCreatures[i];
// 				if (Entities.IsValidEntity(iEntIndex) && Entities.GetPlayerOwnerID(iEntIndex) == Players.GetLocalPlayer() && Entities.HasBuff(iEntIndex, "modifier_courier")) {
// 					if (Players.IsEntitySelected(iEntIndex)) {
// 						GameUI.MoveCameraToEntity(iEntIndex);
// 					} else {
// 						GameUI.SelectUnit(iEntIndex, false);
// 					}
// 					break;
// 				}
// 			}
// 		}, "", 67108864);
// 	}

// 	// 掉落物品显示等级
// 	let pDroppedItemPanel = $("#DroppedItemPanel");
// 	let bCheck = true;
// 	let bHide = true;
// 	$.RegisterForUnhandledEvent("DOTAShowDroppedItemTooltip", (a, x, y, sAbilityName) => {
// 		if (bCheck) {
// 			pDroppedItemPanel.SetPositionInPixels(x / pDroppedItemPanel.actualuiscale_x, y / pDroppedItemPanel.actualuiscale_y, 0);
// 			let iPhysicalItemIndex = CustomUIConfig.GetCursorPhysicalItem();
// 			if (Entities.IsItemPhysical(iPhysicalItemIndex)) {
// 				let iItemIndex = Entities.GetContainedItem(iPhysicalItemIndex) as number;
// 				// WHY???
// 				iItemIndex &= ~0xFFFFC000;
// 				bHide = false;
// 				$.Schedule(0, () => {
// 					bCheck = false;
// 					if (!bHide) {
// 						CustomUIConfig.ShowAbilityTooltip(pDroppedItemPanel, sAbilityName, -1 as EntityIndex, -1, Abilities.GetLevel(iItemIndex as ItemEntityIndex));
// 					}
// 					bCheck = true;
// 				});
// 			}
// 		}
// 	});
// 	$.RegisterForUnhandledEvent("DOTAHideDroppedItemTooltip", () => {
// 		bHide = true;
// 		CustomUIConfig.HideAbilityTooltip(pDroppedItemPanel);
// 	});

// 	Game.AddCommand("cast_on_mouse_cursor_position", (name: string, sAbilityIndex: string) => {
// 		let iAbilityIndex = Number(sAbilityIndex) as AbilityEntityIndex;
// 		let aPosition = GameUI.GetScreenWorldPosition(GameUI.GetCursorPosition());
// 		if (aPosition) {
// 			Game.PrepareUnitOrders({
// 				AbilityIndex: iAbilityIndex,
// 				ShowEffects: true,
// 				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
// 				Position: aPosition,
// 			});
// 		}
// 	}, "", 67108864);
// 	Game.AddCommand("ability_behavior_item_target", (name: string, sAbilityIndex: string, sItemIndex: string) => {
// 		let iAbilityIndex = Number(sAbilityIndex);
// 		let iItemIndex = Number(sItemIndex);
// 		if (Abilities.GetLocalPlayerActiveAbility() != iAbilityIndex) {
// 			Game.PrepareUnitOrders({
// 				AbilityIndex: iAbilityIndex,
// 				ShowEffects: false,
// 				OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
// 				Position: [iItemIndex, 16300, 0],
// 			});
// 		}
// 	}, "", 67108864);
// 	Game.AddCommand("on_active_dialog_event_ability", (name: string, sAbilityIndex: string) => {
// 		let iAbilityIndex = Number(sAbilityIndex) as AbilityEntityIndex;
// 		let iCasterIndex = Abilities.GetCaster(iAbilityIndex);
// 		let iSlot = 0;
// 		if (Abilities.IsItem(iAbilityIndex)) {
// 			for (let i = 0; i < 6; i++) {
// 				if (Entities.GetItemInSlot(iCasterIndex, i) == iAbilityIndex) {
// 					iSlot = i + 6;
// 					break;
// 				}
// 			}
// 		} else {
// 			for (let i = 0; i < Entities.GetAbilityCount(iCasterIndex); i++) {
// 				if (Entities.GetAbility(iCasterIndex, i) == iAbilityIndex) {
// 					iSlot = i;
// 					break;
// 				}
// 			}
// 		}

// 		let tData = CustomNetTables.GetTableValue("npc", iCasterIndex) ?? {};
// 		let tNPCDialogEvents = tData.tDialogEvents ?? {};
// 		let iNPCPlayerID = tData.iPlayerID ?? -1;
// 		if (Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer()) && iNPCPlayerID == Players.GetLocalPlayer()) {
// 			let sNPCDialogEvent = tNPCDialogEvents[iSlot + 1];
// 			if (sNPCDialogEvent != "") {
// 				GameEvents.SendCustomEventToServer("on_dialog_events_activate", { dialog_event_name: sNPCDialogEvent });
// 			}
// 		}
// 	}, "", 67108864);

// 	let iDigitParticleCPValue: Record<string, number> = {
// 		K: 1,
// 		M: 2,
// 		G: 3,
// 		T: 4,
// 		P: 5,
// 		E: 6,
// 		Z: 7,
// 		Y: 8,
// 		B: 9,
// 		万: 1,
// 		亿: 2,
// 		万亿: 21,
// 		兆: 3,
// 		万兆: 31,
// 		京: 4,
// 		万京: 41,
// 		垓: 5,
// 		万垓: 51,
// 		秭: 6,
// 		万秭: 61,
// 		穰: 7,
// 		万穰: 71,
// 		沟: 8,
// 		万沟: 81,
// 		涧: 9,
// 		万涧: 91,
// 	};

// 	GameEvents.Subscribe("custom_crit_msg", (tEvents) => {
// 		let attacker = tEvents.attacker;
// 		let victim = tEvents.victim;
// 		if (Entities.IsValidEntity(attacker) && Entities.IsValidEntity(victim)) {
// 			let damage = Round(finiteNumber(Number(tEvents.damage), 0));
// 			let [str, sDigit] = FormatNumberBase(damage, 2);
// 			let position = Entities.GetAbsOrigin(victim);
// 			position[1] += -30;
// 			position[2] += 100 + 32.5 * tEvents.scale;

// 			let funcGetPlaceholder = (n: number) => Number([...Array(n)].map(() => 1).join(""));
// 			let s = str;
// 			let n = s.split(".");
// 			let a = finiteNumber(Number(n[0]));
// 			let b = finiteNumber(Number(n[1]?.split('')?.reverse()?.join('')));
// 			let color: [number, number, number] = [255, 0, 0];

// 			if (tEvents.damage_type == DAMAGE_TYPES.DAMAGE_TYPE_MAGICAL) {
// 				color = [0, 191, 255];
// 			}

// 			let length = s.length + 1;
// 			let iParticleID = Particles.CreateParticle("particles/ui/msg_crit.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, victim);
// 			Particles.SetParticleControl(iParticleID, 0, position);
// 			let iDigitValue;
// 			if (sDigit) {
// 				iDigitValue = iDigitParticleCPValue[sDigit];
// 				length += String(iDigitValue).length;
// 				if (FindKey(Digit, sDigit) != undefined) {
// 					Particles.SetParticleControl(iParticleID, 3, [iDigitValue, b, funcGetPlaceholder(length - 1 - String(iDigitValue).length - (b > 0 ? String(b).length : 0))]);
// 					Particles.SetParticleControl(iParticleID, 4, [0, 0, 0]);
// 				}
// 				if (FindKey(DigitSchinese, sDigit) != undefined) {
// 					Particles.SetParticleControl(iParticleID, 3, [0, 0, 0]);
// 					Particles.SetParticleControl(iParticleID, 4, [iDigitValue, b, funcGetPlaceholder(length - 1 - String(iDigitValue).length - (b > 0 ? String(b).length : 0))]);
// 				}
// 			} else {
// 				Particles.SetParticleControl(iParticleID, 3, [0, b, funcGetPlaceholder(length - (b > 0 ? String(b).length : 0))]);
// 				Particles.SetParticleControl(iParticleID, 4, [0, 0, 0]);
// 			}
// 			Particles.SetParticleControl(iParticleID, 2, [a, b > 0 ? 1 : 0, funcGetPlaceholder(length - (String(a).length) - (b > 0 ? 1 : 0))]);
// 			Particles.SetParticleControl(iParticleID, 5, [2.5, length, 0]);
// 			Particles.SetParticleControl(iParticleID, 6, color);
// 			Particles.SetParticleControl(iParticleID, 7, [funcGetPlaceholder(length - 1), 1, 0]);
// 			Particles.ReleaseParticleIndex(iParticleID);
// 		}
// 	});
// 	GameEvents.Subscribe("entity_hurt", (tEvents) => {
// 		let attacker = tEvents.entindex_attacker;
// 		let victim = tEvents.entindex_killed;
// 		if (Entities.IsValidEntity(attacker) && Entities.IsValidEntity(victim)) {
// 			let damage = Round(tEvents.damage / Entities.GetMaxHealth(victim) * finiteNumber(Number(Entities.GetUnitData(victim, "GetHealth"))));
// 			let [str, sDigit] = FormatNumberBase(damage, 2);

// 			let position = Entities.GetAbsOrigin(victim);
// 			position[2] += Entities.GetHealthBarOffset(victim);

// 			let funcGetPlaceholder = (n: number) => Number([...Array(n)].map(() => 1).join(""));
// 			let s = str;
// 			let n = s.split(".");
// 			let a = finiteNumber(Number(n[0]));
// 			let b = finiteNumber(Number(n[1]?.split('')?.reverse()?.join('')));

// 			if (Entities.GetPlayerOwnerID(attacker) == Players.GetLocalPlayer()) {
// 				let length = s.length;
// 				let iParticleID = Particles.CreateParticle("particles/ui/msg_damage_numbers_outgoing.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, victim);
// 				Particles.SetParticleControl(iParticleID, 0, position);
// 				let iDigitValue;
// 				if (sDigit) {
// 					iDigitValue = iDigitParticleCPValue[sDigit];
// 					length += String(iDigitValue).length;
// 					if (FindKey(Digit, sDigit) != undefined) {
// 						Particles.SetParticleControl(iParticleID, 3, [iDigitValue, b, funcGetPlaceholder(length - String(iDigitValue).length - (b > 0 ? String(b).length : 0))]);
// 						Particles.SetParticleControl(iParticleID, 4, [0, 0, 0]);
// 					}
// 					if (FindKey(DigitSchinese, sDigit) != undefined) {
// 						Particles.SetParticleControl(iParticleID, 3, [0, 0, 0]);
// 						Particles.SetParticleControl(iParticleID, 4, [iDigitValue, b, funcGetPlaceholder(length - String(iDigitValue).length - (b > 0 ? String(b).length : 0))]);
// 					}
// 				} else {
// 					Particles.SetParticleControl(iParticleID, 3, [0, b, funcGetPlaceholder(length - (b > 0 ? String(b).length : 0))]);
// 					Particles.SetParticleControl(iParticleID, 4, [0, 0, 0]);
// 				}
// 				Particles.SetParticleControl(iParticleID, 2, [a, b > 0 ? 1 : 0, funcGetPlaceholder(length - (String(a).length) - (b > 0 ? 1 : 0))]);
// 				Particles.SetParticleControl(iParticleID, 5, [0.5, length, 0]);
// 				Particles.SetParticleControl(iParticleID, 6, [191, 191, 191]);
// 				Particles.ReleaseParticleIndex(iParticleID);
// 			}

// 			if (Entities.GetPlayerOwnerID(victim) == Players.GetLocalPlayer()) {
// 				let length = s.length;
// 				let iParticleID = Particles.CreateParticle("particles/ui/msg_damage_numbers_incoming.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, victim);
// 				Particles.SetParticleControl(iParticleID, 0, position);
// 				let iDigitValue;
// 				if (sDigit) {
// 					iDigitValue = iDigitParticleCPValue[sDigit];
// 					length += String(iDigitValue).length;
// 					if (FindKey(Digit, sDigit) != undefined) {
// 						Particles.SetParticleControl(iParticleID, 3, [iDigitValue, b, funcGetPlaceholder(length - String(iDigitValue).length - (b > 0 ? String(b).length : 0))]);
// 						Particles.SetParticleControl(iParticleID, 4, [0, 0, 0]);
// 					}
// 					if (FindKey(DigitSchinese, sDigit) != undefined) {
// 						Particles.SetParticleControl(iParticleID, 3, [0, 0, 0]);
// 						Particles.SetParticleControl(iParticleID, 4, [iDigitValue, b, funcGetPlaceholder(length - String(iDigitValue).length - (b > 0 ? String(b).length : 0))]);
// 					}
// 				} else {
// 					Particles.SetParticleControl(iParticleID, 3, [0, b, funcGetPlaceholder(length - (b > 0 ? String(b).length : 0))]);
// 					Particles.SetParticleControl(iParticleID, 4, [0, 0, 0]);
// 				}
// 				Particles.SetParticleControl(iParticleID, 2, [a, b > 0 ? 1 : 0, funcGetPlaceholder(length - (String(a).length) - (b > 0 ? 1 : 0))]);
// 				Particles.SetParticleControl(iParticleID, 5, [0.5, length, 0]);
// 				Particles.SetParticleControl(iParticleID, 6, [255, 32, 32]);
// 				Particles.ReleaseParticleIndex(iParticleID);
// 			}
// 		}
// 	});

// 	// TODO: 系统化处理
// 	// let p = $("#DragTest");
// 	// if (p) {
// 	// 	p.SetDraggable(true);
// 	// 	$.RegisterForUnhandledEvent("DragStart", (pPanel: Panel, tDragCallbacks) => {
// 	// 		if (pPanel == p) {
// 	// 			let position = GameUI.GetCursorPosition();
// 	// 			// @ts-ignore
// 	// 			pPanel.hParent = pPanel.GetParent();
// 	// 			// @ts-ignore
// 	// 			pPanel.offsetX = pPanel.GetPositionWithinWindow().x - position[0];
// 	// 			// @ts-ignore
// 	// 			pPanel.offsetY = pPanel.GetPositionWithinWindow().y - position[1];
// 	// 			tDragCallbacks.displayPanel = pPanel;
// 	// 			// @ts-ignore
// 	// 			tDragCallbacks.offsetX = -pPanel.offsetX;
// 	// 			// @ts-ignore
// 	// 			tDragCallbacks.offsetY = -pPanel.offsetY;
// 	// 		}
// 	// 	});
// 	// 	$.RegisterForUnhandledEvent("DragEnd", (pPanel: Panel, pDraggedPanel: Panel, a, b, c) => {
// 	// 		if (pPanel == p) {
// 	// 			// @ts-ignore
// 	// 			pDraggedPanel.SetParent(pDraggedPanel.hParent);
// 	// 			let position = GameUI.GetCursorPosition();
// 	// 			// @ts-ignore
// 	// 			pDraggedPanel.SetPositionInPixels(Clamp(position[0] + pDraggedPanel.offsetX, 0, Game.GetScreenWidth() - pDraggedPanel.actuallayoutwidth) / pDraggedPanel.actualuiscale_x, Clamp(position[1] + pDraggedPanel.offsetY, 0, Game.GetScreenHeight() - pDraggedPanel.actuallayoutheight) / pDraggedPanel.actualuiscale_y, 0);
// 	// 		}
// 	// 	});
// 	// }
// })();