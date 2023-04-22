import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";

import "./CCPortrait.less";
interface ICCPortrait extends NodePropsData {
    hudType: string
}

export class CCPortrait extends CCPanel<ICCPortrait> {
    onStartUI() {
        // this.__root__.current!.FindChildTraverse("InspectButton")?.style.marginLeft = "80px";
        // this.__root__.current!.FindChildTraverse("HeroViewButton")?.style.marginLeft = "50px";
    }
    render() {
        return (
            this.__root___isValid && (
                <GenericPanel type="DOTAPortrait" className="PortraitLocation CC_root" id={this.props.hudType} ref={this.__root__}  >
                    {this.props.children}
                    {this.__root___childs}
                </GenericPanel>
            )
        );
    }
}

