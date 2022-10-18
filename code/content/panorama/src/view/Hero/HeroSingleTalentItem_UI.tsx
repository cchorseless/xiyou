
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "@demon673/react-panorama";
import {HeroTalentIconItem_UI} from './HeroTalentIconItem_UI' ;


export class HeroSingleTalentItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_name: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_name: 'lbl_name',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_name = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"100px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"4px","x":"0px","width":"600px","height":"92px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/hero/tab_bg.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"27px","x":"92px","width":"55px","height":"44px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/hero/arrow.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"33px","x":"15px","width":"73px","height":"41px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"10px","x":"145px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_name_isValid:boolean = true;
lbl_name_attrs:LabelAttributes={};
lbl_name_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Image key="compId_2" style={this.CSS_1_0} >
</Image>
    <Image key="compId_4" style={this.CSS_1_1} >
</Image>
    {this.lbl_name_isValid && 
<Label text="Lv.25" ref={this.lbl_name} key="compId_5" style={this.CSS_1_2}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
    <HeroTalentIconItem_UI key="compId_6" style={this.CSS_1_3} >
</HeroTalentIconItem_UI>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}