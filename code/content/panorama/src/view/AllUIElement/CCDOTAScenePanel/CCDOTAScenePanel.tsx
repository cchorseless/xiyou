import { DOTAScenePanelAttributes } from "@demon673/react-panorama";
import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDOTAScenePanel.less";

interface ICCDOTAScenePanel extends DOTAScenePanelAttributes {
    /**dota2单位名字 */
    unit: string;
    /**显示高光 */
    showlight?: boolean;
    camera?: "default_camera" | string,
    drawbackground?: boolean,
    allowrotation?: boolean,
    rotateonmousemove?: boolean,
    antialias?: boolean,
    renderdeferred?: boolean,
    particleonly?: boolean,
    light?: "global_light" | string,
}
export class CCDOTAScenePanel extends CCPanel<ICCDOTAScenePanel>{
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
            <Panel className="CCDOTAScenePanel" ref={this.__root__}   {...this.initRootAttrs()}>
                <Panel className="DOTASceneSelectLightBg" visible={this.props.showlight} />
                <Panel className="DOTASceneSelectLight" visible={this.props.showlight} />
                {this.props.children}
                {this.__root___childs}
                <DOTAScenePanel className={"Custom_DOTAScenePanel"} hittest={false} {...this.props} />
            </Panel>
        );
    }
}
