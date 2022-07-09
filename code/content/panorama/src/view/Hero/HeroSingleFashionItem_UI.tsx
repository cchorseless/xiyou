
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "react-panorama-eom";


export class HeroSingleFashionItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_iconBg: React.RefObject<ImagePanel>;
img_icon: React.RefObject<ImagePanel>;
img_cion: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_iconBg: 'img_iconBg',  img_icon: 'img_icon',  img_cion: 'img_cion',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_iconBg = createRef<ImagePanel>();
this.img_icon = createRef<ImagePanel>();
this.img_cion = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"100px","height":"100px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"width":"100px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/frame_A.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"100px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/frame_A.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"50px","x":"0px","width":"50px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/card_icon/antimage.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_iconBg_isValid:boolean = true;
img_iconBg_attrs:ImageAttributes={};
img_iconBg_childs: Array<JSX.Element> = [];
img_icon_isValid:boolean = true;
img_icon_attrs:ImageAttributes={};
img_icon_childs: Array<JSX.Element> = [];
img_cion_isValid:boolean = true;
img_cion_attrs:ImageAttributes={};
img_cion_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_iconBg_isValid && 
<Image ref={this.img_iconBg} key="compId_2" style={this.CSS_1_0}  {...this.img_iconBg_attrs} >
{this.img_iconBg_childs}
</Image>
}
    {this.img_icon_isValid && 
<Image ref={this.img_icon} key="compId_3" style={this.CSS_1_1}  {...this.img_icon_attrs} >
{this.img_icon_childs}
</Image>
}
    {this.img_cion_isValid && 
<Image ref={this.img_cion} key="compId_4" style={this.CSS_1_2}  {...this.img_cion_attrs} >
{this.img_cion_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}