
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "@demon673/react-panorama";


export class CombinationBottomCountItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img: 'img',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"50px","height":"12px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/combination/exp_bar_0.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_isValid:boolean = true;
img_attrs:ImageAttributes={};
img_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_isValid && 
<Image ref={this.img} className="root" key="compId_2" style={this.CSS_1_0}  {...this.img_attrs} >
{this.img_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}