import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { CCAbilityPanel, ICCAbilityPanel } from "../CCAbility/CCAbilityPanel";
import { CCPanel } from "../CCPanel/CCPanel";
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
        iUnlockStar: -1,
        isBackpack: false,
    }
    onBtn_dragend(item_slot: number) {
        let pos = GameUI.GetCursorPosition();
        let selectedEntityid = Players.GetLocalPlayerPortraitUnit();
        if (!Entities.IsControllableByPlayer(selectedEntityid, Players.GetLocalPlayer())) { return }
        let itementityid = Entities.GetItemInSlot(selectedEntityid, item_slot);
        let curEntity = Entities.GetCursorUnit(DOTATeam_t.DOTA_TEAM_GOODGUYS);
        if (curEntity > -1) {
            GGameScene.Local.CourierBagComp.GiveItemToNpc(curEntity, item_slot, itementityid)
            // let entitys = GameUI.FindScreenEntities(pos);
            // for (let info of entitys) {
            //     if (info.accurateCollision) {
            //         NetHelper.SendToLua(GameProtocol.Protocol.req_ITEM_GIVE_NPC, {
            //             npc: info.entityIndex,
            //             slot: item_slot,
            //             itementityid: itementityid
            //         })
            //         break;
            //     }
            // }
        }
        else {
            // 走过去扔
            // if (itementityid > -1) {
            //     Game.DropItemAtCursor(selectedEntityid, itemindex)
            // }
            // 直接扔
            let worldpos = GameUI.GetScreenWorldPosition(pos)!;
            GGameScene.Local.CourierBagComp.DropItem(item_slot, itementityid, worldpos)
        }
    };
    render() {
        const slot = this.props.slot!;
        const isBackpack = this.props.isBackpack!;
        const draggable = this.props.draggable!;
        const dragtype = this.props.dragtype!;
        const iUnlockStar = this.props.iUnlockStar!;
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
                    iUnlockStar={iUnlockStar}
                    draggable={draggable}
                    dragtype={dragtype}
                    dragdropcallback={(pDraggedPanel, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
                        let iAbilityIndex = pDraggedPanel.overrideentityindex!;
                        let m_Slot = pDraggedPanel.m_Slot;
                        // GLogHelper.print("dragdropcallback", dragtype, m_Slot, slot)
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
                        if (pDraggedPanel.m_DragCompleted == false) {
                            let iAbilityIndex = pDraggedPanel.overrideentityindex;
                            let m_Slot = pDraggedPanel.m_Slot!;
                            if (iAbilityIndex != -1 && m_Slot != -1) {
                                this.onBtn_dragend(m_Slot)
                            }
                        }
                    }} />
            </Panel>
        );
    }
}