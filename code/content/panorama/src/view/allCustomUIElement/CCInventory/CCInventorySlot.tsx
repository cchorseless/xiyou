import { PanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { AbilityHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { CCPanel } from "../CCPanel/CCPanel";

interface ICCInventorySlot extends PanelAttributes {
    overrideentityindex: ItemEntityIndex,
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

    defaultClass() {
        return CSSHelper.ClassMaker("AbilityPanel", "AbilityMaxLevel" + m_max_level)
    }

    static defaultProps = {
        overrideentityindex: -1,
        overridedisplaykeybind: DOTAKeybindCommand_t.DOTA_KEYBIND_NONE,
        draggable: false,
        dragtype: "InventorySlot",
        slot: -1,
    }


    render() {
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
        let bCooldownReady = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? true : Abilities.IsCooldownReady(overrideentityindex);

        let iManaCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelManaCost(overrideentityindex, iLevel - 1);
        iManaCost = CalcSpecialValueUpgrade(iCasterIndex, Abilities.GetAbilityName(overrideentityindex), "mana_cost", iManaCost);
        let iGoldCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelGoldCost(overrideentityindex, iLevel - 1);
        let fChargesPercent = 1;
        if (!Entities.IsEnemy(iCasterIndex)) {
            for (let i = 0; i < Entities.GetNumBuffs(iCasterIndex); i++) {
                let iModifier = Entities.GetBuff(iCasterIndex, i);
                let sModifierName = Buffs.GetName(iCasterIndex, iModifier);
                if (iModifier != -1 && Buffs.GetAbility(iCasterIndex, iModifier) == overrideentityindex && FindKey(GameUI.CustomUIConfig().ChargeCounterKv, sModifierName) && !Buffs.IsDebuff(iCasterIndex, iModifier)) {
                    pSelf.AddClass("show_ability_charges");
                    pSelf.SetDialogVariableInt("ability_charge_count", Buffs.GetStackCount(iCasterIndex, iModifier));
                    fCooldownLength = Buffs.GetDuration(iCasterIndex, iModifier) == -1 ? 0 : Buffs.GetDuration(iCasterIndex, iModifier);
                    let fPercent = Clamp(Buffs.GetRemainingTime(iCasterIndex, iModifier) / fCooldownLength, 0, 1);
                    fChargesPercent = 1 - fPercent;
                    if (fChargesPercent != LoadData(pSelf, "m_charges_percent")) {
                        SaveData(pSelf, "m_charges_percent", fChargesPercent);
                        set_charges_percent(fChargesPercent);
                    }
                    break;
                }
            }
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
                        <Button id="LevelUpTab" hittest={true} onactivate={() => {
                            if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                Abilities.AttemptToUpgrade(overrideentityindex);
                            }
                        }} onmouseover={(self) => {
                            let pAbilityButton = self.GetParent()?.FindChildTraverse("AbilityButton");
                            if (pAbilityButton) {
                                if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                    GameUI.CustomUIConfig().ShowAbilityTooltip(pAbilityButton, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex), slot);
                                }
                            }
                        }} onmouseout={(self) => {
                            let pAbilityButton = self.GetParent()?.FindChildTraverse("AbilityButton");
                            if (pAbilityButton) {
                                GameUI.CustomUIConfig().HideAbilityTooltip(pAbilityButton);
                            }
                        }} >
                            <Panel id="LevelUpButton">
                                <Panel id="LevelUpIcon" />
                            </Panel>
                            <Panel id="LearnModeButton" hittest={false} />
                        </Button>
                        <Panel id="LevelUpLight" hittest={false} />
                        <Panel hittest={false} id="ButtonWell">
                            <Panel hittest={false} id="AutocastableBorder" />
                            <Panel id="AutoCastingContainer" hittest={false}>
                                {/* {!m_is_item &&
							} */}
                                <DOTAScenePanel id="AutoCasting" map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
                            </Panel>
                            <Panel id="ButtonSize">
                                <Panel id="AbilityButton" draggable={draggable}
                                    onactivate={(self) => {
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
                                    }}
                                    oncontextmenu={(self) => {
                                        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                            if (Abilities.IsItem(overrideentityindex)) {
                                                if (!$.GetContextPanel().BHasClass("dragging") && overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                                    let iCasterIndex = Abilities.GetCaster(overrideentityindex);
                                                    let sItemName = Abilities.GetAbilityName(overrideentityindex);
                                                    let bSlotInStash = slot >= DOTA_ITEM_STASH_MIN;
                                                    let bOwned = Entities.GetPlayerOwnerID(iCasterIndex) == Players.GetLocalPlayer();
                                                    let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
                                                    let bSellable = Items.IsSellable(overrideentityindex) && Items.CanBeSoldByLocalPlayer(overrideentityindex);
                                                    let bDisassemble = Items.IsDisassemblable(overrideentityindex) && bControllable && !bSlotInStash;
                                                    let bAlertable = Items.IsAlertableItem(overrideentityindex);
                                                    let bLocked = IsItemLocked(overrideentityindex);
                                                    let bAutocast = Abilities.IsAutocast(overrideentityindex);
                                                    // let bShowInShop = Items.IsPurchasable(overrideentityindex);
                                                    let bShowInShop = false;
                                                    // let bMoveToStash = !bSlotInStash && bControllable;
                                                    // let bDropFromStash = bSlotInStash && bControllable;
                                                    let bMoveToStash = false;
                                                    let bDropFromStash = false;
                                                    let bMoveToTraining = true;

                                                    // 铸造相关
                                                    // let castingInfo = CustomNetTables.GetTableValue("common", "casting_info") || {};
                                                    // let castingName = "";
                                                    // for (const itemName in castingInfo) {
                                                    // 	for (const _key in castingInfo[itemName]) {
                                                    // 		if (castingInfo[itemName][_key] == sItemName) {
                                                    // 			castingName = itemName;
                                                    // 			break;
                                                    // 		}
                                                    // 	}
                                                    // }
                                                    if (!draggable) {
                                                        return;
                                                    }

                                                    if (!bControllable) {
                                                        return;
                                                    }

                                                    if (!bOwned) {
                                                        return;
                                                    }

                                                    if (!bSellable && !bDisassemble && !bShowInShop && !bDropFromStash && !bAlertable && !bMoveToStash && !bAutocast && !bMoveToTraining) {
                                                        return;
                                                    }
                                                    let pContextMenu = $.CreatePanel("ContextMenuScript", self, "");
                                                    pContextMenu.AddClass("ContextMenu_NoArrow");
                                                    pContextMenu.AddClass("ContextMenu_NoBorder");

                                                    let pContentsPanel = pContextMenu.GetContentsPanel<InventoryItemContextMenu>();
                                                    pContentsPanel.BLoadLayout("file://{resources}/layout/custom_game/context_menu/context_menu_inventory_item/context_menu_inventory_item.xml", false, false);
                                                    pContentsPanel.SetItem(overrideentityindex, self);
                                                    pContentsPanel.SetHasClass("bSellable", bSellable);
                                                    pContentsPanel.SetHasClass("bDisassemble", bDisassemble);
                                                    pContentsPanel.SetHasClass("bShowInShop", bShowInShop);
                                                    pContentsPanel.SetHasClass("bDropFromStash", bDropFromStash);
                                                    pContentsPanel.SetHasClass("bAlertable", bAlertable);
                                                    pContentsPanel.SetHasClass("bMoveToStash", bMoveToStash);
                                                    pContentsPanel.SetHasClass("bLocked", bLocked);
                                                    // pContentsPanel.SetHasClass("bCasting", castingName != "");
                                                    pContentsPanel.SetHasClass("bAutocast", bAutocast);
                                                    pContentsPanel.SetHasClass("bMoveToTraining", bMoveToTraining);
                                                    pContentsPanel.SetHasClass("bSacrifice", GetItemRarity(Abilities.GetAbilityName(overrideentityindex)) == 6);
                                                    // pContentsPanel.SetDialogVariable("itemname", $.Localize("DOTA_Tooltip_ability_" + castingName));
                                                    // if (castingName != "") {
                                                    // 	pContentsPanel.SetDialogVariableInt("int_value", Number(GameUI.CustomUIConfig().ItemsKv[castingName].CastingCrystalCost || 0));
                                                    // }
                                                }
                                                return;
                                            }
                                            if (Abilities.IsAutocast(overrideentityindex)) {
                                                Game.PrepareUnitOrders({
                                                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
                                                    AbilityIndex: overrideentityindex,
                                                    UnitIndex: Abilities.GetCaster(overrideentityindex),
                                                });
                                            }
                                        }
                                    }} onmouseover={(self) => {
                                        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                                            if (Abilities.IsItem(overrideentityindex)) {
                                                GameEvents.SendEventClientSide("custom_hover_item", {
                                                    item_entindex: overrideentityindex,
                                                });
                                            }
                                            GameUI.CustomUIConfig().ShowAbilityTooltip(self, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex), slot);
                                        }
                                    }} onmouseout={(self) => {
                                        if (Abilities.IsItem(overrideentityindex)) {
                                            GameEvents.SendEventClientSide("custom_hover_item", {
                                                item_entindex: -1 as ItemEntityIndex,
                                            });
                                        }
                                        GameUI.CustomUIConfig().HideAbilityTooltip(self);
                                    }} >
                                    <DOTAAbilityImage id="AbilityImage" showtooltip={false} hittest={false} contextEntityIndex={contextEntityIndex} />
                                    <DOTAItemImage id="ItemImage" contextEntityIndex={overrideentityindex} scaling="stretch-to-fit-x-preserve-aspect" showtooltip={false} hittest={false} hittestchildren={false} />
                                    <Panel hittest={false} id="AbilityBevel" />
                                    <Panel hittest={false} id="ShineContainer">
                                        <Panel hittest={false} id="Shine" />
                                    </Panel>
                                    <Panel id="TopBarUltimateCooldown" hittest={false} />
                                    <Panel id="Cooldown" hittest={false}>
                                        <Panel id="CooldownOverlay" hittest={false} style={{ clip: "radial(50.0% 50.0%, 0.0deg, " + -finiteNumber(m_cooldown_percent) * 360 + "deg)" }} />
                                        <Label id="CooldownTimer" className="MonoNumbersFont" localizedText="{d:cooldown_timer}" hittest={false} />
                                    </Panel>
                                    <Panel id="ActiveAbility" hittest={false} />
                                    <Panel id="InactiveOverlay" hittest={false} />
                                    <Label id="ItemCharges" localizedText="{d:item_charge_count}" hittest={false} />
                                    <Label id="ItemAltCharges" localizedText="{d:item_alt_charge_count}" hittest={false} />
                                </Panel>
                                <Panel hittest={false} id="ActiveAbilityBorder" />
                                <Panel hittest={false} id="PassiveAbilityBorder" />
                                <Panel hittest={false} id="AutocastableAbilityBorder" />
                                <Panel hittest={false} id="GoldCostBG" />
                                <Label hittest={false} id="GoldCost" localizedText="{d:gold_cost}" />
                                <Panel hittest={false} id="ManaCostBG" />
                                <Label hittest={false} id="ManaCost" localizedText="{d:mana_cost}" />
                                {/* <Label hittest={false} id="NeutralItemTier" localizedText="{d:neutral_item_tier_number}" /> */}
                                <Panel hittest={false} id="CombineLockedOverlay" />
                                <Panel hittest={false} id="SilencedOverlay" />
                                <Panel hittest={false} id="AbilityStatusOverlay" />
                                <Panel hittest={false} id="UpgradeOverlay" />
                                <Panel hittest={false} id="DropTargetHighlight" />
                            </Panel>
                        </Panel>
                        <Panel id="HotkeyContainer" hittest={false} hittestchildren={false}>
                            <Panel id="Hotkey">
                                <Label id="HotkeyText" localizedText="{s:hotkey}" />
                            </Panel>
                            <Panel id="HotkeyModifier">
                                <Label id="AltText" localizedText="#DOTA_Keybind_ALT" />
                            </Panel>
                            <Panel id="HotkeyCtrlModifier">
                                <Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" />
                            </Panel>
                        </Panel>
                        <CircularProgressBar id="AbilityCharges" hittest={false} hittestchildren={false} value={fChargesPercent}>
                            <Label localizedText="{d:ability_charge_count}" />
                        </CircularProgressBar>
                    </Panel>
                    <Panel hittest={false} id="AbilityLevelContainer" >
                        {iMaxLevel > 0 && [...Array(iMaxLevel).keys()].map((key) => {
                            return <Panel key={key.toString()} className={CSSHelper.ClassMaker("LevelPanel", { "next_level": key == iLevel, "active_level": key < iLevel })} />;
                        })}
                    </Panel>
                </Panel>
            </Panel>
        )
    }
}