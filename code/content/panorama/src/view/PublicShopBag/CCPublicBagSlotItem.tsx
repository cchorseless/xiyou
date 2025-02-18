import { render } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { TipsHelper } from "../../helper/TipsHelper";

import { PublicBagConfig } from "../../../../scripts/tscripts/shared/PublicBagConfig";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import "./CCPublicBagSlotItem.less";

interface ICCPublicBagSlotItem extends NodePropsData {
    itemIndex: ItemEntityIndex, slot?: number, iType?: PublicBagConfig.EBagSlotType;
}



export class CCPublicBagSlotItem extends CCPanel<ICCPublicBagSlotItem> {

    static defaultProps = {
        itemIndex: -1 as ItemEntityIndex, slot: -1, iType: "BackPackSlot"
    }

    onStartUI() {
        this.addDragEvent()
    }

    addDragEvent() {
        const pSelf = this.__root__.current!;
        $.RegisterEventHandler("DragStart", pSelf, (pPanel: Panel, tDragCallbacks: DragSettings) => {
            const itemIndex = this.props.itemIndex!;
            const iType = this.props.iType!;
            const slot = this.props.slot!;
            TipsHelper.HideAbilityTooltip(pSelf);
            if (pSelf && pPanel == pSelf) {
                if (!Entities.IsValidEntity(itemIndex)) {
                    return true;
                }
                const ccMainPanel = CCMainPanel.GetInstance();
                ccMainPanel?.HideToolTip();
                // Tooltips.TogglePublicAreaNotice();
                let pDisplayPanel = $.CreatePanel("Panel", $.GetContextPanel(), "dragImage") as IDragItem;
                render(<CCItemImage itemname={Abilities.GetAbilityName(itemIndex)} contextEntityIndex={itemIndex} showtooltip={false} />, pDisplayPanel);
                pDisplayPanel.overrideentityindex = itemIndex;
                pDisplayPanel.m_pPanel = pPanel;
                pDisplayPanel.m_DragCompleted = false;
                pDisplayPanel.m_DragType = iType;
                pDisplayPanel.m_Slot = slot;
                pDisplayPanel.bIsDragItem = true;

                tDragCallbacks.displayPanel = pDisplayPanel;
                tDragCallbacks.offsetX = 0;
                tDragCallbacks.offsetY = 0;

                pPanel.AddClass("dragging_from");
                return true;
            }
        });
        $.RegisterEventHandler("DragLeave", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            if (pSelf && pPanel == pSelf) {
                if (pDraggedPanel.m_pPanel == undefined) {
                    return false;
                }
                if (!pDraggedPanel.bIsDragItem) {
                    return false;
                }
                if (pDraggedPanel.m_pPanel == pPanel) {
                    return false;
                }

                pPanel.RemoveClass("potential_drop_target");
                return true;
            }
            return false;
        });
        $.RegisterEventHandler("DragEnter", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            if (pSelf && pPanel == pSelf) {
                // 从哪里拖过来
                if (pDraggedPanel.m_pPanel == undefined) {
                    return true;
                }
                // 拖动类型
                if (!pDraggedPanel.bIsDragItem) {
                    return true;
                }
                // 自己拖动到自己
                if (pDraggedPanel.m_pPanel == pPanel) {
                    return true;
                }

                pPanel.AddClass("potential_drop_target");

                return true;
            }
            return false;
        });
        $.RegisterEventHandler("DragDrop", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            const itemIndex = this.props.itemIndex!;
            const iType = this.props.iType!;
            const slot = this.props.slot!;
            if (pSelf && pPanel == pSelf) {
                if (pDraggedPanel.m_pPanel == undefined) {
                    return true;
                }
                if (!pDraggedPanel.bIsDragItem) {
                    return true;
                }
                if (pDraggedPanel.m_pPanel == pSelf) {
                    pDraggedPanel.m_DragCompleted = true;
                    return false;
                }
                let iDraggedItemIndex = pDraggedPanel.overrideentityindex;
                if (iDraggedItemIndex && iDraggedItemIndex != -1) {
                    let from = pDraggedPanel.m_DragType! as PublicBagConfig.EBagSlotType;
                    let to = iType;
                    let fromslot = pDraggedPanel.m_Slot!;
                    let toslot = slot;
                    GGameScene.Local.CourierBagComp.MoveItem(from, fromslot, to, toslot, Abilities.GetCaster(iDraggedItemIndex));
                    pDraggedPanel.m_DragCompleted = true;
                    // // 合成格子
                    // if (iType == PublicBagConfig.EBagSlotType.EquipCombineSlot) {
                    //     if (!Items.IsCombinable(iDraggedItemIndex)) {
                    //         TipsHelper.showErrorMessage("dota_hud_error_uncombinable_item");
                    //         pDraggedPanel.m_DragCompleted = true;
                    //         return false;
                    //     }
                    // }
                    // GLogHelper.print("DragDrop", iDraggedItemIndex, slot, iType, pDraggedPanel.m_DragType)
                    // let iCasterIndex = Abilities.GetCaster(iDraggedItemIndex);
                    // switch (pDraggedPanel.m_DragType) {
                    //     case "BackPackSlot":
                    //         // if (pDraggedPanel.m_DragType_Extra == 2 && (itemIndex != -1 && !Items.IsCombinable(itemIndex))) {
                    //         //     TipsHelper.showErrorMessage("dota_hud_error_uncombinable_item");
                    //         //     pDraggedPanel.m_DragCompleted = true;
                    //         //     return false;
                    //         // }

                    //         pDraggedPanel.m_DragCompleted = true;
                    //         break;
                    //     case "InventorySlot":
                    //     case "OverHeadSlot":
                    //         Game.PrepareUnitOrders({
                    //             UnitIndex: iCasterIndex,
                    //             OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
                    //             TargetIndex: slot,
                    //             AbilityIndex: iDraggedItemIndex,
                    //             OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY
                    //         });
                    //         pDraggedPanel.m_DragCompleted = true;
                    //         break;
                    //     default:
                    //         break;
                    // }
                }
                return true;
            }
            return false;
        });
        $.RegisterEventHandler("DragEnd", pSelf, (pPanel: Panel, pDraggedPanel: IDragItem) => {
            // 这个panel是从这里拖出去的
            if (pSelf && pPanel == pSelf) {
                // Tooltips.TogglePublicAreaNotice();
                if (pDraggedPanel.m_DragCompleted == false) {
                    let iDraggedItemIndex = pDraggedPanel.overrideentityindex;
                    if (iDraggedItemIndex && iDraggedItemIndex != -1) {
                        let iCasterIndex = Abilities.GetCaster(iDraggedItemIndex);
                        switch (pDraggedPanel.m_DragType) {
                            case PublicBagConfig.EBagSlotType.BackPackSlot:
                            case PublicBagConfig.EBagSlotType.PublicBagSlot:
                            case PublicBagConfig.EBagSlotType.EquipCombineSlot:
                                let iTargetIndex = Entities.GetCursorUnit();
                                if (iTargetIndex != -1) {
                                    GGameScene.Local.CourierBagComp.MoveItem(
                                        pDraggedPanel.m_DragType,
                                        pDraggedPanel.m_Slot!,
                                        PublicBagConfig.EBagSlotType.InventorySlot,
                                        0,
                                        iTargetIndex);
                                    // Game.PrepareUnitOrders({
                                    //     OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_GIVE_ITEM,
                                    //     UnitIndex: iCasterIndex,
                                    //     TargetIndex: iTargetIndex,
                                    //     AbilityIndex: iDraggedItemIndex,
                                    // });
                                } else {
                                    TipsHelper.showErrorMessage("背包物品无法扔在地上")
                                    // Game.PrepareUnitOrders({
                                    //     OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_DROP_ITEM,
                                    //     UnitIndex: iCasterIndex,
                                    //     AbilityIndex: iDraggedItemIndex,
                                    //     Position: Game.ScreenXYToWorld(...GameUI.GetCursorPosition()),
                                    // });
                                }
                                break;
                            default:
                                Game.DropItemAtCursor(iCasterIndex, iDraggedItemIndex);
                                break;
                        }
                    }
                }
                pDraggedPanel.DeleteAsync(-1);
                pPanel.RemoveClass("dragging_from");
            }
        });
    }



    render() {
        const itemIndex = this.props.itemIndex!;
        const iCharge = Items.GetCurrentCharges(itemIndex);

        return (
            <Panel className={CSSHelper.ClassMaker("CC_PublicBagSlotItem", { "has_charge": iCharge > 0 })}
                ref={this.__root__} draggable={true} hittest={true} hittestchildren={false}
                onactivate={() => { }}
                onmouseover={(self) => {
                    if (itemIndex != -1 && Entities.IsValidEntity(itemIndex)) {
                        TipsHelper.ShowAbilityTooltip(self, Abilities.GetAbilityName(itemIndex), itemIndex,);
                    }
                }}
                onmouseout={(self) => {
                    TipsHelper.HideAbilityTooltip(self);
                }}
                oncontextmenu={(self) => {
                    if (itemIndex != -1 && Entities.IsValidEntity(itemIndex)) {
                        if (GameUI.IsControlDown()) {
                            Game.PrepareUnitOrders({
                                UnitIndex: Players.GetLocalPlayerPortraitUnit(),
                                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
                                TargetIndex: 7777,
                                AbilityIndex: itemIndex,
                                OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY
                            });
                        } else {
                            // ContextMenus.ShowItemContextMenu(self, {
                            //     iItemIndex: itemIndex,
                            //     slot: slot,
                            // });
                        }
                    }
                }}
            >
                <Panel id="BackPackSlotBorder" />
                {(itemIndex != -1 && Entities.IsValidEntity(itemIndex)) && <CCItemImage key={itemIndex + ""} contextEntityIndex={itemIndex} />}
                <Label id="itemCharge" text={iCharge} />
                <Panel id="DropTargetHighlight" />
            </Panel>
        );
    }
}