
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,DOTAAbilityImageAttributes,LabelAttributes } from "@demon673/react-panorama";


export class SkillCastItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_bg: React.RefObject<ImagePanel>;
img_skillicon: React.RefObject<AbilityImage>;
onbtn_castability = (...args: any[]) => { };
panel_cd: React.RefObject<Panel>;
lbl_lefttime: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  img_bg: 'img_bg',  img_skillicon: 'img_skillicon',  panel_cd: 'panel_cd',  lbl_lefttime: 'lbl_lefttime',  };
FUNCNAME = {  onbtn_castability: {nodeName:"img_skillicon",type:"onmouseactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_bg = createRef<ImagePanel>();
this.img_skillicon = createRef<AbilityImage>();
this.panel_cd = createRef<Panel>();
this.lbl_lefttime = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"140px","height":"140px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"140px","height":"140px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/skill/frame_SS.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"10px","x":"14px","width":"112px","height":"112px"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"112px","height":"112px"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"31px","x":"0px","fontWeight":"bold","fontSize":"50","color":"#ffffff","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_bg_isValid:boolean = true;
img_bg_attrs:ImageAttributes={};
img_bg_childs: Array<JSX.Element> = [];
img_skillicon_isValid:boolean = true;
img_skillicon_attrs:DOTAAbilityImageAttributes={};
img_skillicon_childs: Array<JSX.Element> = [];
panel_cd_isValid:boolean = true;
panel_cd_attrs:PanelAttributes={};
panel_cd_childs: Array<JSX.Element> = [];
lbl_lefttime_isValid:boolean = true;
lbl_lefttime_attrs:LabelAttributes={};
lbl_lefttime_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_bg_isValid && 
<Image ref={this.img_bg} key="compId_4" style={this.CSS_1_0}  {...this.img_bg_attrs} >
{this.img_bg_childs}
</Image>
}
    {this.img_skillicon_isValid && 
<DOTAAbilityImage ref={this.img_skillicon} onmouseactivate={this.onbtn_castability} key="compId_5" style={this.CSS_1_1}  {...this.img_skillicon_attrs}>
        {this.panel_cd_isValid && 
<Panel ref={this.panel_cd} key="compId_6" style={this.CSS_2_0}  {...this.panel_cd_attrs} >
{this.panel_cd_childs}
</Panel>
}
        {this.lbl_lefttime_isValid && 
<Label text="600" ref={this.lbl_lefttime} key="compId_8" style={this.CSS_2_1}  {...this.lbl_lefttime_attrs} >
{this.lbl_lefttime_childs}
</Label>
}
    
{this.img_skillicon_childs}
</DOTAAbilityImage>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}