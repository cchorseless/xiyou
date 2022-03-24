
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes,DOTAHeroImageAttributes } from "react-panorama-eom";


export class Task_TalkInfoDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_tips: React.RefObject<LabelPanel>;
heroimaage: React.RefObject<HeroImage>;
heroimaageself: React.RefObject<HeroImage>;
lbl_tipsself: React.RefObject<LabelPanel>;
btn_next: React.RefObject<Button>;
onbtn_nexttalk = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  lbl_tips: 'lbl_tips',  heroimaage: 'heroimaage',  heroimaageself: 'heroimaageself',  lbl_tipsself: 'lbl_tipsself',  btn_next: 'btn_next',  };
FUNCNAME = {  onbtn_nexttalk: {nodeName:"btn_next",type:"onactivate"}, };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_tips = createRef<LabelPanel>();
this.heroimaage = createRef<HeroImage>();
this.heroimaageself = createRef<HeroImage>();
this.lbl_tipsself = createRef<LabelPanel>();
this.btn_next = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"900px","height":"180px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"24px","x":"182px","width":"400px","fontSize":"25","color":"#ffffff"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"13px","x":"6px","width":"150px","height":"150px"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"13px","x":"740px","width":"150px","height":"150px"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"24px","x":"316px","width":"400px","fontSize":"25","color":"#ffffff"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"126px","width":"86px","height":"54px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/control_icons/arrow_dropdown.png\")","backgroundSize":"100% 100%","x":"0px","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_tips_isValid:boolean = true;
lbl_tips_attrs:LabelAttributes={};
lbl_tips_childs: Array<JSX.Element> = [];
heroimaage_isValid:boolean = true;
heroimaage_attrs:DOTAHeroImageAttributes={};
heroimaage_childs: Array<JSX.Element> = [];
heroimaageself_isValid:boolean = true;
heroimaageself_attrs:DOTAHeroImageAttributes={};
heroimaageself_childs: Array<JSX.Element> = [];
lbl_tipsself_isValid:boolean = true;
lbl_tipsself_attrs:LabelAttributes={};
lbl_tipsself_childs: Array<JSX.Element> = [];
btn_next_isValid:boolean = true;
btn_next_attrs:PanelAttributes={};
btn_next_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_tips_isValid && 
<Label ref={this.lbl_tips} key="compId_2" style={this.CSS_1_0}  {...this.lbl_tips_attrs} >
{this.lbl_tips_childs}
</Label>
}
    {this.heroimaage_isValid && 
<DOTAHeroImage ref={this.heroimaage} key="compId_3" style={this.CSS_1_1}  {...this.heroimaage_attrs} >
{this.heroimaage_childs}
</DOTAHeroImage>
}
    {this.heroimaageself_isValid && 
<DOTAHeroImage ref={this.heroimaageself} key="compId_4" style={this.CSS_1_2}  {...this.heroimaageself_attrs} >
{this.heroimaageself_childs}
</DOTAHeroImage>
}
    {this.lbl_tipsself_isValid && 
<Label ref={this.lbl_tipsself} key="compId_5" style={this.CSS_1_3}  {...this.lbl_tipsself_attrs} >
{this.lbl_tipsself_childs}
</Label>
}
    {this.btn_next_isValid && 
<Button ref={this.btn_next} onactivate={this.onbtn_nexttalk} key="compId_8" style={this.CSS_1_4}  {...this.btn_next_attrs} >
{this.btn_next_childs}
</Button>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}