
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TeamAgreeGoForTaskDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
panel_0: React.RefObject<Panel>;
panel_9: React.RefObject<Panel>;
panel_1: React.RefObject<Panel>;
panel_2: React.RefObject<Panel>;
panel_3: React.RefObject<Panel>;
panel_8: React.RefObject<Panel>;
panel_7: React.RefObject<Panel>;
panel_6: React.RefObject<Panel>;
panel_4: React.RefObject<Panel>;
panel_5: React.RefObject<Panel>;
lbl_agree_0: React.RefObject<LabelPanel>;
lbl_agree_9: React.RefObject<LabelPanel>;
lbl_agree_8: React.RefObject<LabelPanel>;
lbl_agree_7: React.RefObject<LabelPanel>;
lbl_agree_6: React.RefObject<LabelPanel>;
lbl_agree_5: React.RefObject<LabelPanel>;
lbl_agree_4: React.RefObject<LabelPanel>;
lbl_agree_3: React.RefObject<LabelPanel>;
lbl_agree_2: React.RefObject<LabelPanel>;
lbl_agree_1: React.RefObject<LabelPanel>;
panel_agreeinfo: React.RefObject<Panel>;
btn_agree: React.RefObject<Button>;
onbtn_agree = (...args: any[]) => { };
btn_disagree: React.RefObject<Button>;
onbtn_disagree = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  panel_0: 'panel_0',  panel_9: 'panel_9',  panel_1: 'panel_1',  panel_2: 'panel_2',  panel_3: 'panel_3',  panel_8: 'panel_8',  panel_7: 'panel_7',  panel_6: 'panel_6',  panel_4: 'panel_4',  panel_5: 'panel_5',  lbl_agree_0: 'lbl_agree_0',  lbl_agree_9: 'lbl_agree_9',  lbl_agree_8: 'lbl_agree_8',  lbl_agree_7: 'lbl_agree_7',  lbl_agree_6: 'lbl_agree_6',  lbl_agree_5: 'lbl_agree_5',  lbl_agree_4: 'lbl_agree_4',  lbl_agree_3: 'lbl_agree_3',  lbl_agree_2: 'lbl_agree_2',  lbl_agree_1: 'lbl_agree_1',  panel_agreeinfo: 'panel_agreeinfo',  btn_agree: 'btn_agree',  btn_disagree: 'btn_disagree',  };
FUNCNAME = {  onbtn_agree: {nodeName:"btn_agree",type:"onactivate"}, onbtn_disagree: {nodeName:"btn_disagree",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.panel_0 = createRef<Panel>();
this.panel_9 = createRef<Panel>();
this.panel_1 = createRef<Panel>();
this.panel_2 = createRef<Panel>();
this.panel_3 = createRef<Panel>();
this.panel_8 = createRef<Panel>();
this.panel_7 = createRef<Panel>();
this.panel_6 = createRef<Panel>();
this.panel_4 = createRef<Panel>();
this.panel_5 = createRef<Panel>();
this.lbl_agree_0 = createRef<LabelPanel>();
this.lbl_agree_9 = createRef<LabelPanel>();
this.lbl_agree_8 = createRef<LabelPanel>();
this.lbl_agree_7 = createRef<LabelPanel>();
this.lbl_agree_6 = createRef<LabelPanel>();
this.lbl_agree_5 = createRef<LabelPanel>();
this.lbl_agree_4 = createRef<LabelPanel>();
this.lbl_agree_3 = createRef<LabelPanel>();
this.lbl_agree_2 = createRef<LabelPanel>();
this.lbl_agree_1 = createRef<LabelPanel>();
this.panel_agreeinfo = createRef<Panel>();
this.btn_agree = createRef<Button>();
this.btn_disagree = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1300px","height":"800px","backgroundColor":"#4f4c4c","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"21px","width":"250px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"width":"1200px","height":"661px","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"125px","x":"35px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"383px","x":"35px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"272px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"509px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"747px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"469px","x":"272px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_6 : Partial<VCSSStyleDeclaration>  = {"y":"469px","x":"509px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_7 : Partial<VCSSStyleDeclaration>  = {"y":"469px","x":"747px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_8 : Partial<VCSSStyleDeclaration>  = {"y":"131px","x":"997px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_9 : Partial<VCSSStyleDeclaration>  = {"y":"389px","x":"997px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_10 : Partial<VCSSStyleDeclaration>  = {"y":"282px","x":"68px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_11 : Partial<VCSSStyleDeclaration>  = {"y":"540px","x":"68px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_12 : Partial<VCSSStyleDeclaration>  = {"y":"624px","x":"309px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_13 : Partial<VCSSStyleDeclaration>  = {"y":"626px","x":"546px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_14 : Partial<VCSSStyleDeclaration>  = {"y":"626px","x":"786px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_15 : Partial<VCSSStyleDeclaration>  = {"y":"542px","x":"1036px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_16 : Partial<VCSSStyleDeclaration>  = {"y":"286px","x":"1036px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_17 : Partial<VCSSStyleDeclaration>  = {"y":"180px","x":"784px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_18 : Partial<VCSSStyleDeclaration>  = {"y":"178px","x":"544px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_19 : Partial<VCSSStyleDeclaration>  = {"y":"178px","x":"308px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_20 : Partial<VCSSStyleDeclaration>  = {"y":"223px","x":"300px","width":"600px","height":"232px"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"y":"64px","x":"33px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/agree.png\")","backgroundSize":"100% 100%"}
CSS_3_1 : Partial<VCSSStyleDeclaration>  = {"y":"60px","x":"418px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/disagree.png\")","backgroundSize":"100% 100%"}
CSS_3_2 : Partial<VCSSStyleDeclaration>  = {"x":"0px","height":"46px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
panel_0_isValid:boolean = true;
panel_0_attrs:PanelAttributes={};
panel_0_childs: Array<JSX.Element> = [];
panel_9_isValid:boolean = true;
panel_9_attrs:PanelAttributes={};
panel_9_childs: Array<JSX.Element> = [];
panel_1_isValid:boolean = true;
panel_1_attrs:PanelAttributes={};
panel_1_childs: Array<JSX.Element> = [];
panel_2_isValid:boolean = true;
panel_2_attrs:PanelAttributes={};
panel_2_childs: Array<JSX.Element> = [];
panel_3_isValid:boolean = true;
panel_3_attrs:PanelAttributes={};
panel_3_childs: Array<JSX.Element> = [];
panel_8_isValid:boolean = true;
panel_8_attrs:PanelAttributes={};
panel_8_childs: Array<JSX.Element> = [];
panel_7_isValid:boolean = true;
panel_7_attrs:PanelAttributes={};
panel_7_childs: Array<JSX.Element> = [];
panel_6_isValid:boolean = true;
panel_6_attrs:PanelAttributes={};
panel_6_childs: Array<JSX.Element> = [];
panel_4_isValid:boolean = true;
panel_4_attrs:PanelAttributes={};
panel_4_childs: Array<JSX.Element> = [];
panel_5_isValid:boolean = true;
panel_5_attrs:PanelAttributes={};
panel_5_childs: Array<JSX.Element> = [];
lbl_agree_0_isValid:boolean = true;
lbl_agree_0_attrs:LabelAttributes={};
lbl_agree_0_childs: Array<JSX.Element> = [];
lbl_agree_9_isValid:boolean = true;
lbl_agree_9_attrs:LabelAttributes={};
lbl_agree_9_childs: Array<JSX.Element> = [];
lbl_agree_8_isValid:boolean = true;
lbl_agree_8_attrs:LabelAttributes={};
lbl_agree_8_childs: Array<JSX.Element> = [];
lbl_agree_7_isValid:boolean = true;
lbl_agree_7_attrs:LabelAttributes={};
lbl_agree_7_childs: Array<JSX.Element> = [];
lbl_agree_6_isValid:boolean = true;
lbl_agree_6_attrs:LabelAttributes={};
lbl_agree_6_childs: Array<JSX.Element> = [];
lbl_agree_5_isValid:boolean = true;
lbl_agree_5_attrs:LabelAttributes={};
lbl_agree_5_childs: Array<JSX.Element> = [];
lbl_agree_4_isValid:boolean = true;
lbl_agree_4_attrs:LabelAttributes={};
lbl_agree_4_childs: Array<JSX.Element> = [];
lbl_agree_3_isValid:boolean = true;
lbl_agree_3_attrs:LabelAttributes={};
lbl_agree_3_childs: Array<JSX.Element> = [];
lbl_agree_2_isValid:boolean = true;
lbl_agree_2_attrs:LabelAttributes={};
lbl_agree_2_childs: Array<JSX.Element> = [];
lbl_agree_1_isValid:boolean = true;
lbl_agree_1_attrs:LabelAttributes={};
lbl_agree_1_childs: Array<JSX.Element> = [];
panel_agreeinfo_isValid:boolean = true;
panel_agreeinfo_attrs:PanelAttributes={};
panel_agreeinfo_childs: Array<JSX.Element> = [];
btn_agree_isValid:boolean = true;
btn_agree_attrs:PanelAttributes={};
btn_agree_childs: Array<JSX.Element> = [];
btn_disagree_isValid:boolean = true;
btn_disagree_attrs:PanelAttributes={};
btn_disagree_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Label text="本次任务队伍成员" key="compId_13" style={this.CSS_1_0} >
</Label>
    <Panel key="compId_30" style={this.CSS_1_1}>
        {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_34" style={this.CSS_2_0}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}
        {this.panel_9_isValid && 
<Panel ref={this.panel_9} key="compId_35" style={this.CSS_2_1}  {...this.panel_9_attrs} >
{this.panel_9_childs}
</Panel>
}
        {this.panel_1_isValid && 
<Panel ref={this.panel_1} key="compId_36" style={this.CSS_2_2}  {...this.panel_1_attrs} >
{this.panel_1_childs}
</Panel>
}
        {this.panel_2_isValid && 
<Panel ref={this.panel_2} key="compId_37" style={this.CSS_2_3}  {...this.panel_2_attrs} >
{this.panel_2_childs}
</Panel>
}
        {this.panel_3_isValid && 
<Panel ref={this.panel_3} key="compId_38" style={this.CSS_2_4}  {...this.panel_3_attrs} >
{this.panel_3_childs}
</Panel>
}
        {this.panel_8_isValid && 
<Panel ref={this.panel_8} key="compId_39" style={this.CSS_2_5}  {...this.panel_8_attrs} >
{this.panel_8_childs}
</Panel>
}
        {this.panel_7_isValid && 
<Panel ref={this.panel_7} key="compId_40" style={this.CSS_2_6}  {...this.panel_7_attrs} >
{this.panel_7_childs}
</Panel>
}
        {this.panel_6_isValid && 
<Panel ref={this.panel_6} key="compId_41" style={this.CSS_2_7}  {...this.panel_6_attrs} >
{this.panel_6_childs}
</Panel>
}
        {this.panel_4_isValid && 
<Panel ref={this.panel_4} key="compId_42" style={this.CSS_2_8}  {...this.panel_4_attrs} >
{this.panel_4_childs}
</Panel>
}
        {this.panel_5_isValid && 
<Panel ref={this.panel_5} key="compId_43" style={this.CSS_2_9}  {...this.panel_5_attrs} >
{this.panel_5_childs}
</Panel>
}
        {this.lbl_agree_0_isValid && 
<Label text="已投票" ref={this.lbl_agree_0} key="compId_44" style={this.CSS_2_10}  {...this.lbl_agree_0_attrs} >
{this.lbl_agree_0_childs}
</Label>
}
        {this.lbl_agree_9_isValid && 
<Label text="已投票" ref={this.lbl_agree_9} key="compId_45" style={this.CSS_2_11}  {...this.lbl_agree_9_attrs} >
{this.lbl_agree_9_childs}
</Label>
}
        {this.lbl_agree_8_isValid && 
<Label text="已投票" ref={this.lbl_agree_8} key="compId_46" style={this.CSS_2_12}  {...this.lbl_agree_8_attrs} >
{this.lbl_agree_8_childs}
</Label>
}
        {this.lbl_agree_7_isValid && 
<Label text="已投票" ref={this.lbl_agree_7} key="compId_47" style={this.CSS_2_13}  {...this.lbl_agree_7_attrs} >
{this.lbl_agree_7_childs}
</Label>
}
        {this.lbl_agree_6_isValid && 
<Label text="已投票" ref={this.lbl_agree_6} key="compId_48" style={this.CSS_2_14}  {...this.lbl_agree_6_attrs} >
{this.lbl_agree_6_childs}
</Label>
}
        {this.lbl_agree_5_isValid && 
<Label text="已投票" ref={this.lbl_agree_5} key="compId_49" style={this.CSS_2_15}  {...this.lbl_agree_5_attrs} >
{this.lbl_agree_5_childs}
</Label>
}
        {this.lbl_agree_4_isValid && 
<Label text="已投票" ref={this.lbl_agree_4} key="compId_50" style={this.CSS_2_16}  {...this.lbl_agree_4_attrs} >
{this.lbl_agree_4_childs}
</Label>
}
        {this.lbl_agree_3_isValid && 
<Label text="已投票" ref={this.lbl_agree_3} key="compId_51" style={this.CSS_2_17}  {...this.lbl_agree_3_attrs} >
{this.lbl_agree_3_childs}
</Label>
}
        {this.lbl_agree_2_isValid && 
<Label text="已投票" ref={this.lbl_agree_2} key="compId_52" style={this.CSS_2_18}  {...this.lbl_agree_2_attrs} >
{this.lbl_agree_2_childs}
</Label>
}
        {this.lbl_agree_1_isValid && 
<Label text="已投票" ref={this.lbl_agree_1} key="compId_53" style={this.CSS_2_19}  {...this.lbl_agree_1_attrs} >
{this.lbl_agree_1_childs}
</Label>
}
        {this.panel_agreeinfo_isValid && 
<Panel ref={this.panel_agreeinfo} key="compId_54" style={this.CSS_2_20}  {...this.panel_agreeinfo_attrs}>
            {this.btn_agree_isValid && 
<Button ref={this.btn_agree} onactivate={this.onbtn_agree} key="compId_14" style={this.CSS_3_0}  {...this.btn_agree_attrs} >
{this.btn_agree_childs}
</Button>
}
            {this.btn_disagree_isValid && 
<Button ref={this.btn_disagree} onactivate={this.onbtn_disagree} key="compId_28" style={this.CSS_3_1}  {...this.btn_disagree_attrs} >
{this.btn_disagree_childs}
</Button>
}
            <Label text="对于本次组队安排，你的看法:" key="compId_29" style={this.CSS_3_2} >
</Label>
        
{this.panel_agreeinfo_childs}
</Panel>
}
    
</Panel>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}