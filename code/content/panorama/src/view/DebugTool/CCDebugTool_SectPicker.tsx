import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { NetHelper } from "../../helper/NetHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCombinationIcon } from "../Combination/CCCombinationIcon";
import { CCCombinationInfoDialog } from "../Combination/CCCombinationInfoDialog";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

interface IDebugTool_SectPicker {
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


export class CCDebugTool_SectPicker extends CCPanel<IDebugTool_SectPicker> {
    state = {
        filterWord: "",
        toggleType: "",
        rawMode: false,
    };

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DebugTool_SectPicker"  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer
                    title={this.props.title}
                    toggleList={this.props.toggleList}
                    onSearch={text => this.UpdateState({ filterWord: text })}
                    onToggleType={text => this.UpdateState({ toggleType: text })}
                    onChangeRawMode={rawMode => this.UpdateState({ rawMode: rawMode })}
                    DomainPanel={this}
                >
                    <CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                        {this.props.abilityNames?.map((sectName, index) => {
                            if (this.props.filterFunc) {
                                if (!this.props.filterFunc(this.state.toggleType, sectName)) {
                                    return;
                                }
                            }
                            if (this.state.filterWord != "") {
                                if (sectName.search(new RegExp(this.state.filterWord, "gim")) == -1 && $.Localize("#lang_" + sectName).search(new RegExp(this.state.filterWord, "gim")) == -1) {
                                    return;
                                }
                            }
                            return (
                                <CCButton type="Empty" className="CC_DebugTool_AbilityPickerItem" key={index + ""} width="64px" flowChildren="down"
                                    onactivate={self => {
                                        NetHelper.SendToLua(GameProtocol.Protocol.req_DebugAddSect, {
                                            sectname: sectName
                                        })
                                    }} >
                                    <CCCombinationIcon sectName={sectName} horizontalAlign="center" dialogTooltip={
                                        {
                                            cls: CCCombinationInfoDialog,
                                            props: {
                                                showBg: true,
                                                sectName: sectName,
                                                playerid: GGameScene.Local.BelongPlayerid,
                                                showSectName: true,
                                            }
                                        }} />
                                    <Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? sectName : $.Localize("#lang_" + sectName)} />
                                </CCButton>
                            );
                        })}
                    </CCPanel>
                </CCDebugTool_SelectContainer>
            </Panel>
        );
    }
}
