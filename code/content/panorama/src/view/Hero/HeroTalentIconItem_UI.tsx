
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, LabelAttributes } from "@demon673/react-panorama";


export class HeroTalentIconItem_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    lbl_name: React.RefObject<LabelPanel>;
    NODENAME = { __root__: '__root__', lbl_name: 'lbl_name', };
    FUNCNAME = {};

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.lbl_name = createRef<LabelPanel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "150px", "height": "80px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "23px", "x": "11px", "width": "119px", "height": "41px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
    CSS_1_1: Partial<VCSSStyleDeclaration> = { "y": "34px", "x": "94px", "width": "55px", "height": "44px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/check_77.png\")", "backgroundSize": "100% 100%" }

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
                    <Label text="魔法回复" ref={this.lbl_name} key="compId_3" style={this.CSS_1_0}  {...this.lbl_name_attrs} >
                        {this.lbl_name_childs}
                    </Label>
                }
                <Image visible={false} key="compId_2" style={this.CSS_1_1} >
                </Image>

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}