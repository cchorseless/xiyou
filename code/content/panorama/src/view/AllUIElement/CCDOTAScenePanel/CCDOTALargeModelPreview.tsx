import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDOTALargeModelPreview.less";

interface ICCDOTALargeModelPreview {
    unit: string;
}
export class CCDOTALargeModelPreview extends CCPanel<ICCDOTALargeModelPreview>{
    static defaultProps = {
        camera: "default_camera",
        showlight: false,
        drawbackground: false,
        allowrotation: true,
        rotateonmousemove: true,
        antialias: true,
        renderdeferred: false,
        particleonly: false,
        light: "global_light",
    }
    onInitUI() {
    }

    render() {
        return (
            <Panel className="CCDOTALargeModelPreview" ref={this.__root__}   {...this.initRootAttrs()}>
                <GenericPanel type="DOTALargeModelPreview" id="ModelPreview" hittest={false} {... this.props} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        );
    }
}