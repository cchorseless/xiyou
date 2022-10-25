
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes,DOTAHeroImageAttributes } from "@demon673/react-panorama";


export class NpcTalkDialog_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
lbl_tips: React.RefObject<LabelPanel>;
heroimaage: React.RefObject<HeroImage>;
NODENAME = {  __root__: '__root__',  lbl_tips: 'lbl_tips',  heroimaage: 'heroimaage',  };
FUNCNAME = {  };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_tips = createRef<LabelPanel>();
this.heroimaage = createRef<HeroImage>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"180px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"34px","x":"192px","width":"400px","fontSize":"25","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"14px","width":"150px","height":"150px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_tips_isValid:boolean = true;
lbl_tips_attrs:LabelAttributes={};
lbl_tips_childs: Array<JSX.Element> = [];
heroimaage_isValid:boolean = true;
heroimaage_attrs:DOTAHeroImageAttributes={};
heroimaage_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_tips_isValid && 
<Label ref={this.lbl_tips} key="compId_2" style={this.CSS_1_0}  {...this.lbl_tips_attrs} >
{this.lbl_tips_childs}
</Label>
}
    {this.heroimaage_isValid && 
<DOTAHeroImage ref={this.heroimaage} key="compId_3" style={this.CSS_1_1}  {...this.heroimaage_attrs} >
{this.heroimaage_childs}
</DOTAHeroImage>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}