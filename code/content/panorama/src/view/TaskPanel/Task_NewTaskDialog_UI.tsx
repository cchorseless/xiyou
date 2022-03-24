
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class Task_NewTaskDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_task_progress: React.RefObject<LabelPanel>;
lbl_taskdes: React.RefObject<LabelPanel>;
lbl_prizedes: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_task_progress: 'lbl_task_progress',  lbl_taskdes: 'lbl_taskdes',  lbl_prizedes: 'lbl_prizedes',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_task_progress = createRef<LabelPanel>();
this.lbl_taskdes = createRef<LabelPanel>();
this.lbl_prizedes = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"120px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"38px","x":"25px","width":"107px","height":"51px","fontWeight":"bold","fontSize":"35","color":"#f9f4f4"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"162px","width":"420px","height":"70px","fontSize":"20","color":"#ffffff"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"91px","x":"163px","width":"182px","height":"28px","fontSize":"20","color":"#f9170e"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_task_progress_isValid:boolean = true;
lbl_task_progress_attrs:LabelAttributes={};
lbl_task_progress_childs: Array<JSX.Element> = [];
lbl_taskdes_isValid:boolean = true;
lbl_taskdes_attrs:LabelAttributes={};
lbl_taskdes_childs: Array<JSX.Element> = [];
lbl_prizedes_isValid:boolean = true;
lbl_prizedes_attrs:LabelAttributes={};
lbl_prizedes_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_task_progress_isValid && 
<Label text="新任务" ref={this.lbl_task_progress} key="compId_2" style={this.CSS_1_0}  {...this.lbl_task_progress_attrs} >
{this.lbl_task_progress_childs}
</Label>
}
    {this.lbl_taskdes_isValid && 
<Label text="打roshan啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊" ref={this.lbl_taskdes} key="compId_3" style={this.CSS_1_1}  {...this.lbl_taskdes_attrs} >
{this.lbl_taskdes_childs}
</Label>
}
    {this.lbl_prizedes_isValid && 
<Label text="奖励：金币*1000" ref={this.lbl_prizedes} key="compId_4" style={this.CSS_1_2}  {...this.lbl_prizedes_attrs} >
{this.lbl_prizedes_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}