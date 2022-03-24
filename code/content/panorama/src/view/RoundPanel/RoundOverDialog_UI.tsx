
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class RoundOverDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_end: React.RefObject<Button>;
onbtn_makeTeam = (...args: any[]) => { };
lbl_winner: React.RefObject<LabelPanel>;
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
NODENAME = {  __root__: '__root__',  btn_end: 'btn_end',  lbl_winner: 'lbl_winner',  panel_0: 'panel_0',  panel_9: 'panel_9',  panel_1: 'panel_1',  panel_2: 'panel_2',  panel_3: 'panel_3',  panel_8: 'panel_8',  panel_7: 'panel_7',  panel_6: 'panel_6',  panel_4: 'panel_4',  panel_5: 'panel_5',  };
FUNCNAME = {  onbtn_makeTeam: {nodeName:"btn_end",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_end = createRef<Button>();
this.lbl_winner = createRef<LabelPanel>();
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

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1300px","height":"800px","backgroundColor":"#4f4c4c","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"17px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"689px","width":"194px","height":"90px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_green.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"64px","width":"1200px","height":"609px","x":"0px","horizontalAlign":"middle"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"269px","x":"0px","height":"58px","fontWeight":"bold","fontSize":"50","color":"#24f31b","horizontalAlign":"middle"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"125px","x":"35px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"331px","x":"35px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"272px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"509px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"747px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_6 : Partial<VCSSStyleDeclaration>  = {"y":"417px","x":"272px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_7 : Partial<VCSSStyleDeclaration>  = {"y":"417px","x":"509px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_8 : Partial<VCSSStyleDeclaration>  = {"y":"417px","x":"747px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_9 : Partial<VCSSStyleDeclaration>  = {"y":"131px","x":"997px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}
CSS_2_10 : Partial<VCSSStyleDeclaration>  = {"y":"337px","x":"997px","width":"200px","uiScaleY":"80%","uiScaleX":"80%","height":"190px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/camera_side.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_end_isValid:boolean = true;
btn_end_attrs:PanelAttributes={};
btn_end_childs: Array<JSX.Element> = [];
lbl_winner_isValid:boolean = true;
lbl_winner_attrs:LabelAttributes={};
lbl_winner_childs: Array<JSX.Element> = [];
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

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Label text="身份解密" key="compId_13" style={this.CSS_1_0} >
</Label>
    {this.btn_end_isValid && 
<Button ref={this.btn_end} onactivate={this.onbtn_makeTeam} key="compId_14" style={this.CSS_1_1}  {...this.btn_end_attrs}>
        <Label text="我知道了" key="compId_15" style={this.CSS_2_0} >
</Label>
    
{this.btn_end_childs}
</Button>
}
    <Panel key="compId_16" style={this.CSS_1_2}>
        {this.lbl_winner_isValid && 
<Label text="刺杀对方领袖获取最终胜利" ref={this.lbl_winner} key="compId_46" style={this.CSS_2_0_0}  {...this.lbl_winner_attrs} >
{this.lbl_winner_childs}
</Label>
}
        {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_47" style={this.CSS_2_1}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}
        {this.panel_9_isValid && 
<Panel ref={this.panel_9} key="compId_49" style={this.CSS_2_2}  {...this.panel_9_attrs} >
{this.panel_9_childs}
</Panel>
}
        {this.panel_1_isValid && 
<Panel ref={this.panel_1} key="compId_51" style={this.CSS_2_3}  {...this.panel_1_attrs} >
{this.panel_1_childs}
</Panel>
}
        {this.panel_2_isValid && 
<Panel ref={this.panel_2} key="compId_53" style={this.CSS_2_4}  {...this.panel_2_attrs} >
{this.panel_2_childs}
</Panel>
}
        {this.panel_3_isValid && 
<Panel ref={this.panel_3} key="compId_55" style={this.CSS_2_5}  {...this.panel_3_attrs} >
{this.panel_3_childs}
</Panel>
}
        {this.panel_8_isValid && 
<Panel ref={this.panel_8} key="compId_57" style={this.CSS_2_6}  {...this.panel_8_attrs} >
{this.panel_8_childs}
</Panel>
}
        {this.panel_7_isValid && 
<Panel ref={this.panel_7} key="compId_58" style={this.CSS_2_7}  {...this.panel_7_attrs} >
{this.panel_7_childs}
</Panel>
}
        {this.panel_6_isValid && 
<Panel ref={this.panel_6} key="compId_59" style={this.CSS_2_8}  {...this.panel_6_attrs} >
{this.panel_6_childs}
</Panel>
}
        {this.panel_4_isValid && 
<Panel ref={this.panel_4} key="compId_63" style={this.CSS_2_9}  {...this.panel_4_attrs} >
{this.panel_4_childs}
</Panel>
}
        {this.panel_5_isValid && 
<Panel ref={this.panel_5} key="compId_64" style={this.CSS_2_10}  {...this.panel_5_attrs} >
{this.panel_5_childs}
</Panel>
}
    
</Panel>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}