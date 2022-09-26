
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class CombinationDesItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_des: React.RefObject<LabelPanel>;
lbl_des0: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_des: 'lbl_des',  lbl_des0: 'lbl_des0',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_des = createRef<LabelPanel>();
this.lbl_des0 = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"380px","height":"80px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"52px","width":"322px","horizontalAlign":"middle","height":"66px","fontWeight":"bold","fontSize":"25","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"6px","x":"4px","horizontalAlign":"middle","height":"38px","fontWeight":"bold","fontSize":"25","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_des_isValid:boolean = true;
lbl_des_attrs:LabelAttributes={};
lbl_des_childs: Array<JSX.Element> = [];
lbl_des0_isValid:boolean = true;
lbl_des0_attrs:LabelAttributes={};
lbl_des0_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_des_isValid && 
<Label text="越深越深" ref={this.lbl_des} key="compId_3" style={this.CSS_1_0}  {...this.lbl_des_attrs} >
{this.lbl_des_childs}
</Label>
}
    {this.lbl_des0_isValid && 
<Label text="(12)" ref={this.lbl_des0} key="compId_7" style={this.CSS_1_1}  {...this.lbl_des0_attrs} >
{this.lbl_des0_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}