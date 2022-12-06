import { PanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
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
                    dragdropcallback={(pDraggedInfo, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
                        let iAbilityIndex = overrideentityindex;
                        if (iAbilityIndex != -1 && slot != -1) {
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
                    }}
                    dragendcallback={(pDraggedInfo, overrideentityindex, overridedisplaykeybind, slot, dragtype) => {
                        if (pDraggedInfo.m_DragCompleted == false) {
                            let iAbilityIndex = overrideentityindex;
                            if (iAbilityIndex != -1) {
                                let iCasterIndex = Abilities.GetCaster(iAbilityIndex);
                                Game.DropItemAtCursor(iCasterIndex, iAbilityIndex);
                            }
                        }
                    }} />
            </Panel>
        );
    }
}