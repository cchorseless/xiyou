
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes,DOTAScenePanelAttributes } from "@demon673/react-panorama";


export class DrawCardHeroSceneItem_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
heroscene: React.RefObject<ScenePanel>;
NODENAME = {  __root__: '__root__',  heroscene: 'heroscene',  };
FUNCNAME = {  };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();
this.heroscene = createRef<ScenePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"330px","height":"440px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"width":"330px","height":"440px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
heroscene_isValid:boolean = true;
heroscene_attrs:DOTAScenePanelAttributes={};
heroscene_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.heroscene_isValid && 
<DOTAScenePanel ref={this.heroscene} key="compId_2" style={this.CSS_1_0}  {...this.heroscene_attrs} >
{this.heroscene_childs}
</DOTAScenePanel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}