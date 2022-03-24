
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class RoundChatStartDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_sure: React.RefObject<Button>;
onbtn_makeTeam = (...args: any[]) => { };
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
lbl_playerid: React.RefObject<LabelPanel>;
lbl_shunxu: React.RefObject<LabelPanel>;
btn_changeTurn: React.RefObject<Button>;
onbtn_changeTurn = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  btn_sure: 'btn_sure',  panel_0: 'panel_0',  panel_9: 'panel_9',  panel_1: 'panel_1',  panel_2: 'panel_2',  panel_3: 'panel_3',  panel_8: 'panel_8',  panel_7: 'panel_7',  panel_6: 'panel_6',  panel_4: 'panel_4',  panel_5: 'panel_5',  lbl_playerid: 'lbl_playerid',  lbl_shunxu: 'lbl_shunxu',  btn_changeTurn: 'btn_changeTurn',  };
FUNCNAME = {  onbtn_makeTeam: {nodeName:"btn_sure",type:"onactivate"}, onbtn_changeTurn: {nodeName:"btn_changeTurn",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_sure = createRef<Button>();
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
this.lbl_playerid = createRef<LabelPanel>();
this.lbl_shunxu = createRef<LabelPanel>();
this.btn_changeTurn = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1300px","height":"800px","backgroundColor":"#4f4c4c","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"17px","width":"250px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"689px","width":"194px","height":"90px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_green.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"64px","width":"1200px","height":"609px","x":"0px","horizontalAlign":"middle"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"125px","x":"35px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"331px","x":"35px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"272px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"509px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"747px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"417px","x":"272px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_6 : Partial<VCSSStyleDeclaration>  = {"y":"417px","x":"509px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_7 : Partial<VCSSStyleDeclaration>  = {"y":"417px","x":"747px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_8 : Partial<VCSSStyleDeclaration>  = {"y":"131px","x":"997px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_9 : Partial<VCSSStyleDeclaration>  = {"y":"337px","x":"997px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_10 : Partial<VCSSStyleDeclaration>  = {"y":"231px","x":"-160px","width":"256px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_2_11 : Partial<VCSSStyleDeclaration>  = {"y":"328px","x":"-154px","width":"256px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","horizontalAlign":"middle"}
CSS_2_12 : Partial<VCSSStyleDeclaration>  = {"y":"274px","x":"737px","width":"158px","height":"68px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_purple.png\")","backgroundSize":"100% 100%"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}
CSS_2_13 : Partial<VCSSStyleDeclaration>  = {"y":"271px","x":"-151px","width":"305px","height":"34px","fontWeight":"bold","fontSize":"22","color":"#24f31b","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_sure_isValid:boolean = true;
btn_sure_attrs:PanelAttributes={};
btn_sure_childs: Array<JSX.Element> = [];
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
lbl_playerid_isValid:boolean = true;
lbl_playerid_attrs:LabelAttributes={};
lbl_playerid_childs: Array<JSX.Element> = [];
lbl_shunxu_isValid:boolean = true;
lbl_shunxu_attrs:LabelAttributes={};
lbl_shunxu_childs: Array<JSX.Element> = [];
btn_changeTurn_isValid:boolean = true;
btn_changeTurn_attrs:PanelAttributes={};
btn_changeTurn_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Label text="选取本次发言顺序" key="compId_13" style={this.CSS_1_0} >
</Label>
    {this.btn_sure_isValid && 
<Button ref={this.btn_sure} onactivate={this.onbtn_makeTeam} key="compId_14" style={this.CSS_1_1}  {...this.btn_sure_attrs}>
        <Label text="确认" key="compId_15" style={this.CSS_2_0} >
</Label>
    
{this.btn_sure_childs}
</Button>
}
    <Panel key="compId_16" style={this.CSS_1_2}>
        {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_47" style={this.CSS_2_0_0}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}
        {this.panel_9_isValid && 
<Panel ref={this.panel_9} key="compId_49" style={this.CSS_2_1}  {...this.panel_9_attrs} >
{this.panel_9_childs}
</Panel>
}
        {this.panel_1_isValid && 
<Panel ref={this.panel_1} key="compId_51" style={this.CSS_2_2}  {...this.panel_1_attrs} >
{this.panel_1_childs}
</Panel>
}
        {this.panel_2_isValid && 
<Panel ref={this.panel_2} key="compId_53" style={this.CSS_2_3}  {...this.panel_2_attrs} >
{this.panel_2_childs}
</Panel>
}
        {this.panel_3_isValid && 
<Panel ref={this.panel_3} key="compId_55" style={this.CSS_2_4}  {...this.panel_3_attrs} >
{this.panel_3_childs}
</Panel>
}
        {this.panel_8_isValid && 
<Panel ref={this.panel_8} key="compId_57" style={this.CSS_2_5}  {...this.panel_8_attrs} >
{this.panel_8_childs}
</Panel>
}
        {this.panel_7_isValid && 
<Panel ref={this.panel_7} key="compId_58" style={this.CSS_2_6}  {...this.panel_7_attrs} >
{this.panel_7_childs}
</Panel>
}
        {this.panel_6_isValid && 
<Panel ref={this.panel_6} key="compId_59" style={this.CSS_2_7}  {...this.panel_6_attrs} >
{this.panel_6_childs}
</Panel>
}
        {this.panel_4_isValid && 
<Panel ref={this.panel_4} key="compId_63" style={this.CSS_2_8}  {...this.panel_4_attrs} >
{this.panel_4_childs}
</Panel>
}
        {this.panel_5_isValid && 
<Panel ref={this.panel_5} key="compId_64" style={this.CSS_2_9}  {...this.panel_5_attrs} >
{this.panel_5_childs}
</Panel>
}
        {this.lbl_playerid_isValid && 
<Label text="首位发言玩家:06号" ref={this.lbl_playerid} key="compId_41" style={this.CSS_2_10}  {...this.lbl_playerid_attrs} >
{this.lbl_playerid_childs}
</Label>
}
        {this.lbl_shunxu_isValid && 
<Label text="发言顺序:正序" ref={this.lbl_shunxu} key="compId_42" style={this.CSS_2_11}  {...this.lbl_shunxu_attrs} >
{this.lbl_shunxu_childs}
</Label>
}
        {this.btn_changeTurn_isValid && 
<Button ref={this.btn_changeTurn} onactivate={this.onbtn_changeTurn} key="compId_43" style={this.CSS_2_12}  {...this.btn_changeTurn_attrs}>
            <Label text="颠倒顺序" key="compId_44" style={this.CSS_3_0} >
</Label>
        
{this.btn_changeTurn_childs}
</Button>
}
        <Label text="（点击头像修改首次发言玩家）" key="compId_46" style={this.CSS_2_13} >
</Label>
    
</Panel>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}