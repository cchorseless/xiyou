
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";


export class Minimap_iconitem_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
img_0: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  img_0: 'img_0',  };
FUNCNAME = {  };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_0 = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"64px","height":"64px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"64px","height":"64px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/textures/minimap_hero_self.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_0_isValid:boolean = true;
img_0_attrs:PanelAttributes={};
img_0_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_0_isValid && 
<Panel ref={this.img_0} key="compId_2" style={this.CSS_1_0}  {...this.img_0_attrs} >
{this.img_0_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}