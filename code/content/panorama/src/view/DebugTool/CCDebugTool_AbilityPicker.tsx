import React from "react";
import { CCBaseButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

import "./CCDebugTool_AbilityPicker.less";

/** 技能选择 */
interface ICCDebugTool_AbilityPicker {
    /** 技能名列表 */
    abilityNames?: string[];
    /** 窗口标题 */
    title: string;
    /** 分类 */
    toggleList?: {
        /** type是分类，后面实际显示的描述 */
        [toggleType: string]: string;
    };
    /** 过滤器 */
    filterFunc?: (toggleType: string, itemName: string) => boolean;
}
export class CCDebugTool_AbilityPicker extends CCPanel<ICCDebugTool_AbilityPicker> {
    state = {
        filterWord: "",
        toggleType: "",
        rawMode: false,
    };
    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__}   {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer
                    title={this.props.title}
                    toggleList={this.props.toggleList}
                    onSearch={text => this.setState({ filterWord: text })}
                    onToggleType={text => this.setState({ toggleType: text })}
                    onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
                    DomainPanel={this}

                >
                    <CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                        {this.props.abilityNames?.map((abilityname, index) => {
                            if (this.props.filterFunc) {
                                if (!this.props.filterFunc(this.state.toggleType, abilityname)) {
                                    return;
                                }
                            }
                            if (this.state.filterWord != "") {
                                if (abilityname.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#DOTA_Tooltip_ability_" + abilityname).search(new RegExp(this.state.filterWord, "gim")) == -1) {
                                    return;
                                }
                            }
                            return (
                                <CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} width="64px" flowChildren="down" onactivate={self => { }}>
                                    <DOTAAbilityImage abilityname={abilityname} showtooltip />
                                    <Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? abilityname : $.Localize("#DOTA_Tooltip_ability_" + abilityname)} />
                                </CCBaseButton>
                            );
                        })}
                    </CCPanel>
                </CCDebugTool_SelectContainer>
            </Panel>
        );
    }
}