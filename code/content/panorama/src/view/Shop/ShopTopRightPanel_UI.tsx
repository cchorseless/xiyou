
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, ImageAttributes } from "@demon673/react-panorama";


export class ShopTopRightPanel_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    btn_shop: React.RefObject<ImagePanel>;
    onbtn_shop = (...args: any[]) => { };
    NODENAME = { __root__: '__root__', btn_shop: 'btn_shop', };
    FUNCNAME = { onbtn_shop: { nodeName: "btn_shop", type: "onmouseactivate" }, };

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.btn_shop = createRef<ImagePanel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "500px", "height": "400px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "80px", "x": "27px", "width": "120px", "height": "120px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/bg_27.png\")", "backgroundSize": "100% 100%" }
    CSS_2_0: Partial<VCSSStyleDeclaration> = { "y": "20px", "x": "30px", "width": "60px", "height": "60px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/btn_icon_shop.png\")", "backgroundSize": "100% 100%" }
    CSS_2_1: Partial<VCSSStyleDeclaration> = { "y": "85px", "x": "16px" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    btn_shop_isValid: boolean = true;
    btn_shop_attrs: ImageAttributes = {};
    btn_shop_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.btn_shop_isValid &&
                    <Image ref={this.btn_shop} onmouseactivate={this.onbtn_shop} key="compId_2" style={this.CSS_1_0}  {...this.btn_shop_attrs}>
                        <Image key="compId_3" style={this.CSS_2_0} >
                        </Image>
                        <Label key="compId_4" style={this.CSS_2_1} >
                        </Label>

                        {this.btn_shop_childs}
                    </Image>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}