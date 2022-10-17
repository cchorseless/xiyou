
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, LabelAttributes } from "@demon673/react-panorama";


export class TipsPanel_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    lbl: React.RefObject<LabelPanel>;
    NODENAME = { __root__: '__root__', lbl: 'lbl', };
    FUNCNAME = {};

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.lbl = createRef<LabelPanel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "500px", "verticalAlign": "center", "horizontalAlign": "center", "height": "100px", "backgroundColor": "#000000" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "verticalAlign": "center", "horizontalAlign": "center", "height": "76px", "fontSize": "50", "color": "#f8f4f4", "x": "0px", "y": "0px" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    lbl_isValid: boolean = true;
    lbl_attrs: LabelAttributes = {};
    lbl_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.lbl_isValid &&
                    <Label text="ssss" ref={this.lbl} key="compId_2" style={this.CSS_1_0}  {...this.lbl_attrs} >
                        {this.lbl_childs}
                    </Label>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}