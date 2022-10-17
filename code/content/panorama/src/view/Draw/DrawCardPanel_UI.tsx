
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, ImageAttributes } from "@demon673/react-panorama";


export class DrawCardPanel_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    box_model: React.RefObject<Panel>;
    img_bg: React.RefObject<ImagePanel>;
    btn_close: React.RefObject<ImagePanel>;
    onbtn_close_click = (...args: any[]) => { };
    box: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', box_model: 'box_model', img_bg: 'img_bg', btn_close: 'btn_close', box: 'box', };
    FUNCNAME = { onbtn_close_click: { nodeName: "btn_close", type: "onactivate" }, };

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.box_model = createRef<Panel>();
        this.img_bg = createRef<ImagePanel>();
        this.btn_close = createRef<ImagePanel>();
        this.box = createRef<Panel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "1600px", "height": "600px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "80px", "x": "55px", "height": "250px" }
    CSS_1_1: Partial<VCSSStyleDeclaration> = { "y": "323px", "x": "55px", "width": "1500px", "height": "250px" }
    CSS_2_0: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px", "width": "1500px", "height": "250px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/dashboard_background.png\")", "backgroundSize": "100% 100%" }
    CSS_2_1: Partial<VCSSStyleDeclaration> = { "y": "10px", "width": "48px", "marginTop": "10px", "marginRight": "10px", "height": "48px", "backgroundImage": "url(\"file://{images}/common/close_png.png\")", "horizontalAlign": "right" }
    CSS_2_2: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px", "height": "250px" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    box_model_isValid: boolean = true;
    box_model_attrs: PanelAttributes = {};
    box_model_childs: Array<JSX.Element> = [];
    img_bg_isValid: boolean = true;
    img_bg_attrs: ImageAttributes = {};
    img_bg_childs: Array<JSX.Element> = [];
    btn_close_isValid: boolean = true;
    btn_close_attrs: ImageAttributes = {};
    btn_close_childs: Array<JSX.Element> = [];
    box_isValid: boolean = true;
    box_attrs: PanelAttributes = {};
    box_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.box_model_isValid &&
                    <Panel ref={this.box_model} key="compId_12" style={this.CSS_1_0}  {...this.box_model_attrs} >
                        {this.box_model_childs}
                    </Panel>
                }
                <Panel key="compId_13" style={this.CSS_1_1}>
                    {this.img_bg_isValid &&
                        <Image ref={this.img_bg} key="compId_4" style={this.CSS_2_0}  {...this.img_bg_attrs} >
                            {this.img_bg_childs}
                        </Image>
                    }
                    {this.btn_close_isValid &&
                        <Image ref={this.btn_close} onactivate={this.onbtn_close_click} key="compId_5" style={this.CSS_2_1}  {...this.btn_close_attrs} >
                            {this.btn_close_childs}
                        </Image>
                    }
                    {this.box_isValid &&
                        <Panel ref={this.box} key="compId_10" style={this.CSS_2_2}  {...this.box_attrs} >
                            {this.box_childs}
                        </Panel>
                    }

                </Panel>

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}