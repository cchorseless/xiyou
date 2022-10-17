
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, ImageAttributes } from "@demon673/react-panorama";


export class CardSamllIconItem_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    img_cion: React.RefObject<ImagePanel>;
    NODENAME = { __root__: '__root__', img_cion: 'img_cion', };
    FUNCNAME = {};

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.img_cion = createRef<ImagePanel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "50px", "height": "50px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px", "width": "50px", "height": "50px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/card/card_icon/antimage.png\")", "backgroundSize": "100% 100%" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    img_cion_isValid: boolean = true;
    img_cion_attrs: ImageAttributes = {};
    img_cion_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.img_cion_isValid &&
                    <Image ref={this.img_cion} key="compId_3" style={this.CSS_1_0}  {...this.img_cion_attrs} >
                        {this.img_cion_childs}
                    </Image>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}