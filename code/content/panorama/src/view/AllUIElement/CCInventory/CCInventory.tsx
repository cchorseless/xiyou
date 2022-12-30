import React, { createRef, PureComponent } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { CCInventorySlot } from "./CCInventorySlot";
import "./CCInventory.less";

interface ICCInventory extends NodePropsData {
}

interface ISlotInfo {

}
export class CCInventory extends CCPanel<ICCInventory> {


    updateSlots() {
        let aSlots = [];
        let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        for (let index = GameEnum.Dota2.EDotaItemSlot.DOTA_ITEM_SLOT_MIN; index <= GameEnum.Dota2.EDotaItemSlot.DOTA_ITEM_SLOT_MAX; index++) {
            let iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, index);
            aSlots.push({
                overrideentityindex: iItemIndex,
                slot: index,
            });
        }
        let aBackpacks = [];
        for (let index = GameEnum.Dota2.EDotaItemSlot.DOTA_ITEM_BACKPACK_MIN; index <= GameEnum.Dota2.EDotaItemSlot.DOTA_ITEM_BACKPACK_MAX; index++) {
            let iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, index);
            aBackpacks.push({
                overrideentityindex: iItemIndex,
                slot: index,
            });
        }
        this.UpdateState({ Slots: aSlots });
        this.UpdateState({ Backpacks: aBackpacks });
    }

    onInitUI() {
        this.addEvent();
        this.updateSlots()
    }
    addEvent() {
        const eventList = [
            GameEnum.GameEvent.dota_inventory_changed,
            GameEnum.GameEvent.dota_player_update_selected_unit,
            GameEnum.GameEvent.dota_player_update_query_unit,
        ]
        eventList.forEach(event => {
            this.addGameEvent(event, (e) => {
                this.updateSlots();
            });
        })
    }
    render() {
        const Slots = this.GetState<ISlotInfo[]>("Slots")
        const Backpacks = this.GetState<ISlotInfo[]>("Backpacks")

        return (
            this.__root___isValid && (
                <Panel id="InventoryRoot" ref={this.__root__} {...this.initRootAttrs()}>
                    <Panel id="inventory_items" hittest={false} require-composition-layer="true" always-cache-composition-layer="true" >
                        <Panel id="InventoryContainer" hittest={true} draggable={true} >
                            <Panel id="inventory_list_container" hittest={false} >
                                <Panel id="inventory_list" className="inventory_list" hittest={false}  >
                                    {[...Array(3).keys()].map((key) => {
                                        return <CCInventorySlot key={key.toString()} id={"inventory_slot_" + key} {...Slots[key]} />
                                    })}
                                </Panel>
                                <Panel id="inventory_list2" className="inventory_list" hittest={false}  >
                                    {[...Array(3).keys()].map((key) => {
                                        return <CCInventorySlot key={key.toString()} id={"inventory_slot_" + (key + 3)} {...Slots[key + 3]} />
                                    })}
                                </Panel>
                            </Panel>
                            <Panel id="inventory_backpack_list" hittest={false}  >
                                {Backpacks.map((t, key) => {
                                    return <CCInventorySlot key={key.toString()} id={"inventory_slot_" + (key + GameEnum.Dota2.EDotaItemSlot.DOTA_ITEM_BACKPACK_MIN)} {...t} isBackpack={true} />
                                })}
                            </Panel>
                        </Panel>
                    </Panel>
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}