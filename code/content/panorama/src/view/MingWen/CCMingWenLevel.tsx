import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import "./CCMingWenLevel.less";

interface ICCMingWenLevel {
    level: number;
}

export class CCMingWenLevel extends CCPanel<ICCMingWenLevel> {

    render() {
        return (
            <Panel className="CCMingWenLevel" ref={this.__root__}  {...this.initRootAttrs()}>
                <Panel id="CCMingWenLevelBorder" />
                <Label id="CCMingWenLevelLabel" text={this.props.level} />
            </Panel>
        );
    }
}

