
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TopBarPanel_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_round: React.RefObject<LabelPanel>;
lbl_chooseteam: React.RefObject<LabelPanel>;
lbl_lefttime: React.RefObject<LabelPanel>;
panel_0: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  lbl_round: 'lbl_round',  lbl_chooseteam: 'lbl_chooseteam',  lbl_lefttime: 'lbl_lefttime',  panel_0: 'panel_0',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_round = createRef<LabelPanel>();
this.lbl_chooseteam = createRef<LabelPanel>();
this.lbl_lefttime = createRef<LabelPanel>();
this.panel_0 = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1000px","marginTop":"0px","height":"180px","backgroundColor":"#606060","x":"0px","horizontalAlign":"middle"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"31px","width":"954px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/custom_game/bt_grey.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"5px","x":"12px","width":"228px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"322px","width":"320px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"694px","width":"228px","height":"42px","fontWeight":"bold","fontSize":"40","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"88px","width":"650px","height":"90px","x":"0px","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_round_isValid:boolean = true;
lbl_round_attrs:LabelAttributes={};
lbl_round_childs: Array<JSX.Element> = [];
lbl_chooseteam_isValid:boolean = true;
lbl_chooseteam_attrs:LabelAttributes={};
lbl_chooseteam_childs: Array<JSX.Element> = [];
lbl_lefttime_isValid:boolean = true;
lbl_lefttime_attrs:LabelAttributes={};
lbl_lefttime_childs: Array<JSX.Element> = [];
panel_0_isValid:boolean = true;
panel_0_attrs:PanelAttributes={};
panel_0_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel ref={this.__root__} key="compId_1" style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Image key="compId_2" style={this.CSS_1_0}>
        {this.lbl_round_isValid && 
<Label text="ROUND:100" ref={this.lbl_round} key="compId_5" style={this.CSS_2_0}  {...this.lbl_round_attrs} >
{this.lbl_round_childs}
</Label>
}
        {this.lbl_chooseteam_isValid && 
<Label text="选择队伍" ref={this.lbl_chooseteam} key="compId_6" style={this.CSS_2_1}  {...this.lbl_chooseteam_attrs} >
{this.lbl_chooseteam_childs}
</Label>
}
        {this.lbl_lefttime_isValid && 
<Label text="倒计时:600秒" ref={this.lbl_lefttime} key="compId_7" style={this.CSS_2_2}  {...this.lbl_lefttime_attrs} >
{this.lbl_lefttime_childs}
</Label>
}
    
</Image>
    {this.panel_0_isValid && 
<Panel ref={this.panel_0} key="compId_4" style={this.CSS_1_1}  {...this.panel_0_attrs} >
{this.panel_0_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}