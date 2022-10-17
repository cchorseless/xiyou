import React, { useState, useRef, useEffect } from 'react';
// import classNames from 'classnames';
import { PanelAttributes, useRegisterForUnhandledEvent } from '@demon673/react-panorama';
// import { PanelAttributes, useRegisterForUnhandledEvent } from '@demon673/react-panorama';

const DOTA_ITEM_SLOT_MIN = 0;
const DOTA_ITEM_SLOT_MAX = 5;
const DOTA_ITEM_BACKPACK_MIN = 6;
const DOTA_ITEM_BACKPACK_MAX = 8;
const DOTA_ITEM_STASH_MIN = 9;
const DOTA_ITEM_STASH_MAX = 14;

function SaveData(panel: Panel, key: string, value: any) {
    (panel as any)[key] = value;
};
function LoadData(panel: Panel, key: string) {
    return (panel as any)[key] as any;
};

// function GetAbilityIndex() {

// }

function ClassMaker(...args: (string | number | any | { [k: string]: boolean })[]): string {
    let classes: string[] = [];
    for (let i = 0; i < args.length; i++) {
        let arg = args[i];
        if (!arg) continue;
        let argType = typeof arg;
        if (argType === 'string' || argType === 'number') {
            classes.push(arg as string);
        }
        else if (Array.isArray(arg)) {
            if (arg.length) {
                let inner = ClassMaker(...arg);
                if (inner) {
                    classes.push(inner);
                }
            }
        } else if (argType === 'object') {
            let objargs = arg as { [k: string]: boolean }
            for (let key in objargs) {
                if (objargs[key]) {
                    classes.push(key);
                }
            }
        }
    }
    return classes.join(" ");
};

interface AbilityPanelAttributes extends PanelAttributes {
    overrideentityindex: ItemEntityIndex,
    overridedisplaykeybind?: DOTAKeybindCommand_t,
    slot?: number,
    dragtype?: string,
    dragstartcallback?: (tDragCallbacks: any, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
    dragdropcallback?: (pDraggedPanel: Panel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
    dragendcallback?: (pDraggedPanel: Panel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => void;
}

export function AbilityPanel({ overrideentityindex = -1 as ItemEntityIndex, overridedisplaykeybind = DOTAKeybindCommand_t.DOTA_KEYBIND_NONE, draggable = false, dragstartcallback, dragdropcallback, dragendcallback, dragtype = "InventorySlot", slot = -1, className, ...other }: AbilityPanelAttributes) {
    const refSelf = useRef<Panel>(null);
    const [m_is_item, set_is_item] = useState(false);
    const [m_max_level, set_max_level] = useState(0);
    const [m_level, set_level] = useState(0);
    const [m_charges_percent, set_charges_percent] = useState(1);
    const [m_cooldown_percent, set_cooldown_percent] = useState(1);
    function update() {
        let pSelf = refSelf.current! as any as Panel;
        if (pSelf == null) return;
        let iActiveAbility = Abilities.GetLocalPlayerActiveAbility();
        let iCasterIndex = Abilities.GetCaster(overrideentityindex);
        let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
        let bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);
        pSelf.SetHasClass("no_ability", !bIsValid);
        let bIsItem = Abilities.IsItem(overrideentityindex) || slot != -1;
        if (bIsItem != LoadData(pSelf, "m_is_item")) {
            SaveData(pSelf, "m_is_item", bIsItem);
            set_is_item(bIsItem);
        }

        pSelf.SetHasClass("no_item", bIsItem && !bIsValid);
        pSelf.SetHasClass("inactive_item", pSelf.BHasClass("BackpackSlot") && Entities.HasItemInInventory(iCasterIndex, Abilities.GetAbilityName(overrideentityindex)));

        let iMaxLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetMaxLevel(overrideentityindex);
        if (iMaxLevel != LoadData(pSelf, "m_max_level")) {
            SaveData(pSelf, "m_max_level", iMaxLevel);
            set_max_level(iMaxLevel);
        }
        let iLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetLevel(overrideentityindex);
        if (iLevel != LoadData(pSelf, "m_level")) {
            SaveData(pSelf, "m_level", iLevel);
            set_level(iLevel);
        }
        let iCasterMana = iCasterIndex == -1 ? 0 : Entities.GetMana(iCasterIndex);
        let iAbilityPoints = Entities.GetAbilityPoints(iCasterIndex);

        let iKeybindCommand = overridedisplaykeybind;
        let sHotkey = Game.GetKeybindForCommand(iKeybindCommand);
        if (bIsItem) {
            if (overridedisplaykeybind == DOTAKeybindCommand_t.DOTA_KEYBIND_NONE) {
                iKeybindCommand = slot + DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1;
                sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY6) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                if (sHotkey == "") {
                    iKeybindCommand = slot + DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST;
                    sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_INVENTORY6_QUICKAUTOCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                }
            }
        } else {
            iKeybindCommand = Entities.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1;
            sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
            if (sHotkey == "") {
                iKeybindCommand = Entities.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST;
                sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                if (sHotkey == "") {
                    sHotkey = Abilities.GetKeybind(overrideentityindex);
                }
            }
            if (Abilities.GetKeybind(overrideentityindex) != sHotkey) {
                sHotkey = Abilities.GetKeybind(overrideentityindex);
            }
        }
        let pAbilityImage = pSelf.FindChildTraverse("AbilityImage") as AbilityImage;
        if (pAbilityImage) {
            pAbilityImage.contextEntityIndex = (bIsItem ? -1 : overrideentityindex) as AbilityEntityIndex;
        }
        // let pItemImage = pSelf.FindChildTraverse<Panel>("ItemImage")?.FindChildTraverse<ItemImage>("CustomItemImage");
        // if (pItemImage) {
        // 	pItemImage.contextEntityIndex = (bIsItem ? overrideentityindex : -1) as ItemEntityIndex;
        // }

        let bInAbilityPhase = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? false : Abilities.IsInAbilityPhase(overrideentityindex);
        let bCooldownReady = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? true : Abilities.IsCooldownReady(overrideentityindex);

        let iManaCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetLevelManaCost(overrideentityindex, iLevel - 1);
        iManaCost = CalcSpecialValueUpgrade(iCasterIndex, Abilities.GetAbilityName(overrideentityindex), "mana_cost", iManaCost);
        let iGoldCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetLevelGoldCost(overrideentityindex, iLevel - 1);

        pSelf.SetHasClass("unitmuted", Entities.IsMuted(iCasterIndex));
        pSelf.SetHasClass("silenced", Entities.IsSilenced(iCasterIndex));

        pSelf.SetHasClass("auto_castable", bIsValid && Abilities.IsAutocast(overrideentityindex));
        pSelf.SetHasClass("is_passive", bIsValid && Abilities.IsPassive(overrideentityindex));
        pSelf.SetHasClass("is_toggle", bIsValid && Abilities.IsToggle(overrideentityindex));

        pSelf.SetHasClass("insufficient_mana", iManaCost > iCasterMana);
        pSelf.SetHasClass("auto_cast_enabled", bIsValid && Abilities.GetAutoCastState(overrideentityindex));
        pSelf.SetHasClass("toggle_enabled", bIsValid && Abilities.GetToggleState(overrideentityindex));

        pSelf.SetHasClass("can_cast_again", (iManaCost > iCasterMana) || !bCooldownReady);

        pSelf.SetHasClass("no_level", iLevel == 0 || !Abilities.IsActivated(overrideentityindex));
        pSelf.SetHasClass("could_level_up", bControllable && iAbilityPoints > 0 && Abilities.CanAbilityBeUpgraded(overrideentityindex) == AbilityLearnResult_t.ABILITY_CAN_BE_UPGRADED);
        pSelf.SetHasClass("show_level_up_tab", pSelf.BHasClass("could_level_up"));
        pSelf.SetHasClass("show_level_up_frame", Game.IsInAbilityLearnMode() && pSelf.BHasClass("could_level_up"));
        pSelf.SetHasClass("is_active", bIsValid && iActiveAbility == overrideentityindex);
        pSelf.SetHasClass("combine_locked", bIsValid && IsItemLocked(overrideentityindex));
        pSelf.SetHasClass("ability_phase", bInAbilityPhase);
        pSelf.SetHasClass("in_cooldown", !bCooldownReady);
        pSelf.SetHasClass("cooldown_ready", bCooldownReady);
        pSelf.SetHasClass("no_mana_cost", iManaCost == 0);
        pSelf.SetDialogVariableInt("mana_cost", iManaCost);
        pSelf.SetHasClass("no_gold_cost", iGoldCost == 0);
        pSelf.SetDialogVariableInt("gold_cost", iGoldCost);

        // 物品等级，用中立物品的样式来显示
        let iNeutralTier = GetItemRarity(Abilities.GetAbilityName(overrideentityindex));
        pSelf.SetHasClass("is_neutral_item", bIsItem && iNeutralTier != -1);
        if (pSelf.BHasClass("is_neutral_item")) {
            pSelf.SwitchClass("NeutralTier", "NeutralTier" + (iNeutralTier + 1));
            pSelf.SetDialogVariableInt("neutral_item_tier_number", iNeutralTier + 1);
        }

        pSelf.SetHasClass("no_hotkey", sHotkey == "" || !bControllable || !((!pSelf.BHasClass("no_level") && !pSelf.BHasClass("is_passive")) || pSelf.BHasClass("show_level_up_frame") || (GameUI.IsControlDown() && pSelf.BHasClass("could_level_up"))));
        pSelf.RemoveClass("hotkey_alt");
        pSelf.RemoveClass("hotkey_ctrl");
        let aHotkeys = sHotkey.split("-");
        if (aHotkeys) {
            for (const sKey of aHotkeys) {
                if (sKey.toUpperCase().indexOf("ALT") != -1) {
                    pSelf.AddClass("hotkey_alt");
                } else if (sKey.toUpperCase().indexOf("CTRL") != -1) {
                    pSelf.AddClass("hotkey_ctrl");
                } else {
                    pSelf.SetDialogVariable("hotkey", Abilities.GetKeybind(overrideentityindex));
                }
            }
        }

        let fCooldownLength = Abilities.GetCooldownLength(overrideentityindex);

        pSelf.RemoveClass("show_ability_charges");
        if (!Entities.IsEnemy(iCasterIndex)) {
            for (let i = 0; i < Entities.GetNumBuffs(iCasterIndex); i++) {
                let iModifier = Entities.GetBuff(iCasterIndex, i);
                let sModifierName = Buffs.GetName(iCasterIndex, iModifier);
                if (iModifier != -1 && Buffs.GetAbility(iCasterIndex, iModifier) == overrideentityindex && FindKey(GameUI.CustomUIConfig().ChargeCounterKv, sModifierName) && !Buffs.IsDebuff(iCasterIndex, iModifier)) {
                    pSelf.AddClass("show_ability_charges");
                    pSelf.SetDialogVariableInt("ability_charge_count", Buffs.GetStackCount(iCasterIndex, iModifier));
                    fCooldownLength = Buffs.GetDuration(iCasterIndex, iModifier) == -1 ? 0 : Buffs.GetDuration(iCasterIndex, iModifier);
                    let fPercent = Clamp(Buffs.GetRemainingTime(iCasterIndex, iModifier) / fCooldownLength, 0, 1);
                    let fChargesPercent = 1 - fPercent;
                    if (fChargesPercent != LoadData(pSelf, "m_charges_percent")) {
                        SaveData(pSelf, "m_charges_percent", fChargesPercent);
                        set_charges_percent(fChargesPercent);
                    }
                    break;
                }
            }
        }

        let fCastStartTime = LoadData(pSelf, "m_cast_start_time");
        if (bInAbilityPhase) {
            if (fCastStartTime == undefined || fCastStartTime == -1) fCastStartTime = Game.GetGameTime() - Game.GetGameFrameTime();

            let fCastTime = Clamp(Game.GetGameTime() - fCastStartTime, 0, Abilities.GetCastPoint(overrideentityindex));
            let fPercent = fCastTime / Abilities.GetCastPoint(overrideentityindex);
            if (fPercent != LoadData(pSelf, "m_cooldown_percent")) {
                SaveData(pSelf, "m_cooldown_percent", fPercent);
                set_cooldown_percent(fPercent);
            }
        } else {
            fCastStartTime = -1;
        }
        if (fCastStartTime != LoadData(pSelf, "m_cast_start_time")) {
            SaveData(pSelf, "m_cast_start_time", fCastStartTime);
        }
        if (!bCooldownReady) {
            let fCooldownTimeRemaining = Abilities.GetCooldownTimeRemaining(overrideentityindex);
            let fPercent = (fCooldownTimeRemaining / fCooldownLength);
            if (fCooldownLength == 0) fPercent = 1;
            if (fPercent != LoadData(pSelf, "m_cooldown_percent")) {
                SaveData(pSelf, "m_cooldown_percent", fPercent);
                set_cooldown_percent(fPercent);
            }

            pSelf.SetDialogVariableInt("cooldown_timer", Math.ceil(fCooldownTimeRemaining));
        }

        let pShine = pSelf.FindChildTraverse("Shine");
        if (pShine) {
            if (overrideentityindex != -1 && ((bCooldownReady == true && bInAbilityPhase == false && bInAbilityPhase != LoadData(pSelf, "m_in_ability_phase")) || (bCooldownReady == true && bCooldownReady != LoadData(pSelf, "m_cooldown_ready")))) {
                pShine.TriggerClass("do_shine");
            }
        }

        pSelf.RemoveClass("show_item_charges");
        pSelf.RemoveClass("show_item_alt_charges");
        pSelf.RemoveClass("muted");
        if (Abilities.IsItem(overrideentityindex)) {
            pSelf.SetHasClass("muted", Items.IsMuted(overrideentityindex));

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

            pSelf.SetHasClass("show_item_charges", bHasCharges);
            pSelf.SetHasClass("show_item_alt_charges", bHasAltCharges);

            pSelf.SetDialogVariableInt("item_charge_count", iChargeCount);
            pSelf.SetDialogVariableInt("item_alt_charge_count", iAltChargeCount);
        }
        if (bInAbilityPhase != LoadData(pSelf, "m_in_ability_phase")) {
            SaveData(pSelf, "m_in_ability_phase", bInAbilityPhase);
        }
        if (bCooldownReady != LoadData(pSelf, "m_cooldown_ready")) {
            SaveData(pSelf, "m_cooldown_ready", bCooldownReady);
        }
    }

    useEffect(() => {
        let pSelf = refSelf.current!;
        if (pSelf) {
            SaveData(pSelf, "m_is_item", false);
            SaveData(pSelf, "m_max_level", 0);
            SaveData(pSelf, "m_level", 0);
            SaveData(pSelf, "m_cooldown_ready", true);
            SaveData(pSelf, "m_in_ability_phase", false);
            SaveData(pSelf, "m_charges_percent", 1);
            SaveData(pSelf, "m_cooldown_percent", 1);
            SaveData(pSelf, "m_cast_start_time", -1);
            SaveData(pSelf, "update", update);
        }
        update();
    }, []);

    useEffect(() => {
        let pSelf = refSelf.current;
        if (pSelf) {
            SaveData(pSelf, "update", update);
        }
        update();
    }, [overrideentityindex, overridedisplaykeybind, slot]);

    if (draggable) {
        // 拖拽相关
        useRegisterForUnhandledEvent("DragStart", (pPanel: Panel, tDragCallbacks) => {
            let pSelf = refSelf.current;
            if (pSelf && pPanel == pSelf.FindChildTraverse("AbilityButton")) {
                if (!pSelf || pSelf.BHasClass("no_ability")) {
                    return true;
                }
                if (typeof dragstartcallback == "function" && !dragstartcallback(tDragCallbacks, overrideentityindex, overridedisplaykeybind, slot, dragtype)) {
                    return true;
                }
                GameUI.CustomUIConfig().HideAbilityTooltip(pPanel);
                let iAbilityIndex = overrideentityindex;
                if (iAbilityIndex != -1) {
                    let sAbilityName = Abilities.GetAbilityName(iAbilityIndex);
                    let pDisplayPanel: ItemImage | AbilityImage;
                    if (Abilities.IsItem(iAbilityIndex)) {
                        pDisplayPanel = $.CreatePanel("DOTAItemImage", $.GetContextPanel(), "dragImage");
                        pDisplayPanel.itemname = sAbilityName;
                    } else {
                        pDisplayPanel = $.CreatePanel("DOTAAbilityImage", $.GetContextPanel(), "dragImage");
                        pDisplayPanel.abilityname = sAbilityName;
                    }
                    SaveData(pDisplayPanel, "overrideentityindex", iAbilityIndex);
                    SaveData(pDisplayPanel, "m_pPanel", pSelf);
                    SaveData(pDisplayPanel, "m_DragCompleted", false);
                    SaveData(pDisplayPanel, "m_DragType", dragtype);
                    SaveData(pDisplayPanel, "m_Slot", slot);
                    pDisplayPanel.AddClass(dragtype);

                    tDragCallbacks.displayPanel = pDisplayPanel;
                    tDragCallbacks.offsetX = 0;
                    tDragCallbacks.offsetY = 0;

                    pSelf.AddClass("dragging_from");
                }

                return true;
            }
        }, [overrideentityindex, overridedisplaykeybind, slot, dragtype]);
        useRegisterForUnhandledEvent("DragLeave", (pPanel: Panel, pDraggedPanel: Panel) => {
            $.Msg("DragLeave:" + pPanel.id + "|" + pDraggedPanel.id)
            if (LoadData(pDraggedPanel, "m_pPanel") == undefined || LoadData(pDraggedPanel, "m_pPanel") == null) {
                return false;
            }
            if (LoadData(pDraggedPanel, "m_DragType") != dragtype) {
                return false;
            }
            let pSelf = refSelf.current;
            if (pSelf && pPanel == pSelf.FindChildTraverse("AbilityButton")) {
                if (LoadData(pDraggedPanel, "m_pPanel") == pSelf) {
                    return false;
                }

                pSelf.RemoveClass("potential_drop_target");

                return true;
            }
            return false;
        }, [overrideentityindex, overridedisplaykeybind, slot, dragtype]);
        useRegisterForUnhandledEvent("DragEnter", (pPanel: Panel, pDraggedPanel: Panel) => {
            if (LoadData(pDraggedPanel, "m_pPanel") == undefined || LoadData(pDraggedPanel, "m_pPanel") == null) {
                return true;
            }
            if (LoadData(pDraggedPanel, "m_DragType") != dragtype) {
                return true;
            }
            let pSelf = refSelf.current;
            if (pSelf && pPanel == pSelf.FindChildTraverse("AbilityButton")) {
                if (LoadData(pDraggedPanel, "m_pPanel") == pSelf) {
                    return true;
                }

                pSelf.AddClass("potential_drop_target");

                return true;
            }
            return false;
        }, [overrideentityindex, overridedisplaykeybind, slot, dragtype]);
        useRegisterForUnhandledEvent("DragDrop", (pPanel: Panel, pDraggedPanel: Panel) => {
            $.Msg("DragDrop:" + pPanel.id + "|" + pDraggedPanel.id)
            if (LoadData(pDraggedPanel, "m_pPanel") == undefined || LoadData(pDraggedPanel, "m_pPanel") == null) {
                return true;
            }
            if (LoadData(pDraggedPanel, "m_DragType") != dragtype) {
                return true;
            }
            let pSelf = refSelf.current;
            if (pSelf && pPanel == pSelf.FindChildTraverse("AbilityButton")) {
                if (LoadData(pDraggedPanel, "m_pPanel") == pSelf) {
                    SaveData(pDraggedPanel, "m_DragCompleted", true);
                    return true;
                }
                if (typeof dragdropcallback == "function" && dragdropcallback(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype)) {
                    SaveData(pDraggedPanel, "m_DragCompleted", true);
                }

                return true;
            } else {
                if (LoadData(pDraggedPanel, "m_pPanel") == undefined || LoadData(pDraggedPanel, "m_pPanel") == null) {
                    return true;
                }
                SaveData(pDraggedPanel, "m_DragCompleted", true);
            }
            return false;
        }, [overrideentityindex, overridedisplaykeybind, slot, dragtype]);
        useRegisterForUnhandledEvent("DragEnd", (pPanel: Panel, pDraggedPanel) => {
            $.Msg("DragEnd:" + pPanel.id + "|" + pDraggedPanel.id)
            let pSelf = refSelf.current;
            if (pSelf && pPanel == pSelf.FindChildTraverse("AbilityButton")) {
                if (typeof dragendcallback == "function") {
                    dragendcallback(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype);
                }
                pDraggedPanel.DeleteAsync(-1);

                pSelf.RemoveClass("dragging_from");
            }
        }, [overrideentityindex, overridedisplaykeybind, slot, dragtype]);
    }

    return (
        <Panel className={ClassMaker("AbilityPanel", className, "AbilityMaxLevel" + m_max_level)} {...other} ref={refSelf}>
            <Panel id="ButtonAndLevel" require-composition-layer="true" always-cache-composition-layer="true" hittest={false}>
                <Panel id="LevelUpBurstFXContainer" hittest={false}>
                    {!m_is_item &&
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
                            <Panel id="AbilityButton" draggable={draggable} onactivate={(self) => {
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
                            }} oncontextmenu={(self) => {
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
                                <DOTAAbilityImage id="AbilityImage" showtooltip={false} hittest={false} />
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
                    <CircularProgressBar id="AbilityCharges" hittest={false} hittestchildren={false} value={m_charges_percent}>
                        <Label localizedText="{d:ability_charge_count}" />
                    </CircularProgressBar>
                </Panel>
                <Panel hittest={false} id="AbilityLevelContainer" >
                    {m_max_level > 0 && [...Array(m_max_level).keys()].map((key) => {
                        return <Panel key={key.toString()} className={ClassMaker("LevelPanel", { "next_level": key == m_level, "active_level": key < m_level })} />;
                    })}
                </Panel>
            </Panel>
        </Panel>
    );
}

interface InventorySlotAttributes extends AbilityPanelAttributes {
    isBackpack?: boolean;
}
export function InventorySlot(
    { overrideentityindex = -1 as ItemEntityIndex,
        overridedisplaykeybind = DOTAKeybindCommand_t.DOTA_KEYBIND_NONE,
        slot = -1,
        isBackpack = false,
        ...other }: InventorySlotAttributes) {
    return (
        <AbilityPanel id="AbilityPanel" draggable={true} dragtype="InventorySlot" dragdropcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
            let iAbilityIndex = LoadData(pDraggedPanel, "overrideentityindex");
            if (iAbilityIndex != -1 && LoadData(pDraggedPanel, "m_Slot") != -1) {
                let iCasterIndex = Abilities.GetCaster(iAbilityIndex);
                Game.PrepareUnitOrders({
                    UnitIndex: iCasterIndex,
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
                    TargetIndex: slot,
                    AbilityIndex: iAbilityIndex,
                });
                return true;
            }
            return false;
        }} dragendcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
            if (LoadData(pDraggedPanel, "m_DragCompleted") == false) {
                let iAbilityIndex = LoadData(pDraggedPanel, "overrideentityindex");
                if (iAbilityIndex != -1) {
                    let iCasterIndex = Abilities.GetCaster(iAbilityIndex);
                    Game.DropItemAtCursor(iCasterIndex, iAbilityIndex);
                }
            }
        }} className={ClassMaker("InventoryItem", { "BackpackSlot": isBackpack })} {...other} overrideentityindex={overrideentityindex} overridedisplaykeybind={overridedisplaykeybind} slot={slot} />
    );
}


export function SecondaryAbilityPanel({ overrideentityindex = -1 as ItemEntityIndex, className, ...other }: InventorySlotAttributes) {
    return (
        <Panel {...other} className={ClassMaker("DOTASecondaryAbility ShowAbility RequiresCharges HasCharges", className)} onactivate={(self) => {
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
                                GameEvents.SendEventClientSide("custom_get_active_ability", { entindex: -1 as AbilityEntityIndex });
                                Abilities.ExecuteAbility(iAbilityIndex, Abilities.GetCaster(iAbilityIndex), true);
                            }
                            return;
                        }
                    }
                }
                let iCasterIndex = Abilities.GetCaster(overrideentityindex);
                Abilities.ExecuteAbility(overrideentityindex, iCasterIndex, false);
            }
        }} onmouseover={(self) => {
            GameUI.CustomUIConfig().ShowAbilityTooltip(self, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex));
        }} onmouseout={(self) => {
            GameUI.CustomUIConfig().HideAbilityTooltip(self);
        }}>
            <Panel id="AbilityImageContainer" hittestchildren={false} >
                <DOTAAbilityImage id="AbilityImage" hittest={false} abilityname={Abilities.GetAbilityName(overrideentityindex)} />
                <Panel id="Cooldown">
                    <Panel id="CooldownBackground" />
                    <Label id="CooldownSeconds" className="MonoNumbersFont" text="{d:cooldown_seconds}" dialogVariables={{ cooldown_seconds: Abilities.GetCooldownTimeRemaining(overrideentityindex) }} />
                </Panel>
            </Panel>
        </Panel>
    );
}