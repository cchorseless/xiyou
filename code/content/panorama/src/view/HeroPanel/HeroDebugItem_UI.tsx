
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class HeroDebugItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_position: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_position: 'lbl_position',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_position = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"250px","height":"80px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"13px","x":"9px","fontSize":"18","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_position_isValid:boolean = true;
lbl_position_attrs:LabelAttributes={};
lbl_position_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_position_isValid && 
<Label text="位置：1000,1000,1000" ref={this.lbl_position} key="compId_2" style={this.CSS_1_0}  {...this.lbl_position_attrs} >
{this.lbl_position_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}