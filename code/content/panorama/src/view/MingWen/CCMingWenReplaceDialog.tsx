import React from "react";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCIcon_Check } from "../AllUIElement/CCIcons/CCIcon_Check";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCMingWenItem } from "./CCMingWenItem";
import "./CCMingWenReplaceDialog.less";

interface ICCMingWenReplaceDialog {
    slot?: number
}

export class CCMingWenReplaceDialog extends CCPanel<ICCMingWenReplaceDialog> {
    OnSelectEquipDressUp() {

    }
    render() {
        const isNeedBuy = true;
        const mingwens: ICCMingWenReplaceItem[] = [
            {
                type: "diamond",
                color: "Red",
                level: 1,
                itemid: "1001"
            },
            {
                type: "diamond",
                color: "Red",
                level: 1,
                itemid: "1001"
            },
            {
                type: "diamond",
                color: "Red",
                level: 1,
                itemid: "1001"
            },
            {
                type: "diamond",
                color: "Red",
                level: 1,
                itemid: "1001"
            },
            {
                type: "diamond",
                color: "Red",
                level: 1,
                itemid: "1001"
            },
            {
                type: "diamond",
                color: "Red",
                level: 1,
                itemid: "1001"
            }
        ];
        const selectindex = this.GetState<number>("selectindex")
        return <Panel className="CCMingWenReplaceDialog" ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPopUpDialog title="符文镶嵌" width="400px" height="600px" onClose={() => this.close()}>
                <CCPanel flowChildren="down"  >
                    <CCPanel flowChildren="down" height="400px" scroll={"y"}>
                        {
                            mingwens.map((v, index) => {
                                return <CCMingWenReplaceItem key={index + ""} {...v} marginTop={"3px"} bselected={selectindex == index} onactivate={() => {
                                    this.UpdateState({ selectindex: index })
                                }} />
                            })
                        }

                    </CCPanel>
                    {
                        isNeedBuy && <CCPanel flowChildren="right" horizontalAlign="center">
                            <CCLabel text={"消耗："} />
                            <CCIcon_CoinType cointype={GEEnum.EMoneyType.SoulCrystal} marginLeft={"10px"} width="30px" height="30px" />
                            <CCLabel text={"x1000"} type="UnitName" />
                        </CCPanel>
                    }
                    <CCButton color="Green" type="Tui3" horizontalAlign="center" verticalAlign="bottom" marginBottom={"10px"} onactivate={() => { this.OnSelectEquipDressUp() }}>
                        <CCLabel type="UnitName" align="center center" text={isNeedBuy ? "购买镶嵌" : "镶嵌"} />
                    </CCButton>
                </CCPanel>
            </CCPopUpDialog>
        </Panel>
    }
}
interface ICCMingWenReplaceItem {
    type: "square" | "diamond",
    color?: "Red" | "Green" | "Blue",
    itemid?: string | number,
    level?: number,
    bselected?: boolean,

}
export class CCMingWenReplaceItem extends CCPanel<ICCMingWenReplaceItem> {

    render() {

        const bselected = GToBoolean(this.props.bselected);
        return <Panel className="CCMingWenReplaceItem" ref={this.__root__}  {...this.initRootAttrs()}>
            <CCIconButton flowChildren="right" width="100%" height="100%">
                <CCMingWenItem type={this.props.type} level={this.props.level} itemid={this.props.level} color={this.props.color} />
                <CCPanel flowChildren="down">
                    <CCLabel type="UnitName" text={"3级铭文：圣人"} />
                    <CCPanel flowChildren="down">
                        <CCLabel type="UnitName" text={"物理防御 +100"} fontSize="20px" />
                        <CCLabel type="UnitName" text={"魔法防御 +100"} fontSize="20px" />
                    </CCPanel>
                </CCPanel>
                <CCIcon_Check visible={bselected} verticalAlign="center" horizontalAlign="right" marginRight={"10px"} />
            </CCIconButton>
        </Panel>
    }

}