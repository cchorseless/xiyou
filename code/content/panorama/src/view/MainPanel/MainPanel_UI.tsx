
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes } from "react-panorama-eom";


export class MainPanel_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_debug: React.RefObject<Button>;
onbtn_click = (...args: any[]) => { };
btn_showInfo: React.RefObject<Button>;
onbtn_showInfo = (...args: any[]) => { };
btn_showAllInfo: React.RefObject<Button>;
onbtn_showAllInfo = (...args: any[]) => { };
btn_showAllInfo_close: React.RefObject<Button>;
btn_showtsak: React.RefObject<Button>;
onbtn_showtask = (...args: any[]) => { };
btn_showgamepanel: React.RefObject<Button>;
onbtn_showgamepanel = (...args: any[]) => { };
panel_allpanel: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  btn_debug: 'btn_debug',  btn_showInfo: 'btn_showInfo',  btn_showAllInfo: 'btn_showAllInfo',  btn_showAllInfo_close: 'btn_showAllInfo_close',  btn_showtsak: 'btn_showtsak',  btn_showgamepanel: 'btn_showgamepanel',  panel_allpanel: 'panel_allpanel',  };
FUNCNAME = {  onbtn_click: {nodeName:"btn_debug",type:"onactivate"}, onbtn_showInfo: {nodeName:"btn_showInfo",type:"onactivate"}, onbtn_showAllInfo: {nodeName:"btn_showAllInfo",type:"onactivate"}, onbtn_showtask: {nodeName:"btn_showtsak",type:"onactivate"}, onbtn_showgamepanel: {nodeName:"btn_showgamepanel",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_debug = createRef<Button>();
this.btn_showInfo = createRef<Button>();
this.btn_showAllInfo = createRef<Button>();
this.btn_showAllInfo_close = createRef<Button>();
this.btn_showtsak = createRef<Button>();
this.btn_showgamepanel = createRef<Button>();
this.panel_allpanel = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"x":"5px","width":"38px","height":"38px","marginBottom":"245px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/arrow_popout.png\")","backgroundSize":"100% 100%","verticalAlign":"bottom"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"x":"0px","width":"64px","marginTop":"262px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/friend_large.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"x":"12px","width":"40px","height":"20px","fontWeight":"bold","fontSize":"20","color":"#000000","marginBottom":"5px","verticalAlign":"bottom"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"width":"80px","marginRight":"5px","height":"80px","marginBottom":"0px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/icon_multiple_styles.png\")","backgroundSize":"100% 100%","horizontalAlign":"right","verticalAlign":"bottom"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"10px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/purgatory.png\")","backgroundSize":"100% 100%"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"x":"0px","width":"64px","marginTop":"362px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/custom_game/icons/container_mail.png\")","backgroundSize":"100% 100%"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"382px","x":"67px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"x":"0px","width":"64px","marginTop":"179px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/task_ising.png\")","backgroundSize":"100% 100%"}
CSS_1_6 : Partial<VCSSStyleDeclaration>  = {"x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_debug_isValid:boolean = true;
btn_debug_attrs:PanelAttributes={};
btn_debug_childs: Array<JSX.Element> = [];
btn_showInfo_isValid:boolean = true;
btn_showInfo_attrs:PanelAttributes={};
btn_showInfo_childs: Array<JSX.Element> = [];
btn_showAllInfo_isValid:boolean = true;
btn_showAllInfo_attrs:PanelAttributes={};
btn_showAllInfo_childs: Array<JSX.Element> = [];
btn_showAllInfo_close_isValid:boolean = true;
btn_showAllInfo_close_attrs:PanelAttributes={};
btn_showAllInfo_close_childs: Array<JSX.Element> = [];
btn_showtsak_isValid:boolean = true;
btn_showtsak_attrs:PanelAttributes={};
btn_showtsak_childs: Array<JSX.Element> = [];
btn_showgamepanel_isValid:boolean = true;
btn_showgamepanel_attrs:PanelAttributes={};
btn_showgamepanel_childs: Array<JSX.Element> = [];
panel_allpanel_isValid:boolean = true;
panel_allpanel_attrs:PanelAttributes={};
panel_allpanel_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel ref={this.__root__} className="root" key="compId_1" style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.btn_debug_isValid && 
<Button ref={this.btn_debug} onactivate={this.onbtn_click} className="CommonButton" key="compId_2" style={this.CSS_1_0}  {...this.btn_debug_attrs} >
{this.btn_debug_childs}
</Button>
}
    {this.btn_showInfo_isValid && 
<Button ref={this.btn_showInfo} onactivate={this.onbtn_showInfo} className="CommonButton" key="compId_3" style={this.CSS_1_1}  {...this.btn_showInfo_attrs}>
        <Label text="身份" key="compId_6" style={this.CSS_2_0} >
</Label>
    
{this.btn_showInfo_childs}
</Button>
}
    {this.btn_showAllInfo_isValid && 
<Button ref={this.btn_showAllInfo} onactivate={this.onbtn_showAllInfo} className="CommonButton" key="compId_4" style={this.CSS_1_2}  {...this.btn_showAllInfo_attrs}>
        {this.btn_showAllInfo_close_isValid && 
<Button ref={this.btn_showAllInfo_close} key="compId_5" style={this.CSS_2_0_0}  {...this.btn_showAllInfo_close_attrs} >
{this.btn_showAllInfo_close_childs}
</Button>
}
    
{this.btn_showAllInfo_childs}
</Button>
}
    {this.btn_showtsak_isValid && 
<Button ref={this.btn_showtsak} onactivate={this.onbtn_showtask} className="CommonButton" key="compId_7" style={this.CSS_1_3}  {...this.btn_showtsak_attrs} >
{this.btn_showtsak_childs}
</Button>
}
    <Label text="任务:" key="compId_10" style={this.CSS_1_4} >
</Label>
    {this.btn_showgamepanel_isValid && 
<Button ref={this.btn_showgamepanel} onactivate={this.onbtn_showgamepanel} className="CommonButton" key="compId_11" style={this.CSS_1_5}  {...this.btn_showgamepanel_attrs} >
{this.btn_showgamepanel_childs}
</Button>
}
    {this.panel_allpanel_isValid && 
<Panel ref={this.panel_allpanel} className="root" key="compId_13" style={this.CSS_1_6}  {...this.panel_allpanel_attrs} >
{this.panel_allpanel_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}