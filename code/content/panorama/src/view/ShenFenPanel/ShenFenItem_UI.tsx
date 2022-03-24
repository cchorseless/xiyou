
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,DOTAAvatarImageAttributes,LabelAttributes,ImageAttributes } from "react-panorama-eom";


export class ShenFenItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
playerIcon: React.RefObject<AvatarImage>;
lbl_playerName: React.RefObject<LabelPanel>;
img_campicon: React.RefObject<ImagePanel>;
img_cantchat: React.RefObject<ImagePanel>;
lbl_index: React.RefObject<LabelPanel>;
img_isTeamleader: React.RefObject<ImagePanel>;
img_role2: React.RefObject<ImagePanel>;
img_role1: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  playerIcon: 'playerIcon',  lbl_playerName: 'lbl_playerName',  img_campicon: 'img_campicon',  img_cantchat: 'img_cantchat',  lbl_index: 'lbl_index',  img_isTeamleader: 'img_isTeamleader',  img_role2: 'img_role2',  img_role1: 'img_role1',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.playerIcon = createRef<AvatarImage>();
this.lbl_playerName = createRef<LabelPanel>();
this.img_campicon = createRef<ImagePanel>();
this.img_cantchat = createRef<ImagePanel>();
this.lbl_index = createRef<LabelPanel>();
this.img_isTeamleader = createRef<ImagePanel>();
this.img_role2 = createRef<ImagePanel>();
this.img_role1 = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"500px","height":"190px","backgroundColor":"#383636"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","width":"438px","marginRight":"0px","height":"190px","horizontalAlign":"right"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"2px","width":"120px","height":"120px"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"10px","x":"125px","fontWeight":"bold","fontSize":"40","color":"#f60804"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"366px","width":"70px","height":"67px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/camp/camp_1.png\")","backgroundSize":"100% 100%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"y":"71px","x":"299px","width":"136px","height":"36px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"y":"114px","x":"353px","width":"80px","height":"73px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/party_open_mic_active.png\")","backgroundSize":"100% 100%"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"width":"40px","height":"40px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/purgatory.png\")","backgroundColor":"#f30501","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}
CSS_2_5 : Partial<VCSSStyleDeclaration>  = {"y":"125px","x":"0px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/dota2/hud/reborn/buff_outline_psd.png\")","backgroundSize":"100% 100%"}
CSS_3_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"12px","x":"10px","width":"47px","height":"48px","fontWeight":"bold","fontSize":"35","color":"#f9f4f4"}
CSS_2_6 : Partial<VCSSStyleDeclaration>  = {"y":"57px","x":"137px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/custom_game/battlepass/bp_icon.png\")","backgroundSize":"100% 100%"}
CSS_2_7 : Partial<VCSSStyleDeclaration>  = {"y":"126px","x":"64px","width":"288px","height":"35px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/dota2/hud/reborn/shop_launcher_button_psd.png\")","backgroundSize":"100% 100%"}
CSS_3_0_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"288px","height":"35px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/dota2/hud/reborn/shop_launcher_button_inrange_psd.png\")","backgroundSize":"100% 100%"}
CSS_2_8 : Partial<VCSSStyleDeclaration>  = {"y":"162px","x":"65px","width":"288px","height":"28px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/dota2/hud/reborn/shop_launcher_button_psd.png\")","backgroundSize":"100% 100%"}
CSS_2_9 : Partial<VCSSStyleDeclaration>  = {"y":"63px","x":"250px","width":"40px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/custom_game/battlepass/battlepass_premium_icon.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"128px","x":"0px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/isteamleader.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"65px","x":"0px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card_icon/cardicon_2.png\")","backgroundSize":"100% 100%"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"0px","width":"60px","height":"60px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card_icon/cardicon_2.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
playerIcon_isValid:boolean = true;
playerIcon_attrs:DOTAAvatarImageAttributes={};
playerIcon_childs: Array<JSX.Element> = [];
lbl_playerName_isValid:boolean = true;
lbl_playerName_attrs:LabelAttributes={};
lbl_playerName_childs: Array<JSX.Element> = [];
img_campicon_isValid:boolean = true;
img_campicon_attrs:ImageAttributes={};
img_campicon_childs: Array<JSX.Element> = [];
img_cantchat_isValid:boolean = true;
img_cantchat_attrs:ImageAttributes={};
img_cantchat_childs: Array<JSX.Element> = [];
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
    <Panel key="compId_19" style={this.CSS_1_0}>
        {this.playerIcon_isValid && 
<DOTAAvatarImage ref={this.playerIcon} key="compId_18" style={this.CSS_2_0}  {...this.playerIcon_attrs} >
{this.playerIcon_childs}
</DOTAAvatarImage>
}
        {this.lbl_playerName_isValid && 
<Label text="玩家名字六个字" ref={this.lbl_playerName} key="compId_5" style={this.CSS_2_1}  {...this.lbl_playerName_attrs} >
{this.lbl_playerName_childs}
</Label>
}
        {this.img_campicon_isValid && 
<Image ref={this.img_campicon} key="compId_4" style={this.CSS_2_2}  {...this.img_campicon_attrs} >
{this.img_campicon_childs}
</Image>
}
        <Label text="天梯段位" key="compId_6" style={this.CSS_2_3} >
</Label>
        <Image key="compId_8" style={this.CSS_2_4}>
            {this.img_cantchat_isValid && 
<Image ref={this.img_cantchat} key="compId_24" style={this.CSS_3_0}  {...this.img_cantchat_attrs} >
{this.img_cantchat_childs}
</Image>
}
        
</Image>
        <Image key="compId_10" style={this.CSS_2_5}>
            {this.lbl_index_isValid && 
<Label text="09" ref={this.lbl_index} key="compId_9" style={this.CSS_3_0_0}  {...this.lbl_index_attrs} >
{this.lbl_index_childs}
</Label>
}
        
</Image>
        <Image key="compId_11" style={this.CSS_2_6} >
</Image>
        <Image key="compId_12" style={this.CSS_2_7}>
            <Image key="compId_13" style={this.CSS_3_0_1} >
</Image>
        
</Image>
        <Image key="compId_15" style={this.CSS_2_8} >
</Image>
        <Image key="compId_17" style={this.CSS_2_9} >
</Image>
    
</Panel>
    {this.img_isTeamleader_isValid && 
<Image ref={this.img_isTeamleader} key="compId_20" style={this.CSS_1_1}  {...this.img_isTeamleader_attrs} >
{this.img_isTeamleader_childs}
</Image>
}
    {this.img_role2_isValid && 
<Image ref={this.img_role2} key="compId_21" style={this.CSS_1_2}  {...this.img_role2_attrs} >
{this.img_role2_childs}
</Image>
}
    {this.img_role1_isValid && 
<Image ref={this.img_role1} key="compId_22" style={this.CSS_1_3}  {...this.img_role1_attrs} >
{this.img_role1_childs}
</Image>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}