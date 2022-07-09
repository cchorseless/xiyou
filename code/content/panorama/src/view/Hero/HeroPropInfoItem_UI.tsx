
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class HeroPropInfoItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_name: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_name: 'lbl_name',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_name = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"800px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"29px","x":"23px","width":"553px","height":"95px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"138px","x":"20px","width":"48px","height":"48px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/hero/icon_30.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"144px","x":"95px","width":"73px","height":"47px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"322px","x":"21px","width":"564px","height":"48px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/hero/title.png\")","backgroundSize":"100% 100%"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"302px","x":"235px","width":"137px","height":"47px","fontWeight":"bold","fontSize":"30","color":"#ffffff"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"396px","x":"24px","width":"551px","height":"382px"}
CSS_1_6 : Partial<VCSSStyleDeclaration>  = {"y":"200px","x":"66px","width":"500px","height":"110px"}

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
    {this.lbl_name_isValid && 
<Label text="英雄描述xxxxxxxxxxxxxxxxx" ref={this.lbl_name} key="compId_2" style={this.CSS_1_0}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
    <Image key="compId_3" style={this.CSS_1_1} >
</Image>
    {this.lbl_name_isValid && 
<Label text="羁绊" ref={this.lbl_name} key="compId_4" style={this.CSS_1_2}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
    <Image key="compId_5" style={this.CSS_1_3} >
</Image>
    {this.lbl_name_isValid && 
<Label text="初始属性" ref={this.lbl_name} key="compId_6" style={this.CSS_1_4}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
    <Panel key="compId_7" style={this.CSS_1_5} >
</Panel>
    <Panel key="compId_10" style={this.CSS_1_6} >
</Panel>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}