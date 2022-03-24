
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TaskGoForFinishDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_agree: React.RefObject<Button>;
onbtn_agree = (...args: any[]) => { };
panel_0: React.RefObject<Panel>;
btn_disagree: React.RefObject<Button>;
onbtn_disagree = (...args: any[]) => { };
lbl_needplayerCount: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  btn_agree: 'btn_agree',  panel_0: 'panel_0',  btn_disagree: 'btn_disagree',  lbl_needplayerCount: 'lbl_needplayerCount',  };
FUNCNAME = {  onbtn_agree: {nodeName:"btn_agree",type:"onactivate"}, onbtn_disagree: {nodeName:"btn_disagree",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_agree = createRef<Button>();
this.panel_0 = createRef<Panel>();
this.btn_disagree = createRef<Button>();
this.lbl_needplayerCount = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1300px","height":"880px","backgroundColor":"#4f4c4c","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"17px","x":"0px","width":"250px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"702px","x":"515px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/agree.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"64px","width":"1200px","height":"609px","x":"0px","horizontalAlign":"middle"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"702px","x":"900px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/disagree.png\")","backgroundSize":"100% 100%"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"752px","width":"327px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"-364px","horizontalAlign":"middle"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"617px","x":"-20px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_agree_isValid:boolean = true;
btn_agree_attrs:PanelAttributes={};
btn_agree_childs: Array<JSX.Element> = [];
panel_0_isValid:boolean = true;
panel_0_attrs:PanelAttributes={};
panel_0_childs: Array<JSX.Element> = [];
btn_disagree_isValid:boolean = true;
btn_disagree_attrs:PanelAttributes={};
btn_disagree_childs: Array<JSX.Element> = [];
lbl_needplayerCount_isValid:boolean = true;
lbl_needplayerCount_attrs:LabelAttributes={};
lbl_needplayerCount_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Label text="本次任务队伍成员" key="compId_13" style={this.CSS_1_0} >
</Label>
    {this.btn_agree_isValid && 
<Button ref={this.btn_agree} onactivate={this.onbtn_agree} key="compId_14" style={this.CSS_1_1}  {...this.btn_agree_attrs} >
{this.btn_agree_childs}
</Button>
}
    {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_16" style={this.CSS_1_2}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}
    {this.btn_disagree_isValid && 
<Button ref={this.btn_disagree} onactivate={this.onbtn_disagree} key="compId_28" style={this.CSS_1_3}  {...this.btn_disagree_attrs} >
{this.btn_disagree_childs}
</Button>
}
    <Label text="你要不要完成本次任务？" key="compId_29" style={this.CSS_1_4} >
</Label>
    {this.lbl_needplayerCount_isValid && 
<Label text="本次任务队伍成员" ref={this.lbl_needplayerCount} key="compId_30" style={this.CSS_1_5}  {...this.lbl_needplayerCount_attrs} >
{this.lbl_needplayerCount_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}