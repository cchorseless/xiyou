
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class CombinationSmallItem_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_bg: React.RefObject<ImagePanel>;
lbl_des: React.RefObject<LabelPanel>;
img_icon: React.RefObject<ImagePanel>;
box_dialog: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  img_bg: 'img_bg',  lbl_des: 'lbl_des',  img_icon: 'img_icon',  box_dialog: 'box_dialog',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_bg = createRef<ImagePanel>();
this.lbl_des = createRef<LabelPanel>();
this.img_icon = createRef<ImagePanel>();
this.box_dialog = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"290px","height":"110px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"8px","x":"85px","width":"200px","height":"93px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/combination/combination_bg.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"20px","x":"20px","horizontalAlign":"middle","fontWeight":"bold","fontSize":"46","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"2px","x":"0px","width":"104px","height":"106px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/combination/icon/animal.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"88px","x":"108px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_bg_isValid:boolean = true;
img_bg_attrs:ImageAttributes={};
img_bg_childs: Array<JSX.Element> = [];
lbl_des_isValid:boolean = true;
lbl_des_attrs:LabelAttributes={};
lbl_des_childs: Array<JSX.Element> = [];
img_icon_isValid:boolean = true;
img_icon_attrs:ImageAttributes={};
img_icon_childs: Array<JSX.Element> = [];
box_dialog_isValid:boolean = true;
box_dialog_attrs:PanelAttributes={};
box_dialog_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_bg_isValid && 
<Image ref={this.img_bg} key="compId_2" style={this.CSS_1_0}  {...this.img_bg_attrs}>
        {this.lbl_des_isValid && 
<Label text="越深越深" ref={this.lbl_des} key="compId_5" style={this.CSS_2_0}  {...this.lbl_des_attrs} >
{this.lbl_des_childs}
</Label>
}
    
{this.img_bg_childs}
</Image>
}
    {this.img_icon_isValid && 
<Image ref={this.img_icon} key="compId_3" style={this.CSS_1_1}  {...this.img_icon_attrs} >
{this.img_icon_childs}
</Image>
}
    {this.box_dialog_isValid && 
<Panel ref={this.box_dialog} key="compId_6" style={this.CSS_1_2}  {...this.box_dialog_attrs} >
{this.box_dialog_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}