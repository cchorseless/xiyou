
import { LabelAttributes, PanelAttributes } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";


export class HeroSinglePropItem_UI<T extends NodePropsData> extends BasePureComponent<T> {
    __root__: React.RefObject<Panel>;
    lbl_name: React.RefObject<LabelPanel>;
    NODENAME = { __root__: '__root__', lbl_name: 'lbl_name', };
    FUNCNAME = {};

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.lbl_name = createRef<LabelPanel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "500px", "height": "50px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "8px", "x": "5px", "width": "137px", "height": "47px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
    CSS_1_1: Partial<VCSSStyleDeclaration> = { "y": "6px", "x": "147px", "width": "137px", "height": "47px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    lbl_name_isValid: boolean = true;
    lbl_name_attrs: LabelAttributes = {};
    lbl_name_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.lbl_name_isValid &&
                    <Label text="初始属性:" ref={this.lbl_name} key="compId_2" style={this.CSS_1_0}  {...this.lbl_name_attrs} >
                        {this.lbl_name_childs}
                    </Label>
                }
                {this.lbl_name_isValid &&
                    <Label text="1000" ref={this.lbl_name} key="compId_3" style={this.CSS_1_1}  {...this.lbl_name_attrs} >
                        {this.lbl_name_childs}
                    </Label>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}