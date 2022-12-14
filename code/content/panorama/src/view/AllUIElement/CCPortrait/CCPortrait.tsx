import React, { createRef, PureComponent } from "react";
import { DOTAParticleScenePanelAttributes, PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";
import { NodePropsData } from "../../../libs/BasePureComponent";
import "./CCPortrait.less";
interface ICCPortrait extends NodePropsData {
    hudType: string
}

export class CCPortrait extends CCPanel<ICCPortrait> {
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

