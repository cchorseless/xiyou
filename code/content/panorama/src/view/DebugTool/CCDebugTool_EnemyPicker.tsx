import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

interface ICCDebugTool_EnemyPicker {
    /** 单位名列表 */
    unitNames?: string[];
    /** 窗口标题 */
    title: string;
}
export class CCDebugTool_EnemyPicker extends CCPanel<ICCDebugTool_EnemyPicker> {
    state = {
        filterWord: "",
        toggleType: "",
        rawMode: false,
    };
    render() {
        return (<Panel ref={this.__root__} id="CC_DebugTool_EnemyPicker"  {...this.initRootAttrs()} hittest={false}>
            <CCDebugTool_SelectContainer
                title={this.props.title}
                hasFilter={true}
                onSearch={text => this.setState({ filterWord: text })}
                onToggleType={text => this.setState({ toggleType: text })}
                onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
                DomainPanel={this}
            >
                <CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                    {this.props.unitNames?.map((unitName, index) => {
                        if (this.props.filterFunc) {
                            if (!this.props.filterFunc(this.state.toggleType, unitName)) {
                                return;
                            }
                        }
                        if (this.state.filterWord != "") {
                            if (unitName.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#" + unitName).search(new RegExp(this.state.filterWord, "gim")) == -1) {
                                return;
                            }
                        }
                        return (
                            <CCButton type="Empty" className="CC_DebugTool_AbilityPickerItem" key={index + ""} flowChildren="down" onactivate={self => {
                                NetHelper.SendToLua(GameProtocol.Protocol.req_DebugAddEnemy, { unitname: unitName })
                            }}>
                                <CCUnitSmallIcon itemname={unitName} />
                                <Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? unitName : $.Localize("#" + unitName)} />
                            </CCButton>
                        );
                    })}
                </CCPanel>
            </CCDebugTool_SelectContainer>
        </Panel>
        );
    }
}