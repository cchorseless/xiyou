import React, { createRef, PureComponent } from "react";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";
import { FuncHelper } from "../../../helper/FuncHelper";


interface ICCAbilityButton {
    draggable?: boolean;
    overrideentityindex?: ItemEntityIndex
}


export class CCAbilityButton extends CCPanel<ICCAbilityButton> {
    AbilityImage: React.RefObject<AbilityImage>;
    onInitUI() {
        this.AbilityImage = createRef<AbilityImage>();
    }

    static defaultProps = {
        overrideentityindex: -1,
        draggable: false,
    }

    CastRangeParticleID: ParticleID;
    private onAbilityButtonclick_left() {
        const overrideentityindex = this.props.overrideentityindex!;
        if (overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex)) {
            // m_bToggleState = Abilities.GetToggleState(overrideentityindex);
            let iCasterIndex = Abilities.GetCaster(overrideentityindex);
            if (GameUI.IsAltDown()) {
                Abilities.PingAbility(overrideentityindex);
                return;
            }
            if (GameUI.IsControlDown()) {
                Abilities.AttemptToUpgrade(overrideentityindex);
                return;
            }
            // 施法范围
            let fCastRange = Abilities.GetCastRange(overrideentityindex);
            if (this.CastRangeParticleID) {
                Particles.DestroyParticleEffect(this.CastRangeParticleID, false);
                this.CastRangeParticleID = null as any;
            }
            if (fCastRange > 0) {
                this.CastRangeParticleID = Particles.CreateParticle("particles/ui_mouseactions/range_display.vpcf", ParticleAttachment_t.PATTACH_CUSTOMORIGIN, -1 as EntityIndex);
                Particles.SetParticleControlEnt(this.CastRangeParticleID, 0, iCasterIndex, ParticleAttachment_t.PATTACH_ABSORIGIN_FOLLOW, "", Entities.GetAbsOrigin(iCasterIndex), true);
                Particles.SetParticleControl(this.CastRangeParticleID, 1, [fCastRange, 1, 1]);
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
        const overrideentityindex = this.props.overrideentityindex!;
        const bIsValid = overrideentityindex != -1 && Entities.IsValidEntity(overrideentityindex);
        const dialogVariables: { [x: string]: any; } = {};
        const bIsItem = Abilities.IsItem(overrideentityindex) && bIsValid;
        const contextEntityIndex = (bIsItem ? -1 : overrideentityindex) as AbilityEntityIndex;
        const iCasterIndex = Abilities.GetCaster(overrideentityindex);
        const bCooldownReady = (!bIsValid || Entities.IsEnemy(iCasterIndex)) ? true : Abilities.IsCooldownReady(overrideentityindex);
        let fCooldownLength = Abilities.GetCooldownLength(overrideentityindex);
        let fChargesPercent = 1;
        if (!bCooldownReady) {
            let fCooldownTimeRemaining = Abilities.GetCooldownTimeRemaining(overrideentityindex);
            let fPercent = (fCooldownTimeRemaining / fCooldownLength);
            if (fCooldownLength == 0) fPercent = 1;
            fChargesPercent = 1 - fPercent;
            dialogVariables["cooldown_timer"] = Math.ceil(fCooldownTimeRemaining);
        }
        let show_item_charges = false;
        let show_item_alt_charges = false;
        let muted = false;
        if (bIsItem) {
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
            this.__root___isValid && (
                <Panel
                    id="CC_AbilityButton"
                    onactivate={(self) => { this.onAbilityButtonclick_left() }}
                    oncontextmenu={(self) => { this.onAbilityButtonclick_right(); }}
                    onmouseover={(self) => { this.onAbilityButtonMouseOver() }}
                    onmouseout={(self) => { this.onAbilityButtonMouseOut() }}
                    ref={this.__root__}
                    {...this.initRootAttrs()}
                >
                    <DOTAAbilityImage id="AbilityImage" showtooltip={false} hittest={false} contextEntityIndex={contextEntityIndex} />
                    {bIsItem &&
                        <DOTAItemImage id="ItemImage" contextEntityIndex={overrideentityindex} scaling="stretch-to-fit-x-preserve-aspect" showtooltip={false} hittest={false} hittestchildren={false} />
                    }
                    <Panel hittest={false} id="AbilityBevel" />
                    <Panel hittest={false} id="ShineContainer">
                        <Panel hittest={false} id="Shine" />
                    </Panel>
                    <Panel id="TopBarUltimateCooldown" hittest={false} />
                    {!bCooldownReady &&
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
                    {/* <Label id="ItemTimer" text="{s:item_timer}" dialogVariables={{ item_timer: this.props.item_timer }} hittest={false} /> */}
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
