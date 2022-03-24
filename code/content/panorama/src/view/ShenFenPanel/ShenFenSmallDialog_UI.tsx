
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "react-panorama-eom";


export class ShenFenSmallDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_0: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_0: 'img_0',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_0 = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"330px","height":"450px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"width":"330px","height":"450px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/card_small_0.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_0_isValid:boolean = true;
img_0_attrs:ImageAttributes={};
img_0_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_0_isValid && 
<Image ref={this.img_0} key="compId_2" style={this.CSS_1_0}  {...this.img_0_attrs} >
{this.img_0_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}