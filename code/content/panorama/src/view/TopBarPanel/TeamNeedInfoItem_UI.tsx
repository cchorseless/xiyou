
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class TeamNeedInfoItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_1: React.RefObject<ImagePanel>;
onbtn_click = (...args: any[]) => { };
lbl_playercount: React.RefObject<LabelPanel>;
img_0: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_1: 'img_1',  lbl_playercount: 'lbl_playercount',  img_0: 'img_0',  };
FUNCNAME = {  onbtn_click: {nodeName:"img_1",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_1 = createRef<ImagePanel>();
this.lbl_playercount = createRef<LabelPanel>();
this.img_0 = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"240px","height":"240px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"240px","height":"240px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/custom_game/avatar/border/avatar_border_12.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"66px","x":"120px","width":"60px","height":"56px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/friend_large.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"31px","x":"59px","fontWeight":"bold","fontSize":"100","color":"#ffffff"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"133px","width":"80px","height":"80px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/task_ising.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_1_isValid:boolean = true;
img_1_attrs:ImageAttributes={};
img_1_childs: Array<JSX.Element> = [];
lbl_playercount_isValid:boolean = true;
lbl_playercount_attrs:LabelAttributes={};
lbl_playercount_childs: Array<JSX.Element> = [];
img_0_isValid:boolean = true;
img_0_attrs:ImageAttributes={};
img_0_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_1_isValid && 
<Image ref={this.img_1} onactivate={this.onbtn_click} key="compId_4" style={this.CSS_1_0}  {...this.img_1_attrs}>
        <Image key="compId_2" style={this.CSS_2_0} >
</Image>
        {this.lbl_playercount_isValid && 
<Label text="1" ref={this.lbl_playercount} key="compId_3" style={this.CSS_2_1}  {...this.lbl_playercount_attrs} >
{this.lbl_playercount_childs}
</Label>
}
        {this.img_0_isValid && 
<Image ref={this.img_0} key="compId_6" style={this.CSS_2_2}  {...this.img_0_attrs} >
{this.img_0_childs}
</Image>
}
    
{this.img_1_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}