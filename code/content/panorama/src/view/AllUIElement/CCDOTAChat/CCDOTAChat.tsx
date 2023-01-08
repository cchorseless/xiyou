import React, { createRef } from "react";
import { CCPanel } from "../CCPanel/CCPanel";
// import "./CCDOTAChat.less";

export interface ICCDOTAChat {
    chatstyle?: "hudpregame" | string
}

/** 分割线 */
export class CCDOTAChat extends CCPanel<ICCDOTAChat> {
    static defaultProps = {
        chatstyle: "hudpregame"
    }
    chat = createRef<Panel>()

    onStartUI() {
        const ChatLinesArea = this.chat.current!.FindChildTraverse("ChatLinesArea");
        if (ChatLinesArea) {
            ChatLinesArea.SetPanelEvent("onactivate", () => {
                this.closeChat()
            })
        }
    }
    closeChat() {
        this.chat.current!.SetHasClass("ChatExpanded", false)
    }
    render() {
        const chatstyle = this.props.chatstyle;
        return (
            <Panel ref={this.__root__}      {...this.initRootAttrs()}>
                <GenericPanel type="DOTAChat" ref={this.chat} chatstyle={chatstyle} />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        )
    }
}