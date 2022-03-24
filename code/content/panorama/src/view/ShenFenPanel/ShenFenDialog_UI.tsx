
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "react-panorama-eom";


export class ShenFenDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
img_bg: React.RefObject<ImagePanel>;
lbl_name: React.RefObject<LabelPanel>;
btn_close: React.RefObject<Button>;
onbtn_close = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  img_bg: 'img_bg',  lbl_name: 'lbl_name',  btn_close: 'btn_close',  };
FUNCNAME = {  onbtn_close: {nodeName:"btn_close",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.img_bg = createRef<ImagePanel>();
this.lbl_name = createRef<LabelPanel>();
this.btn_close = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"400px","height":"600px","backgroundColor":"#000000"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"400px","height":"600px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/card/card_shenfen_0.png\")","backgroundSize":"100% 100%"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"391px","x":"16px","fontSize":"40","color":"#ffffff"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"width":"369px","height":"126px","fontWeight":"bold","fontSize":"80","color":"#f30c08","marginBottom":"0px","verticalAlign":"bottom","x":"0px","horizontalAlign":"middle"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"527px","x":"331px","width":"64px","height":"64px","backgroundImage":"url(\"file://{images}/control_icons/arrow_left.png\")"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
img_bg_isValid:boolean = true;
img_bg_attrs:ImageAttributes={};
img_bg_childs: Array<JSX.Element> = [];
lbl_name_isValid:boolean = true;
lbl_name_attrs:LabelAttributes={};
lbl_name_childs: Array<JSX.Element> = [];
btn_close_isValid:boolean = true;
btn_close_attrs:PanelAttributes={};
btn_close_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.img_bg_isValid && 
<Image ref={this.img_bg} key="compId_3" style={this.CSS_1_0}  {...this.img_bg_attrs} >
{this.img_bg_childs}
</Image>
}
    <Label text="你的身份:" key="compId_4" style={this.CSS_1_1} >
</Label>
    {this.lbl_name_isValid && 
<Label text="梅林" ref={this.lbl_name} key="compId_5" style={this.CSS_1_2}  {...this.lbl_name_attrs} >
{this.lbl_name_childs}
</Label>
}
    {this.btn_close_isValid && 
<Button ref={this.btn_close} onactivate={this.onbtn_close} className="CommonButton" key="compId_6" style={this.CSS_1_3}  {...this.btn_close_attrs} >
{this.btn_close_childs}
</Button>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}