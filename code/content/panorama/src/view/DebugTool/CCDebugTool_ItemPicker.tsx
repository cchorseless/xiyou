import React from "react";
import { CCBaseButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 选择物品 */
interface ICCDebugTool_ItemPicker {
    /** 技能名列表 */
    itemNames?: string[];
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
export class CCDebugTool_ItemPicker extends CCPanel<ICCDebugTool_ItemPicker> {
    state = {
        filterWord: "",
        toggleType: "",
        rawMode: false,
    };

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DebugTool_TextPicker"  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer
                    title={this.props.title}
                    toggleList={this.props.toggleList}
                    onSearch={text => this.setState({ filterWord: text })}
                    onToggleType={text => this.setState({ toggleType: text })}
                    onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
                    DomainPanel={this}

                >
                    <CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                        {this.props.itemNames?.map((abilityname, index) => {
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
                                <CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} flowChildren="down" onactivate={self => {

                                }}>
                                    <DOTAItemImage itemname={abilityname} showtooltip />
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