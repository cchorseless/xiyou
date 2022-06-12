/** Create By Editor*/
import React, { createRef, useState } from "react";
import { DotaUIHelper } from "../../helper/DotaUIHelper";
import { CustomAbilityList } from "../alldota2/ui_element/CustomAbilityList";
import { CustomHealthMana } from "../alldota2/ui_element/CustomHealthMana";
import { CustomInventory } from "../alldota2/ui_element/CustomInventory";
import { CustomPortraitGroup } from "../alldota2/ui_element/CustomPortraitGroup";
import { CustomStats } from "../alldota2/ui_element/CustomStats";
import { DacBoardPanelV0_UI } from "./DacBoardPanelV0_UI";
export class DacBoardPanelV0 extends DacBoardPanelV0_UI {
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();

    }

    onStartUI() {
        this.addNodeChildAt(this.NODENAME.panel_PortraitGroup, CustomPortraitGroup, {
            horizontalAlign: "left",
            verticalAlign: "bottom",
        })
        this.addNodeChildAt(this.NODENAME.panel_AbilityList, CustomAbilityList, {
            horizontalAlign: "left",
            verticalAlign: "bottom",
        })
        this.addNodeChildAt(this.NODENAME.panel_HealthMana, CustomHealthMana, {
            horizontalAlign: "left",
            verticalAlign: "bottom",
        })
        this.addNodeChildAt(this.NODENAME.panel_Inventory, CustomInventory, {
            horizontalAlign: "left",
            verticalAlign: "bottom",
        })
        this.addNodeChildAt(this.NODENAME.panel_PortraitGroup, CustomStats, {
            horizontalAlign: "left",
            verticalAlign: "bottom",
        })
        this.updateSelf()
        // let lower_hud = DotaUIHelper.FindDotaHudElement(DotaUIHelper.EDotaUIId.lower_hud);
        // if (lower_hud) {
        //     // lower_hud.SetParent(this.__root__.current!);
        //     lower_hud.FindChildTraverse("left_flare")!.visible = false;
        //     lower_hud.FindChildTraverse("xp")!.visible = false;
        //     lower_hud.FindChildTraverse("right_flare")!.visible = false;
        //     lower_hud.FindChildTraverse("center_bg")!.visible = false;
        //     lower_hud.FindChildTraverse("InventoryBG")!.style.opacity = "0";
        //     lower_hud.FindChildTraverse("HUDSkinInventoryBG")!.style.opacity = "0";
        //     lower_hud.FindChildTraverse("inventory_items")!.style.backgroundColor = null;
        //     lower_hud.FindChildTraverse("inventory_items")!.style.backgroundImage = null;
        //     lower_hud.FindChildTraverse("ButtonSize")!.style.backgroundColor = null;
        //     lower_hud.FindChildTraverse("ButtonSize")!.style.backgroundImage = null;
        //     // lower_hud.FindChildTraverse("ItemImage")!.AddClass;

        //     //天赋树
        //     lower_hud.FindChildTraverse("StatBranch")!.visible = false;
        //     lower_hud.FindChildTraverse("StatBranch")!.style.width = "0px";
        //     lower_hud.FindChildTraverse("AghsStatusContainer")!.visible = false;
        //     lower_hud.FindChildTraverse("AghsStatusContainer")!.style.width = "0px";

        //     //tp、中立物品栏位置的快捷键
        //     lower_hud.FindChildTraverse("inventory_tpscroll_HotkeyContainer")!.style.opacity = "0";
        //     lower_hud.FindChildTraverse("inventory_neutral_slot_HotkeyContainer")!.style.opacity = "0";
        //     lower_hud.FindChildTraverse("inventory_composition_layer_container")!.style.opacity = "0";
        //     lower_hud.FindChildTraverse("inventory_tpscroll_container")!.style.opacity = "0";
        // }
    }
}
