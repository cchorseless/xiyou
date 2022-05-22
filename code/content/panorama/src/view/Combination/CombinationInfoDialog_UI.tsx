
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class CombinationInfoDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_bg: React.RefObject<ImagePanel>;
onbtn_click = (...args: any[]) => { };
title_img_bg: React.RefObject<ImagePanel>;
lbl_des: React.RefObject<LabelPanel>;
title_img_icon: React.RefObject<ImagePanel>;
box: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  img_bg: 'img_bg',  title_img_bg: 'title_img_bg',  lbl_des: 'lbl_des',  title_img_icon: 'title_img_icon',  box: 'box',  };
FUNCNAME = {  onbtn_click: {nodeName:"img_bg",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_bg = createRef<ImagePanel>();
this.title_img_bg = createRef<ImagePanel>();
this.lbl_des = createRef<LabelPanel>();
this.title_img_icon = createRef<ImagePanel>();
this.box = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"400px","height":"400px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"-2px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/gallery_background.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"105px","width":"315px","uiScaleY":"60%","uiScaleX":"60%","height":"129px"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"18px","x":"95px","width":"200px","height":"93px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/combination/combination_bg.png\")","backgroundSize":"100% 100%"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"y":"20px","x":"20px","horizontalAlign":"middle","fontWeight":"bold","fontSize":"46","color":"#ffffff"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"y":"12px","x":"10px","width":"104px","height":"106px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/combination/icon/animal.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"86px","x":"0px","width":"400px","height":"314px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_bg_isValid:boolean = true;
img_bg_attrs:ImageAttributes={};
img_bg_childs: Array<JSX.Element> = [];
title_img_bg_isValid:boolean = true;
title_img_bg_attrs:ImageAttributes={};
title_img_bg_childs: Array<JSX.Element> = [];
lbl_des_isValid:boolean = true;
lbl_des_attrs:LabelAttributes={};
lbl_des_childs: Array<JSX.Element> = [];
title_img_icon_isValid:boolean = true;
title_img_icon_attrs:ImageAttributes={};
title_img_icon_childs: Array<JSX.Element> = [];
box_isValid:boolean = true;
box_attrs:PanelAttributes={};
box_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_bg_isValid && 
<Image ref={this.img_bg} onactivate={this.onbtn_click} className="root" key="compId_2" style={this.CSS_1_0}  {...this.img_bg_attrs} >
{this.img_bg_childs}
</Image>
}
    <Panel key="compId_12" style={this.CSS_1_1}>
        {this.title_img_bg_isValid && 
<Image ref={this.title_img_bg} key="compId_9" style={this.CSS_2_0}  {...this.title_img_bg_attrs}>
            {this.lbl_des_isValid && 
<Label text="越深越深" ref={this.lbl_des} key="compId_11" style={this.CSS_3_0}  {...this.lbl_des_attrs} >
{this.lbl_des_childs}
</Label>
}
        
{this.title_img_bg_childs}
</Image>
}
        {this.title_img_icon_isValid && 
<Image ref={this.title_img_icon} key="compId_10" style={this.CSS_2_1}  {...this.title_img_icon_attrs} >
{this.title_img_icon_childs}
</Image>
}
    
</Panel>
    {this.box_isValid && 
<Panel ref={this.box} key="compId_8" style={this.CSS_1_2}  {...this.box_attrs} >
{this.box_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}