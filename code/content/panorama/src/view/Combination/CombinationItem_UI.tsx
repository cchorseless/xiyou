
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class CombinationItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
heroicon: React.RefObject<ImagePanel>;
lbl_des: React.RefObject<LabelPanel>;
img_rarety: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  heroicon: 'heroicon',  lbl_des: 'lbl_des',  img_rarety: 'img_rarety',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.heroicon = createRef<ImagePanel>();
this.lbl_des = createRef<LabelPanel>();
this.img_rarety = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"380px","height":"80px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"0px","width":"88px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/items/heroes/antimage.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"92px","width":"282px","horizontalAlign":"middle","height":"66px","fontWeight":"bold","fontSize":"25","color":"#ffffff"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"0px","width":"88px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/CardRarity_SSR.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
heroicon_isValid:boolean = true;
heroicon_attrs:ImageAttributes={};
heroicon_childs: Array<JSX.Element> = [];
lbl_des_isValid:boolean = true;
lbl_des_attrs:LabelAttributes={};
lbl_des_childs: Array<JSX.Element> = [];
img_rarety_isValid:boolean = true;
img_rarety_attrs:ImageAttributes={};
img_rarety_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.heroicon_isValid && 
<Image ref={this.heroicon} key="compId_6" style={this.CSS_1_0}  {...this.heroicon_attrs} >
{this.heroicon_childs}
</Image>
}
    {this.lbl_des_isValid && 
<Label text="越深越深" ref={this.lbl_des} key="compId_3" style={this.CSS_1_1}  {...this.lbl_des_attrs} >
{this.lbl_des_childs}
</Label>
}
    {this.img_rarety_isValid && 
<Image ref={this.img_rarety} key="compId_5" style={this.CSS_1_2}  {...this.img_rarety_attrs} >
{this.img_rarety_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}