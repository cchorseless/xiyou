
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";
import {CardTitleItem} from '../Card/CardTitleItem' ;


export class DrawCardBottomItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
box_all: React.RefObject<Panel>;
frameBg: React.RefObject<ImagePanel>;
box_skill: React.RefObject<Panel>;
box_combina: React.RefObject<Panel>;
btn_wanted: React.RefObject<Button>;
btn_share2public: React.RefObject<Button>;
titleitem: React.RefObject<CardTitleItem>;
lbl_population: React.RefObject<LabelPanel>;
lbl_gold: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  box_all: 'box_all',  frameBg: 'frameBg',  box_skill: 'box_skill',  box_combina: 'box_combina',  btn_wanted: 'btn_wanted',  btn_share2public: 'btn_share2public',  titleitem: 'titleitem',  lbl_population: 'lbl_population',  lbl_gold: 'lbl_gold',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.box_all = createRef<Panel>();
this.frameBg = createRef<ImagePanel>();
this.box_skill = createRef<Panel>();
this.box_combina = createRef<Panel>();
this.btn_wanted = createRef<Button>();
this.btn_share2public = createRef<Button>();
this.titleitem = createRef<CardTitleItem>();
this.lbl_population = createRef<LabelPanel>();
this.lbl_gold = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"330px","height":"220px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"width":"330px","height":"220px"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"330px","height":"220px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/item_rarity_border_5.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"50px","x":"0px","uiScaleY":"50%","uiScaleX":"50%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"117px","x":"0px","uiScaleY":"35%","uiScaleX":"35%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"122px","x":"228px","width":"47px","height":"44px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/likes.png\")","backgroundSize":"100% 100%"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"121px","x":"277px","width":"47px","height":"44px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/share.png\")","backgroundSize":"100% 100%"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"10px","x":"34px"}
CSS_2_6 : Partial<VCSSStyleDeclaration>  = {"y":"164px","x":"146px","width":"48px","height":"48px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/money.png\")","backgroundSize":"100% 100%"}
CSS_2_7 : Partial<VCSSStyleDeclaration>  = {"y":"167px","x":"7px","width":"48px","height":"36px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/population_png.png\")","backgroundSize":"100% 100%"}
CSS_2_8 : Partial<VCSSStyleDeclaration>  = {"y":"165px","x":"61px","width":"61px","height":"42px","fontWeight":"bold","fontSize":"35","color":"#ffffff"}
CSS_2_9 : Partial<VCSSStyleDeclaration>  = {"y":"167px","x":"203px","height":"42px","fontWeight":"bold","fontSize":"35","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
box_all_isValid:boolean = true;
box_all_attrs:PanelAttributes={};
box_all_childs: Array<JSX.Element> = [];
frameBg_isValid:boolean = true;
frameBg_attrs:ImageAttributes={};
frameBg_childs: Array<JSX.Element> = [];
box_skill_isValid:boolean = true;
box_skill_attrs:PanelAttributes={};
box_skill_childs: Array<JSX.Element> = [];
box_combina_isValid:boolean = true;
box_combina_attrs:PanelAttributes={};
box_combina_childs: Array<JSX.Element> = [];
btn_wanted_isValid:boolean = true;
btn_wanted_attrs:PanelAttributes={};
btn_wanted_childs: Array<JSX.Element> = [];
btn_share2public_isValid:boolean = true;
btn_share2public_attrs:PanelAttributes={};
btn_share2public_childs: Array<JSX.Element> = [];
titleitem_isValid:boolean = true;
titleitem_attrs:any={};
titleitem_childs: Array<JSX.Element> = [];
lbl_population_isValid:boolean = true;
lbl_population_attrs:LabelAttributes={};
lbl_population_childs: Array<JSX.Element> = [];
lbl_gold_isValid:boolean = true;
lbl_gold_attrs:LabelAttributes={};
lbl_gold_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.box_all_isValid && 
<Panel ref={this.box_all} key="compId_19" style={this.CSS_1_0}  {...this.box_all_attrs}>
        {this.frameBg_isValid && 
<Image ref={this.frameBg} key="compId_18" style={this.CSS_2_0}  {...this.frameBg_attrs} >
{this.frameBg_childs}
</Image>
}
        {this.box_skill_isValid && 
<Panel ref={this.box_skill} key="compId_11" style={this.CSS_2_1}  {...this.box_skill_attrs} >
{this.box_skill_childs}
</Panel>
}
        {this.box_combina_isValid && 
<Panel ref={this.box_combina} key="compId_12" style={this.CSS_2_2}  {...this.box_combina_attrs} >
{this.box_combina_childs}
</Panel>
}
        {this.btn_wanted_isValid && 
<Button ref={this.btn_wanted} key="compId_9" style={this.CSS_2_3}  {...this.btn_wanted_attrs} >
{this.btn_wanted_childs}
</Button>
}
        {this.btn_share2public_isValid && 
<Button ref={this.btn_share2public} key="compId_10" style={this.CSS_2_4}  {...this.btn_share2public_attrs} >
{this.btn_share2public_childs}
</Button>
}
        {this.titleitem_isValid && 
<CardTitleItem ref={this.titleitem} key="compId_8" style={this.CSS_2_5}  {...this.titleitem_attrs} >
{this.titleitem_childs}
</CardTitleItem>
}
        <Image key="compId_13" style={this.CSS_2_6} >
</Image>
        <Image key="compId_14" style={this.CSS_2_7} >
</Image>
        {this.lbl_population_isValid && 
<Label text="x2" ref={this.lbl_population} key="compId_15" style={this.CSS_2_8}  {...this.lbl_population_attrs} >
{this.lbl_population_childs}
</Label>
}
        {this.lbl_gold_isValid && 
<Label text="x1500" ref={this.lbl_gold} key="compId_16" style={this.CSS_2_9}  {...this.lbl_gold_attrs} >
{this.lbl_gold_childs}
</Label>
}
    
{this.box_all_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}