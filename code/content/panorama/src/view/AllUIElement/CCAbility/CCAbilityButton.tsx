import React, { createRef } from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCAbilityButton.less";

interface ICCAbilityButton {
    contextEntityIndex: AbilityEntityIndex,
    m_level?: number,
    iUnlockStar?: number,
    m_cooldown_percent?: number;
    dialogVariables?: {
        cooldown_timer: number;
        item_charge_count: number;
        item_alt_charge_count: number;
    }
}


export class CCAbilityButton extends CCPanel<ICCAbilityButton> {
    AbilityImage = createRef<AbilityImage>();

    static defaultProps = {
        contextEntityIndex: -1,
    }

    CastRangeParticleID: ParticleID;
    private onAbilityButtonclick_left() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        if (contextEntityIndex != -1 && Entities.IsValidEntity(contextEntityIndex)) {
            // m_bToggleState = Abilities.GetToggleState(contextEntityIndex);
            let iCasterIndex = Abilities.GetCaster(contextEntityIndex);
            if (GameUI.IsAltDown()) {
                Abilities.PingAbility(contextEntityIndex);
                return;
            }
            if (GameUI.IsControlDown()) {
                Abilities.AttemptToUpgrade(contextEntityIndex);
                return;
            }
            // 施法范围
            let fCastRange = Abilities.GetCastRange(contextEntityIndex);
            if (this.CastRangeParticleID) {
                Particles.DestroyParticleEffect(this.CastRangeParticleID, false);
                this.CastRangeParticleID = null as any;
            }
            if (fCastRange > 0) {
                this.CastRangeParticleID = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, -1 as EntityIndex);
                Particles.SetParticleControlEnt(this.CastRangeParticleID, 0, iCasterIndex, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", Entities.GetAbsOrigin(iCasterIndex), true);
                Particles.SetParticleControl(this.CastRangeParticleID, 1, [fCastRange, 1, 1]);
            }
            if (Abilities.IsItem(contextEntityIndex)) {
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
                                Position: [contextEntityIndex, 16300, 0],
                            });
                            // GameEvents.SendCustomGameEventToServer("ability_spell_item_target", {
                            // 	ability_index: iAbilityIndex,
                            // 	item_index: contextEntityIndex,
                            // });
                            // GameEvents.SendEventClientSide("custom_get_active_ability", { entindex: -1 as AbilityEntityIndex });
                            // Abilities.ExecuteAbility(iAbilityIndex, Abilities.GetCaster(iAbilityIndex), true);
                        }
                        return;
                    }
                }
            }
            Abilities.ExecuteAbility(contextEntityIndex, iCasterIndex, false);
        }
    }
    private onAbilityButtonclick_right() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        const slot = this.props.slot!;
        // if (contextEntityIndex != -1 && Entities.IsValidEntity(contextEntityIndex)) {
        //     if (Abilities.IsItem(contextEntityIndex)) {
        //         if (!$.GetContextPanel().BHasClass("dragging") && contextEntityIndex != -1 && Entities.IsValidEntity(contextEntityIndex)) {
        //             let iCasterIndex = Abilities.GetCaster(contextEntityIndex);
        //             let sItemName = Abilities.GetAbilityName(contextEntityIndex);
        //             let bSlotInStash = slot >= DOTA_ITEM_STASH_MIN;
        //             let bOwned = Entities.GetPlayerOwnerID(iCasterIndex) == Players.GetLocalPlayer();
        //             let bControllable = Entities.IsControllableByPlayer(iCasterIndex, Players.GetLocalPlayer());
        //             let bSellable = Items.IsSellable(contextEntityIndex) && Items.CanBeSoldByLocalPlayer(contextEntityIndex);
        //             let bDisassemble = Items.IsDisassemblable(contextEntityIndex) && bControllable && !bSlotInStash;
        //             let bAlertable = Items.IsAlertableItem(contextEntityIndex);
        //             let bLocked = IsItemLocked(contextEntityIndex);
        //             let bAutocast = Abilities.IsAutocast(contextEntityIndex);
        //             // let bShowInShop = Items.IsPurchasable(contextEntityIndex);
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
        //             pContentsPanel.SetItem(contextEntityIndex, self);
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
        //             pContentsPanel.SetHasClass("bSacrifice", GetItemRarity(Abilities.GetAbilityName(contextEntityIndex)) == 6);
        //             // pContentsPanel.SetDialogVariable("itemname", $.Localize("DOTA_Tooltip_ability_" + castingName));
        //             // if (castingName != "") {
        //             // 	pContentsPanel.SetDialogVariableInt("int_value", Number(GameUI.CustomUIConfig().ItemsKv[castingName].CastingCrystalCost || 0));
        //             // }
        //         }
        //         return;
        //     }
        //     if (Abilities.IsAutocast(contextEntityIndex)) {
        //         Game.PrepareUnitOrders({
        //             OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_CAST_TOGGLE_AUTO,
        //             AbilityIndex: contextEntityIndex,
        //             UnitIndex: Abilities.GetCaster(contextEntityIndex),
        //         });
        //     }
        // }
    }
    private onAbilityButtonMouseOver() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        if (contextEntityIndex != -1 && Entities.IsValidEntity(contextEntityIndex)) {
            // if (Abilities.IsItem(contextEntityIndex)) {
            //     GameEvents.SendEventClientSide("custom_hover_item", {
            //         item_entindex: contextEntityIndex,
            //     });
            // }
            // GameUI.CustomUIConfig().ShowAbilityTooltip(self, Abilities.GetAbilityName(contextEntityIndex), Abilities.GetCaster(contextEntityIndex), slot);
        }
    }
    private onAbilityButtonMouseOut() {
        // if (Abilities.IsItem(contextEntityIndex)) {
        //     GameEvents.SendEventClientSide("custom_hover_item", {
        //         item_entindex: -1 as ItemEntityIndex,
        //     });
        // }
        // GameUI.CustomUIConfig().HideAbilityTooltip(self);
    }
    render() {
        const contextEntityIndex = this.props.contextEntityIndex!;
        const m_level = this.props.m_level!;
        const m_cooldown_percent = this.props.m_cooldown_percent!;
        const dialogVariables = this.props.dialogVariables!;

        return <Panel className="CCAbilityButton"
            onactivate={(self) => { this.onAbilityButtonclick_left() }}
            oncontextmenu={(self) => { this.onAbilityButtonclick_right(); }}
            onmouseover={(self) => { this.onAbilityButtonMouseOver() }}
            onmouseout={(self) => { this.onAbilityButtonMouseOut() }}
            ref={this.__root__}
            {...this.initRootAttrs()}
        >
            <DOTAAbilityImage id="AbilityImage" contextEntityIndex={contextEntityIndex} showtooltip={true} hittest={false} ref={this.AbilityImage} />
            {/* scaling="stretch-to-fit-x-preserve-aspect" */}
            {/* <DOTAItemImage id="ItemImage" contextEntityIndex={contextEntityIndex as any} showtooltip={false} hittest={false} hittestchildren={false} /> */}
            {/* <CustomItemImage id="ItemImage" showtooltip={false} contextEntityIndex={contextEntityIndex as ItemEntityIndex} iLevel={m_level} iUnlockStar={iUnlockStar} /> */}
            <Panel hittest={false} id="AbilityBevel" />
            <Panel hittest={false} id="ShineContainer" >
                <Panel hittest={false} id="Shine" />
            </Panel>
            <Panel id="TopBarUltimateCooldown" hittest={false} />
            <Panel id="Cooldown" hittest={false}>
                <Panel id="CooldownOverlay" hittest={false} style={{ clip: "radial(50.0% 50.0%, 0.0deg, " + - FuncHelper.ToFiniteNumber(m_cooldown_percent) * 360 + "deg)" }} />
                <Label id="CooldownTimer" className="MonoNumbersFont" localizedText="{d:cooldown_timer}" hittest={false} dialogVariables={dialogVariables} />
            </Panel>
            <Panel id="ActiveAbility" hittest={false} />
            <Panel id="InactiveOverlay" hittest={false} />
            <Label id="ItemCharges" localizedText="{d:item_charge_count}" hittest={false} dialogVariables={dialogVariables} />
            <Label id="ItemAltCharges" localizedText="{d:item_alt_charge_count}" hittest={false} dialogVariables={dialogVariables} />
            {this.props.children}
            {this.__root___childs}
        </Panel>
    }
}


