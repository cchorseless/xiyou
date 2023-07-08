import { render } from "@demon673/react-panorama";
import React, { ReactElement } from "react";
import { GameProtocol } from "../../../scripts/tscripts/shared/GameProtocol";
import { GEventHelper } from "../../../scripts/tscripts/shared/lib/GEventHelper";
import { CCCombinationInfoDialog } from "../view/Combination/CCCombinationInfoDialog";
import { CCMainPanel } from "../view/MainPanel/CCMainPanel";
import { EventHelper } from "./EventHelper";
import { KVHelper } from "./KVHelper";
import { LogHelper } from "./LogHelper";
import { NetHelper } from "./NetHelper";
import { TipsHelper } from "./TipsHelper";



export module DotaUIHelper {
    const EventObj = {};

    /**UI根节点 */
    let WindowRoot: Panel;
    /**
     * dota2UI查找节点
     */
    export function findElement(id: string) {
        return GetWindowRoot()!.FindChild(id);
    }

    export async function isLongTimeMouseOver() {
        let oldmouse = GameUI.GetCursorPosition();
        await GTimerHelper.DelayTime(0.3);
        let newmouse = GameUI.GetCursorPosition();
        let dis = (newmouse[0] - oldmouse[0]) * (newmouse[0] - oldmouse[0]) + (newmouse[1] - oldmouse[1]) * (newmouse[1] - oldmouse[1]);
        return dis <= 1000;
    }

    /**
     *
     * @returns  游戏UI根节点
     */
    export function GetWindowRoot() {
        let a = $.GetContextPanel();
        while (a.GetParent() != null) {
            let p = a.GetParent() as Panel;
            if (p.BHasClass("WindowRoot")) {
                return p;
            }
            a = p;
        }
    }

    // 因为BCreateChildren无了，改为调用这个CreateChildren
    export function CreateChildren(parent_panel: Panel, xmlstring: string) {
        let obj = readXML(xmlstring);
        CreateOneElement(obj, parent_panel);
    }
    export function FindDotaHudElement(id: string) {
        let hudRoot: Panel = null as any;
        for (let panel = $.GetContextPanel(); panel != null; panel = panel.GetParent()!) {
            hudRoot = panel;
        }
        let comp = hudRoot.FindChildTraverse(id);
        return comp;
    }
    export function CreateUIElement(parent_panel: Panel, panel_type: string, id: string, prop: object) {
        if (!parent_panel || !panel_type) {
            return;
        }
        var new_ui_element = $.CreatePanelWithProperties(panel_type, parent_panel, id, prop || {});
        return new_ui_element;
    }
    export function ClearUIElement(parent_panel: Panel) {
        parent_panel.RemoveAndDeleteChildren();
    }
    export function CreateOneElement(obj: any, parent_panel: Panel) {
        if (!obj) {
            return;
        }
        if (!obj.type) {
            if (obj.children && obj.children.length > 0) {
                for (let i = 0; i < obj.children.length; i++) {
                    CreateOneElement(obj.children[i], parent_panel);
                }
            }
            return;
        }
        let panel_type = obj.type;
        let props = obj.props;
        let panel_id = obj.props.id;
        let panel = CreateUIElement(parent_panel, panel_type, panel_id, props)!;

        if (obj.children && obj.children.length > 0) {
            for (let i = 0; i < obj.children.length; i++) {
                CreateOneElement(obj.children[i], panel);
            }
        }
    }

    function readXML(xmlstring: string) {
        xmlstring = xmlstring.replace(/\s+=\s+/g, "=");
        xmlstring = xmlstring.replace(/\s+=/g, "=");
        xmlstring = xmlstring.replace(/=\s+/g, "=");

        let element_queue = [];
        let p_i = 0;
        let element_temp = "";
        while (p_i < xmlstring.length) {
            element_temp = element_temp + xmlstring.charAt(p_i);
            if (xmlstring.charAt(p_i) == ">") {
                element_queue.unshift(element_temp);
                element_temp = "";
            }
            p_i++;
        }
        let element_stack = [];

        let element_string_object = { context: "root", children: [], parent: null };
        let tree_pointer: any[] = element_string_object["children"];
        let parent_pointer = element_string_object;
        while (element_queue.length > 0) {
            let element = element_queue.pop()!;
            if (element.indexOf("/>") != -1) {
                tree_pointer.push({ context: element, children: [], parent: parent_pointer });
            } else if (element.indexOf("</") != -1) {
                parent_pointer = element_stack.pop()!["parent"];
                tree_pointer = parent_pointer["children"];
            } else if (element.indexOf("<") != -1) {
                var obj = { context: element, children: [], parent: parent_pointer };
                tree_pointer.push(obj);
                element_stack.push(obj);
                parent_pointer = obj as any;
                tree_pointer = obj["children"];
            }
        }
        readchild(element_string_object);

        return element_string_object;
    }
    function readchild(obj: any) {
        if (obj["children"].length == 0) {
            return null;
        } else {
            for (var i = 0; i < obj["children"].length; i++) {
                var str = obj["children"][i]["context"];
                var p_type_start = str.indexOf("<");
                var p_type_end = str.indexOf(" ");
                var type = str.slice(p_type_start + 1, p_type_end);
                obj["children"][i]["type"] = type;
                var props = {};
                var p_i = p_type_end;
                while (p_i < str.length) {
                    var p_prop_name_end = str.indexOf("=", p_i);
                    if (p_prop_name_end == -1) {
                        break;
                    }
                    var prop_name = str.slice(p_i, p_prop_name_end).trim();

                    var p_prop_value_start_1 = str.indexOf('"', p_i);
                    var p_prop_value_start_2 = str.indexOf("'", p_i);
                    var p_prop_value_end_1 = null;
                    var p_prop_value_end_2 = null;
                    if (p_prop_value_start_1) {
                        p_prop_value_end_1 = str.indexOf('"', p_prop_value_start_1 + 1) + 1;
                    }
                    if (p_prop_value_start_2) {
                        p_prop_value_end_2 = str.indexOf("'", p_prop_value_start_2 + 1) + 1;
                    }
                    var p_prop_value_end = p_prop_value_end_1 || p_prop_value_end_2;
                    if (p_prop_value_end == -1) {
                        break;
                    }
                    var prop_value = str.slice(p_prop_name_end + 1, p_prop_value_end).slice(1, -1);
                    if (prop_name != "" && prop_value != "") {
                        (props as any)[prop_name] = prop_value;
                    }
                    p_i = p_prop_value_end + 1;
                }
                obj["children"][i]["props"] = props;
                delete obj["children"][i]["context"];
                delete obj["children"][i]["parent"];
                readchild(obj["children"][i]);
            }
        }
    }

    /**打印dota2UI层级 */
    export function debugUIid() {
        let _r = GetWindowRoot();
        let out = {} as any;
        let arr = [
            {
                p: _r,
                data: out,
            },
        ];
        while (arr.length > 0) {
            let P_data = arr.shift() as { p: Panel; data: any };
            let curP = P_data.p;
            let data = P_data.data;
            if (curP && curP.id) {
                let new_data = {};
                data[curP.id] = new_data;
                if (curP.GetChildCount() > 0) {
                    for (let i = 0; i < curP.GetChildCount(); i++) {
                        let c = curP.GetChild(i);
                        if (c) {
                            arr.push({
                                p: c,
                                data: new_data,
                            });
                        }
                    }
                }
            }
        }
        let str = JSON.stringify(out);
        LogHelper.print("-------------");
        let endarr = [":", "{", "}", ",", '"'];
        while (str.length > 400) {
            let tmp = str.substring(0, 400);
            if (endarr.indexOf(tmp[399]) == -1) {
                LogHelper.print(tmp + "\\");
            } else {
                LogHelper.print(tmp);
            }
            str = str.substring(400);
        }
        LogHelper.print(str);
        LogHelper.print("------------");
    }

    export enum EDotaUIId {
        lower_hud = "lower_hud",
    }


    function RegDragEvent() {
        EventHelper.addUnhandledEvent("DragStart", GHandler.create(EventObj, (pPanel: Panel, tDragCallbacks: DragSettings) => {
            // LogHelper.print("DragStart", "111111")
            // runDragHandler(pDraggedPanel, "DragStart", pPanel)
        }));
        EventHelper.addUnhandledEvent("DragEnter", GHandler.create(EventObj, (pPanel: Panel, pDraggedPanel: ItemImage | AbilityImage) => {
            CCMainPanel.GetInstance()?.HideToolTip();
            if (pPanel.BHasClass && pPanel.IsValid() && pPanel.BHasClass(IsDragTargetPanel)) {
                let brightness = pPanel.style.brightness || 1;
                pPanel.style.brightness = Number(brightness) + 0.5 + "";
                runDragHandler(pDraggedPanel, "DragEnter", pPanel);
            }
        }));
        EventHelper.addUnhandledEvent("DragLeave", GHandler.create(EventObj, (pPanel: Panel, pDraggedPanel: ItemImage | AbilityImage) => {
            if (pPanel.BHasClass && pPanel.IsValid() && pPanel.BHasClass(IsDragTargetPanel)) {
                let brightness = pPanel.style.brightness || 1.5;
                pPanel.style.brightness = Number(brightness) - 0.5 + "";
                runDragHandler(pDraggedPanel, "DragLeave", pPanel);
            }
        }));
        EventHelper.addUnhandledEvent("DragDrop", GHandler.create(EventObj, (pPanel: Panel, pDraggedPanel: ItemImage | AbilityImage) => {
            if (pPanel.BHasClass && pPanel.IsValid() && pPanel.BHasClass(IsDragTargetPanel)) {
                runDragHandler(pDraggedPanel, "DragDrop", pPanel);
            }
        }));
        EventHelper.addUnhandledEvent("DragEnd", GHandler.create(EventObj, (pPanel: Panel, pDraggedPanel: ItemImage | AbilityImage) => {
            if (pPanel.BHasClass && pPanel.IsValid() && pPanel.BHasClass(IsDragTargetPanel)) {
                runDragHandler(pDraggedPanel, "DragEnd", pPanel);
            }
        }));
    }
    const AllEventInfo: { [eventName: string]: [{ pDraggedPanel: ItemImage | AbilityImage, isonce: boolean; handler: IGHandler }] } = {};
    function runDragHandler(pDraggedPanel: ItemImage | AbilityImage, eventName: string, ...args: any[]) {
        if (pDraggedPanel == null || !pDraggedPanel.IsValid()) { return }
        let eventinfo = AllEventInfo[eventName];
        if (eventinfo) {
            for (let i = 0, len = eventinfo.length; i < len; i++) {
                let info = eventinfo[i];
                if (info && info.handler && info.handler._id > 0) {
                    if (info.pDraggedPanel.contextEntityIndex && info.pDraggedPanel.contextEntityIndex == pDraggedPanel.contextEntityIndex) {
                        if (args.length > 0) {
                            info.handler.runWith(args);
                        } else {
                            info.handler.run();
                        }
                        if (info.isonce) {
                            AllEventInfo[eventName].splice(i, 1);
                            i--;
                        }
                    }
                }
            }
        }
    }

    export function addDragEvent(pDraggedPanel: ItemImage | AbilityImage, eventName: "DragEnter" | "DragLeave" | "DragDrop" | "DragEnd", handler: IGHandler, isOnce = false) {
        if (AllEventInfo[eventName] == null) {
            AllEventInfo[eventName] = [] as any;
        }
        if (!isOnce) {
            handler.once = false;
        }
        AllEventInfo[eventName].push({ pDraggedPanel: pDraggedPanel, isonce: isOnce, handler: handler });
    }

    export function removeDragEvent(pDraggedPanel: ItemImage | AbilityImage) {
        for (let eventName in AllEventInfo) {
            for (let i = 0, len = AllEventInfo[eventName].length; i < len; i++) {
                let info = AllEventInfo[eventName][i];
                if (info && info.handler && info.handler._id > 0) {
                    if (info.pDraggedPanel === pDraggedPanel) {
                        AllEventInfo[eventName].splice(i, 1);
                        info.handler.recover();
                        i--;
                    }
                }
            }
        }
    }

    export function addDragTargetClass(targetPanel: Panel, className: string) {
        targetPanel.AddClass(IsDragTargetPanel);
        targetPanel.AddClass(className);
    }
    /**标记可拖拽目标 */
    const IsDragTargetPanel = "IsDragTargetPanel";
    function RegAbilityItemToolTipEvent() {
        const WindowRoot = GetWindowRoot()!;
        const tooltips = WindowRoot.FindChildTraverse("Tooltips")!;
        let DOTAAbilityToolTip: Panel;
        let DOTAAbilityToolTip_Contents: Panel;
        let TextToolTip: Panel;
        const customPanelid = "CustomTooltipPanel";
        const customLabelid = "CustomTooltipLabel";
        const CustomJinDuPanel = "CustomJinDuPanel";
        const params: any[] = [];
        const abilityShowTooltipHandler = GHandler.create(EventObj, (abilitypanel: Panel, ability_name: string, abilityEntityIndex: AbilityEntityIndex, abilityEntityIndex2: AbilityEntityIndex) => {
            params.length = 0;
            params.push(abilitypanel, ability_name, abilityEntityIndex, abilityEntityIndex2);
            abilityEntityIndex = GToNumber(abilityEntityIndex) as AbilityEntityIndex;
            if (typeof ability_name == "number" && abilityEntityIndex == 0) {
                abilityEntityIndex = ability_name;
                ability_name = Abilities.GetAbilityName(ability_name as AbilityEntityIndex);
            }
            else if (typeof ability_name == "string") {
                if (abilityEntityIndex == 0) {
                    abilityEntityIndex = abilityEntityIndex2 || -1 as AbilityEntityIndex;
                }
                // 判断是否是Unit EntityIndex
                else {
                    if (Abilities.GetCaster(abilityEntityIndex) == -1) {
                        abilityEntityIndex = Entities.GetAbilityByName(abilityEntityIndex, ability_name);
                    }
                }
            }
            const unitEntIndex = Abilities.GetCaster(abilityEntityIndex);
            DOTAAbilityToolTip = DOTAAbilityToolTip || tooltips.FindChildTraverse("DOTAAbilityTooltip");
            if (DOTAAbilityToolTip == null) { return }
            DOTAAbilityToolTip_Contents = DOTAAbilityToolTip_Contents || DOTAAbilityToolTip.FindChildTraverse("Contents")!;
            DOTAAbilityToolTip_Contents.style.flowChildren = "right";
            const AbilityDetails = DOTAAbilityToolTip_Contents.FindChild("AbilityDetails")!;
            const AbilityDescriptionOuterContainer = AbilityDetails.FindChildTraverse("AbilityDescriptionOuterContainer")!;
            if (AbilityDetails) {
                // AbilityDetails.style.width = "340px";
                // 升级进度条
                const jinduinfo = Abilities.GetAbilityJinDuInfo(abilityEntityIndex > 0 ? abilityEntityIndex : ability_name);
                const AbilityUpgradeProgress = AbilityDetails.FindChild("AbilityUpgradeProgress")!;
                AbilityUpgradeProgress.visible = jinduinfo != null;
                if (jinduinfo) {
                    AbilityUpgradeProgress.Children().forEach((child) => {
                        if (child.id != CustomJinDuPanel) {
                            child.visible = false;
                        }
                    });
                    render(<ProgressBar id={CustomJinDuPanel} value={jinduinfo.now} min={jinduinfo.min} max={jinduinfo.max} style={{ horizontalAlign: "center", marginLeft: "10px", height: "18px", width: "300px" }} >
                        <Label localizedText={"#lang_Ability_JinDu"} dialogVariables={jinduinfo} html={true} style={{ align: "center center", }} />
                    </ProgressBar>, AbilityUpgradeProgress)
                }
                // 修改技能名字
                const header = AbilityDetails.FindChild("Header")!;
                if (header) {
                    const AbilityHeader = header.FindChildTraverse("AbilityHeader")! as Panel;
                    let needstar = KVHelper.GetAbilityOrItemDataForKey(ability_name, "RequiredStar", true) as number;
                    if (needstar > 0 && Entities.GetStar(unitEntIndex) < needstar) {
                        render(<Label id={customLabelid} text={` (${needstar}星激活)`} />, AbilityHeader)
                    }
                    else {
                        render(< ></>, AbilityHeader)
                    }
                }
            }
            // DOTAAbilityToolTip_Contents.style.width = "fit-children";
            let sectname = GJsonConfigHelper.GetAbilitySectLabel(ability_name);
            let CustomTooltipPanel = AbilityDescriptionOuterContainer.FindChild(customPanelid);
            if (CustomTooltipPanel == null) {
                CustomTooltipPanel = $.CreatePanel("Panel", AbilityDescriptionOuterContainer, customPanelid)
            }
            if (CustomTooltipPanel) {
                if (sectname) {
                    render(<CCCombinationInfoDialog key={Math.random() * 1000 + ""} unitentityindex={unitEntIndex} sectName={sectname} abilityitemname={ability_name as string} />, CustomTooltipPanel);
                }
                else {
                    render(< ></>, CustomTooltipPanel);
                }
            }
        })
        const abilityRefreshTooltipHandler = GHandler.create(EventObj, () => {
            abilityShowTooltipHandler.runWith(params);
        })
        const abilityShowDropItemTooltipHandler = GHandler.create(EventObj, (abilitypanel: Panel, x: number, y: number, ability_name: string, d, f, g, h) => {
            let targets = GameUI.FindScreenEntities([x, y]);
            targets = targets.filter(e => e.accurateCollision && Entities.IsItemPhysical(e.entityIndex));
            // 掉落物品
            if (targets[0]) {
                const abilityEntityIndex = Entities.GetContainedItem(targets[0].entityIndex);
                abilityShowTooltipHandler.runWith([abilitypanel, ability_name, abilityEntityIndex]);
            }
        })
        EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityTooltip, abilityShowTooltipHandler);
        EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityTooltipForEntityIndex, abilityShowTooltipHandler);
        EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityInventoryItemTooltip, abilityShowTooltipHandler);
        EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityShopItemTooltip, abilityShowTooltipHandler);
        EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowDroppedItemTooltip, abilityShowDropItemTooltipHandler);
        GEventHelper.AddEvent(TipsHelper.ToolTipType.DOTARefreshAbilityTooltip, abilityRefreshTooltipHandler);
        // EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityTooltipForGuide, abilityShowTooltipHandler);
        // EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityTooltipForHero, abilityShowTooltipHandler);
        // EventHelper.addUnhandledEvent(TipsHelper.ToolTipType.DOTAShowAbilityTooltipForLevel, abilityShowTooltipHandler);
    }
    /**
     * 报错上报
     * @param element 
     * @param container 
     * @param callback 
     */
    export function ErrorRender(element: ReactElement, container: Panel, callback?: () => void) {
        try {
            render(element, container, callback);
        } catch (error) {
            NetHelper.SendToLua(GameProtocol.Protocol.req_DebugClientErrorLog, (error as any).stack);
        }
    }
    export function Init(IsHeroSelect = false) {
        const PreGame = FindDotaHudElement("PreGame");
        if (PreGame) {
            PreGame.enabled = false;
            PreGame.style.opacity = "0";
        }
        const stackable_side_panels = FindDotaHudElement("stackable_side_panels");
        if (stackable_side_panels)
            stackable_side_panels.style.visibility = "collapse";
        //小地图
        FindDotaHudElement("GlyphScanContainer")!.style.opacity = "0";
        FindDotaHudElement("RoshanTimerContainer")!.style.opacity = "0";
        FindDotaHudElement("HUDSkinMinimap")!.style.opacity = "0";
        // 计分板按钮
        FindDotaHudElement("ToggleScoreboardButton")!.style.opacity = "0";
        if (!IsHeroSelect) {
            RegAbilityItemToolTipEvent()
        }
    }
    export function Quit() {
        EventHelper.removeUnhandledEventCaller(EventObj);
    }

}
