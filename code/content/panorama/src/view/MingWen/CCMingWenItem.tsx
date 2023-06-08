
import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import "./CCMingWenItem.less";
import { CCMingWenLevelUpDialog } from "./CCMingWenLevelUpDialog";
import { CCMingWenReplaceDialog } from "./CCMingWenReplaceDialog";

interface ICCMingWenItem {
    type: "square" | "diamond",
    color?: "Red" | "Green" | "Blue",
    itemid?: string | number,
    level?: number,
    block?: boolean,
    slot?: number,
}

export class CCMingWenItem extends CCPanel<ICCMingWenItem> {


    render() {
        const level = this.props.level || 1;
        const block = GToBoolean(this.props.block);
        const color = this.props.color;
        const itemid = this.props.itemid;

        return <Panel ref={this.__root__} className={CSSHelper.ClassMaker("CCMingWenItem", "MingWen_" + this.props.type)} hittest={false} {...this.initRootAttrs()}>
            <CCIconButton enabled={!block} width="60px" height="80px" onactivate={() => {
                if (!block && itemid == null) {
                    CCMainPanel.GetInstance()!.addOnlyPanel(CCMingWenReplaceDialog, { ...this.props })
                }
                else if (!block && itemid !== null) {
                    CCMainPanel.GetInstance()!.addOnlyPanel(CCMingWenLevelUpDialog, { ...this.props })

                }

            }}>
                <Panel id="MingWenBg" >
                    <Panel id="MingWenBgStar" className={color} visible={GToBoolean(itemid)} />
                    <Panel id="MingWenBgContent" className={color} />
                    <Panel id="MingWenBgLight" className={color} />
                    <CCLabel type="UnitName" text={"lv." + level} visible={GToBoolean(itemid)} marginTop={"40px"} horizontalAlign="center" />
                </Panel>
                <CCLabel type="UnitName" text={block ? "lv." + 30 : "???"} fontSize="16px" visible={block || itemid == null} marginTop={"15px"} horizontalAlign="center" />
                <CCLabel type="UnitName" text={block ? "解锁" : "镶嵌"} fontSize="16px" visible={block || itemid == null} marginTop={"45px"} horizontalAlign="center" />
            </CCIconButton>
            {this.props.children}
            {this.__root___childs}
        </Panel>

    }
}