
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class ChallengeIconItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_iconbg: React.RefObject<ImagePanel>;
img_icon: React.RefObject<ImagePanel>;
lbl_lv: React.RefObject<LabelPanel>;
img_costbg: React.RefObject<ImagePanel>;
img_cost: React.RefObject<ImagePanel>;
lbl_cost: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  img_iconbg: 'img_iconbg',  img_icon: 'img_icon',  lbl_lv: 'lbl_lv',  img_costbg: 'img_costbg',  img_cost: 'img_cost',  lbl_cost: 'lbl_cost',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_iconbg = createRef<ImagePanel>();
this.img_icon = createRef<ImagePanel>();
this.lbl_lv = createRef<LabelPanel>();
this.img_costbg = createRef<ImagePanel>();
this.img_cost = createRef<ImagePanel>();
this.lbl_cost = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"120px","height":"130px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"10px","width":"100px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/challenge/round_bg.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"19px","x":"13px","width":"88px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/challenge/wave_challenge_crystal.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"76px","x":"63px","width":"46px","height":"20px","fontWeight":"bold","fontSize":"18","color":"#ffffff"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"94px","x":"2px","width":"116px","height":"35px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/challenge/cost_bg_gold.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"14px","width":"25px","height":"25px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/money.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"7px","x":"42px","width":"56px","height":"28px","fontWeight":"bold","fontSize":"20","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_iconbg_isValid:boolean = true;
img_iconbg_attrs:ImageAttributes={};
img_iconbg_childs: Array<JSX.Element> = [];
img_icon_isValid:boolean = true;
img_icon_attrs:ImageAttributes={};
img_icon_childs: Array<JSX.Element> = [];
lbl_lv_isValid:boolean = true;
lbl_lv_attrs:LabelAttributes={};
lbl_lv_childs: Array<JSX.Element> = [];
img_costbg_isValid:boolean = true;
img_costbg_attrs:ImageAttributes={};
img_costbg_childs: Array<JSX.Element> = [];
img_cost_isValid:boolean = true;
img_cost_attrs:ImageAttributes={};
img_cost_childs: Array<JSX.Element> = [];
lbl_cost_isValid:boolean = true;
lbl_cost_attrs:LabelAttributes={};
lbl_cost_childs: Array<JSX.Element> = [];

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
<Image ref={this.img_icon} key="compId_3" style={this.CSS_1_1}  {...this.img_icon_attrs} >
{this.img_icon_childs}
</Image>
}
    {this.lbl_lv_isValid && 
<Label text="Lv.20" ref={this.lbl_lv} key="compId_7" style={this.CSS_1_2}  {...this.lbl_lv_attrs} >
{this.lbl_lv_childs}
</Label>
}
    {this.img_costbg_isValid && 
<Image ref={this.img_costbg} key="compId_4" style={this.CSS_1_3}  {...this.img_costbg_attrs}>
        {this.img_cost_isValid && 
<Image ref={this.img_cost} key="compId_5" style={this.CSS_2_0}  {...this.img_cost_attrs} >
{this.img_cost_childs}
</Image>
}
        {this.lbl_cost_isValid && 
<Label text="1000" ref={this.lbl_cost} key="compId_6" style={this.CSS_2_1}  {...this.lbl_cost_attrs} >
{this.lbl_cost_childs}
</Label>
}
    
{this.img_costbg_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}