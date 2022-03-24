
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TaskInfoItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_taskdes: React.RefObject<LabelPanel>;
lbl_gototask: React.RefObject<LabelPanel>;
onbtn_goTask = (...args: any[]) => { };
lbl_tasktype: React.RefObject<LabelPanel>;
lbl_prizedes: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_taskdes: 'lbl_taskdes',  lbl_gototask: 'lbl_gototask',  lbl_tasktype: 'lbl_tasktype',  lbl_prizedes: 'lbl_prizedes',  };
FUNCNAME = {  onbtn_goTask: {nodeName:"lbl_gototask",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_taskdes = createRef<LabelPanel>();
this.lbl_gototask = createRef<LabelPanel>();
this.lbl_tasktype = createRef<LabelPanel>();
this.lbl_prizedes = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"350px","height":"100px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"11px","x":"74px","width":"272px","height":"80px","fontSize":"20","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"18px","x":"6px","width":"61px","height":"61px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/random_dice.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"70px","width":"84px","marginRight":"0px","height":"28px","fontSize":"20","color":"#18f90e","horizontalAlign":"right"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"5px","x":"5px","width":"58px","height":"92px","fontSize":"35","color":"#ffffff"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"70px","x":"73px","width":"182px","height":"28px","fontSize":"20","color":"#f9170e"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_taskdes_isValid:boolean = true;
lbl_taskdes_attrs:LabelAttributes={};
lbl_taskdes_childs: Array<JSX.Element> = [];
lbl_gototask_isValid:boolean = true;
lbl_gototask_attrs:LabelAttributes={};
lbl_gototask_childs: Array<JSX.Element> = [];
lbl_tasktype_isValid:boolean = true;
lbl_tasktype_attrs:LabelAttributes={};
lbl_tasktype_childs: Array<JSX.Element> = [];
lbl_prizedes_isValid:boolean = true;
lbl_prizedes_attrs:LabelAttributes={};
lbl_prizedes_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_taskdes_isValid && 
<Label text="打roshan啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊" ref={this.lbl_taskdes} key="compId_2" style={this.CSS_1_0}  {...this.lbl_taskdes_attrs} >
{this.lbl_taskdes_childs}
</Label>
}
    <Image visible={false} key="compId_3" style={this.CSS_1_1} >
</Image>
    {this.lbl_gototask_isValid && 
<Label text="点击前往" ref={this.lbl_gototask} onactivate={this.onbtn_goTask} key="compId_4" style={this.CSS_1_2}  {...this.lbl_gototask_attrs} >
{this.lbl_gototask_childs}
</Label>
}
    {this.lbl_tasktype_isValid && 
<Label text="对局" ref={this.lbl_tasktype} key="compId_5" style={this.CSS_1_3}  {...this.lbl_tasktype_attrs} >
{this.lbl_tasktype_childs}
</Label>
}
    {this.lbl_prizedes_isValid && 
<Label text="奖励：金币*1000" ref={this.lbl_prizedes} key="compId_6" style={this.CSS_1_4}  {...this.lbl_prizedes_attrs} >
{this.lbl_prizedes_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}