
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes } from "react-panorama-eom";


export class DebugPanel_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
panel_0: React.RefObject<Panel>;
btn_close: React.RefObject<Button>;
onbtn_close = (...args: any[]) => { };
btn_restartGame: React.RefObject<Button>;
onClick_restartGame = (...args: any[]) => { };
btn_clearall: React.RefObject<Button>;
onClick_btn_clearall = (...args: any[]) => { };
btn_reload: React.RefObject<Button>;
onClick_reload = (...args: any[]) => { };
btn_createUnit: React.RefObject<Button>;
onClick_createUnit = (...args: any[]) => { };
btn_finishTask: React.RefObject<Button>;
onClick_finishTask = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  panel_0: 'panel_0',  btn_close: 'btn_close',  btn_restartGame: 'btn_restartGame',  btn_clearall: 'btn_clearall',  btn_reload: 'btn_reload',  btn_createUnit: 'btn_createUnit',  btn_finishTask: 'btn_finishTask',  };
FUNCNAME = {  onbtn_close: {nodeName:"btn_close",type:"onactivate"}, onClick_restartGame: {nodeName:"btn_restartGame",type:"ondblclick"}, onClick_btn_clearall: {nodeName:"btn_clearall",type:"onactivate"}, onClick_reload: {nodeName:"btn_reload",type:"ondblclick"}, onClick_createUnit: {nodeName:"btn_createUnit",type:"ondblclick"}, onClick_finishTask: {nodeName:"btn_finishTask",type:"ondblclick"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.panel_0 = createRef<Panel>();
this.btn_close = createRef<Button>();
this.btn_restartGame = createRef<Button>();
this.btn_clearall = createRef<Button>();
this.btn_reload = createRef<Button>();
this.btn_createUnit = createRef<Button>();
this.btn_finishTask = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"width":"1567px","height":"761px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/backgrounds/dashboard_background.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"15px","width":"80px","marginTop":"15px","marginRight":"15px","height":"80px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/purgatory.png\")","backgroundSize":"100% 100%","horizontalAlign":"right"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"150px","x":"125px"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"fontSize":"25","color":"#fdfdfd"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"249px","x":"125px"}
CSS_3_0_0 : Partial<VCSSStyleDeclaration>  = {"fontSize":"25","color":"#fdfdfd"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"347px","x":"125px"}
CSS_3_0_1 : Partial<VCSSStyleDeclaration>  = {"fontSize":"25","color":"#fdfdfd"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"155px","x":"391px"}
CSS_3_0_2 : Partial<VCSSStyleDeclaration>  = {"fontSize":"25","color":"#fdfdfd"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"249px","x":"381px"}
CSS_3_0_3 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"100px","height":"29px","fontSize":"25","color":"#fdfdfd"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
panel_0_isValid:boolean = true;
panel_0_attrs:PanelAttributes={};
panel_0_childs: Array<JSX.Element> = [];
btn_close_isValid:boolean = true;
btn_close_attrs:PanelAttributes={};
btn_close_childs: Array<JSX.Element> = [];
btn_restartGame_isValid:boolean = true;
btn_restartGame_attrs:PanelAttributes={};
btn_restartGame_childs: Array<JSX.Element> = [];
btn_clearall_isValid:boolean = true;
btn_clearall_attrs:PanelAttributes={};
btn_clearall_childs: Array<JSX.Element> = [];
btn_reload_isValid:boolean = true;
btn_reload_attrs:PanelAttributes={};
btn_reload_childs: Array<JSX.Element> = [];
btn_createUnit_isValid:boolean = true;
btn_createUnit_attrs:PanelAttributes={};
btn_createUnit_childs: Array<JSX.Element> = [];
btn_finishTask_isValid:boolean = true;
btn_finishTask_attrs:PanelAttributes={};
btn_finishTask_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel className="root" key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_2" style={this.CSS_1_0}  {...this.panel_0_attrs}>
        {this.btn_close_isValid && 
<Button ref={this.btn_close} onactivate={this.onbtn_close} key="compId_3" style={this.CSS_2_0}  {...this.btn_close_attrs} >
{this.btn_close_childs}
</Button>
}
        {this.btn_restartGame_isValid && 
<Button ref={this.btn_restartGame} ondblclick={this.onClick_restartGame} className="DebugButton" key="compId_7" style={this.CSS_2_1}  {...this.btn_restartGame_attrs}>
            <Label text="重启游戏" key="compId_11" style={this.CSS_3_0} >
</Label>
        
{this.btn_restartGame_childs}
</Button>
}
        {this.btn_clearall_isValid && 
<Button ref={this.btn_clearall} onactivate={this.onClick_btn_clearall} className="DebugButton" key="compId_12" style={this.CSS_2_2}  {...this.btn_clearall_attrs}>
            <Label text="清除打印" key="compId_13" style={this.CSS_3_0_0} >
</Label>
        
{this.btn_clearall_childs}
</Button>
}
        {this.btn_reload_isValid && 
<Button ref={this.btn_reload} ondblclick={this.onClick_reload} className="DebugButton" key="compId_14" style={this.CSS_2_3}  {...this.btn_reload_attrs}>
            <Label text="重新加载" key="compId_15" style={this.CSS_3_0_1} >
</Label>
        
{this.btn_reload_childs}
</Button>
}
        {this.btn_createUnit_isValid && 
<Button ref={this.btn_createUnit} ondblclick={this.onClick_createUnit} className="DebugButton" key="compId_16" style={this.CSS_2_4}  {...this.btn_createUnit_attrs}>
            <Label text="创建单位" key="compId_17" style={this.CSS_3_0_2} >
</Label>
        
{this.btn_createUnit_childs}
</Button>
}
        {this.btn_finishTask_isValid && 
<Button ref={this.btn_finishTask} ondblclick={this.onClick_finishTask} className="DebugButton" key="compId_18" style={this.CSS_2_5}  {...this.btn_finishTask_attrs}>
            <Label text="完成任务" key="compId_19" style={this.CSS_3_0_3} >
</Label>
        
{this.btn_finishTask_childs}
</Button>
}
    
{this.panel_0_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}