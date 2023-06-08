import React from "react";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_Arrow } from "../AllUIElement/CCIcons/CCIcon_Arrow";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPopUpDialog } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCMingWenItem } from "./CCMingWenItem";
import "./CCMingWenLevelUpDialog.less";
import { CCMingWenReplaceDialog } from "./CCMingWenReplaceDialog";

interface ICCMingWenLevelUpDialog {
    type: "square" | "diamond",
    color?: "Red" | "Green" | "Blue",
    itemid?: string | number,
    level?: number,
    slot?: number,
}

export class CCMingWenLevelUpDialog extends CCPanel<ICCMingWenLevelUpDialog> {

    render() {
        return (
            <Panel className="CCMingWenLevelUpDialog" ref={this.__root__}  {...this.initRootAttrs()}>
                <CCPopUpDialog title="符文升级" width="400px" height="500px" onClose={() => this.close()}>
                    <CCPanel flowChildren="down">
                        <CCMingWenItem horizontalAlign="center" type={this.props.type} level={this.props.level} itemid={this.props.level} color={this.props.color} />
                        <CCLabel type="UnitName" text={"铭文：圣人"} horizontalAlign="center" />
                        <CCLabel type="UnitName" text={"等级：2  ->  3"} horizontalAlign="center" marginTop={"20px"} />
                        <CCPanel flowChildren="right" horizontalAlign="center" height="120px">
                            <CCPanel flowChildren="down" verticalAlign="center"  >
                                <CCLabel type="UnitName" text={"物理防御 +100"} fontSize="20px" marginTop={"10px"} />
                                <CCLabel type="UnitName" text={"魔法防御 +100"} fontSize="20px" marginTop={"10px"} />
                            </CCPanel>
                            <CCIcon_Arrow type="ArrowRight" verticalAlign="center" />
                            <CCPanel flowChildren="down" verticalAlign="center" >
                                <CCLabel type="UnitName" text={"物理防御 +100"} fontSize="20px" marginTop={"10px"} />
                                <CCLabel type="UnitName" text={"魔法防御 +100"} fontSize="20px" marginTop={"10px"} />
                            </CCPanel>
                        </CCPanel>
                        <CCPanel flowChildren="right" horizontalAlign="center">
                            <CCLabel text={"升级消耗："} />
                            <CCIcon_CoinType cointype={GEEnum.EMoneyType.SoulCrystal} marginLeft={"10px"} width="30px" height="30px" />
                            <CCLabel text={"x1000"} type="UnitName" />
                        </CCPanel>
                        <CCPanel flowChildren="right" horizontalAlign="center">
                            <CCButton color="Green" type="Tui3" width="120px" horizontalAlign="center" onactivate={() => { }}>
                                <CCLabel type="UnitName" align="center center" text={"升级"} />
                            </CCButton>
                            <CCButton color="Green" type="Tui3" width="120px" horizontalAlign="center" onactivate={() => {
                                this.close();
                                CCMainPanel.GetInstance()!.addOnlyPanel(CCMingWenReplaceDialog, { ...this.props })
                            }}>
                                <CCLabel type="UnitName" align="center center" text={"替换"} />
                            </CCButton>
                        </CCPanel>
                    </CCPanel>
                </CCPopUpDialog>
            </Panel>
        );
    }
}

