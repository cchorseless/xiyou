import React from "react";
import { CSSHelper } from "../../../helper/CSSHelper";
import { DotaUIHelper } from "../../../helper/DotaUIHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { GameEnum } from "../../../libs/GameEnum";
import { CustomInventory_UI } from "./CustomInventory_UI";

export class CustomInventory extends CustomInventory_UI {
    constructor(p: any) {
        super(p);
        this.addEvent();
    }
    // 初始化数据
    componentDidMount() {
        super.componentDidMount();
        let panel = $.CreatePanelWithProperties("DOTAInventory", this.__root__.current!, "inventory", {});
        if (panel) {
            panel.SetParent(this.__root__.current!);
            this.inventoryitems = panel.FindChildTraverse("inventory_items");
            this.InventoryBG = panel.FindChildTraverse("InventoryBG");
            panel.style.width = "100%";
            panel.style.height = "100%";
            for (let i = 0; i < 9; i++) {
                let _slot = panel.FindChildTraverse("inventory_slot_" + i);
                if (_slot) {
                    // 背包道具背景图
                    let buttonSize = _slot.FindChildTraverse("ButtonSize");
                    // buttonSize!.style.backgroundImage = "none";
                    // buttonSize!.style.backgroundColor = "none";
                    this.buttonSizePanel.push(buttonSize!);
                    // 备用背包背景图
                    let buttonWell = _slot.FindChildTraverse("ButtonWell");
                    // buttonWell!.style.boxShadow = "none";
                    this.buttonSizeWell.push(buttonWell!);
                    let item_rare = $.CreatePanelWithProperties("Image", buttonSize!, "customitem_rare_" + i, {});
                    item_rare.hittest = true;
                    item_rare.SetDraggable(true);
                    item_rare.style.zIndex = 100;
                    item_rare.style.width = "100%";
                    item_rare.style.height = "100%";
                    item_rare.SetScaling("stretch-to-fit-preserve-aspect");
                    item_rare.SetPanelEvent("onmouseactivate", () => {
                        this.onBtn_leftClick(i);
                    });
                    item_rare.SetPanelEvent("oncontextmenu", () => {
                        this.onBtn_rightClick(i);
                    });
                    item_rare.SetPanelEvent("onmouseover", () => {
                        this.onBtn_mouseover(i);
                    });
                    item_rare.SetPanelEvent("onmouseout", () => {
                        this.onBtn_mouseout(i);
                    });
                    // b 拖动的panel
                    $.RegisterEventHandler("DragEnd", item_rare!, (a, b) => {
                        this.onBtn_dragend(i);
                    });
                }
            }
            this.onRefreshUI();
            this.__root__.current!.visible = false;
        }
    }
    // 整体背景
    inventoryitems: Panel | null;
    // 背包背景
    InventoryBG: Panel | null;
    buttonSizePanel: Panel[] = [];
    buttonSizeWell: Panel[] = [];

    addEvent() {
        GameEvents.Subscribe(GameEnum.GameEvent.dota_inventory_changed, (e) => {
            this.onRefreshUI();
        });
        GameEvents.Subscribe(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.onRefreshUI();
        });
    }
    onStartUI() {
        this.__root__.current!.visible = true;
        this.inventoryitems!.ApplyStyles(true);
        // this.inventoryitems!.style.backgroundImage = "none";
        // this.inventoryitems!.style.backgroundColor = "none";
        // this.InventoryBG!.style.backgroundImage = "none";
    }

    selectedEntityid: EntityIndex;
    onRefreshUI() {
        let entitys = Players.GetSelectedEntities(Game.GetLocalPlayerID());
        this.selectedEntityid = entitys[entitys.length - 1];
        if (this.selectedEntityid == null) {
            return
        }
        for (let i = 0; i < 9; i++) {
            let img = this.__root__.current!.FindChildTraverse("customitem_rare_" + i) as ImagePanel;
            if (img) {
                img.visible = Entities.GetItemInSlot(this.selectedEntityid, i) > -1;
                CSSHelper.setImagePanelUrl(img, `common/rarity/CardRarity_SR.png`);
            }
        }
    }

    onBtn_leftClick = (item_slot: number) => {
        let overrideentityindex = Entities.GetItemInSlot(this.selectedEntityid, item_slot);
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
                let iAbilityIndex = Abilities.GetLocalPlayerActiveAbility();
                if (iAbilityIndex != -1) {
                    let iAbilityBehavior = Abilities.GetBehavior(iAbilityIndex);
                    if (iAbilityBehavior & DOTA_ABILITY_BEHAVIOR.DOTA_ABILITY_BEHAVIOR_RUNE_TARGET) {
                        let iClickbehaviors = GameUI.GetClickBehaviors();
                        if (iClickbehaviors === CLICK_BEHAVIORS.DOTA_CLICK_BEHAVIOR_CAST) {
                            Abilities.ExecuteAbility(iAbilityIndex, Abilities.GetCaster(iAbilityIndex), true);
                        }
                        return;
                    }
                }
            }
            let iCasterIndex = Abilities.GetCaster(overrideentityindex);
            Abilities.ExecuteAbility(overrideentityindex, iCasterIndex, false);
        }
    };
    onBtn_rightClick = (item_slot: number) => {
        LogHelper.print(111111, " ---", item_slot);
    };
    onBtn_mouseover = (item_slot: number) => { };
    onBtn_mouseout = (item_slot: number) => { };
    onBtn_dragend = (item_slot: number) => {
        let pos = GameUI.GetCursorPosition();
        let entitys = GameUI.FindScreenEntities(pos);
        if (entitys.length > 0) {
            for (let info of entitys) {
                if (info.accurateCollision) {
                    NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_GIVE_NPC, {
                        npc: info.entityIndex,
                        slot: item_slot
                    })
                    break;
                }
            }
        }
        else {
            let worldpos = GameUI.GetScreenWorldPosition(pos)!;
            NetHelper.SendToLua(GameEnum.CustomProtocol.req_ITEM_DROP_POSITION, {
                pos: { x: worldpos[0], y: worldpos[1], z: worldpos[2] },
                slot: item_slot
            })
        }
    };
}
