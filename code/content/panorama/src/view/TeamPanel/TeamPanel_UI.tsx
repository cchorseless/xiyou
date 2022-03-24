
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";
import {TeamShenFenItem} from './TeamShenFenItem' ;


export class TeamPanel_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_sure: React.RefObject<Button>;
onbtn_makeTeam = (...args: any[]) => { };
panel_0: React.RefObject<Panel>;
lbl_teamCount: React.RefObject<LabelPanel>;
ui_item: React.RefObject<TeamShenFenItem>;
NODENAME = {  __root__: '__root__',  btn_sure: 'btn_sure',  panel_0: 'panel_0',  lbl_teamCount: 'lbl_teamCount',  ui_item: 'ui_item',  };
FUNCNAME = {  onbtn_makeTeam: {nodeName:"btn_sure",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_sure = createRef<Button>();
this.panel_0 = createRef<Panel>();
this.lbl_teamCount = createRef<LabelPanel>();
this.ui_item = createRef<TeamShenFenItem>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1300px","height":"880px","backgroundColor":"#4f4c4c","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"17px","width":"250px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"744px","x":"934px","width":"194px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_green.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"30px","x":"32px","width":"130px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"64px","width":"1200px","height":"609px","x":"0px","horizontalAlign":"middle"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"700px","x":"931px","width":"234px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"749px","x":"60px","width":"144px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"680px","x":"210px","width":"390px","height":"190px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_sure_isValid:boolean = true;
btn_sure_attrs:PanelAttributes={};
btn_sure_childs: Array<JSX.Element> = [];
panel_0_isValid:boolean = true;
panel_0_attrs:PanelAttributes={};
panel_0_childs: Array<JSX.Element> = [];
lbl_teamCount_isValid:boolean = true;
lbl_teamCount_attrs:LabelAttributes={};
lbl_teamCount_childs: Array<JSX.Element> = [];
ui_item_isValid:boolean = true;
ui_item_attrs:any={};
ui_item_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Label text="选取本次队伍成员" key="compId_13" style={this.CSS_1_0} >
</Label>
    {this.btn_sure_isValid && 
<Button ref={this.btn_sure} onactivate={this.onbtn_makeTeam} key="compId_14" style={this.CSS_1_1}  {...this.btn_sure_attrs}>
        <Label text="确认队伍" key="compId_15" style={this.CSS_2_0} >
</Label>
    
{this.btn_sure_childs}
</Button>
}
    {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_16" style={this.CSS_1_2}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}
    {this.lbl_teamCount_isValid && 
<Label text="成员数量:(0/5)" ref={this.lbl_teamCount} key="compId_24" style={this.CSS_1_3}  {...this.lbl_teamCount_attrs} >
{this.lbl_teamCount_childs}
</Label>
}
    <Label text="你自己=>" key="compId_25" style={this.CSS_1_4} >
</Label>
    {this.ui_item_isValid && 
<TeamShenFenItem ref={this.ui_item} key="compId_27" style={this.CSS_1_5}  {...this.ui_item_attrs} >
{this.ui_item_childs}
</TeamShenFenItem>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}