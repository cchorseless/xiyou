
import { LabelAttributes, PanelAttributes } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";


export class HeroFashionItem_UI<T extends NodePropsData> extends BasePureComponent<T> {
    __root__: React.RefObject<Panel>;
    lbl_starstone: React.RefObject<LabelPanel>;
    lbl_dresschange: React.RefObject<LabelPanel>;
    lbl_dressonekey: React.RefObject<LabelPanel>;
    NODENAME = { __root__: '__root__', lbl_starstone: 'lbl_starstone', lbl_dresschange: 'lbl_dresschange', lbl_dressonekey: 'lbl_dressonekey', };
    FUNCNAME = {};

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.lbl_starstone = createRef<LabelPanel>();
        this.lbl_dresschange = createRef<LabelPanel>();
        this.lbl_dressonekey = createRef<LabelPanel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "600px", "height": "650px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "x": "18px", "width": "202px", "marginTop": "567px", "height": "52px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/status_bg.png\")", "backgroundSize": "100% 100%" }
    CSS_2_0: Partial<VCSSStyleDeclaration> = { "y": "1px", "x": "19px", "width": "50px", "height": "50px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/icon_StarStone.png\")", "backgroundSize": "100% 100%" }
    CSS_2_1: Partial<VCSSStyleDeclaration> = { "y": "11px", "x": "91px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
    CSS_1_1: Partial<VCSSStyleDeclaration> = { "y": "557px", "x": "407px", "width": "181px", "height": "77px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/btn_orange.png\")", "backgroundSize": "100% 100%" }
    CSS_2_0_0: Partial<VCSSStyleDeclaration> = { "y": "23px", "x": "35px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
    CSS_1_2: Partial<VCSSStyleDeclaration> = { "y": "48px", "x": "13px", "width": "574px", "height": "498px" }
    CSS_1_3: Partial<VCSSStyleDeclaration> = { "y": "555px", "x": "218px", "width": "184px", "height": "77px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/btn_green.png\")", "backgroundSize": "100% 100%" }
    CSS_2_0_1: Partial<VCSSStyleDeclaration> = { "y": "23px", "x": "35px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
    CSS_1_4: Partial<VCSSStyleDeclaration> = { "y": "1px", "x": "15px", "width": "40px", "height": "40px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/checkbox_on.png\")", "backgroundSize": "100% 100%" }
    CSS_1_5: Partial<VCSSStyleDeclaration> = { "y": "10px", "x": "63px", "width": "208.97216796875px", "height": "25px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }
    CSS_1_6: Partial<VCSSStyleDeclaration> = { "y": "8px", "x": "379px", "width": "40px", "height": "40px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/radio_on.png\")", "backgroundSize": "100% 100%" }
    CSS_1_7: Partial<VCSSStyleDeclaration> = { "y": "14px", "x": "428px", "fontWeight": "bold", "fontSize": "20", "color": "#ffffff" }
    CSS_1_8: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "479px", "width": "40px", "height": "40px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/radio_off.png\")", "backgroundSize": "100% 100%" }
    CSS_1_9: Partial<VCSSStyleDeclaration> = { "y": "12px", "x": "526px", "fontWeight": "bold", "fontSize": "20", "color": "#ffffff" }
    CSS_1_10: Partial<VCSSStyleDeclaration> = { "y": "11px", "x": "313px", "width": "62px", "height": "31px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    lbl_starstone_isValid: boolean = true;
    lbl_starstone_attrs: LabelAttributes = {};
    lbl_starstone_childs: Array<JSX.Element> = [];
    lbl_dresschange_isValid: boolean = true;
    lbl_dresschange_attrs: LabelAttributes = {};
    lbl_dresschange_childs: Array<JSX.Element> = [];
    lbl_dressonekey_isValid: boolean = true;
    lbl_dressonekey_attrs: LabelAttributes = {};
    lbl_dressonekey_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                <Image key="compId_2" style={this.CSS_1_0}>
                    <Image key="compId_5" style={this.CSS_2_0} >
                    </Image>
                    {this.lbl_starstone_isValid &&
                        <Label text="6666" ref={this.lbl_starstone} key="compId_6" style={this.CSS_2_1}  {...this.lbl_starstone_attrs} >
                            {this.lbl_starstone_childs}
                        </Label>
                    }

                </Image>
                <Image key="compId_3" style={this.CSS_1_1}>
                    {this.lbl_dresschange_isValid &&
                        <Label text="合成分解" ref={this.lbl_dresschange} key="compId_7" style={this.CSS_2_0_0}  {...this.lbl_dresschange_attrs} >
                            {this.lbl_dresschange_childs}
                        </Label>
                    }

                </Image>
                <Panel key="compId_4" style={this.CSS_1_2} >
                </Panel>
                <Image key="compId_8" style={this.CSS_1_3}>
                    {this.lbl_dressonekey_isValid &&
                        <Label text="一键穿戴" ref={this.lbl_dressonekey} key="compId_9" style={this.CSS_2_0_1}  {...this.lbl_dressonekey_attrs} >
                            {this.lbl_dressonekey_childs}
                        </Label>
                    }

                </Image>
                <Image key="compId_10" style={this.CSS_1_4} >
                </Image>
                {this.lbl_dressonekey_isValid &&
                    <Label text="显示全部(100/200)" ref={this.lbl_dressonekey} key="compId_11" style={this.CSS_1_5}  {...this.lbl_dressonekey_attrs} >
                        {this.lbl_dressonekey_childs}
                    </Label>
                }
                <Image key="compId_12" style={this.CSS_1_6} >
                </Image>
                {this.lbl_dressonekey_isValid &&
                    <Label text="评分" ref={this.lbl_dressonekey} key="compId_13" style={this.CSS_1_7}  {...this.lbl_dressonekey_attrs} >
                        {this.lbl_dressonekey_childs}
                    </Label>
                }
                <Image key="compId_14" style={this.CSS_1_8} >
                </Image>
                {this.lbl_dressonekey_isValid &&
                    <Label text="稀有度" ref={this.lbl_dressonekey} key="compId_15" style={this.CSS_1_9}  {...this.lbl_dressonekey_attrs} >
                        {this.lbl_dressonekey_childs}
                    </Label>
                }
                {this.lbl_dressonekey_isValid &&
                    <Label text="排序:" ref={this.lbl_dressonekey} key="compId_16" style={this.CSS_1_10}  {...this.lbl_dressonekey_attrs} >
                        {this.lbl_dressonekey_childs}
                    </Label>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}