
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";


export class End_Screen_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  };
FUNCNAME = {  };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"400px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_undefined" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs} >
{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}