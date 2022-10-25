
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "@demon673/react-panorama";


export class HeroTalentInfoItem_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
lbl_starstone: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_starstone: 'lbl_starstone',  };
FUNCNAME = {  };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_starstone = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"650px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"x":"24px","width":"202px","marginTop":"567px","height":"52px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/status_bg.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"1px","x":"19px","width":"50px","height":"50px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/icon_StarStone.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"11px","x":"91px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"551px","x":"358px","width":"193px","height":"77px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_orange.png\")","backgroundSize":"100% 100%"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"23px","x":"35px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"13px","width":"574px","height":"546px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_starstone_isValid:boolean = true;
lbl_starstone_attrs:LabelAttributes={};
lbl_starstone_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Image key="compId_2" style={this.CSS_1_0}>
        <Image key="compId_3" style={this.CSS_2_0} >
</Image>
        {this.lbl_starstone_isValid && 
<Label text="6666" ref={this.lbl_starstone} key="compId_4" style={this.CSS_2_1}  {...this.lbl_starstone_attrs} >
{this.lbl_starstone_childs}
</Label>
}
    
</Image>
    <Image key="compId_5" style={this.CSS_1_1}>
        {this.lbl_starstone_isValid && 
<Label text="重置天赋" ref={this.lbl_starstone} key="compId_6" style={this.CSS_2_0_0}  {...this.lbl_starstone_attrs} >
{this.lbl_starstone_childs}
</Label>
}
    
</Image>
    <Panel key="compId_7" style={this.CSS_1_2} >
</Panel>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}