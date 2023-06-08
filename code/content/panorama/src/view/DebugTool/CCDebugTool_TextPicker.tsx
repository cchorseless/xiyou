import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";
import "./CCDebugTool_TextPicker.less";
/** 普通选择 */
interface ICCDebugTool_TextPicker {
    /** 列表 */
    itemNames?: string[];
    /** 窗口标题 */
    title: string;
}
export class CCDebugTool_TextPicker extends CCPanel<ICCDebugTool_TextPicker> {
    state = {
        rawMode: false,
    };

    render() {
        return (<Panel ref={this.__root__}   {...this.initRootAttrs()} hittest={false}>
            <CCDebugTool_SelectContainer
                title={this.props.title}
                hasFilter={false}
                onChangeRawMode={rawMode => this.UpdateState({ rawMode: rawMode })}
                DomainPanel={this}
                width="620px"
                height="500px"
            >
                <CCPanel className="CC_DebugTool_TextPicker" flowChildren="right-wrap" width="100%" scroll="y" >
                    {this.props.itemNames?.map((itemName, index) => {
                        return (
                            <TextButton key={index} className="CC_DebugTool_TextPickerItem" localizedText={"#" + itemName} />
                        );
                    })}
                </CCPanel>
            </CCDebugTool_SelectContainer>
        </Panel>
        );
    }
}
