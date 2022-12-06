// import { PanelAttributes } from "@demon673/react-panorama";
// import React from "react";
// import { CSSHelper } from "../../../helper/CSSHelper";
// import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
// import { DotaUIHelper } from "../../../helper/DotaUIHelper";
// import { FuncHelper } from "../../../helper/FuncHelper";
// import { CCPanel } from "../CCPanel/CCPanel";
// import { CCAbilityButton } from "./CCAbilityButton";
// import "./CCAbilityPanel.less";

// interface ICCAbilityPanel extends PanelAttributes {
//     overrideentityindex?: ItemEntityIndex,
//     overridedisplaykeybind?: DOTAKeybindCommand_t,
//     isBackpack?: boolean,
//     slot?: number,
//     dragtype?: string,
//     dragstartcallback?: (tDragCallbacks: any, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
//     dragdropcallback?: (pDraggedPanel: Panel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
//     dragendcallback?: (pDraggedPanel: Panel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => void;
// }

// export class CCAbilityPanel extends CCPanel<ICCAbilityPanel> {
//     static defaultProps = {
//         overrideentityindex: -1,
//         overridedisplaykeybind: DOTAKeybindCommand_t.DOTA_KEYBIND_NONE,
//         draggable: false,
//         dragtype: "InventorySlot",
//         slot: -1,
//     }
//     defaultClass() {
//         const overrideentityindex = this.props.overrideentityindex!;
//         const iCasterIndex = Abilities.GetCaster(overrideentityindex);
//         const bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);
//         const iMaxLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetMaxLevel(overrideentityindex);
//         return CSSHelper.ClassMaker("AbilityPanel", "AbilityMaxLevel" + iMaxLevel)
//     }

//     onInitUI() {
//         if (this.props.draggable) {
//             // DotaUIHelper.addDragEvent(this.props.
//         }
//     }

//     render() {
//         const dialogVariables: { [x: string]: any; } = {};
//         const slot = this.props.slot!;
//         let overrideentityindex = this.props.overrideentityindex!;
//         let entity = Players.GetQueryUnit(0);
//         overrideentityindex = Entities.GetAbility(entity, 0) as any;

//         const draggable = this.props.draggable!;
//         const bIsItem = Abilities.IsItem(overrideentityindex) || slot != -1;
//         let iActiveAbility = Abilities.GetLocalPlayerActiveAbility();
//         let iCasterIndex = Abilities.GetCaster(overrideentityindex);
//         let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
//         const bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);
//         let iMaxLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetMaxLevel(overrideentityindex);
//         let iLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetLevel(overrideentityindex);
//         let iCasterMana = iCasterIndex == -1 ? 0 : Entities.GetMana(iCasterIndex);
//         let iAbilityPoints = Entities.GetAbilityPoints(iCasterIndex);
//         let iKeybindCommand = this.props.overridedisplaykeybind!;
//         let sHotkey = Game.GetKeybindForCommand(iKeybindCommand);
//         if (bIsItem) {
//             if (iKeybindCommand == DOTAKeybindCommand_t.DOTA_KEYBIND_NONE) {
//                 iKeybindCommand = slot + DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1;
//                 sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY6) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
//                 if (sHotkey == "") {
//                     iKeybindCommand = slot + DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST;
//                     sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY6_QUICKAUTOCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
//                 }
//             }
//         } else {
//             iKeybindCommand = UnitHelper.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1;
//             sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
//             if (sHotkey == "") {
//                 iKeybindCommand = UnitHelper.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST;
//                 sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
//                 if (sHotkey == "") {
//                     sHotkey = Abilities.GetKeybind(overrideentityindex);
//                 }
//             }
//             if (Abilities.GetKeybind(overrideentityindex) != sHotkey) {
//                 sHotkey = Abilities.GetKeybind(overrideentityindex);
//             }
//         }
//         // let pItemImage = pSelf.FindChildTraverse<Panel>("ItemImage")?.FindChildTraverse<ItemImage>("CustomItemImage");
//         // if (pItemImage) {
//         // 	pItemImage.contextEntityIndex = (bIsItem ? overrideentityindex : -1) as ItemEntityIndex;
//         // }
//         let bInAbilityPhase = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? false : Abilities.IsInAbilityPhase(overrideentityindex);
//         let iManaCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelManaCost(overrideentityindex, iLevel - 1);
//         // iManaCost = CalcSpecialValueUpgrade(iCasterIndex, Abilities.GetAbilityName(overrideentityindex), "mana_cost", iManaCost);
//         dialogVariables["mana_cost"] = iManaCost;
//         let iGoldCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelGoldCost(overrideentityindex, iLevel - 1);
//         dialogVariables["gold_cost"] = iGoldCost;

//         let bCooldownReady = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? true : Abilities.IsCooldownReady(overrideentityindex);
//         let fCooldownLength = Abilities.GetCooldownLength(overrideentityindex);
//         if (!bCooldownReady) {
//             let fCooldownTimeRemaining = Abilities.GetCooldownTimeRemaining(overrideentityindex);
//             let fPercent = (fCooldownTimeRemaining / fCooldownLength);
//             if (fCooldownLength == 0) fPercent = 1;
//             dialogVariables["cooldown_timer"] = Math.ceil(fCooldownTimeRemaining);
//         }

//         let BackpackSlot = this.props.isBackpack!;
//         let inactive_item = BackpackSlot && Entities.HasItemInInventory(iCasterIndex, Abilities.GetAbilityName(overrideentityindex));
//         let unitmuted = Entities.IsMuted(iCasterIndex);
//         let silenced = Entities.IsSilenced(iCasterIndex);
//         let auto_castable = bIsValid && Abilities.IsAutocast(overrideentityindex);
//         let is_passive = bIsValid && Abilities.IsPassive(overrideentityindex);
//         let is_toggle = bIsValid && Abilities.IsToggle(overrideentityindex);
//         let insufficient_mana = iManaCost > iCasterMana;
//         let auto_cast_enabled = bIsValid && Abilities.GetAutoCastState(overrideentityindex);
//         let toggle_enabled = bIsValid && Abilities.GetToggleState(overrideentityindex);
//         let can_cast_again = (iManaCost > iCasterMana) || !bCooldownReady;
//         let no_level = iLevel == 0 || !Abilities.IsActivated(overrideentityindex);
//         let could_level_up = bControllable && iAbilityPoints > 0 && Abilities.CanAbilityBeUpgraded(overrideentityindex) == AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED
//         let show_level_up_tab = could_level_up;
//         let show_level_up_frame = Game.IsInAbilityLearnMode() && could_level_up;
//         let is_active = bIsValid && iActiveAbility == overrideentityindex;
//         // let combine_locked = bIsValid && IsItemLocked(overrideentityindex);
//         let ability_phase = bInAbilityPhase;
//         let no_mana_cost = iManaCost == 0;
//         let no_gold_cost = iGoldCost == 0;
//         let iNeutralTier = ItemHelper.GetItemRarity(Abilities.GetAbilityName(overrideentityindex));
//         let is_neutral_item = bIsItem && iNeutralTier != -1;
//         let no_hotkey = sHotkey == "" || !bControllable || !((!no_level && !is_passive) || show_level_up_frame || (GameUI.IsControlDown() && could_level_up));
//         let hotkey_alt = false;
//         let hotkey_ctrl = false;
//         let aHotkeys = sHotkey.split("-");
//         dialogVariables["hotkey"] = Abilities.GetKeybind(overrideentityindex);
//         if (aHotkeys) {
//             for (const sKey of aHotkeys) {
//                 if (sKey.toUpperCase().indexOf("ALT") != -1) {
//                     hotkey_alt = true;
//                 } else if (sKey.toUpperCase().indexOf("CTRL") != -1) {
//                     hotkey_ctrl = true;
//                 }
//             }
//         }
//         let fChargesPercent = 1;
//         let show_ability_charges = false;
//         if (!Entities.IsEnemy(iCasterIndex)) {
//             for (let i = 0; i < Entities.GetNumBuffs(iCasterIndex); i++) {
//                 let iModifier = Entities.GetBuff(iCasterIndex, i);
//                 let sModifierName = Buffs.GetName(iCasterIndex, iModifier);
//                 if (iModifier != -1 && Buffs.GetAbility(iCasterIndex, iModifier) == overrideentityindex && !Buffs.IsDebuff(iCasterIndex, iModifier)) {
//                     show_ability_charges = true;
//                     dialogVariables["ability_charge_count"] = Buffs.GetStackCount(iCasterIndex, iModifier);
//                     fCooldownLength = Buffs.GetDuration(iCasterIndex, iModifier) == -1 ? 0 : Buffs.GetDuration(iCasterIndex, iModifier);
//                     let fPercent = FuncHelper.Clamp(Buffs.GetRemainingTime(iCasterIndex, iModifier) / fCooldownLength, 0, 1);
//                     fChargesPercent = 1 - fPercent;
//                     break;
//                 }
//             }
//         }

//         let show_item_charges = false;
//         let show_item_alt_charges = false;
//         let muted = false;
//         if (Abilities.IsItem(overrideentityindex)) {
//             muted = Items.IsMuted(overrideentityindex);
//             let iChargeCount = 0;
//             let bHasCharges = false;
//             let iAltChargeCount = 0;
//             let bHasAltCharges = false;
//             if (Items.ShowSecondaryCharges(overrideentityindex)) {
//                 bHasCharges = true;
//                 bHasAltCharges = true;
//                 if (Abilities.GetToggleState(overrideentityindex)) {
//                     iChargeCount = Items.GetCurrentCharges(overrideentityindex);
//                     iAltChargeCount = Items.GetSecondaryCharges(overrideentityindex);
//                 }
//                 else {
//                     iAltChargeCount = Items.GetCurrentCharges(overrideentityindex);
//                     iChargeCount = Items.GetSecondaryCharges(overrideentityindex);
//                 }
//             }
//             else if (Items.ShouldDisplayCharges(overrideentityindex)) {
//                 bHasCharges = true;
//                 iChargeCount = Items.GetCurrentCharges(overrideentityindex);
//             }

//             show_item_charges = bHasCharges;
//             show_item_alt_charges = bHasAltCharges;
//             dialogVariables["item_charge_count"] = iChargeCount;
//             dialogVariables["item_alt_charge_count"] = iAltChargeCount;
//         }

//         return (
//             this.__root___isValid &&
//             <Panel id="CC_AbilityPanel" ref={this.__root__} {...this.initRootAttrs()}>
//                 <Panel id="ButtonAndLevel" require-composition-layer="true" always-cache-composition-layer="true" hittest={false}>
//                     <Panel id="LevelUpBurstFXContainer" hittest={false}>
//                         {!bIsItem &&
//                             <DOTAScenePanel id="LevelUpBurstFX" map="scenes/hud/levelupburst" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
//                         }
//                     </Panel>
//                     <Panel id="ButtonWithLevelUpTab" hittest={false}>
//                         <Button id="LevelUpTab" hittest={true}
//                             onactivate={
//                                 () => {
//                                     if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
//                                         Abilities.AttemptToUpgrade(overrideentityindex);
//                                     }
//                                 }}
//                             onmouseover={
//                                 (self) => {
//                                     // let pAbilityButton = self.GetParent()?.FindChildTraverse("AbilityButton");
//                                     // if (pAbilityButton) {
//                                     //     if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
//                                     //         GameUI.CustomUIConfig().ShowAbilityTooltip(pAbilityButton, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex), slot);
//                                     //     }
//                                     // }
//                                 }}
//                             onmouseout={(self) => {

//                             }} >
//                             <Panel id="LevelUpButton">
//                                 <Panel id="LevelUpIcon" />
//                             </Panel>
//                             <Panel id="LearnModeButton" hittest={false} />
//                         </Button>
//                         <Panel id="LevelUpLight" hittest={false} />
//                         <Panel id="ButtonWell" hittest={false}>
//                             <Panel id="AutocastableBorder" hittest={false} />
//                             <Panel id="AutoCastingContainer" hittest={false}>
//                                 <DOTAScenePanel id="AutoCasting" map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
//                             </Panel>
//                             <Panel id="ButtonSize">
//                                 <CCAbilityButton overrideentityindex={overrideentityindex} draggable={draggable} />
//                                 <Panel hittest={false} id="ActiveAbilityBorder" />
//                                 <Panel hittest={false} id="PassiveAbilityBorder" />
//                                 <Panel hittest={false} id="AutocastableAbilityBorder" />
//                                 {!no_gold_cost &&
//                                     [<Panel hittest={false} id="GoldCostBG" />,
//                                     <Label hittest={false} id="GoldCost" localizedText="{d:gold_cost}" dialogVariables={dialogVariables} />
//                                     ]}
//                                 {!no_mana_cost &&
//                                     [<Panel hittest={false} id="ManaCostBG" />,
//                                     <Label hittest={false} id="ManaCost" localizedText="{d:mana_cost}" dialogVariables={dialogVariables} />
//                                     ]}
//                                 {/* <Label hittest={false} id="NeutralItemTier" localizedText="{d:neutral_item_tier_number}" /> */}
//                                 <Panel hittest={false} id="CombineLockedOverlay" />
//                                 {silenced && <Panel id="SilencedOverlay" hittest={false} />}
//                                 <Panel hittest={false} id="AbilityStatusOverlay" />
//                                 <Panel hittest={false} id="UpgradeOverlay" />
//                                 <Panel hittest={false} id="DropTargetHighlight" />
//                             </Panel>
//                         </Panel>
//                         <Panel id="HotkeyContainer" hittest={false} hittestchildren={false}>
//                             {!no_hotkey &&
//                                 <Panel id="Hotkey" >
//                                     <Label id="HotkeyText" localizedText="{s:hotkey}" dialogVariables={dialogVariables} />
//                                 </Panel>
//                             }
//                             {hotkey_alt &&
//                                 <Panel id="HotkeyModifier" >
//                                     <Label id="AltText" localizedText="#DOTA_Keybind_ALT" />
//                                 </Panel>
//                             }
//                             {hotkey_ctrl &&
//                                 <Panel id="HotkeyCtrlModifier" >
//                                     <Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" />
//                                 </Panel>
//                             }
//                         </Panel>
//                         {show_ability_charges &&
//                             <CircularProgressBar id="AbilityCharges" hittest={false} hittestchildren={false} value={fChargesPercent}>
//                                 <Label localizedText="{d:ability_charge_count}" dialogVariables={dialogVariables} />
//                             </CircularProgressBar>
//                         }
//                     </Panel>
//                     {/**技能等级 */}
//                     <Panel id="AbilityLevelContainer" hittest={false}>
//                         {iMaxLevel > 0 && [...Array(iMaxLevel).keys()].map((key) => {
//                             return <Panel key={key.toString()} className={CSSHelper.ClassMaker("LevelPanel", { "next_level": key == iLevel, "active_level": key < iLevel })} />;
//                         })}
//                     </Panel>
//                 </Panel>
//             </Panel>
//         )
//     }
// }