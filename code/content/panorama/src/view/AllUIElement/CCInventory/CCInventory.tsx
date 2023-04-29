import React from "react";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { PublicBagConfig } from "../../../../../scripts/tscripts/shared/PublicBagConfig";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCInventory.less";
import { CCInventorySlot } from "./CCInventorySlot";

interface ICCInventory extends NodePropsData {
}

interface ISlotInfo {
    iUnlockStar?: number,
    slot: number,
    overrideentityindex: ItemEntityIndex,
}
export class CCInventory extends CCPanel<ICCInventory> {

    updateSlots() {
        let aSlots: ISlotInfo[] = [];
        let iLocalPortraitUnit = Players.GetLocalPlayerPortraitUnit();
        let inventorylock = GBuildingEntityRoot.GetEntity(iLocalPortraitUnit)?.InventoryLock;
        for (let index = PublicBagConfig.DOTA_ITEM_SLOT_MIN; index <= PublicBagConfig.DOTA_ITEM_SLOT_MAX; index++) {
            let iItemIndex = Entities.GetItemInSlot(iLocalPortraitUnit, index);
            let iUnlockStar = -1;
            const iUnlockStars = inventorylock || {};
            if (iUnlockStars[index]) {
                iUnlockStar = iUnlockStars[index]
            }
            aSlots.push({
                overrideentityindex: iItemIndex,
                slot: index,
                iUnlockStar: iUnlockStar,
            });
        }
        let aBackpacks: ISlotInfo[] = [];
        for (let index = PublicBagConfig.DOTA_ITEM_BACKPACK_MIN; index <= PublicBagConfig.DOTA_ITEM_BACKPACK_MAX; index++) {
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
                    <Panel id="inventory_items" hittest={false} require-composition-layer={true} always-cache-composition-layer={true} >
                        <Panel id="InventoryContainer" hittest={true} draggable={true} >
                            <Panel id="inventory_list_container" hittest={false} >
                                <Panel id="inventory_list" className="inventory_list" hittest={false}  >
                                    {[...Array(3)].map((_, key) => {
                                        let data = Slots[key];
                                        return <CCInventorySlot key={key.toString()} id={"inventory_slot_" + key} overrideentityindex={data.overrideentityindex} iUnlockStar={data.iUnlockStar} slot={data.slot} />
                                    })}
                                </Panel>
                                <Panel id="inventory_list2" className="inventory_list" hittest={false}  >
                                    {[...Array(3)].map((_, key) => {
                                        let data = Slots[key + 3];
                                        return <CCInventorySlot key={key.toString()} id={"inventory_slot_" + (key + 3)} overrideentityindex={data.overrideentityindex} iUnlockStar={data.iUnlockStar} slot={data.slot} />
                                    })}
                                </Panel>
                            </Panel>
                            <Panel id="inventory_backpack_list" hittest={false}  >
                                {Backpacks.map((data, key) => {
                                    return <CCInventorySlot key={key.toString()} id={"inventory_slot_" + (key + PublicBagConfig.DOTA_ITEM_BACKPACK_MIN)} overrideentityindex={data.overrideentityindex} slot={data.slot} isBackpack={true} />
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