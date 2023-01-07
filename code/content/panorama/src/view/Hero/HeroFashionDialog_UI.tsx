
import { PanelAttributes } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";


export class HeroFashionDialog_UI<T extends NodePropsData> extends BasePureComponent<T> {
    __root__: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', };
    FUNCNAME = {};

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "600px", "height": "600px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "backgroundImage": "url(\"file://{images}/common/bg_10.png\")" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                <Panel key="compId_2" style={this.CSS_1_0} >
                </Panel>

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}