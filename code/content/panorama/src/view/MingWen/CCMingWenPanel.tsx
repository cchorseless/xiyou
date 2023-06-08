
import React from "react";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMingWenItem } from "./CCMingWenItem";
import "./CCMingWenPanel.less";

interface ICCMingWenPanel {
}

export class CCMingWenPanel extends CCPanel<ICCMingWenPanel> {
    render() {
        const level = this.props.level;

        return <Panel ref={this.__root__} className={"CCMingWenPanel"} hittest={false} {...this.initRootAttrs()}>
            <CCPanel flowChildren="right">
                <CCMingWenItem type="diamond" color="Red" />
                <CCMingWenItem type="diamond" color="Red" itemid={"1110"} />
                <CCMingWenItem type="diamond" color="Red" block={true} />
                <CCMingWenItem type="diamond" color="Red" />
                <CCMingWenItem type="diamond" color="Red" />
            </CCPanel>
            <CCPanel flowChildren="right">
                <CCMingWenItem type="diamond" color="Blue" />
                <CCMingWenItem type="diamond" color="Blue" />
                <CCMingWenItem type="diamond" color="Blue" block={true} />
                <CCMingWenItem type="diamond" color="Blue" />
                <CCMingWenItem type="diamond" color="Blue" />
            </CCPanel>
            <CCPanel flowChildren="right">
                <CCMingWenItem type="diamond" color="Green" />
                <CCMingWenItem type="diamond" color="Green" />
                <CCMingWenItem type="diamond" color="Green" block={true} />
                <CCMingWenItem type="diamond" color="Green" />
                <CCMingWenItem type="diamond" color="Green" />
            </CCPanel>
            {this.props.children}
            {this.__root___childs}
        </Panel>
    }
}