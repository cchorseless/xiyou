
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TaskResultDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_tips: React.RefObject<LabelPanel>;
panel_resultinfo: React.RefObject<Panel>;
lbl_agree: React.RefObject<LabelPanel>;
lbl_disagree: React.RefObject<LabelPanel>;
panel_taskprogress: React.RefObject<Panel>;
lbl_resulttips: React.RefObject<LabelPanel>;
lbl_task_progress: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_tips: 'lbl_tips',  panel_resultinfo: 'panel_resultinfo',  lbl_agree: 'lbl_agree',  lbl_disagree: 'lbl_disagree',  panel_taskprogress: 'panel_taskprogress',  lbl_resulttips: 'lbl_resulttips',  lbl_task_progress: 'lbl_task_progress',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_tips = createRef<LabelPanel>();
this.panel_resultinfo = createRef<Panel>();
this.lbl_agree = createRef<LabelPanel>();
this.lbl_disagree = createRef<LabelPanel>();
this.panel_taskprogress = createRef<Panel>();
this.lbl_resulttips = createRef<LabelPanel>();
this.lbl_task_progress = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"400px","backgroundColor":"#000000"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"32px","x":"0px","height":"73px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"155px","x":"55px","width":"520px","height":"240px"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/agree.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"x":"359px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/disagree.png\")","backgroundSize":"100% 100%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"161px","x":"-160px","height":"73px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"159px","x":"178px","height":"73px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"100px","x":"50px","width":"500px","height":"300px"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"108px","x":"6px","height":"39px","fontWeight":"bold","fontSize":"30","color":"#7def01","horizontalAlign":"middle"}
CSS_2_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"192px","x":"0px","height":"73px","fontWeight":"bold","fontSize":"40","color":"#f9f4f4","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_tips_isValid:boolean = true;
lbl_tips_attrs:LabelAttributes={};
lbl_tips_childs: Array<JSX.Element> = [];
panel_resultinfo_isValid:boolean = true;
panel_resultinfo_attrs:PanelAttributes={};
panel_resultinfo_childs: Array<JSX.Element> = [];
lbl_agree_isValid:boolean = true;
lbl_agree_attrs:LabelAttributes={};
lbl_agree_childs: Array<JSX.Element> = [];
lbl_disagree_isValid:boolean = true;
lbl_disagree_attrs:LabelAttributes={};
lbl_disagree_childs: Array<JSX.Element> = [];
panel_taskprogress_isValid:boolean = true;
panel_taskprogress_attrs:PanelAttributes={};
panel_taskprogress_childs: Array<JSX.Element> = [];
lbl_resulttips_isValid:boolean = true;
lbl_resulttips_attrs:LabelAttributes={};
lbl_resulttips_childs: Array<JSX.Element> = [];
lbl_task_progress_isValid:boolean = true;
lbl_task_progress_attrs:LabelAttributes={};
lbl_task_progress_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_tips_isValid && 
<Label text="task finish" ref={this.lbl_tips} key="compId_3" style={this.CSS_1_0}  {...this.lbl_tips_attrs} >
{this.lbl_tips_childs}
</Label>
}
    {this.panel_resultinfo_isValid && 
<Panel ref={this.panel_resultinfo} key="compId_9" style={this.CSS_1_1}  {...this.panel_resultinfo_attrs}>
        <Button key="compId_4" style={this.CSS_2_0} >
</Button>
        <Button key="compId_5" style={this.CSS_2_1} >
</Button>
        {this.lbl_agree_isValid && 
<Label text="0" ref={this.lbl_agree} key="compId_6" style={this.CSS_2_2}  {...this.lbl_agree_attrs} >
{this.lbl_agree_childs}
</Label>
}
        {this.lbl_disagree_isValid && 
<Label text="10" ref={this.lbl_disagree} key="compId_7" style={this.CSS_2_3}  {...this.lbl_disagree_attrs} >
{this.lbl_disagree_childs}
</Label>
}
    
{this.panel_resultinfo_childs}
</Panel>
}
    {this.panel_taskprogress_isValid && 
<Panel ref={this.panel_taskprogress} key="compId_11" style={this.CSS_1_2}  {...this.panel_taskprogress_attrs}>
        {this.lbl_resulttips_isValid && 
<Label text="(队伍成员正在做任务)" ref={this.lbl_resulttips} key="compId_8" style={this.CSS_2_0_0}  {...this.lbl_resulttips_attrs} >
{this.lbl_resulttips_childs}
</Label>
}
        {this.lbl_task_progress_isValid && 
<Label text="任务进度：（5/6）" ref={this.lbl_task_progress} key="compId_10" style={this.CSS_2_1_0}  {...this.lbl_task_progress_attrs} >
{this.lbl_task_progress_childs}
</Label>
}
    
{this.panel_taskprogress_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}