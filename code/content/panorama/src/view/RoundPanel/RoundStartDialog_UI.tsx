
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";
import {TeamShenFenItem} from '../TeamPanel/TeamShenFenItem' ;


export class RoundStartDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_tips: React.RefObject<LabelPanel>;
ui_item: React.RefObject<TeamShenFenItem>;
NODENAME = {  __root__: '__root__',  lbl_tips: 'lbl_tips',  ui_item: 'ui_item',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_tips = createRef<LabelPanel>();
this.ui_item = createRef<TeamShenFenItem>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"400px","backgroundColor":"#3b3939"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"18px","x":"3px","width":"298px","height":"77px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"180px","width":"184px","height":"65px","fontWeight":"bold","fontSize":"50","color":"#f9f4f4","x":"-191px","horizontalAlign":"middle"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"331px","width":"342px","height":"55px","fontWeight":"bold","fontSize":"40","color":"#f9f4f4","x":"6px","horizontalAlign":"middle"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"105px","x":"200px","width":"390px","height":"190px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_tips_isValid:boolean = true;
lbl_tips_attrs:LabelAttributes={};
lbl_tips_childs: Array<JSX.Element> = [];
ui_item_isValid:boolean = true;
ui_item_attrs:any={};
ui_item_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_tips_isValid && 
<Label text="ROUND:1" ref={this.lbl_tips} key="compId_2" style={this.CSS_1_0}  {...this.lbl_tips_attrs} >
{this.lbl_tips_childs}
</Label>
}
    <Label text="队长=>" key="compId_3" style={this.CSS_1_1} >
</Label>
    <Label text="队长挑选队员中..." key="compId_4" style={this.CSS_1_2} >
</Label>
    {this.ui_item_isValid && 
<TeamShenFenItem ref={this.ui_item} key="compId_7" style={this.CSS_1_3}  {...this.ui_item_attrs} >
{this.ui_item_childs}
</TeamShenFenItem>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}