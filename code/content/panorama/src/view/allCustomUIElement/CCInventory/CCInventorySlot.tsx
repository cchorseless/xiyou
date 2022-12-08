import { PanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { GameEnum } from "../../../../../../game/scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../../helper/CSSHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { CCAbilityPanel, ICCAbilityPanel } from "../CCAbility/CCAbilityPanel";
import { CCPanel } from "../CCPanel/CCPanel";
// import "./CCInventorySlot.less";
interface ICCInventorySlot extends ICCAbilityPanel {
    isBackpack?: boolean,
}


export class CCInventorySlot extends CCPanel<ICCInventorySlot> {
    static defaultProps = {
        overrideentityindex: -1,
        overridedisplaykeybind: DOTAKeybindCommand_t.DOTA_KEYBIND_NONE,
        draggable: true,
        dragtype: "InventorySlot",
        slot: -1,
        isBackpack: false,
    }
    onBtn_dragend(item_slot: number) {
        let pos = GameUI.GetCursorPosition();
        let entitys = GameUI.FindScreenEntities(pos);
        let selectedEntityid = Players.GetLocalPlayerPortraitUnit();
        let itementityid = Entities.GetItemInSlot(selectedEntityid, item_slot);
        if (entitys.length > 0) {
            for (let info of entitys) {
                if (info.accurateCollision) {
                    NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_GIVE_NPC, {
                        npc: info.entityIndex,
                        slot: item_slot,
                        itementityid: itementityid
                    })
                    break;
                }
            }
        }
        else {
            // 走过去扔
            let itemindex = Entities.GetItemInSlot(selectedEntityid, item_slot);
            if (itemindex > -1) {
                Game.DropItemAtCursor(selectedEntityid, itemindex)
            }
            // 直接扔
            // let worldpos = GameUI.GetScreenWorldPosition(pos)!;
            // NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_DROP_POSITION, {
            //     pos: { x: worldpos[0], y: worldpos[1], z: worldpos[2] },
            //     slot: item_slot,
            //     itementityid: itementityid
            // })
        }
    };
    render() {
        const slot = this.props.slot!;
        const isBackpack = this.props.isBackpack!;
        const draggable = this.props.draggable!;
        const dragtype = this.props.dragtype!;
        const overrideentityindex = this.props.overrideentityindex!;
        const overridedisplaykeybind = this.props.overridedisplaykeybind!;
        return (
            this.__root___isValid &&
            <Panel id="CC_InventorySlot" ref={this.__root__} {...this.initRootAttrs()}>
                <CCAbilityPanel
                    className={CSSHelper.ClassMaker("InventoryItem", "inventory", { "BackpackSlot": isBackpack })}
                    overrideentityindex={overrideentityindex}
                    overridedisplaykeybind={overridedisplaykeybind}
                    slot={slot}
                    draggable={draggable}
                    dragtype={dragtype}
                    dragdropcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
                        let iAbilityIndex = CSSHelper.GetPanelData(pDraggedPanel, "overrideentityindex") as any;
                        let m_Slot = CSSHelper.GetPanelData(pDraggedPanel, "m_Slot") as any;
                        if (iAbilityIndex != -1 && m_Slot != -1) {
                            let iCasterIndex = Abilities.GetCaster(iAbilityIndex);
                            Game.PrepareUnitOrders({
                                UnitIndex: iCasterIndex,
                                OrderType: dotaunitorder_t.DOTA_UNIT_ORDER_MOVE_ITEM,
                                TargetIndex: slot,
                                AbilityIndex: iAbilityIndex,
                                OrderIssuer: PlayerOrderIssuer_t.DOTA_ORDER_ISSUER_PASSED_UNIT_ONLY
                            });
                            return true;
                        }
                        return false;
                    }}
                    dragendcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
                        if (CSSHelper.GetPanelData(pDraggedPanel, "m_DragCompleted") == false) {
                            let iAbilityIndex = CSSHelper.GetPanelData(pDraggedPanel, "overrideentityindex") as any;
                            let m_Slot = CSSHelper.GetPanelData(pDraggedPanel, "m_Slot") as number;
                            if (iAbilityIndex != -1 && m_Slot != -1) {
                                this.onBtn_dragend(m_Slot)
                            }
                        }
                    }} />
            </Panel>
        );
    }
}