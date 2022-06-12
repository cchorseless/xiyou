
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class BuildingTopBarItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_nameng: React.RefObject<ImagePanel>;
img_prop: React.RefObject<ImagePanel>;
lbl_name: React.RefObject<LabelPanel>;
img_rare: React.RefObject<ImagePanel>;
img_star4: React.RefObject<ImagePanel>;
img_star2: React.RefObject<ImagePanel>;
img_star1: React.RefObject<ImagePanel>;
img_star3: React.RefObject<ImagePanel>;
img_star5: React.RefObject<ImagePanel>;
panel_hpbar: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  img_nameng: 'img_nameng',  img_prop: 'img_prop',  lbl_name: 'lbl_name',  img_rare: 'img_rare',  img_star4: 'img_star4',  img_star2: 'img_star2',  img_star1: 'img_star1',  img_star3: 'img_star3',  img_star5: 'img_star5',  panel_hpbar: 'panel_hpbar',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_nameng = createRef<ImagePanel>();
this.img_prop = createRef<ImagePanel>();
this.lbl_name = createRef<LabelPanel>();
this.img_rare = createRef<ImagePanel>();
this.img_star4 = createRef<ImagePanel>();
this.img_star2 = createRef<ImagePanel>();
this.img_star1 = createRef<ImagePanel>();
this.img_star3 = createRef<ImagePanel>();
this.img_star5 = createRef<ImagePanel>();
this.panel_hpbar = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"300px","height":"140px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"40px","x":"33px","width":"270px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/titlebg_A.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"22px","width":"36px","height":"36px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/pip_agi.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"63px","width":"153px","height":"34px","fontWeight":"bold","fontSize":"25","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"35px","x":"0px","width":"50px","height":"55px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/rarity/rare_A.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"50px","width":"200px","height":"41px"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/star.png\")","backgroundSize":"100% 100%"}
CSS_2_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"40px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/star.png\")","backgroundSize":"100% 100%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"80px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/star.png\")","backgroundSize":"100% 100%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"120px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/star.png\")","backgroundSize":"100% 100%"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"160px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/star.png\")","backgroundSize":"100% 100%"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"90px","x":"52px","width":"246px","height":"50px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_nameng_isValid:boolean = true;
img_nameng_attrs:ImageAttributes={};
img_nameng_childs: Array<JSX.Element> = [];
img_prop_isValid:boolean = true;
img_prop_attrs:ImageAttributes={};
img_prop_childs: Array<JSX.Element> = [];
lbl_name_isValid:boolean = true;
lbl_name_attrs:LabelAttributes={};
lbl_name_childs: Array<JSX.Element> = [];
img_rare_isValid:boolean = true;
img_rare_attrs:ImageAttributes={};
img_rare_childs: Array<JSX.Element> = [];
img_star4_isValid:boolean = true;
img_star4_attrs:ImageAttributes={};
img_star4_childs: Array<JSX.Element> = [];
img_star2_isValid:boolean = true;
img_star2_attrs:ImageAttributes={};
img_star2_childs: Array<JSX.Element> = [];
img_star1_isValid:boolean = true;
img_star1_attrs:ImageAttributes={};
img_star1_childs: Array<JSX.Element> = [];
img_star3_isValid:boolean = true;
img_star3_attrs:ImageAttributes={};
img_star3_childs: Array<JSX.Element> = [];
img_star5_isValid:boolean = true;
img_star5_attrs:ImageAttributes={};
img_star5_childs: Array<JSX.Element> = [];
panel_hpbar_isValid:boolean = true;
panel_hpbar_attrs:PanelAttributes={};
panel_hpbar_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_nameng_isValid && 
<Image ref={this.img_nameng} key="compId_11" style={this.CSS_1_0}  {...this.img_nameng_attrs}>
        {this.img_prop_isValid && 
<Image ref={this.img_prop} key="compId_7" style={this.CSS_2_0}  {...this.img_prop_attrs} >
{this.img_prop_childs}
</Image>
}
        {this.lbl_name_isValid && 
<Label text="虚空罗多这啊" ref={this.lbl_name} key="compId_9" style={this.CSS_2_1}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
    
{this.img_nameng_childs}
</Image>
}
    {this.img_rare_isValid && 
<Image ref={this.img_rare} key="compId_12" style={this.CSS_1_1}  {...this.img_rare_attrs} >
{this.img_rare_childs}
</Image>
}
    <Panel key="compId_13" style={this.CSS_1_2}>
        {this.img_star4_isValid && 
<Image ref={this.img_star4} key="compId_2" style={this.CSS_2_0_0}  {...this.img_star4_attrs} >
{this.img_star4_childs}
</Image>
}
        {this.img_star2_isValid && 
<Image ref={this.img_star2} key="compId_3" style={this.CSS_2_1_0}  {...this.img_star2_attrs} >
{this.img_star2_childs}
</Image>
}
        {this.img_star1_isValid && 
<Image ref={this.img_star1} key="compId_4" style={this.CSS_2_2}  {...this.img_star1_attrs} >
{this.img_star1_childs}
</Image>
}
        {this.img_star3_isValid && 
<Image ref={this.img_star3} key="compId_5" style={this.CSS_2_3}  {...this.img_star3_attrs} >
{this.img_star3_childs}
</Image>
}
        {this.img_star5_isValid && 
<Image ref={this.img_star5} key="compId_6" style={this.CSS_2_4}  {...this.img_star5_attrs} >
{this.img_star5_childs}
</Image>
}
    
</Panel>
    {this.panel_hpbar_isValid && 
<Panel ref={this.panel_hpbar} key="compId_18" style={this.CSS_1_3}  {...this.panel_hpbar_attrs} >
{this.panel_hpbar_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}