import { PanelAttributes } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { GameEnum } from "../../../../../../game/scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../../helper/CSSHelper";
import { AbilityHelper, ItemHelper, UnitHelper } from "../../../helper/DotaEntityHelper";
import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { CCMainPanel } from "../../MainPanel/CCMainPanel";
import { CCPanel } from "../CCPanel/CCPanel";
import { CCAbilityInfoDialog } from "./CCAbilityInfoDialog";
import "./CCAbilityPanel.less";

export interface ICCAbilityPanel extends PanelAttributes {
    overrideentityindex?: ItemEntityIndex,
    overridedisplaykeybind?: DOTAKeybindCommand_t,
    slot?: number,
    dragtype?: string,
    dragstartcallback?: (tDragCallbacks: DragSettings, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
    dragdropcallback?: (pDraggedPanel: IDragPanel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => boolean;
    dragendcallback?: (pDraggedPanel: IDragPanel, overrideentityindex: ItemEntityIndex, overridedisplaykeybind: DOTAKeybindCommand_t, slot: number, dragtype: string) => void;
}


export class CCAbilityPanel extends CCPanel<ICCAbilityPanel> {
    static defaultProps = {
        overrideentityindex: -1,
        overridedisplaykeybind: DOTAKeybindCommand_t.DOTA_KEYBIND_NONE,
        draggable: false,
        dragtype: "InventorySlot",
        slot: -1,
    }
    defaultClass() {
        const overrideentityindex = this.props.overrideentityindex!;
        const iCasterIndex = Abilities.GetCaster(overrideentityindex);
        const bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);
        const iMaxLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetMaxLevel(overrideentityindex);
        return CSSHelper.ClassMaker("AbilityPanel", "AbilityMaxLevel" + iMaxLevel)
    }
    private AbilityImage: React.RefObject<AbilityImage> = createRef<AbilityImage>();;
    private AbilityButton: React.RefObject<Panel> = createRef<Panel>();;

    onInitUI() {
        this.UpdateState({
            m_is_item: false,
            m_level: 0,
            m_max_level: 0,
            m_cooldown_ready: true,
            m_in_ability_phase: false,
            m_charges_percent: 1,
            m_cooldown_percent: 1,
            dialogVariables: {}
        });
        this.useEffectProps(() => {
            this.onRefreshUI();
        }, "overrideentityindex", "overridedisplaykeybind", "slot");
    }
    onStartUI() {
        this.onRefreshUI()
        this.addDragEvent();
    }
    addDragEvent() {
        const draggable = this.props.draggable!;
        const pSelf = this.__root__.current!;
        if (draggable) {
            // 拖拽相关
            $.RegisterEventHandler("DragStart", pSelf, (pPanel: Panel, tDragCallbacks: DragSettings) => {
                const dragstartcallback = this.props.dragstartcallback!;
                const overrideentityindex = this.props.overrideentityindex!;
                const overridedisplaykeybind = this.props.overridedisplaykeybind!;
                const dragtype = this.props.dragtype!;
                const slot = this.props.slot!;
                if (pSelf && pPanel == this.AbilityButton.current) {
                    if (!pSelf || pSelf.BHasClass("no_ability")) {
                        return true;
                    }
                    if (typeof dragstartcallback == "function" && !dragstartcallback(tDragCallbacks, overrideentityindex, overridedisplaykeybind, slot, dragtype)) {
                        return true;
                    }
                    const ccMainPanel = CCMainPanel.GetInstance()!;
                    ccMainPanel.HideToolTip();
                    let iAbilityIndex = overrideentityindex;
                    if (iAbilityIndex != -1) {
                        let sAbilityName = Abilities.GetAbilityName(iAbilityIndex);
                        let pDisplayPanel: IDragPanel;
                        if (Abilities.IsItem(iAbilityIndex)) {
                            pDisplayPanel = $.CreatePanel("DOTAItemImage", $.GetContextPanel(), "dragImage");
                            (pDisplayPanel as ItemImage).itemname = sAbilityName;
                        } else {
                            pDisplayPanel = $.CreatePanel("DOTAAbilityImage", $.GetContextPanel(), "dragImage");
                            (pDisplayPanel as AbilityImage).abilityname = sAbilityName;
                        }
                        pDisplayPanel.overrideentityindex = iAbilityIndex;
                        pDisplayPanel.m_pPanel = pSelf;
                        pDisplayPanel.m_DragCompleted = false;
                        pDisplayPanel.m_DragType = dragtype;
                        pDisplayPanel.m_Slot = slot;
                        pDisplayPanel.AddClass(dragtype);
                        tDragCallbacks.displayPanel = pDisplayPanel;
                        tDragCallbacks.offsetX = 0;
                        tDragCallbacks.offsetY = 0;
                        pSelf.AddClass("dragging_from");
                    }
                    return true;
                }
                return true;
            });
            $.RegisterEventHandler("DragLeave", pSelf, (pPanel: Panel, pDraggedPanel: IDragPanel) => {
                const dragtype = this.props.dragtype!;
                if (pDraggedPanel.m_pPanel == null) {
                    return false;
                }
                if (pDraggedPanel.m_DragType != dragtype) {
                    return false;
                }
                if (pSelf && pPanel == this.AbilityButton.current) {
                    if (pDraggedPanel.m_pPanel == pSelf) {
                        return false;
                    }

                    pSelf.RemoveClass("potential_drop_target");

                    return true;
                }
                return false;
            });
            $.RegisterEventHandler("DragEnter", pSelf, (pPanel: Panel, pDraggedPanel: IDragPanel) => {
                const dragtype = this.props.dragtype!;

                if (pDraggedPanel.m_pPanel == null) {
                    return true;
                }
                if (pDraggedPanel.m_DragType != dragtype) {
                    return true;
                }
                if (pSelf && pPanel == this.AbilityButton.current) {
                    if (pDraggedPanel.m_pPanel == pSelf) {
                        return true;
                    }
                    pSelf.AddClass("potential_drop_target");
                    return true;
                }
                return false;
            });
            $.RegisterEventHandler("DragDrop", pSelf, (pPanel: Panel, pDraggedPanel: IDragPanel) => {
                const dragdropcallback = this.props.dragdropcallback!;
                const overrideentityindex = this.props.overrideentityindex!;
                const dragtype = this.props.dragtype!;
                const overridedisplaykeybind = this.props.overridedisplaykeybind!;
                const slot = this.props.slot!;
                if (pDraggedPanel.m_pPanel == null) {
                    return true;
                }
                if (pDraggedPanel.m_DragType != dragtype) {
                    return true;
                }
                if (pSelf && pPanel == this.AbilityButton.current) {
                    if (pDraggedPanel.m_pPanel == pSelf) {
                        pDraggedPanel.m_DragCompleted = true;
                        return true;
                    }
                    if (typeof dragdropcallback == "function" && dragdropcallback(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype)) {
                        pDraggedPanel.m_DragCompleted = true;
                    }
                    return true;
                } else {
                    if (pDraggedPanel.m_pPanel == null) {
                        return true;
                    }
                    pDraggedPanel.m_DragCompleted = true;
                }
                return false;
            });
            $.RegisterEventHandler("DragEnd", pSelf, (pPanel: Panel, pDraggedPanel: IDragPanel) => {
                const dragendcallback = this.props.dragendcallback!;
                const overrideentityindex = this.props.overrideentityindex!;
                const dragtype = this.props.dragtype!;
                const overridedisplaykeybind = this.props.overridedisplaykeybind!;
                const slot = this.props.slot!;
                if (pSelf && pPanel == this.AbilityButton.current) {
                    if (typeof dragendcallback == "function") {
                        dragendcallback(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype);
                    }
                    pDraggedPanel.DeleteAsync(-1);
                    pSelf.RemoveClass("dragging_from");
                }
            });
        }
    }
    private fCastStartTime = -1;

    private intervalRefresh() {
        // 延迟0.1，保证数据最新
        TimerHelper.AddTimer(0.1, FuncHelper.Handler.create(this, () => {
            this.onRefreshUI();
        }), false);
    }

    onRefreshUI() {
        const pSelf = this.__root__.current!;
        const m_cooldown_ready = this.GetState<boolean>("m_cooldown_ready", false);
        const m_in_ability_phase = this.GetState("m_in_ability_phase", false);
        const overrideentityindex = this.props.overrideentityindex!;
        const slot = this.props.slot!;
        const overridedisplaykeybind = this.props.overridedisplaykeybind!;

        let iActiveAbility = Abilities.GetLocalPlayerActiveAbility();
        let iCasterIndex = Abilities.GetCaster(overrideentityindex);
        let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
        let bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);

        pSelf.SetHasClass("no_ability", !bIsValid);
        let bIsItem = Abilities.IsItem(overrideentityindex) || slot != -1;
        this.UpdateState({ "m_is_item": bIsItem })

        pSelf.SetHasClass("no_item", bIsItem && !bIsValid);
        pSelf.SetHasClass("inactive_item", pSelf.BHasClass("BackpackSlot") && Entities.HasItemInInventory(iCasterIndex, Abilities.GetAbilityName(overrideentityindex)));

        let iMaxLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetMaxLevel(overrideentityindex);
        this.UpdateState({ "m_max_level": iMaxLevel })

        let iLevel = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : Abilities.GetLevel(overrideentityindex);
        this.UpdateState({ "m_level": iLevel })

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
            iKeybindCommand = AbilityHelper.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1;
            sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1 && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
            if (sHotkey == "") {
                iKeybindCommand = AbilityHelper.GetAbilityIndex(iCasterIndex, overrideentityindex) + DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST;
                sHotkey = (iKeybindCommand >= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_PRIMARY1_QUICKCAST && iKeybindCommand <= DOTAKeybindCommand_t.DOTA_KEYBIND_ABILITY_ULTIMATE_QUICKCAST) ? Game.GetKeybindForCommand(iKeybindCommand) : sHotkey;
                if (sHotkey == "") {
                    sHotkey = Abilities.GetKeybind(overrideentityindex);
                }
            }
            if (Abilities.GetKeybind(overrideentityindex) != sHotkey) {
                sHotkey = Abilities.GetKeybind(overrideentityindex);
            }
        }
        if (this.AbilityImage.current) {
            this.AbilityImage.current.contextEntityIndex = (bIsItem ? -1 : overrideentityindex) as AbilityEntityIndex;
        }
        // let pItemImage = pSelf.FindChildTraverse<Panel>("ItemImage")?.FindChildTraverse<ItemImage>("CustomItemImage");
        // if (pItemImage) {
        // 	pItemImage.contextEntityIndex = (bIsItem ? overrideentityindex : -1) as ItemEntityIndex;
        // }

        let bInAbilityPhase = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? false : Abilities.IsInAbilityPhase(overrideentityindex);
        let bCooldownReady = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? true : Abilities.IsCooldownReady(overrideentityindex);

        let iManaCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelManaCost(overrideentityindex, iLevel - 1);
        iManaCost = AbilityHelper.CalcSpecialValueUpgrade(iCasterIndex, Abilities.GetAbilityName(overrideentityindex), "mana_cost", iManaCost);
        let iGoldCost = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? 0 : AbilityHelper.GetLevelGoldCost(overrideentityindex, iLevel - 1);

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
        pSelf.SetHasClass("combine_locked", bIsValid && ItemHelper.IsItemLocked(overrideentityindex));
        pSelf.SetHasClass("ability_phase", bInAbilityPhase);
        pSelf.SetHasClass("in_cooldown", !bCooldownReady);
        pSelf.SetHasClass("cooldown_ready", bCooldownReady);
        pSelf.SetHasClass("no_mana_cost", iManaCost == 0);
        this.updateDialogVariables("mana_cost", iManaCost);
        pSelf.SetHasClass("no_gold_cost", iGoldCost == 0);
        this.updateDialogVariables("gold_cost", iGoldCost);

        // 物品等级，用中立物品的样式来显示
        let iNeutralTier = ItemHelper.GetItemRarityNumber(Abilities.GetAbilityName(overrideentityindex));
        pSelf.SetHasClass("is_neutral_item", bIsItem && iNeutralTier != -1);
        if (pSelf.BHasClass("is_neutral_item")) {
            pSelf.SwitchClass("NeutralTier", "NeutralTier" + (iNeutralTier + 1));
            this.updateDialogVariables("neutral_item_tier_number", iNeutralTier + 1);
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

            // for (let i = 0; i < Entities.GetNumBuffs(iCasterIndex); i++) {
            //     let iModifier = Entities.GetBuff(iCasterIndex, i);
            //     let sModifierName = Buffs.GetName(iCasterIndex, iModifier);
            //     if (iModifier != -1 && Buffs.GetAbility(iCasterIndex, iModifier) == overrideentityindex && !Buffs.IsDebuff(iCasterIndex, iModifier)) {
            //         pSelf.AddClass("show_ability_charges");
            //         this.updateDialogVariables("ability_charge_count", Buffs.GetStackCount(iCasterIndex, iModifier));
            //         fCooldownLength = Buffs.GetDuration(iCasterIndex, iModifier) == -1 ? 0 : Buffs.GetDuration(iCasterIndex, iModifier);
            //         let fPercent = FuncHelper.Clamp(Buffs.GetRemainingTime(iCasterIndex, iModifier) / fCooldownLength, 0, 1);
            //         let fChargesPercent = 1 - fPercent;
            //         this.UpdateState({ "m_charges_percent": fChargesPercent })
            //         break;
            //     }
            // }
        }

        if (bInAbilityPhase) {
            if (this.fCastStartTime == undefined || this.fCastStartTime == -1) this.fCastStartTime = Game.GetGameTime() - Game.GetGameFrameTime();
            let fCastTime = FuncHelper.Clamp(Game.GetGameTime() - this.fCastStartTime, 0, Abilities.GetCastPoint(overrideentityindex));
            let fPercent = fCastTime / Abilities.GetCastPoint(overrideentityindex);
            this.UpdateState({ "m_cooldown_percent": fPercent })
        } else {
            this.fCastStartTime = -1;
        }
        if (!bCooldownReady) {
            let fCooldownTimeRemaining = Abilities.GetCooldownTimeRemaining(overrideentityindex);
            let fPercent = (fCooldownTimeRemaining / fCooldownLength);
            if (fCooldownLength == 0) fPercent = 1;
            this.UpdateState({ "m_cooldown_percent": fPercent });
            this.UpdateState({ "cooldown_timer": Math.ceil(fCooldownTimeRemaining) });
            // this.updateDialogVariables("cooldown_timer", Math.ceil(fCooldownTimeRemaining));
            this.intervalRefresh();
        }
        let pShine = pSelf.FindChildTraverse("Shine");
        if (pShine) {
            if (overrideentityindex != -1 && ((bCooldownReady == true && bInAbilityPhase == false && bInAbilityPhase != m_in_ability_phase) || (bCooldownReady == true && bCooldownReady != m_cooldown_ready))) {
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

            this.updateDialogVariables("item_charge_count", iChargeCount);
            this.updateDialogVariables("item_alt_charge_count", iAltChargeCount);
        }
        this.UpdateState({ "m_in_ability_phase": bInAbilityPhase })
        this.UpdateState({ "m_cooldown_ready": bCooldownReady })

    }

    private updateDialogVariables(k: string, v: any) {
        let dialogVariables = this.GetState("dialogVariables", {} as { [K: string]: any });
        dialogVariables[k] = v;
        dialogVariables = Object.assign({}, dialogVariables);
        this.UpdateState({ "dialogVariables": dialogVariables });
    }
    private onbtn_leftclick() {
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
            this.intervalRefresh();
        }
    }
    private onbtn_rightclick() {
        const overrideentityindex = this.props.overrideentityindex!;
        const draggable = this.props.draggable!;
        const slot = this.props.slot!;
        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
            if (Abilities.IsItem(overrideentityindex)) {
                if (!$.GetContextPanel().BHasClass("dragging") && overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                    let iCasterIndex = Abilities.GetCaster(overrideentityindex);
                    let sItemName = Abilities.GetAbilityName(overrideentityindex);
                    let bSlotInStash = slot >= GameEnum.Dota2.EDotaItemSlot.DOTA_ITEM_STASH_MIN;
                    let bOwned = Entities.GetPlayerOwnerID(iCasterIndex) == Players.GetLocalPlayer();
                    let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
                    let bSellable = Items.IsSellable(overrideentityindex) && Items.CanBeSoldByLocalPlayer(overrideentityindex);
                    let bDisassemble = Items.IsDisassemblable(overrideentityindex) && bControllable && !bSlotInStash;
                    let bAlertable = Items.IsAlertableItem(overrideentityindex);
                    let bLocked = ItemHelper.IsItemLocked(overrideentityindex);
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
                    // let pContextMenu = $.CreatePanel("ContextMenuScript", self, "");
                    // pContextMenu.AddClass("ContextMenu_NoArrow");
                    // pContextMenu.AddClass("ContextMenu_NoBorder");

                    // let pContentsPanel = pContextMenu.GetContentsPanel() as InventoryItemContextMenu;
                    // pContentsPanel.BLoadLayout("file://{resources}/layout/custom_game/context_menu/context_menu_inventory_item/context_menu_inventory_item.xml", false, false);
                    // pContentsPanel.SetItem(overrideentityindex, self);
                    // pContentsPanel.SetHasClass("bSellable", bSellable);
                    // pContentsPanel.SetHasClass("bDisassemble", bDisassemble);
                    // pContentsPanel.SetHasClass("bShowInShop", bShowInShop);
                    // pContentsPanel.SetHasClass("bDropFromStash", bDropFromStash);
                    // pContentsPanel.SetHasClass("bAlertable", bAlertable);
                    // pContentsPanel.SetHasClass("bMoveToStash", bMoveToStash);
                    // pContentsPanel.SetHasClass("bLocked", bLocked);
                    // // pContentsPanel.SetHasClass("bCasting", castingName != "");
                    // pContentsPanel.SetHasClass("bAutocast", bAutocast);
                    // pContentsPanel.SetHasClass("bMoveToTraining", bMoveToTraining);
                    // pContentsPanel.SetHasClass("bSacrifice", ItemHelper.GetItemRarity(Abilities.GetAbilityName(overrideentityindex)) == 6);
                    // pContentsPanel.SetDialogVariable("itemname", $.Localize("DOTA_Tooltip_ability_" + castingName));
                    // if (castingName != "") {
                    //   this.updateDialogVariables("int_value", Number(GameUI.CustomUIConfig().ItemsKv[castingName].CastingCrystalCost || 0));
                    // }
                }
            }
            if (Abilities.IsAutocast(overrideentityindex)) {
                Game.PrepareUnitOrders({
                    OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
                    AbilityIndex: overrideentityindex,
                    UnitIndex: Abilities.GetCaster(overrideentityindex),
                });
            }
            // const pSelf = this.__root__.current!;
            // pSelf.SetHasClass("auto_cast_enabled", !Abilities.GetAutoCastState(overrideentityindex));
            this.intervalRefresh()
        }
    }
    private onbtn_moveover() {
        const overrideentityindex = this.props.overrideentityindex!;
        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
            const ccMainPanel = CCMainPanel.GetInstance()!;
            let dialoginfo = {} as any;
            if (Abilities.IsItem(overrideentityindex)) {
                dialoginfo = {
                    cls: CCAbilityInfoDialog,
                    props: {
                        abilityname: Abilities.GetAbilityName(overrideentityindex),
                        castentityindex: overrideentityindex,
                        level: Abilities.GetLevel(overrideentityindex),
                    },
                    posRight: true,
                };
            }
            else {
                dialoginfo = {
                    cls: CCAbilityInfoDialog,
                    props: {
                        abilityname: Abilities.GetAbilityName(overrideentityindex),
                        castentityindex: overrideentityindex,
                        level: Abilities.GetLevel(overrideentityindex),
                    },
                    posRight: true,
                };
            }
            ccMainPanel.ShowCustomToolTip(this.AbilityButton.current!, dialoginfo);
        }
    }
    private onbtn_moveout() {
        const ccMainPanel = CCMainPanel.GetInstance()!;
        ccMainPanel.HideToolTip();
    }
    render() {
        const m_is_item = this.GetState("m_is_item", false);
        const m_max_level = this.GetState("m_max_level", 0);
        const m_level = this.GetState("m_level", 0);
        const cooldown_timer = this.GetState("cooldown_timer", 0);
        const m_charges_percent = this.GetState("m_charges_percent", 1);
        const m_cooldown_percent = this.GetState("m_cooldown_percent", 1);
        const dialogVariables = this.GetState("dialogVariables", {}) as any;
        const overrideentityindex = this.props.overrideentityindex!;
        const draggable = this.props.draggable!;
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} {...this.initRootAttrs()}>
                <Panel id="ButtonAndLevel" require-composition-layer="true" always-cache-composition-layer="true" hittest={false}>
                    <CCLevelUpBurstFXContainer m_is_item={m_is_item} />
                    <Panel id="ButtonWithLevelUpTab" hittest={false}>
                        <CCLevelUpTab overrideentityindex={overrideentityindex} abilityButton={this.AbilityButton} />
                        <Panel id="LevelUpLight" hittest={false} />
                        <Panel hittest={false} id="ButtonWell" >
                            <Panel hittest={false} id="AutocastableBorder" />
                            <Panel id="AutoCastingContainer" hittest={false}>
                                {/* {!m_is_item &&
							} */}
                                <DOTAScenePanel id="AutoCasting" map="scenes/hud/autocasting" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />
                            </Panel>
                            <Panel id="ButtonSize" >
                                <Panel id="AbilityButton" draggable={draggable} ref={this.AbilityButton}
                                    onactivate={(self) => { this.onbtn_leftclick() }}
                                    oncontextmenu={(self) => this.onbtn_rightclick()}
                                    onmouseover={(self) => this.onbtn_moveover()}
                                    onmouseout={(self) => this.onbtn_moveout()} >
                                    <DOTAAbilityImage id="AbilityImage" showtooltip={false} hittest={false} ref={this.AbilityImage} />
                                    {/* scaling="stretch-to-fit-x-preserve-aspect" */}
                                    <DOTAItemImage id="ItemImage" contextEntityIndex={overrideentityindex} showtooltip={false} hittest={false} hittestchildren={false} />
                                    <Panel hittest={false} id="AbilityBevel" />
                                    <Panel hittest={false} id="ShineContainer" >
                                        <Panel hittest={false} id="Shine" />
                                    </Panel>
                                    <Panel id="TopBarUltimateCooldown" hittest={false} />
                                    <Panel id="Cooldown" hittest={false}>
                                        <Panel id="CooldownOverlay" hittest={false} style={{ clip: "radial(50.0% 50.0%, 0.0deg, " + - FuncHelper.ToFiniteNumber(m_cooldown_percent) * 360 + "deg)" }} />
                                        <Label id="CooldownTimer" className="MonoNumbersFont" text={Math.ceil(cooldown_timer) + ""} hittest={false} />
                                    </Panel>
                                    <Panel id="ActiveAbility" hittest={false} />
                                    <Panel id="InactiveOverlay" hittest={false} />
                                    <Label id="ItemCharges" text={dialogVariables.item_charge_count} hittest={false} />
                                    <Label id="ItemAltCharges" text={dialogVariables.item_alt_charge_count} hittest={false} />
                                </Panel>
                                <Panel hittest={false} id="ActiveAbilityBorder" />
                                <Panel hittest={false} id="PassiveAbilityBorder" />
                                <Panel hittest={false} id="AutocastableAbilityBorder" />
                                <Panel hittest={false} id="GoldCostBG" />
                                <Label hittest={false} id="GoldCost" text={dialogVariables.gold_cost} />
                                <Panel hittest={false} id="ManaCostBG" />
                                <Label hittest={false} id="ManaCost" text={dialogVariables.mana_cost} />
                                {/* <Label hittest={false} id="NeutralItemTier" localizedText="{d:neutral_item_tier_number}" dialogVariables={dialogVariables} /> */}
                                <Panel hittest={false} id="CombineLockedOverlay" />
                                <Panel hittest={false} id="SilencedOverlay" />
                                <Panel hittest={false} id="AbilityStatusOverlay" />
                                <Panel hittest={false} id="UpgradeOverlay" />
                                <Panel hittest={false} id="DropTargetHighlight" />
                            </Panel>
                        </Panel>
                        <CCHotkeyContainer info={dialogVariables} />
                        <CircularProgressBar id="AbilityCharges" hittest={false} hittestchildren={false} value={m_charges_percent}>
                            <Label text={dialogVariables.ability_charge_count} />
                        </CircularProgressBar>
                    </Panel>
                    <Panel hittest={false} id="AbilityLevelContainer" >
                        {m_max_level > 0 && [...Array(m_max_level).keys()].map((key) => {
                            return <Panel key={key.toString()} className={CSSHelper.ClassMaker("LevelPanel", { "next_level": key == m_level, "active_level": key < m_level })} />;
                        })}
                    </Panel>
                </Panel>
            </Panel>
        )
    }
}


class CCLevelUpBurstFXContainer extends CCPanel<{ m_is_item: boolean }> {
    render() {
        const m_is_item = this.props.m_is_item;
        return (
            <Panel id="LevelUpBurstFXContainer" hittest={false} ref={this.__root__} {...this.initRootAttrs()}>
                {!m_is_item && <DOTAScenePanel id="LevelUpBurstFX" map="scenes/hud/levelupburst" renderdeferred={false} rendershadows={false} camera="camera_1" hittest={false} particleonly={true} />}
            </Panel >
        );
    }

}



class CCLevelUpTab extends CCPanel<{ overrideentityindex: AbilityEntityIndex, abilityButton: React.RefObject<Panel> }, Button> {
    render() {
        const overrideentityindex = this.props.overrideentityindex;
        const AbilityButton = this.props.abilityButton;
        return (
            <Button id="LevelUpTab" hittest={true} onactivate={
                () => {
                    if (Entities.IsValidEntity(overrideentityindex))
                        Abilities.AttemptToUpgrade(overrideentityindex);
                }}
                onmouseover={(self) => {
                    if (AbilityButton.current) {
                        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
                            // GameUI.CustomUIConfig().ShowAbilityTooltip(pAbilityButton, Abilities.GetAbilityName(overrideentityindex), Abilities.GetCaster(overrideentityindex), slot);
                        }
                    }
                }} onmouseout={(self) => {
                    if (AbilityButton.current) {
                        // GameUI.CustomUIConfig().HideAbilityTooltip(pAbilityButton);
                    }
                }}
                ref={this.__root__} {...this.initRootAttrs()}>
                <Panel id="LevelUpButton">
                    <Panel id="LevelUpIcon" />
                </Panel>
                <Panel id="LearnModeButton" hittest={false} />
            </Button>
        );
    }

}


class CCHotkeyContainer extends CCPanel<{ info: { [K: string]: string } }>{
    render() {
        const info = this.props.info;
        return (
            <Panel id="HotkeyContainer" hittest={false} hittestchildren={false} ref={this.__root__} {...this.initRootAttrs()}>
                <Panel id="Hotkey">
                    <Label id="HotkeyText" localizedText="{s:hotkey}" dialogVariables={info} />
                </Panel>
                <Panel id="HotkeyModifier">
                    <Label id="AltText" localizedText="#DOTA_Keybind_ALT" dialogVariables={info} />
                </Panel>
                <Panel id="HotkeyCtrlModifier">
                    <Label id="CtrlText" localizedText="#DOTA_Keybind_CTRL" dialogVariables={info} />
                </Panel>
            </Panel>
        );
    }
}