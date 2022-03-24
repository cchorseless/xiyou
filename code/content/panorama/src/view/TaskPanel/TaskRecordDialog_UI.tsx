
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TaskRecordDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_taskname: React.RefObject<LabelPanel>;
lbl_taskstate: React.RefObject<LabelPanel>;
lbl_taskagree: React.RefObject<LabelPanel>;
lbl_taskdisagree: React.RefObject<LabelPanel>;
lbl_round1: React.RefObject<LabelPanel>;
lbl_round2: React.RefObject<LabelPanel>;
lbl_round3: React.RefObject<LabelPanel>;
lbl_round4: React.RefObject<LabelPanel>;
lbl_round5: React.RefObject<LabelPanel>;
btn_close: React.RefObject<Button>;
onbtn_close = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  lbl_taskname: 'lbl_taskname',  lbl_taskstate: 'lbl_taskstate',  lbl_taskagree: 'lbl_taskagree',  lbl_taskdisagree: 'lbl_taskdisagree',  lbl_round1: 'lbl_round1',  lbl_round2: 'lbl_round2',  lbl_round3: 'lbl_round3',  lbl_round4: 'lbl_round4',  lbl_round5: 'lbl_round5',  btn_close: 'btn_close',  };
FUNCNAME = {  onbtn_close: {nodeName:"btn_close",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_taskname = createRef<LabelPanel>();
this.lbl_taskstate = createRef<LabelPanel>();
this.lbl_taskagree = createRef<LabelPanel>();
this.lbl_taskdisagree = createRef<LabelPanel>();
this.lbl_round1 = createRef<LabelPanel>();
this.lbl_round2 = createRef<LabelPanel>();
this.lbl_round3 = createRef<LabelPanel>();
this.lbl_round4 = createRef<LabelPanel>();
this.lbl_round5 = createRef<LabelPanel>();
this.btn_close = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"700px","height":"650px","backgroundColor":"#000000"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"25px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"-2px","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"74px","x":"84px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"73px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"70px","x":"471px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"127px","width":"650px","height":"500px","x":"0px","horizontalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"22px","width":"120px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"145px","width":"120px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"268px","width":"120px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"390px","width":"120px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"513px","width":"120px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"25px","width":"50px","marginTop":"15px","marginRight":"15px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/purgatory.png\")","backgroundSize":"100% 100%","horizontalAlign":"right"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_taskname_isValid:boolean = true;
lbl_taskname_attrs:LabelAttributes={};
lbl_taskname_childs: Array<JSX.Element> = [];
lbl_taskstate_isValid:boolean = true;
lbl_taskstate_attrs:LabelAttributes={};
lbl_taskstate_childs: Array<JSX.Element> = [];
lbl_taskagree_isValid:boolean = true;
lbl_taskagree_attrs:LabelAttributes={};
lbl_taskagree_childs: Array<JSX.Element> = [];
lbl_taskdisagree_isValid:boolean = true;
lbl_taskdisagree_attrs:LabelAttributes={};
lbl_taskdisagree_childs: Array<JSX.Element> = [];
lbl_round1_isValid:boolean = true;
lbl_round1_attrs:LabelAttributes={};
lbl_round1_childs: Array<JSX.Element> = [];
lbl_round2_isValid:boolean = true;
lbl_round2_attrs:LabelAttributes={};
lbl_round2_childs: Array<JSX.Element> = [];
lbl_round3_isValid:boolean = true;
lbl_round3_attrs:LabelAttributes={};
lbl_round3_childs: Array<JSX.Element> = [];
lbl_round4_isValid:boolean = true;
lbl_round4_attrs:LabelAttributes={};
lbl_round4_childs: Array<JSX.Element> = [];
lbl_round5_isValid:boolean = true;
lbl_round5_attrs:LabelAttributes={};
lbl_round5_childs: Array<JSX.Element> = [];
btn_close_isValid:boolean = true;
btn_close_attrs:PanelAttributes={};
btn_close_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_taskname_isValid && 
<Label text="第1轮任务" ref={this.lbl_taskname} key="compId_2" style={this.CSS_1_0}  {...this.lbl_taskname_attrs} >
{this.lbl_taskname_childs}
</Label>
}
    {this.lbl_taskstate_isValid && 
<Label text="第1轮任务" ref={this.lbl_taskstate} key="compId_3" style={this.CSS_1_1}  {...this.lbl_taskstate_attrs} >
{this.lbl_taskstate_childs}
</Label>
}
    {this.lbl_taskagree_isValid && 
<Label text="第1轮任务" ref={this.lbl_taskagree} key="compId_4" style={this.CSS_1_2}  {...this.lbl_taskagree_attrs} >
{this.lbl_taskagree_childs}
</Label>
}
    {this.lbl_taskdisagree_isValid && 
<Label text="第1轮任务" ref={this.lbl_taskdisagree} key="compId_5" style={this.CSS_1_3}  {...this.lbl_taskdisagree_attrs} >
{this.lbl_taskdisagree_childs}
</Label>
}
    <Panel key="compId_7" style={this.CSS_1_4}>
        {this.lbl_round1_isValid && 
<Label text="Round1" ref={this.lbl_round1} key="compId_8" style={this.CSS_2_0}  {...this.lbl_round1_attrs} >
{this.lbl_round1_childs}
</Label>
}
        {this.lbl_round2_isValid && 
<Label text="Round1" ref={this.lbl_round2} key="compId_10" style={this.CSS_2_1}  {...this.lbl_round2_attrs} >
{this.lbl_round2_childs}
</Label>
}
        {this.lbl_round3_isValid && 
<Label text="Round1" ref={this.lbl_round3} key="compId_11" style={this.CSS_2_2}  {...this.lbl_round3_attrs} >
{this.lbl_round3_childs}
</Label>
}
        {this.lbl_round4_isValid && 
<Label text="Round1" ref={this.lbl_round4} key="compId_12" style={this.CSS_2_3}  {...this.lbl_round4_attrs} >
{this.lbl_round4_childs}
</Label>
}
        {this.lbl_round5_isValid && 
<Label text="Round1" ref={this.lbl_round5} key="compId_13" style={this.CSS_2_4}  {...this.lbl_round5_attrs} >
{this.lbl_round5_childs}
</Label>
}
    
</Panel>
    {this.btn_close_isValid && 
<Button ref={this.btn_close} onactivate={this.onbtn_close} key="compId_14" style={this.CSS_1_5}  {...this.btn_close_attrs} >
{this.btn_close_childs}
</Button>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}