
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes,ImageAttributes } from "react-panorama-eom";


export class ChallengeShopItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_poplvup: React.RefObject<Button>;
onbtnpop_click = (...args: any[]) => { };
panel_lvpop0: React.RefObject<Panel>;
lbl_lvpopdes: React.RefObject<LabelPanel>;
lbl_lvpopulationdes: React.RefObject<LabelPanel>;
panel_lvpop1: React.RefObject<Panel>;
img_popneed0: React.RefObject<ImagePanel>;
lbl_popneedcount0: React.RefObject<LabelPanel>;
img_popneed1: React.RefObject<ImagePanel>;
lbl_popneedcount1: React.RefObject<LabelPanel>;
btn_teclvup: React.RefObject<Button>;
onbtntec_click = (...args: any[]) => { };
panel_lvtec0: React.RefObject<Panel>;
lbl_teclvdes: React.RefObject<LabelPanel>;
lbl_lvupdes: React.RefObject<LabelPanel>;
panel_lvtec1: React.RefObject<Panel>;
img_tecneed: React.RefObject<ImagePanel>;
lbl_tecneedcount: React.RefObject<LabelPanel>;
btn_shop: React.RefObject<Button>;
onbtnshop_click = (...args: any[]) => { };
lbl_shopdes: React.RefObject<LabelPanel>;
panel_bossall: React.RefObject<Panel>;
lbl_tiaozhanDes: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  btn_poplvup: 'btn_poplvup',  panel_lvpop0: 'panel_lvpop0',  lbl_lvpopdes: 'lbl_lvpopdes',  lbl_lvpopulationdes: 'lbl_lvpopulationdes',  panel_lvpop1: 'panel_lvpop1',  img_popneed0: 'img_popneed0',  lbl_popneedcount0: 'lbl_popneedcount0',  img_popneed1: 'img_popneed1',  lbl_popneedcount1: 'lbl_popneedcount1',  btn_teclvup: 'btn_teclvup',  panel_lvtec0: 'panel_lvtec0',  lbl_teclvdes: 'lbl_teclvdes',  lbl_lvupdes: 'lbl_lvupdes',  panel_lvtec1: 'panel_lvtec1',  img_tecneed: 'img_tecneed',  lbl_tecneedcount: 'lbl_tecneedcount',  btn_shop: 'btn_shop',  lbl_shopdes: 'lbl_shopdes',  panel_bossall: 'panel_bossall',  lbl_tiaozhanDes: 'lbl_tiaozhanDes',  };
FUNCNAME = {  onbtnpop_click: {nodeName:"btn_poplvup",type:"onmouseactivate"}, onbtntec_click: {nodeName:"btn_teclvup",type:"onmouseactivate"}, onbtnshop_click: {nodeName:"btn_shop",type:"onmouseactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_poplvup = createRef<Button>();
this.panel_lvpop0 = createRef<Panel>();
this.lbl_lvpopdes = createRef<LabelPanel>();
this.lbl_lvpopulationdes = createRef<LabelPanel>();
this.panel_lvpop1 = createRef<Panel>();
this.img_popneed0 = createRef<ImagePanel>();
this.lbl_popneedcount0 = createRef<LabelPanel>();
this.img_popneed1 = createRef<ImagePanel>();
this.lbl_popneedcount1 = createRef<LabelPanel>();
this.btn_teclvup = createRef<Button>();
this.panel_lvtec0 = createRef<Panel>();
this.lbl_teclvdes = createRef<LabelPanel>();
this.lbl_lvupdes = createRef<LabelPanel>();
this.panel_lvtec1 = createRef<Panel>();
this.img_tecneed = createRef<ImagePanel>();
this.lbl_tecneedcount = createRef<LabelPanel>();
this.btn_shop = createRef<Button>();
this.lbl_shopdes = createRef<LabelPanel>();
this.panel_bossall = createRef<Panel>();
this.lbl_tiaozhanDes = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"510px","height":"300px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"510px","height":"300px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/panel_bg_png.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"200px","x":"4px","width":"180px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_purple.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"14px","x":"6px","width":"168px","height":"69px"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"y":"36px","x":"32px","width":"120px","height":"36px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_3_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"30px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"12px","x":"13px","width":"164px","height":"72px"}
CSS_3_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"1px","x":"28px","width":"30px","height":"30px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/money.png\")","backgroundSize":"100% 100%"}
CSS_3_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"60px","width":"83px","height":"34px","fontWeight":"bold","fontSize":"25","color":"#ffffff"}
CSS_3_2 : Partial<VCSSStyleDeclaration>  = {"y":"39px","x":"27px","width":"30px","height":"30px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/money.png\")","backgroundSize":"100% 100%"}
CSS_3_3 : Partial<VCSSStyleDeclaration>  = {"y":"40px","x":"61px","width":"83px","height":"32px","fontWeight":"bold","fontSize":"25","color":"#ffffff"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"200px","x":"185px","width":"180px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_green.png\")","backgroundSize":"100% 100%"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"16px","x":"15px","width":"158px","height":"72px"}
CSS_3_0_1 : Partial<VCSSStyleDeclaration>  = {"y":"37px","x":"27px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_3_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"26px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_2_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"16px","x":"15px","width":"156px","height":"72px"}
CSS_3_0_2 : Partial<VCSSStyleDeclaration>  = {"y":"13px","x":"5px","width":"48px","height":"48px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/money.png\")","backgroundSize":"100% 100%"}
CSS_3_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"18px","x":"50px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"199px","x":"365px","width":"140px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_gold.png\")","backgroundSize":"100% 100%"}
CSS_2_0_1 : Partial<VCSSStyleDeclaration>  = {"y":"27px","x":"29px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"60px","x":"0px","width":"510px","height":"130px"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"10px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_poplvup_isValid:boolean = true;
btn_poplvup_attrs:PanelAttributes={};
btn_poplvup_childs: Array<JSX.Element> = [];
panel_lvpop0_isValid:boolean = true;
panel_lvpop0_attrs:PanelAttributes={};
panel_lvpop0_childs: Array<JSX.Element> = [];
lbl_lvpopdes_isValid:boolean = true;
lbl_lvpopdes_attrs:LabelAttributes={};
lbl_lvpopdes_childs: Array<JSX.Element> = [];
lbl_lvpopulationdes_isValid:boolean = true;
lbl_lvpopulationdes_attrs:LabelAttributes={};
lbl_lvpopulationdes_childs: Array<JSX.Element> = [];
panel_lvpop1_isValid:boolean = true;
panel_lvpop1_attrs:PanelAttributes={};
panel_lvpop1_childs: Array<JSX.Element> = [];
img_popneed0_isValid:boolean = true;
img_popneed0_attrs:ImageAttributes={};
img_popneed0_childs: Array<JSX.Element> = [];
lbl_popneedcount0_isValid:boolean = true;
lbl_popneedcount0_attrs:LabelAttributes={};
lbl_popneedcount0_childs: Array<JSX.Element> = [];
img_popneed1_isValid:boolean = true;
img_popneed1_attrs:ImageAttributes={};
img_popneed1_childs: Array<JSX.Element> = [];
lbl_popneedcount1_isValid:boolean = true;
lbl_popneedcount1_attrs:LabelAttributes={};
lbl_popneedcount1_childs: Array<JSX.Element> = [];
btn_teclvup_isValid:boolean = true;
btn_teclvup_attrs:PanelAttributes={};
btn_teclvup_childs: Array<JSX.Element> = [];
panel_lvtec0_isValid:boolean = true;
panel_lvtec0_attrs:PanelAttributes={};
panel_lvtec0_childs: Array<JSX.Element> = [];
lbl_teclvdes_isValid:boolean = true;
lbl_teclvdes_attrs:LabelAttributes={};
lbl_teclvdes_childs: Array<JSX.Element> = [];
lbl_lvupdes_isValid:boolean = true;
lbl_lvupdes_attrs:LabelAttributes={};
lbl_lvupdes_childs: Array<JSX.Element> = [];
panel_lvtec1_isValid:boolean = true;
panel_lvtec1_attrs:PanelAttributes={};
panel_lvtec1_childs: Array<JSX.Element> = [];
img_tecneed_isValid:boolean = true;
img_tecneed_attrs:ImageAttributes={};
img_tecneed_childs: Array<JSX.Element> = [];
lbl_tecneedcount_isValid:boolean = true;
lbl_tecneedcount_attrs:LabelAttributes={};
lbl_tecneedcount_childs: Array<JSX.Element> = [];
btn_shop_isValid:boolean = true;
btn_shop_attrs:PanelAttributes={};
btn_shop_childs: Array<JSX.Element> = [];
lbl_shopdes_isValid:boolean = true;
lbl_shopdes_attrs:LabelAttributes={};
lbl_shopdes_childs: Array<JSX.Element> = [];
panel_bossall_isValid:boolean = true;
panel_bossall_attrs:PanelAttributes={};
panel_bossall_childs: Array<JSX.Element> = [];
lbl_tiaozhanDes_isValid:boolean = true;
lbl_tiaozhanDes_attrs:LabelAttributes={};
lbl_tiaozhanDes_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Image key="compId_29" style={this.CSS_1_0} >
</Image>
    {this.btn_poplvup_isValid && 
<Button ref={this.btn_poplvup} onmouseactivate={this.onbtnpop_click} key="compId_2" style={this.CSS_1_1}  {...this.btn_poplvup_attrs}>
        {this.panel_lvpop0_isValid && 
<Panel ref={this.panel_lvpop0} key="compId_12" style={this.CSS_2_0}  {...this.panel_lvpop0_attrs}>
            {this.lbl_lvpopdes_isValid && 
<Label text="Lv:10/60" ref={this.lbl_lvpopdes} key="compId_7" style={this.CSS_3_0}  {...this.lbl_lvpopdes_attrs} >
{this.lbl_lvpopdes_childs}
</Label>
}
            {this.lbl_lvpopulationdes_isValid && 
<Label text="升级人口" ref={this.lbl_lvpopulationdes} key="compId_10" style={this.CSS_3_1}  {...this.lbl_lvpopulationdes_attrs} >
{this.lbl_lvpopulationdes_childs}
</Label>
}
        
{this.panel_lvpop0_childs}
</Panel>
}
        {this.panel_lvpop1_isValid && 
<Panel ref={this.panel_lvpop1} key="compId_18" style={this.CSS_2_1}  {...this.panel_lvpop1_attrs}>
            {this.img_popneed0_isValid && 
<Image ref={this.img_popneed0} key="compId_19" style={this.CSS_3_0_0}  {...this.img_popneed0_attrs} >
{this.img_popneed0_childs}
</Image>
}
            {this.lbl_popneedcount0_isValid && 
<Label text="100000" ref={this.lbl_popneedcount0} key="compId_20" style={this.CSS_3_1_0}  {...this.lbl_popneedcount0_attrs} >
{this.lbl_popneedcount0_childs}
</Label>
}
            {this.img_popneed1_isValid && 
<Image ref={this.img_popneed1} key="compId_21" style={this.CSS_3_2}  {...this.img_popneed1_attrs} >
{this.img_popneed1_childs}
</Image>
}
            {this.lbl_popneedcount1_isValid && 
<Label text="100000" ref={this.lbl_popneedcount1} key="compId_22" style={this.CSS_3_3}  {...this.lbl_popneedcount1_attrs} >
{this.lbl_popneedcount1_childs}
</Label>
}
        
{this.panel_lvpop1_childs}
</Panel>
}
    
{this.btn_poplvup_childs}
</Button>
}
    {this.btn_teclvup_isValid && 
<Button ref={this.btn_teclvup} onmouseactivate={this.onbtntec_click} key="compId_3" style={this.CSS_1_2}  {...this.btn_teclvup_attrs}>
        {this.panel_lvtec0_isValid && 
<Panel ref={this.panel_lvtec0} key="compId_13" style={this.CSS_2_0_0}  {...this.panel_lvtec0_attrs}>
            {this.lbl_teclvdes_isValid && 
<Label text="Lv:10/60" ref={this.lbl_teclvdes} key="compId_9" style={this.CSS_3_0_1}  {...this.lbl_teclvdes_attrs} >
{this.lbl_teclvdes_childs}
</Label>
}
            {this.lbl_lvupdes_isValid && 
<Label text="升级科技" ref={this.lbl_lvupdes} key="compId_11" style={this.CSS_3_1_1}  {...this.lbl_lvupdes_attrs} >
{this.lbl_lvupdes_childs}
</Label>
}
        
{this.panel_lvtec0_childs}
</Panel>
}
        {this.panel_lvtec1_isValid && 
<Panel ref={this.panel_lvtec1} key="compId_15" style={this.CSS_2_1_0}  {...this.panel_lvtec1_attrs}>
            {this.img_tecneed_isValid && 
<Image ref={this.img_tecneed} key="compId_6" style={this.CSS_3_0_2}  {...this.img_tecneed_attrs} >
{this.img_tecneed_childs}
</Image>
}
            {this.lbl_tecneedcount_isValid && 
<Label text="100000" ref={this.lbl_tecneedcount} key="compId_14" style={this.CSS_3_1_2}  {...this.lbl_tecneedcount_attrs} >
{this.lbl_tecneedcount_childs}
</Label>
}
        
{this.panel_lvtec1_childs}
</Panel>
}
    
{this.btn_teclvup_childs}
</Button>
}
    {this.btn_shop_isValid && 
<Button ref={this.btn_shop} onmouseactivate={this.onbtnshop_click} key="compId_4" style={this.CSS_1_3}  {...this.btn_shop_attrs}>
        {this.lbl_shopdes_isValid && 
<Label text="商店" ref={this.lbl_shopdes} key="compId_8" style={this.CSS_2_0_1}  {...this.lbl_shopdes_attrs} >
{this.lbl_shopdes_childs}
</Label>
}
    
{this.btn_shop_childs}
</Button>
}
    {this.panel_bossall_isValid && 
<Panel ref={this.panel_bossall} key="compId_27" style={this.CSS_1_4}  {...this.panel_bossall_attrs} >
{this.panel_bossall_childs}
</Panel>
}
    {this.lbl_tiaozhanDes_isValid && 
<Label text="挑战BOSS" ref={this.lbl_tiaozhanDes} key="compId_28" style={this.CSS_1_5}  {...this.lbl_tiaozhanDes_attrs} >
{this.lbl_tiaozhanDes_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}