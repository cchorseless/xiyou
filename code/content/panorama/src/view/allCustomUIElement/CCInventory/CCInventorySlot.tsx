import { PanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCInventorySlot.less";
interface ICCInventorySlot extends PanelAttributes {
    overrideentityindex?: ItemEntityIndex,
    overridedisplaykeybind?: DOTAKeybindCommand_t,
    isBackpack?: boolean,
    slot?: number,
    dragtype?: string,
    dragstartcallback?: (tDragCallbacks: any, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
    dragdropcallback?: (pDraggedPanel: Panel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
    dragendcallback?: (pDraggedPanel: Panel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => void;
}

const DOTA_ITEM_SLOT_MIN = 0;
const DOTA_ITEM_SLOT_MAX = 5;
const DOTA_ITEM_BACKPACK_MIN = 6;
const DOTA_ITEM_BACKPACK_MAX = 8;
const DOTA_ITEM_STASH_MIN = 9;
const DOTA_ITEM_STASH_MAX = 14;

export class CCInventorySlot extends CCPanel<ICCInventorySlot> {
    static defaultProps = {
        overrideentityindex: -1,
        overridedisplaykeybind: DOTAKeybindCommand_t.DOTA_KEYBIND_NONE,
        draggable: false,
        dragtype: "InventorySlot",
        slot: -1,
    }
    defaultClass() {
        return CSSHelper.ClassMaker("AbilityPanel",)
    }

    onInitUI() {
        if (this.props.draggable) {
            // DotaUIHelper.addDragEvent(this.props.
        }
    }

    private onAbilityButtonclick_left() {
        const overrideentityindex = this.props.overrideentityindex!;
        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
            if (GameUI.IsAltDown()) {
                Abilities.PingAbility(overrideentityindex);
                return;
            }
            if (GameUI.IsControlDown()) {
                Abilities.AttemptToUpgrade(overrideentityindex);
                return;
            }
            if (Abilities.IsItem(overrideentityindex)) {
                var iAbilityIndex = Abilities.GetLocalPlayerActiveAbility();
                if (iAbilityIndex != -1) {
                    let iAbilityBehavior = Abilities.GetBehavior(iAbilityIndex);
                    if (iAbilityBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_RUNE_TARGET) {
                        let iClickbehaviors = GameUI.GetClickBehaviors();
                        if (iClickbehaviors === CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_CAST) {
                            Game.PrepareUnitOrders({
                                AbilityIndex: iAbilityIndex,
                                ShowEffects: false,
                                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_POSITION,
                                Position: [overrideentityindex, 16300, 0],
                            });
                            // GameEvents.SendCustomGameEventToServer("ability_spell_item_target", {
                            // 	ability_index: iAbilityIndex,
                            // 	item_index: overrideentityindex,
                            // });
                            // GameEvents.SendEventClientSide("custom_get_active_ability", { entindex: -1 as AbilityEntityIndex });
                            // Abilities.ExecuteAbility(iAbilityIndex, Abilities.GetCaster(iAbilityIndex), true);
                        }
                        return;
                    }
                }
            }
            let iCasterIndex = Abilities.GetCaster(overrideentityindex);
            Abilities.ExecuteAbility(overrideentityindex, iCasterIndex, false);
        }
    }

    private onAbilityButtonclick_right() {
        const overrideentityindex = this.props.overrideentityindex!;
        const slot = this.props.slot!;
        // if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
        //     if (Abilities.IsItem(overrideentityindex)) {
        //         if (!$.GetContextPanel().BHasClass("dragging") && overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
        //             let iCasterIndex = Abilities.GetCaster(overrideentityindex);
        //             let sItemName = Abilities.GetAbilityName(overrideentityindex);
        //             let bSlotInStash = slot >= DOTA_ITEM_STASH_MIN;
        //             let bOwned = Entities.GetPlayerOwnerID(iCasterIndex) == Players.GetLocalPlayer();
        //             let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
        //             let bSellable = Items.IsSellable(overrideentityindex) && Items.CanBeSoldByLocalPlayer(overrideentityindex);
        //             let bDisassemble = Items.IsDisassemblable(overrideentityindex) && bControllable && !bSlotInStash;
        //             let bAlertable = Items.IsAlertableItem(overrideentityindex);
        //             let bLocked = IsItemLocked(overrideentityindex);
        //             let bAutocast = Abilities.IsAutocast(overrideentityindex);
        //             // let bShowInShop = Items.IsPurchasable(overrideentityindex);
        //             let bShowInShop = false;
        //             // let bMoveToStash = !bSlotInStash && bControllable;
        //             // let bDropFromStash = bSlotInStash && bControllable;
        //             let bMoveToStash = false;
        //             let bDropFromStash = false;
        //             let bMoveToTraining = true;

        //             // 铸造相关
        //             // let castingInfo = CustomNetTables.GetTableValue("common", "casting_info") || {};
        //             // let castingName = "";
        //             // for (const itemName in castingInfo) {
        //             // 	for (const _key in castingInfo[itemName]) {
        //             // 		if (castingInfo[itemName][_key] == sItemName) {
        //             // 			castingName = itemName;
        //             // 			break;
        //             // 		}
        //             // 	}
        //             // }
        //             if (!draggable) {
        //                 return;
        //             }

        //             if (!bControllable) {
        //                 return;
        //             }

        //             if (!bOwned) {
        //                 return;
        //             }

        //             if (!bSellable && !bDisassemble && !bShowInShop && !bDropFromStash && !bAlertable && !bMoveToStash && !bAutocast && !bMoveToTraining) {
        //                 return;
        //             }
        //             let pContextMenu = $.CreatePanel("ContextMenuScript", self, "");
        //             pContextMenu.AddClass("ContextMenu_NoArrow");
        //             pContextMenu.AddClass("ContextMenu_NoBorder");

        //             let pContentsPanel = pContextMenu.GetContentsPanel<InventoryItemContextMenu>();
        //             pContentsPanel.BLoadLayout("file://{resources}/layout/custom_game/context_menu/context_menu_inventory_item/context_menu_inventory_item.xml", false, false);
        //             pContentsPanel.SetItem(overrideentityindex, self);
        //             pContentsPanel.SetHasClass("bSellable", bSellable);
        //             pContentsPanel.SetHasClass("bDisassemble", bDisassemble);
        //             pContentsPanel.SetHasClass("bShowInShop", bShowInShop);
        //             pContentsPanel.SetHasClass("bDropFromStash", bDropFromStash);
        //             pContentsPanel.SetHasClass("bAlertable", bAlertable);
        //             pContentsPanel.SetHasClass("bMoveToStash", bMoveToStash);
        //             pContentsPanel.SetHasClass("bLocked", bLocked);
        //             // pContentsPanel.SetHasClass("bCasting", castingName != "");
        //             pContentsPanel.SetHasClass("bAutocast", bAutocast);
        //             pContentsPanel.SetHasClass("bMoveToTraining", bMoveToTraining);
        //             pContentsPanel.SetHasClass("bSacrifice", GetItemRarity(Abilities.GetAbilityName(overrideentityindex)) == 6);
        //             // pContentsPanel.SetDialogVariable("itemname", $.Localize("DOTA_Tooltip_ability_" + castingName));
        //             // if (castingName != "") {
        //             // 	pContentsPanel.SetDialogVariableInt("int_value", Number(GameUI.CustomUIConfig().ItemsKv[castingName].CastingCrystalCost || 0));
        //             // }
        //         }
        //         return;
        //     }
        //     if (Abilities.IsAutocast(overrideentityindex)) {
        //         Game.PrepareUnitOrders({
        //             OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
        //             AbilityIndex: overrideentityindex,
        //             UnitIndex: Abilities.GetCaster(overrideentityindex),
        //         });
        //     }
        // }
    }


    private onAbilityButtonMouseOver() {
        const overrideentityindex = this.props.overrideentityindex!;
        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
            // if (Abilities.IsItem(overrideentityindex)) {
            //     GameEvents.SendEventClientSide("custom_hover_item", {
            //         item_entindex: overrideentityindex,
            //     });
            // }
            // GameUI.CustomUIConfig().ShowAbilityTooltip(self, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex), slot);
        }
    }
    private onAbilityButtonMouseOut() {
        // if (Abilities.IsItem(overrideentityindex)) {
        //     GameEvents.SendEventClientSide("custom_hover_item", {
        //         item_entindex: -1 as ItemEntityIndex,
        //     });
        // }
        // GameUI.CustomUIConfig().HideAbilityTooltip(self);
    }

    render() {
        const dialogVariables: { [x: string]: any; } = {};
        const slot = this.props.slot!;
        const overrideentityindex = this.props.overrideentityindex!;
        const draggable = this.props.draggable!;
        const bIsItem = Abilities.IsItem(overrideentityindex) || slot != -1;
        let iActiveAbility = Abilities.GetLocalPlayerActiveAbility();
        let iCasterIndex = Abilities.GetCaster(overrideentityindex);
        let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
        let bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);
        let iMaxLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetMaxLevel(overrideentityindex);
        let iLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetLevel(overrideentityindex);
        let iCasterMana = iCasterIndex == -1 ? 0 : Entities.GetMana(iCasterIndex);
        let iAbilityPoints = Entities.GetAbilityPoints(iCasterIndex);
        let iKeybindCommand = this.props.overridedisplaykeybind!;
        let sHotkey = Game.GetKeybindForCommand(iKeybindCommand);
        if (bIsItem) {
            if (iKeybindCommand == DOTAKeybindCommand_t.DOTA_KEYBIND_NONE) {
                iKeybindCommand = slot + DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1;
                sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY6) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                if (sHotkey == "") {
                    iKeybindCommand = slot + DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST;
                    sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY6_QUICKAUTOCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                }
            }
        } else {
            iKeybindCommand = UnitHelper.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1;
            sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
            if (sHotkey == "") {
                iKeybindCommand = UnitHelper.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST;
                sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                if (sHotkey == "") {
                    sHotkey = Abilities.GetKeybind(overrideentityindex);
                }
            }
            if (Abilities.GetKeybind(overrideentityindex) != sHotkey) {
                sHotkey = Abilities.GetKeybind(overrideentityindex);
            }
        }
        let contextEntityIndex = (bIsItem ? -1 : overrideentityindex) as AbilityEntityIndex;
        // let pItemImage = pSelf.FindChildTraverse<Panel>("ItemImage")?.FindChildTraverse<ItemImage>("CustomItemImage");
        // if (pItemImage) {
        // 	pItemImage.contextEntityIndex = (bIsItem ? overrideentityindex : -1) as ItemEntityIndex;
        // }
        let bInAbilityPhase = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? false : Abilities.IsInAbilityPhase(overrideentityindex);
        let iManaCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelManaCost(overrideentityindex, iLevel - 1);
        // iManaCost = CalcSpecialValueUpgrade(iCasterIndex, Abilities.GetAbilityName(overrideentityindex), "mana_cost", iManaCost);
        dialogVariables["mana_cost"] = iManaCost;
        let iGoldCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelGoldCost(overrideentityindex, iLevel - 1);
        dialogVariables["gold_cost"] = iGoldCost;

        let bCooldownReady = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? true : Abilities.IsCooldownReady(overrideentityindex);
        let fCooldownLength = Abilities.GetCooldownLength(overrideentityindex);
        if (!bCooldownReady) {
            let fCooldownTimeRemaining = Abilities.GetCooldownTimeRemaining(overrideentityindex);
            let fPercent = (fCooldownTimeRemaining / fCooldownLength);
            if (fCooldownLength == 0) fPercent = 1;
            dialogVariables["cooldown_timer"] = Math.ceil(fCooldownTimeRemaining);
        }

        let no_ability = !bIsValid;
        let no_item = bIsItem && !bIsValid;
        let BackpackSlot = this.props.isBackpack!;
        let inactive_item = BackpackSlot && Entities.HasItemInInventory(iCasterIndex, Abilities.GetAbilityName(overrideentityindex));
        let unitmuted = Entities.IsMuted(iCasterIndex);
        let silenced = Entities.IsSilenced(iCasterIndex);
        let auto_castable = bIsValid && Abilities.IsAutocast(overrideentityindex);
        let is_passive = bIsValid && Abilities.IsPassive(overrideentityindex);
        let is_toggle = bIsValid && Abilities.IsToggle(overrideentityindex);
        let insufficient_mana = iManaCost > iCasterMana;
        let auto_cast_enabled = bIsValid && Abilities.GetAutoCastState(overrideentityindex);
        let toggle_enabled = bIsValid && Abilities.GetToggleState(overrideentityindex);
        let can_cast_again = (iManaCost > iCasterMana) || !bCooldownReady;
        let no_level = iLevel == 0 || !Abilities.IsActivated(overrideentityindex);
        let could_level_up = bControllable && iAbilityPoints > 0 && Abilities.CanAbilityBeUpgraded(overrideentityindex) == AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED
        let show_level_up_tab = could_level_up;
        let show_level_up_frame = Game.IsInAbilityLearnMode() && could_level_up;
        let is_active = bIsValid && iActiveAbility == overrideentityindex;
        // let combine_locked = bIsValid && IsItemLocked(overrideentityindex);
        let ability_phase = bInAbilityPhase;
        let cooldown_ready = bCooldownReady;
        let no_mana_cost = iManaCost == 0;
        let no_gold_cost = iGoldCost == 0;
        let iNeutralTier = ItemHelper.GetItemRarity(Abilities.GetAbilityName(overrideentityindex));
        let is_neutral_item = bIsItem && iNeutralTier != -1;
        let no_hotkey = sHotkey == "" || !bControllable || !((!no_level && !is_passive) || show_level_up_frame || (GameUI.IsControlDown() && could_level_up));
        let hotkey_alt = false;
        let hotkey_ctrl = false;
        let aHotkeys = sHotkey.split("-");
        dialogVariables["hotkey"] = Abilities.GetKeybind(overrideentityindex);
        if (aHotkeys) {
            for (const sKey of aHotkeys) {
                if (sKey.toUpperCase().indexOf("ALT") != -1) {
                    hotkey_alt = true;
                } else if (sKey.toUpperCase().indexOf("CTRL") != -1) {
                    hotkey_ctrl = true;
                }
            }
        }
        let fChargesPercent = 1;
        let show_ability_charges = false;
        if (!Entities.IsEnemy(iCasterIndex)) {
            for (let i = 0; i < Entities.GetNumBuffs(iCasterIndex); i++) {
                let iModifier = Entities.GetBuff(iCasterIndex, i);
                let sModifierName = Buffs.GetName(iCasterIndex, iModifier);
                if (iModifier != -1 && Buffs.GetAbility(iCasterIndex, iModifier) == overrideentityindex && !Buffs.IsDebuff(iCasterIndex, iModifier)) {
                    show_ability_charges = true;
                    dialogVariables["ability_charge_count"] = Buffs.GetStackCount(iCasterIndex, iModifier);
                    fCooldownLength = Buffs.GetDuration(iCasterIndex, iModifier) == -1 ? 0 : Buffs.GetDuration(iCasterIndex, iModifier);
                    let fPercent = FuncHelper.Clamp(Buffs.GetRemainingTime(iCasterIndex, iModifier) / fCooldownLength, 0, 1);
                    fChargesPercent = 1 - fPercent;
                    break;
                }
            }
        }

        let show_item_charges = false;
        let show_item_alt_charges = false;
        let muted = false;
        if (Abilities.IsItem(overrideentityindex)) {
            muted = Items.IsMuted(overrideentityindex);
            let iChargeCount = 0;
            let bHasCharges = false;
            let iAltChargeCount = 0;
            let bHasAltCharges = false;
            if (Items.ShowSecondaryCharges(overrideentityindex)) {
                bHasCharges = true;
                bHasAltCharges = true;
                if (Abilities.GetToggleState(overrideentityindex)) {
                    iChargeCount = Items.GetCurrentCharges(overrideentityindex);
                    iAltChargeCount = Items.GetSecondaryCharges(overrideentityindex);
                }
                else {
                    iAltChargeCount = Items.GetCurrentCharges(overrideentityindex);
                    iChargeCount = Items.GetSecondaryCharges(overrideentityindex);
                }
            }
            else if (Items.ShouldDisplayCharges(overrideentityindex)) {
                bHasCharges = true;
                iChargeCount = Items.GetCurrentCharges(overrideentityindex);
            }

            show_item_charges = bHasCharges;
            show_item_alt_charges = bHasAltCharges;
            dialogVariables["item_charge_count"] = iChargeCount;
            dialogVariables["item_alt_charge_count"] = iAltChargeCount;
        }

        return (
            this.__root___isValid &&
            <Panel id="CC_InventorySlot" ref={this.__root__} {...this.initRootAttrs()}>
                <Panel id="ButtonAndLevel" require-composition-layer="true" always-cache-composition-layer="true" hittest={false}>
                    <Panel id="LevelUpBurstFXContainer" hittest={false}>
                        {!bIsItem &&
                            <DOTAScenePanel id="LevelUpBurstFX" map="scenes/hud/levelupburst" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
                        }
                    </Panel>
                    <Panel id="ButtonWithLevelUpTab" hittest={false}>
                        <Button id="LevelUpTab" hittest={true}
                            onactivate={
                                () => {
                                    if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                        Abilities.AttemptToUpgrade(overrideentityindex);
                                    }
                                }}
                            onmouseover={
                                (self) => {
                                    // let pAbilityButton = self.GetParent()?.FindChildTraverse("AbilityButton");
                                    // if (pAbilityButton) {
                                    //     if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                    //         GameUI.CustomUIConfig().ShowAbilityTooltip(pAbilityButton, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex), slot);
                                    //     }
                                    // }
                                }}
                            onmouseout={(self) => {


                            }} >
                            <Panel id="LevelUpButton">
                                <Panel id="LevelUpIcon" />
                            </Panel>
                            <Panel id="LearnModeButton" hittest={false} />
                        </Button>
                        <Panel id="LevelUpLight" hittest={false} />
                        <Panel id="ButtonWell" hittest={false}>
                            <Panel id="AutocastableBorder" hittest={false} />
                            <Panel id="AutoCastingContainer" hittest={false}>
                                <DOTAScenePanel id="AutoCasting" map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
                            </Panel>
                            <Panel id="ButtonSize">
                                <Panel id="AbilityButton" draggable={draggable}
                                    onactivate={(self) => { this.onAbilityButtonclick_left() }}
                                    oncontextmenu={(self) => { this.onAbilityButtonclick_right(); }}
                                    onmouseover={(self) => { this.onAbilityButtonMouseOver() }}
                                    onmouseout={(self) => { this.onAbilityButtonMouseOut() }} >
                                    <DOTAAbilityImage id="AbilityImage" showtooltip={false} hittest={false} contextEntityIndex={contextEntityIndex} />
                                    <DOTAItemImage id="ItemImage" contextEntityIndex={overrideentityindex} scaling="stretch-to-fit-x-preserve-aspect" showtooltip={false} hittest={false} hittestchildren={false} />
                                    <Panel hittest={false} id="AbilityBevel" />
                                    <Panel hittest={false} id="ShineContainer">
                                        <Panel hittest={false} id="Shine" />
                                    </Panel>
                                    <Panel id="TopBarUltimateCooldown" hittest={false} />
                                    {!cooldown_ready &&
                                        <Panel id="Cooldown" hittest={false}>
                                            <Panel id="CooldownOverlay" hittest={false} style={{ clip: "radial(50.0% 50.0%, 0.0deg, " + -FuncHelper.ToFiniteNumber(fChargesPercent) * 360 + "deg)" }} />
                                            <Label id="CooldownTimer" className="MonoNumbersFont" localizedText="{d:cooldown_timer}" hittest={false} dialogVariables={dialogVariables} />
                                        </Panel>
                                    }
                                    <Panel id="ActiveAbility" hittest={false} />
                                    <Panel id="InactiveOverlay" hittest={false} />
                                    {show_item_charges &&
                                        <Label id="ItemCharges" localizedText="{d:item_charge_count}" dialogVariables={dialogVariables} hittest={false} />
                                    }
                                    {show_item_alt_charges &&
                                        <Label id="ItemAltCharges" localizedText="{d:item_alt_charge_count}" dialogVariables={dialogVariables} hittest={false} />
                                    }
                                </Panel>
                                <Panel hittest={false} id="ActiveAbilityBorder" />
                                <Panel hittest={false} id="PassiveAbilityBorder" />
                                <Panel hittest={false} id="AutocastableAbilityBorder" />
                                {!no_gold_cost &&
                                    [<Panel hittest={false} id="GoldCostBG" />,
                                    <Label hittest={false} id="GoldCost" localizedText="{d:gold_cost}" dialogVariables={dialogVariables} />
                                    ]}
                                {!no_mana_cost &&
                                    [<Panel hittest={false} id="ManaCostBG" />,
                                    <Label hittest={false} id="ManaCost" localizedText="{d:mana_cost}" dialogVariables={dialogVariables} />
                                    ]}
                                {/* <Label hittest={false} id="NeutralItemTier" localizedText="{d:neutral_item_tier_number}" /> */}
                                <Panel hittest={false} id="CombineLockedOverlay" />
                                {silenced && <Panel id="SilencedOverlay" hittest={false} />}
                                <Panel hittest={false} id="AbilityStatusOverlay" />
                                <Panel hittest={false} id="UpgradeOverlay" />
                                <Panel hittest={false} id="DropTargetHighlight" />
                            </Panel>
                        </Panel>
                        <Panel id="HotkeyContainer" hittest={false} hittestchildren={false}>
                            {!no_hotkey &&
                                <Panel id="Hotkey" >
                                    <Label id="HotkeyText" localizedText="{s:hotkey}" dialogVariables={dialogVariables} />
                                </Panel>
                            }
                            {hotkey_alt &&
                                <Panel id="HotkeyModifier" >
                                    <Label id="AltText" localizedText="#DOTA_Keybind_ALT" />
                                </Panel>
                            }
                            {hotkey_ctrl &&
                                <Panel id="HotkeyCtrlModifier" >
                                    <Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" />
                                </Panel>
                            }
                        </Panel>
                        {show_ability_charges &&
                            <CircularProgressBar id="AbilityCharges" hittest={false} hittestchildren={false} value={fChargesPercent}>
                                <Label localizedText="{d:ability_charge_count}" dialogVariables={dialogVariables} />
                            </CircularProgressBar>
                        }
                    </Panel>
                    <Panel id="AbilityLevelContainer" hittest={false}>
                        {iMaxLevel > 0 && [...Array(iMaxLevel).keys()].map((key) => {
                            return <Panel key={key.toString()} className={CSSHelper.ClassMaker("LevelPanel", { "next_level": key == iLevel, "active_level": key < iLevel })} />;
                        })}
                    </Panel>
                </Panel>
            </Panel>
        )
    }
}