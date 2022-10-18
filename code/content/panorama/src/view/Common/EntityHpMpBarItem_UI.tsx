
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes } from "@demon673/react-panorama";


export class EntityHpMpBarItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_hpbg: React.RefObject<ImagePanel>;
img_hp: React.RefObject<ImagePanel>;
img_mpbg: React.RefObject<ImagePanel>;
img_mp: React.RefObject<ImagePanel>;
NODENAME = {  __root__: '__root__',  img_hpbg: 'img_hpbg',  img_hp: 'img_hp',  img_mpbg: 'img_mpbg',  img_mp: 'img_mp',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_hpbg = createRef<ImagePanel>();
this.img_hp = createRef<ImagePanel>();
this.img_mpbg = createRef<ImagePanel>();
this.img_mp = createRef<ImagePanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"212px","height":"50px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"212px","height":"26px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bar_bg.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"2px","width":"208px","height":"23px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bar_86.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"212px","height":"26px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bg_94.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"25px","x":"0px","width":"212px","height":"20px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bar_bg.png\")","backgroundSize":"100% 100%"}
CSS_2_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"1px","x":"1px","width":"210px","height":"19px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bar_81.png\")","backgroundSize":"100% 100%"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"25px","x":"0px","width":"212px","height":"20px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/overhead/bg_94.png\")","backgroundSize":"100% 100%"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_hpbg_isValid:boolean = true;
img_hpbg_attrs:ImageAttributes={};
img_hpbg_childs: Array<JSX.Element> = [];
img_hp_isValid:boolean = true;
img_hp_attrs:ImageAttributes={};
img_hp_childs: Array<JSX.Element> = [];
img_mpbg_isValid:boolean = true;
img_mpbg_attrs:ImageAttributes={};
img_mpbg_childs: Array<JSX.Element> = [];
img_mp_isValid:boolean = true;
img_mp_attrs:ImageAttributes={};
img_mp_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_hpbg_isValid && 
<Image ref={this.img_hpbg} key="compId_6" style={this.CSS_1_0}  {...this.img_hpbg_attrs}>
        {this.img_hp_isValid && 
<Image ref={this.img_hp} key="compId_8" style={this.CSS_2_0}  {...this.img_hp_attrs} >
{this.img_hp_childs}
</Image>
}
    
{this.img_hpbg_childs}
</Image>
}
    <Image key="compId_7" style={this.CSS_1_1} >
</Image>
    {this.img_mpbg_isValid && 
<Image ref={this.img_mpbg} key="compId_9" style={this.CSS_1_2}  {...this.img_mpbg_attrs}>
        {this.img_mp_isValid && 
<Image ref={this.img_mp} key="compId_11" style={this.CSS_2_0_0}  {...this.img_mp_attrs} >
{this.img_mp_childs}
</Image>
}
    
{this.img_mpbg_childs}
</Image>
}
    <Image key="compId_10" style={this.CSS_1_3} >
</Image>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}