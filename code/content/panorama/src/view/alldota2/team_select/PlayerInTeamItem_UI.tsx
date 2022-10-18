
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../../libs/BasePureComponent";
import { PanelAttributes,DOTAAvatarImageAttributes,LabelAttributes } from "@demon673/react-panorama";


export class PlayerInTeamItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
playerIcon: React.RefObject<AvatarImage>;
lbl_playerName: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  playerIcon: 'playerIcon',  lbl_playerName: 'lbl_playerName',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.playerIcon = createRef<AvatarImage>();
this.lbl_playerName = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"400px","height":"150px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"10px","x":"12px","width":"120px","height":"120px"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"48px","x":"150px","fontWeight":"bold","fontSize":"40","color":"#f60804"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
playerIcon_isValid:boolean = true;
playerIcon_attrs:DOTAAvatarImageAttributes={};
playerIcon_childs: Array<JSX.Element> = [];
lbl_playerName_isValid:boolean = true;
lbl_playerName_attrs:LabelAttributes={};
lbl_playerName_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.playerIcon_isValid && 
<DOTAAvatarImage ref={this.playerIcon} key="compId_3" style={this.CSS_1_0}  {...this.playerIcon_attrs} >
{this.playerIcon_childs}
</DOTAAvatarImage>
}
    {this.lbl_playerName_isValid && 
<Label text="玩家名字六个" ref={this.lbl_playerName} key="compId_4" style={this.CSS_1_1}  {...this.lbl_playerName_attrs} >
{this.lbl_playerName_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}