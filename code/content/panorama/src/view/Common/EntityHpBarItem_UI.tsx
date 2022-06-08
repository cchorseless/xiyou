
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "react-panorama-eom";


export class EntityHpBarItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_hpbg: React.RefObject<ImagePanel>;
img_hp: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_hpbg: 'img_hpbg',  img_hp: 'img_hp',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_hpbg = createRef<ImagePanel>();
this.img_hp = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"212px","height":"26px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"212px","height":"26px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bar_bg.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"2px","width":"208px","height":"23px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bar_69.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"212px","height":"26px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bg_94.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_hpbg_isValid:boolean = true;
img_hpbg_attrs:ImageAttributes={};
img_hpbg_childs: Array<JSX.Element> = [];
img_hp_isValid:boolean = true;
img_hp_attrs:ImageAttributes={};
img_hp_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_hpbg_isValid && 
<Image ref={this.img_hpbg} key="compId_3" style={this.CSS_1_0}  {...this.img_hpbg_attrs}>
        {this.img_hp_isValid && 
<Image ref={this.img_hp} key="compId_4" style={this.CSS_2_0}  {...this.img_hp_attrs} >
{this.img_hp_childs}
</Image>
}
    
{this.img_hpbg_childs}
</Image>
}
    <Image key="compId_6" style={this.CSS_1_1} >
</Image>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}