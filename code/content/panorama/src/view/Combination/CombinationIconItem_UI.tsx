
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "react-panorama-eom";


export class CombinationIconItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_icon: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_icon: 'img_icon',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_icon = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"100px","height":"100px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"100px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/combination/icon/animal.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_icon_isValid:boolean = true;
img_icon_attrs:ImageAttributes={};
img_icon_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_icon_isValid && 
<Image ref={this.img_icon} key="compId_2" style={this.CSS_1_0}  {...this.img_icon_attrs} >
{this.img_icon_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}