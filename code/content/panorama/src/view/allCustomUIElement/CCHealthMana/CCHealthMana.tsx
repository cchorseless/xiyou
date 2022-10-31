import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

interface IHealthMana extends NodePropsData {
}

export class CCHealthMana extends CCPanel<IHealthMana> {

    render() {
        return (
            this.__root___isValid && (
                <Panel
                    id="BuffContainer"
                    key="compId_1" className="root" ref={this.__root__}  {...this.initRootAttrs()}>
                    <GenericPanel type="DOTAHealthMana" id="health_mana" style={{ flowChildren: "right-wrap", width: "100%" }} />
                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
