
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TopBarPanel_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_roundstagedes: React.RefObject<LabelPanel>;
lbl_population: React.RefObject<LabelPanel>;
lbl_gold: React.RefObject<LabelPanel>;
lbl_round: React.RefObject<LabelPanel>;
lbl_food: React.RefObject<LabelPanel>;
lbl_wood: React.RefObject<LabelPanel>;
lbl_roundDes: React.RefObject<LabelPanel>;
lbl_populationDes: React.RefObject<LabelPanel>;
lbl_goldDes: React.RefObject<LabelPanel>;
lbl_foodDes: React.RefObject<LabelPanel>;
lbl_woodDes: React.RefObject<LabelPanel>;
lbl_lefttime: React.RefObject<LabelPanel>;
lbl_gametime: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_roundstagedes: 'lbl_roundstagedes',  lbl_population: 'lbl_population',  lbl_gold: 'lbl_gold',  lbl_round: 'lbl_round',  lbl_food: 'lbl_food',  lbl_wood: 'lbl_wood',  lbl_roundDes: 'lbl_roundDes',  lbl_populationDes: 'lbl_populationDes',  lbl_goldDes: 'lbl_goldDes',  lbl_foodDes: 'lbl_foodDes',  lbl_woodDes: 'lbl_woodDes',  lbl_lefttime: 'lbl_lefttime',  lbl_gametime: 'lbl_gametime',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_roundstagedes = createRef<LabelPanel>();
this.lbl_population = createRef<LabelPanel>();
this.lbl_gold = createRef<LabelPanel>();
this.lbl_round = createRef<LabelPanel>();
this.lbl_food = createRef<LabelPanel>();
this.lbl_wood = createRef<LabelPanel>();
this.lbl_roundDes = createRef<LabelPanel>();
this.lbl_populationDes = createRef<LabelPanel>();
this.lbl_goldDes = createRef<LabelPanel>();
this.lbl_foodDes = createRef<LabelPanel>();
this.lbl_woodDes = createRef<LabelPanel>();
this.lbl_lefttime = createRef<LabelPanel>();
this.lbl_gametime = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1400px","marginTop":"0px","height":"180px","backgroundColor":"#606060","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"55px","width":"1400px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/gallery_background.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"735px","width":"48px","height":"48px","backgroundImage":"url(\"file://{images}/common/money.png\")"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"249px","width":"48px","height":"48px","backgroundImage":"url(\"file://{images}/common/population_png.png\")"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"10px","x":"1198px","width":"48px","height":"48px","backgroundImage":"url(\"file://{images}/common/food_png.png\")"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"971px","width":"48px","height":"48px","backgroundImage":"url(\"file://{images}/common/wood_png.png\")"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"500px","width":"169px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#39f909"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"303px","width":"115px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_2_6 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"792px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_2_7 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"16px","width":"48px","height":"48px","backgroundImage":"url(\"file://{images}/common/rank_active_png.png\")"}
CSS_2_8 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"71px","width":"115px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_2_9 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"1024px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_2_10 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"1237px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"56px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"287px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"738px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"975px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"1200px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_6 : Partial<VCSSStyleDeclaration>  = {"y":"115px","x":"524px","width":"101px","height":"66px","fontWeight":"bold","fontSize":"60","color":"#ffffff"}
CSS_1_7 : Partial<VCSSStyleDeclaration>  = {"y":"9px","x":"506px","height":"42px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_roundstagedes_isValid:boolean = true;
lbl_roundstagedes_attrs:LabelAttributes={};
lbl_roundstagedes_childs: Array<JSX.Element> = [];
lbl_population_isValid:boolean = true;
lbl_population_attrs:LabelAttributes={};
lbl_population_childs: Array<JSX.Element> = [];
lbl_gold_isValid:boolean = true;
lbl_gold_attrs:LabelAttributes={};
lbl_gold_childs: Array<JSX.Element> = [];
lbl_round_isValid:boolean = true;
lbl_round_attrs:LabelAttributes={};
lbl_round_childs: Array<JSX.Element> = [];
lbl_food_isValid:boolean = true;
lbl_food_attrs:LabelAttributes={};
lbl_food_childs: Array<JSX.Element> = [];
lbl_wood_isValid:boolean = true;
lbl_wood_attrs:LabelAttributes={};
lbl_wood_childs: Array<JSX.Element> = [];
lbl_roundDes_isValid:boolean = true;
lbl_roundDes_attrs:LabelAttributes={};
lbl_roundDes_childs: Array<JSX.Element> = [];
lbl_populationDes_isValid:boolean = true;
lbl_populationDes_attrs:LabelAttributes={};
lbl_populationDes_childs: Array<JSX.Element> = [];
lbl_goldDes_isValid:boolean = true;
lbl_goldDes_attrs:LabelAttributes={};
lbl_goldDes_childs: Array<JSX.Element> = [];
lbl_foodDes_isValid:boolean = true;
lbl_foodDes_attrs:LabelAttributes={};
lbl_foodDes_childs: Array<JSX.Element> = [];
lbl_woodDes_isValid:boolean = true;
lbl_woodDes_attrs:LabelAttributes={};
lbl_woodDes_childs: Array<JSX.Element> = [];
lbl_lefttime_isValid:boolean = true;
lbl_lefttime_attrs:LabelAttributes={};
lbl_lefttime_childs: Array<JSX.Element> = [];
lbl_gametime_isValid:boolean = true;
lbl_gametime_attrs:LabelAttributes={};
lbl_gametime_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel ref={this.__root__} key="compId_1" style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Image key="compId_2" style={this.CSS_1_0}>
        <Image key="compId_8" style={this.CSS_2_0} >
</Image>
        <Image key="compId_9" style={this.CSS_2_1} >
</Image>
        <Image key="compId_10" style={this.CSS_2_2} >
</Image>
        <Image key="compId_11" style={this.CSS_2_3} >
</Image>
        {this.lbl_roundstagedes_isValid && 
<Label text="准备回合" ref={this.lbl_roundstagedes} key="compId_12" style={this.CSS_2_4}  {...this.lbl_roundstagedes_attrs} >
{this.lbl_roundstagedes_childs}
</Label>
}
        {this.lbl_population_isValid && 
<Label text="10/10" ref={this.lbl_population} key="compId_13" style={this.CSS_2_5}  {...this.lbl_population_attrs} >
{this.lbl_population_childs}
</Label>
}
        {this.lbl_gold_isValid && 
<Label text="1000000" ref={this.lbl_gold} key="compId_15" style={this.CSS_2_6}  {...this.lbl_gold_attrs} >
{this.lbl_gold_childs}
</Label>
}
        <Image key="compId_16" style={this.CSS_2_7} >
</Image>
        {this.lbl_round_isValid && 
<Label text="10/10" ref={this.lbl_round} key="compId_17" style={this.CSS_2_8}  {...this.lbl_round_attrs} >
{this.lbl_round_childs}
</Label>
}
        {this.lbl_food_isValid && 
<Label text="1000000" ref={this.lbl_food} key="compId_19" style={this.CSS_2_9}  {...this.lbl_food_attrs} >
{this.lbl_food_childs}
</Label>
}
        {this.lbl_wood_isValid && 
<Label text="1000000" ref={this.lbl_wood} key="compId_20" style={this.CSS_2_10}  {...this.lbl_wood_attrs} >
{this.lbl_wood_childs}
</Label>
}
    
</Image>
    {this.lbl_roundDes_isValid && 
<Label text="回合" ref={this.lbl_roundDes} key="compId_18" style={this.CSS_1_1}  {...this.lbl_roundDes_attrs} >
{this.lbl_roundDes_childs}
</Label>
}
    {this.lbl_populationDes_isValid && 
<Label text="人口" ref={this.lbl_populationDes} key="compId_14" style={this.CSS_1_2}  {...this.lbl_populationDes_attrs} >
{this.lbl_populationDes_childs}
</Label>
}
    {this.lbl_goldDes_isValid && 
<Label text="金币" ref={this.lbl_goldDes} key="compId_21" style={this.CSS_1_3}  {...this.lbl_goldDes_attrs} >
{this.lbl_goldDes_childs}
</Label>
}
    {this.lbl_foodDes_isValid && 
<Label text="粮食" ref={this.lbl_foodDes} key="compId_22" style={this.CSS_1_4}  {...this.lbl_foodDes_attrs} >
{this.lbl_foodDes_childs}
</Label>
}
    {this.lbl_woodDes_isValid && 
<Label text="木材" ref={this.lbl_woodDes} key="compId_23" style={this.CSS_1_5}  {...this.lbl_woodDes_attrs} >
{this.lbl_woodDes_childs}
</Label>
}
    {this.lbl_lefttime_isValid && 
<Label text="600" ref={this.lbl_lefttime} key="compId_7" style={this.CSS_1_6}  {...this.lbl_lefttime_attrs} >
{this.lbl_lefttime_childs}
</Label>
}
    {this.lbl_gametime_isValid && 
<Label text="00:11:11" ref={this.lbl_gametime} key="compId_6" style={this.CSS_1_7}  {...this.lbl_gametime_attrs} >
{this.lbl_gametime_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}