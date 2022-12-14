import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCDebugTool_SelectContainer } from "./CCDebugTool";

/** 封装好的图标选择 */
interface ICCDebugTool_IconPicker {

}
export class CCDebugTool_IconPicker extends CCPanel<ICCDebugTool_IconPicker> {
    state = {
        type: "",
        filterWord: "",
    };
    render() {
        const type = this.GetState<string>("type");
        const filterWord = this.GetState<string>("filterWord");
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_DebugTool_TextPicker"  {...this.initRootAttrs()} hittest={false}>
                <CCDebugTool_SelectContainer eventName="CC_DebugTool_IconPicker" title="图标选择" hasRawMode={false}
                    toggleList={{
                        All: "全部",
                        Eom: "EOM",
                        Tui7: "Tui7",
                        Tui3: "Tui3",
                        NoType: "无类型",
                    }}
                    onSearch={text => this.UpdateState({ filterWord: text })}
                    onToggleType={text => this.UpdateState({ type: text })}
                    DomainPanel={this}

                >
                    {/* <CC_IconPicker type={type == "" ? undefined : type} filterWord={filterWord} /> */}
                </CCDebugTool_SelectContainer>
            </Panel>
        )
    }
}