
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";


export class Team_select_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
btn_startgame: React.RefObject<Button>;
onbtn_startgame = (...args: any[]) => { };
btn_addbot: React.RefObject<Button>;
onbtn_addbot = (...args: any[]) => { };
allplayer: React.RefObject<Button>;
NODENAME = {  __root__: '__root__',  btn_startgame: 'btn_startgame',  btn_addbot: 'btn_addbot',  allplayer: 'allplayer',  };
FUNCNAME = {  onbtn_startgame: {nodeName:"btn_startgame",type:"onactivate"}, onbtn_addbot: {nodeName:"btn_addbot",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_startgame = createRef<Button>();
this.btn_addbot = createRef<Button>();
this.allplayer = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"width":"897px","marginTop":"47px","marginRight":"650px","height":"770px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/backgrounds/community_challenge_lina.png\")","backgroundColor":"#565252","backgroundSize":"100% 100%","horizontalAlign":"right"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"width":"246px","marginRight":"30px","height":"114px","marginBottom":"30px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_gold.png\")","backgroundSize":"100% 100%","horizontalAlign":"right","verticalAlign":"bottom"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"37px","x":"58px","width":"130px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"width":"246px","marginRight":"300px","height":"114px","marginBottom":"30px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_green.png\")","backgroundSize":"100% 100%","horizontalAlign":"right","verticalAlign":"bottom"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"37px","x":"43px","height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"20px","x":"18px","width":"967px","height":"842px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_startgame_isValid:boolean = true;
btn_startgame_attrs:PanelAttributes={};
btn_startgame_childs: Array<JSX.Element> = [];
btn_addbot_isValid:boolean = true;
btn_addbot_attrs:PanelAttributes={};
btn_addbot_childs: Array<JSX.Element> = [];
allplayer_isValid:boolean = true;
allplayer_attrs:PanelAttributes={};
allplayer_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel id="Team_select" className="root" key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Panel className="only_y" key="compId_9" style={this.CSS_1_0} >
</Panel>
    {this.btn_startgame_isValid && 
<Button ref={this.btn_startgame} onactivate={this.onbtn_startgame} key="compId_4" style={this.CSS_1_1}  {...this.btn_startgame_attrs}>
        <Label text="开始游戏" key="compId_5" style={this.CSS_2_0} >
</Label>
    
{this.btn_startgame_childs}
</Button>
}
    {this.btn_addbot_isValid && 
<Button ref={this.btn_addbot} onactivate={this.onbtn_addbot} key="compId_6" style={this.CSS_1_2}  {...this.btn_addbot_attrs}>
        <Label text="添加机器人" key="compId_7" style={this.CSS_2_0_0} >
</Label>
    
{this.btn_addbot_childs}
</Button>
}
    {this.allplayer_isValid && 
<Button ref={this.allplayer} key="compId_11" style={this.CSS_1_3}  {...this.allplayer_attrs} >
{this.allplayer_childs}
</Button>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}