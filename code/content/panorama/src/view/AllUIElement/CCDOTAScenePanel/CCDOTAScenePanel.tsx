import React from "react";

import { CCPanel } from "../CCPanel/CCPanel";

interface ICCDOTAScenePanel extends NodePropsData {
    /**dota2单位名字 */
    unit: string;
    camera?: "default_camera" | string,
    drawbackground?: boolean,
    allowrotation?: boolean,
    rotateonmousemove?: boolean,
    antialias?: boolean,
    renderdeferred?: boolean,
    particleonly?: boolean,
    light?: "global_light" | string,
}
export class CCDOTAScenePanel extends CCPanel<ICCDOTAScenePanel, ScenePanel>{
    defaultClass() { return "CC_DOTAScenePanel"; };
    static defaultProps = {
        camera: "default_camera",
        drawbackground: false,
        allowrotation: true,
        rotateonmousemove: true,
        antialias: true,
        renderdeferred: false,
        particleonly: false,
        light: "global_light",
        width: "200px",
        height: "200px",
    }
    onInitUI() {
    }

    render() {
        return (
            this.__root___isValid &&
            <DOTAScenePanel ref={this.__root__}    {...this.initRootAttrs()}>
                {this.props.children}
                {this.__root___childs}
            </DOTAScenePanel>
        );
    }
}
