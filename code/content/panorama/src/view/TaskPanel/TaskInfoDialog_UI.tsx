
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TaskInfoDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_close: React.RefObject<Button>;
onbtn_close = (...args: any[]) => { };
panel_0: React.RefObject<Panel>;
panel_1: React.RefObject<Panel>;
lbll_maintask: React.RefObject<LabelPanel>;
onbtn_showpanel0 = (...args: any[]) => { };
lbll_goldtask: React.RefObject<LabelPanel>;
onbtn_showpanel1 = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  btn_close: 'btn_close',  panel_0: 'panel_0',  panel_1: 'panel_1',  lbll_maintask: 'lbll_maintask',  lbll_goldtask: 'lbll_goldtask',  };
FUNCNAME = {  onbtn_close: {nodeName:"btn_close",type:"onactivate"}, onbtn_showpanel0: {nodeName:"lbll_maintask",type:"onactivate"}, onbtn_showpanel1: {nodeName:"lbll_goldtask",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_close = createRef<Button>();
this.panel_0 = createRef<Panel>();
this.panel_1 = createRef<Panel>();
this.lbll_maintask = createRef<LabelPanel>();
this.lbll_goldtask = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"350px","height":"400px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"19px","x":"308px","width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/arrow_left.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"width":"350px","height":"330px","marginBottom":"0px","verticalAlign":"bottom"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"x":"0px","width":"350px","height":"330px","marginBottom":"0px","verticalAlign":"bottom"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"24px","x":"144px","fontSize":"30","color":"#ffffff"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"24px","x":"214px","fontSize":"30","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_close_isValid:boolean = true;
btn_close_attrs:PanelAttributes={};
btn_close_childs: Array<JSX.Element> = [];
panel_0_isValid:boolean = true;
panel_0_attrs:PanelAttributes={};
panel_0_childs: Array<JSX.Element> = [];
panel_1_isValid:boolean = true;
panel_1_attrs:PanelAttributes={};
panel_1_childs: Array<JSX.Element> = [];
lbll_maintask_isValid:boolean = true;
lbll_maintask_attrs:LabelAttributes={};
lbll_maintask_childs: Array<JSX.Element> = [];
lbll_goldtask_isValid:boolean = true;
lbll_goldtask_attrs:LabelAttributes={};
lbll_goldtask_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.btn_close_isValid && 
<Button ref={this.btn_close} onactivate={this.onbtn_close} className="CommonButton" key="compId_5" style={this.CSS_1_0}  {...this.btn_close_attrs} >
{this.btn_close_childs}
</Button>
}
    {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_6" style={this.CSS_1_1}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}
    {this.panel_1_isValid && 
<Panel ref={this.panel_1} key="compId_7" style={this.CSS_1_2}  {...this.panel_1_attrs} >
{this.panel_1_childs}
</Panel>
}
    {this.lbll_maintask_isValid && 
<Label text="主线" ref={this.lbll_maintask} onactivate={this.onbtn_showpanel0} key="compId_8" style={this.CSS_1_3}  {...this.lbll_maintask_attrs} >
{this.lbll_maintask_childs}
</Label>
}
    {this.lbll_goldtask_isValid && 
<Label text="金币" ref={this.lbll_goldtask} onactivate={this.onbtn_showpanel1} key="compId_9" style={this.CSS_1_4}  {...this.lbll_goldtask_attrs} >
{this.lbll_goldtask_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}