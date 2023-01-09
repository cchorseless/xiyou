
import { LabelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCLinkLabel.less";


interface ICCLinkLabel extends LabelAttributes {
    text: string,
    url: string;
}


export class CCLinkLabel extends CCPanel<ICCLinkLabel, LabelPanel>{
    render() {
        return (
            <Label className="CCLinkLabel" text={this.props.text}
                onactivate={() => $.DispatchEvent("ExternalBrowserGoToURL", this.props.url)}
                ref={this.__root__} {...this.initRootAttrs()} />
        )
    }
}