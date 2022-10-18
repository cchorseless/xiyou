
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "@demon673/react-panorama";


export class CardTitleItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
nameBg: React.RefObject<ImagePanel>;
box: React.RefObject<Panel>;
img_icon: React.RefObject<ImagePanel>;
lbl_name: React.RefObject<LabelPanel>;
img_rarety: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  nameBg: 'nameBg',  box: 'box',  img_icon: 'img_icon',  lbl_name: 'lbl_name',  img_rarety: 'img_rarety',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.nameBg = createRef<ImagePanel>();
this.box = createRef<Panel>();
this.img_icon = createRef<ImagePanel>();
this.lbl_name = createRef<LabelPanel>();
this.img_rarety = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"230px","height":"40px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"3px","x":"40px","width":"160px","height":"32px","backgroundImage":"url(\"file://{images}/common/rarity/bg_R.png\")"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"1px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/card_icon/abyssal_underlord.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"5px","x":"42px","height":"30px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"0px","width":"38px","height":"43px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/rare_C.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
nameBg_isValid:boolean = true;
nameBg_attrs:ImageAttributes={};
nameBg_childs: Array<JSX.Element> = [];
box_isValid:boolean = true;
box_attrs:PanelAttributes={};
box_childs: Array<JSX.Element> = [];
img_icon_isValid:boolean = true;
img_icon_attrs:ImageAttributes={};
img_icon_childs: Array<JSX.Element> = [];
lbl_name_isValid:boolean = true;
lbl_name_attrs:LabelAttributes={};
lbl_name_childs: Array<JSX.Element> = [];
img_rarety_isValid:boolean = true;
img_rarety_attrs:ImageAttributes={};
img_rarety_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.nameBg_isValid && 
<Image ref={this.nameBg} key="compId_5" style={this.CSS_1_0}  {...this.nameBg_attrs} >
{this.nameBg_childs}
</Image>
}
    {this.box_isValid && 
<Panel ref={this.box} key="compId_7" style={this.CSS_1_1}  {...this.box_attrs}>
        {this.img_icon_isValid && 
<Image ref={this.img_icon} key="compId_2" style={this.CSS_2_0}  {...this.img_icon_attrs} >
{this.img_icon_childs}
</Image>
}
        {this.lbl_name_isValid && 
<Label text="水晶侍女啊" ref={this.lbl_name} key="compId_6" style={this.CSS_2_1}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
        {this.img_rarety_isValid && 
<Image ref={this.img_rarety} key="compId_4" style={this.CSS_2_2}  {...this.img_rarety_attrs} >
{this.img_rarety_childs}
</Image>
}
    
{this.box_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}