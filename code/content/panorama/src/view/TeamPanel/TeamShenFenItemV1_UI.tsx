
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,DOTAAvatarImageAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class TeamShenFenItemV1_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
panel_1: React.RefObject<Panel>;
playerIcon: React.RefObject<AvatarImage>;
img_campicon: React.RefObject<ImagePanel>;
lbl_index: React.RefObject<LabelPanel>;
img_isTeamleader: React.RefObject<ImagePanel>;
img_role2: React.RefObject<ImagePanel>;
img_role1: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  panel_1: 'panel_1',  playerIcon: 'playerIcon',  img_campicon: 'img_campicon',  lbl_index: 'lbl_index',  img_isTeamleader: 'img_isTeamleader',  img_role2: 'img_role2',  img_role1: 'img_role1',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.panel_1 = createRef<Panel>();
this.playerIcon = createRef<AvatarImage>();
this.img_campicon = createRef<ImagePanel>();
this.lbl_index = createRef<LabelPanel>();
this.img_isTeamleader = createRef<ImagePanel>();
this.img_role2 = createRef<ImagePanel>();
this.img_role1 = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"200px","height":"190px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","width":"140px","marginRight":"0px","height":"190px","backgroundColor":"#000000","horizontalAlign":"right"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"10px","width":"120px","height":"120px"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"123px","x":"65px","width":"70px","height":"67px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/camp/camp_1.png\")","backgroundSize":"100% 100%"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"122px","x":"1px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/dota2/hud/reborn/buff_outline_psd.png\")","backgroundSize":"100% 100%"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"y":"12px","x":"10px","width":"47px","height":"48px","fontWeight":"bold","fontSize":"35","color":"#f9f4f4"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"127px","x":"0px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/isteamleader.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"64px","x":"0px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card_icon/cardicon_2.png\")","backgroundSize":"100% 100%"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"1px","x":"0px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card_icon/cardicon_2.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
panel_1_isValid:boolean = true;
panel_1_attrs:PanelAttributes={};
panel_1_childs: Array<JSX.Element> = [];
playerIcon_isValid:boolean = true;
playerIcon_attrs:DOTAAvatarImageAttributes={};
playerIcon_childs: Array<JSX.Element> = [];
img_campicon_isValid:boolean = true;
img_campicon_attrs:ImageAttributes={};
img_campicon_childs: Array<JSX.Element> = [];
lbl_index_isValid:boolean = true;
lbl_index_attrs:LabelAttributes={};
lbl_index_childs: Array<JSX.Element> = [];
img_isTeamleader_isValid:boolean = true;
img_isTeamleader_attrs:ImageAttributes={};
img_isTeamleader_childs: Array<JSX.Element> = [];
img_role2_isValid:boolean = true;
img_role2_attrs:ImageAttributes={};
img_role2_childs: Array<JSX.Element> = [];
img_role1_isValid:boolean = true;
img_role1_attrs:ImageAttributes={};
img_role1_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.panel_1_isValid && 
<Panel ref={this.panel_1} key="compId_2" style={this.CSS_1_0}  {...this.panel_1_attrs}>
        {this.playerIcon_isValid && 
<DOTAAvatarImage ref={this.playerIcon} key="compId_6" style={this.CSS_2_0}  {...this.playerIcon_attrs} >
{this.playerIcon_childs}
</DOTAAvatarImage>
}
        {this.img_campicon_isValid && 
<Image ref={this.img_campicon} key="compId_8" style={this.CSS_2_1}  {...this.img_campicon_attrs} >
{this.img_campicon_childs}
</Image>
}
        <Image key="compId_11" style={this.CSS_2_2}>
            {this.lbl_index_isValid && 
<Label text="09" ref={this.lbl_index} key="compId_12" style={this.CSS_3_0}  {...this.lbl_index_attrs} >
{this.lbl_index_childs}
</Label>
}
        
</Image>
    
{this.panel_1_childs}
</Panel>
}
    {this.img_isTeamleader_isValid && 
<Image ref={this.img_isTeamleader} key="compId_18" style={this.CSS_1_1}  {...this.img_isTeamleader_attrs} >
{this.img_isTeamleader_childs}
</Image>
}
    {this.img_role2_isValid && 
<Image ref={this.img_role2} key="compId_19" style={this.CSS_1_2}  {...this.img_role2_attrs} >
{this.img_role2_childs}
</Image>
}
    {this.img_role1_isValid && 
<Image ref={this.img_role1} key="compId_20" style={this.CSS_1_3}  {...this.img_role1_attrs} >
{this.img_role1_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}