import React from "react";
import { CCBaseButton } from "../AllUIElement/CCButton/CCButton";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 英雄选择 */
interface ICCDebugTool_HeroPicker {

    /** 单位名列表 */
    unitNames?: string[];
    /** 窗口标题 */
    title: string;
}
export class CCDebugTool_HeroPicker extends CCPanel<ICCDebugTool_HeroPicker> {
    state = {
        rawMode: false,
    };
    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DebugTool_TextPicker"  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer
                    title={this.props.title}
                    hasFilter={false}
                    onChangeRawMode={rawMode => this.setState({ rawMode: rawMode })}
                    DomainPanel={this}

                // width="620px"
                // height="360px"
                >
                    <CCPanel className="CC_DebugTool_AbilityPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                        {this.props.unitNames?.map((unitName, index) => {
                            return (
                                <CCBaseButton className="CC_DebugTool_AbilityPickerItem" key={index + ""} flowChildren="down" onactivate={self => { }}>
                                    <DOTAHeroImage heroimagestyle={"portrait"} heroname={unitName} id="HeroPickerCardImage" scaling="stretch-to-fit-x-preserve-aspect" />
                                    <Label className="CC_DebugTool_AbilityPickerItemName" text={this.state.rawMode ? unitName : $.Localize("#" + unitName)} />
                                </CCBaseButton>
                            );
                        })}
                    </CCPanel>
                </CCDebugTool_SelectContainer>
            </Panel>
        );
    }
}