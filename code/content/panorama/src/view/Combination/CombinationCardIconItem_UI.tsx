
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "@demon673/react-panorama";


export class CombinationCardIconItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_iconbg: React.RefObject<ImagePanel>;
img_icon: React.RefObject<ImagePanel>;
img_check: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_iconbg: 'img_iconbg',  img_icon: 'img_icon',  img_check: 'img_check',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_iconbg = createRef<ImagePanel>();
this.img_icon = createRef<ImagePanel>();
this.img_check = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"80px","height":"80px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"80px","height":"80px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/frame_A.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"2px","width":"75px","height":"75px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/card_icon/antimage.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"50px","x":"44px","width":"35px","height":"27px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/hero/check_77.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_iconbg_isValid:boolean = true;
img_iconbg_attrs:ImageAttributes={};
img_iconbg_childs: Array<JSX.Element> = [];
img_icon_isValid:boolean = true;
img_icon_attrs:ImageAttributes={};
img_icon_childs: Array<JSX.Element> = [];
img_check_isValid:boolean = true;
img_check_attrs:ImageAttributes={};
img_check_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_iconbg_isValid && 
<Image ref={this.img_iconbg} key="compId_2" style={this.CSS_1_0}  {...this.img_iconbg_attrs} >
{this.img_iconbg_childs}
</Image>
}
    {this.img_icon_isValid && 
<Image ref={this.img_icon} key="compId_4" style={this.CSS_1_1}  {...this.img_icon_attrs} >
{this.img_icon_childs}
</Image>
}
    {this.img_check_isValid && 
<Image ref={this.img_check} key="compId_5" style={this.CSS_1_2}  {...this.img_check_attrs} >
{this.img_check_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}