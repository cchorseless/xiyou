
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes,ImageAttributes,LabelAttributes } from "@demon673/react-panorama";


export class ShopPanel_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
btn_gohome: React.RefObject<ImagePanel>;
onbtn_gohome = (...args: any[]) => { };
btn_goback: React.RefObject<ImagePanel>;
onbtn_goback = (...args: any[]) => { };
lbl_starstone: React.RefObject<LabelPanel>;
lbl_metastone: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  btn_gohome: 'btn_gohome',  btn_goback: 'btn_goback',  lbl_starstone: 'lbl_starstone',  lbl_metastone: 'lbl_metastone',  };
FUNCNAME = {  onbtn_gohome: {nodeName:"btn_gohome",type:"onmouseactivate"}, onbtn_goback: {nodeName:"btn_goback",type:"onmouseactivate"}, };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_gohome = createRef<ImagePanel>();
this.btn_goback = createRef<ImagePanel>();
this.lbl_starstone = createRef<LabelPanel>();
this.lbl_metastone = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1600px","height":"900px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/Background.png\")","backgroundSize":"100% 100%"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"1600px","height":"100px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/title_bg.png\")","backgroundSize":"100% 100%"}
CSS_2_1 : Partial<VCSSStyleDeclaration>  = {"width":"85px","marginTop":"10px","marginRight":"10px","height":"82px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/icon_home.png\")","backgroundSize":"100% 100%","horizontalAlign":"right"}
CSS_2_2 : Partial<VCSSStyleDeclaration>  = {"width":"104px","marginTop":"5px","marginLeft":"10px","height":"93px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/btn_top_back.png\")","backgroundSize":"100% 100%"}
CSS_2_3 : Partial<VCSSStyleDeclaration>  = {"x":"1090px","width":"351px","marginTop":"10px","height":"80px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/status_bg.png\")","backgroundSize":"100% 100%"}
CSS_3_0 : Partial<VCSSStyleDeclaration>  = {"y":"-1px","x":"10px","width":"76px","height":"83px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/icon_StarStone.png\")","backgroundSize":"100% 100%"}
CSS_3_1 : Partial<VCSSStyleDeclaration>  = {"y":"16px","x":"97px","fontWeight":"bold","fontSize":"50","color":"#ffffff"}
CSS_2_4 : Partial<VCSSStyleDeclaration>  = {"x":"491px","width":"300px","marginTop":"10px","height":"80px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/status_bg.png\")","backgroundSize":"100% 100%"}
CSS_3_0_0 : Partial<VCSSStyleDeclaration>  = {"y":"3px","x":"10px","width":"77px","height":"73px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/shop/icon_MetaStone.png\")","backgroundSize":"100% 100%"}
CSS_3_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"16px","x":"97px","fontWeight":"bold","fontSize":"50","color":"#ffffff"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_gohome_isValid:boolean = true;
btn_gohome_attrs:ImageAttributes={};
btn_gohome_childs: Array<JSX.Element> = [];
btn_goback_isValid:boolean = true;
btn_goback_attrs:ImageAttributes={};
btn_goback_childs: Array<JSX.Element> = [];
lbl_starstone_isValid:boolean = true;
lbl_starstone_attrs:LabelAttributes={};
lbl_starstone_childs: Array<JSX.Element> = [];
lbl_metastone_isValid:boolean = true;
lbl_metastone_attrs:LabelAttributes={};
lbl_metastone_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    <Image className="root" key="compId_2" style={this.CSS_1_0}>
        <Image key="compId_3" style={this.CSS_2_0} >
</Image>
        {this.btn_gohome_isValid && 
<Image ref={this.btn_gohome} onmouseactivate={this.onbtn_gohome} key="compId_4" style={this.CSS_2_1}  {...this.btn_gohome_attrs} >
{this.btn_gohome_childs}
</Image>
}
        {this.btn_goback_isValid && 
<Image ref={this.btn_goback} onmouseactivate={this.onbtn_goback} key="compId_5" style={this.CSS_2_2}  {...this.btn_goback_attrs} >
{this.btn_goback_childs}
</Image>
}
        <Image key="compId_6" style={this.CSS_2_3}>
            <Image key="compId_9" style={this.CSS_3_0} >
</Image>
            {this.lbl_starstone_isValid && 
<Label text="6666" ref={this.lbl_starstone} key="compId_11" style={this.CSS_3_1}  {...this.lbl_starstone_attrs} >
{this.lbl_starstone_childs}
</Label>
}
        
</Image>
        <Image key="compId_7" style={this.CSS_2_4}>
            <Image key="compId_8" style={this.CSS_3_0_0} >
</Image>
            {this.lbl_metastone_isValid && 
<Label text="6666" ref={this.lbl_metastone} key="compId_10" style={this.CSS_3_1_0}  {...this.lbl_metastone_attrs} >
{this.lbl_metastone_childs}
</Label>
}
        
</Image>
    
</Image>

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}