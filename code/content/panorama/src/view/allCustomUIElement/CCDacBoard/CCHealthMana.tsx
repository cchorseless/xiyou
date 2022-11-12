import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../CCPanel/CCPanel";

interface IHealthMana extends NodePropsData {
}

export class CCHealthMana extends CCPanel<IHealthMana> {

    defaultStyle() {
        return { flowChildren: "right-wrap", width: "100%" } as any
    }

    render() {
        return (
            this.__root___isValid && (
                <GenericPanel type="DOTAHealthMana" id="health_mana" ref={this.__root__}  {...this.initRootAttrs()} onload={(panel) => {
                    const HealthManaContainer = panel.FindChildTraverse("HealthManaContainer");
                    HealthManaContainer!.style.marginLeft = "0px";
                    HealthManaContainer!.style.marginRight = "0px";
                }} >
                    {this.props.children}
                    {this.__root___childs}
                </GenericPanel>
            )
        );
    }
}
