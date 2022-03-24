
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,LabelAttributes } from "react-panorama-eom";


export class TeamResultDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
lbl_tips: React.RefObject<LabelPanel>;
lbl_agree: React.RefObject<LabelPanel>;
lbl_disagree: React.RefObject<LabelPanel>;
lbl_resulttips: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  lbl_tips: 'lbl_tips',  lbl_agree: 'lbl_agree',  lbl_disagree: 'lbl_disagree',  lbl_resulttips: 'lbl_resulttips',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.lbl_tips = createRef<LabelPanel>();
this.lbl_agree = createRef<LabelPanel>();
this.lbl_disagree = createRef<LabelPanel>();
this.lbl_resulttips = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"400px","backgroundColor":"#000000"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"22px","height":"73px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","x":"0px","horizontalAlign":"middle"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"147px","x":"45px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/agree.png\")","backgroundSize":"100% 100%"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"145px","x":"404px","width":"150px","height":"150px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/disagree.png\")","backgroundSize":"100% 100%"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"306px","height":"73px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","x":"-160px","horizontalAlign":"middle"}
CSS_1_4 : Partial<VCSSStyleDeclaration>  = {"y":"304px","height":"73px","fontWeight":"bold","fontSize":"60","color":"#f9f4f4","x":"178px","horizontalAlign":"middle"}
CSS_1_5 : Partial<VCSSStyleDeclaration>  = {"y":"98px","width":"326px","height":"39px","fontWeight":"bold","fontSize":"30","color":"#7def01","x":"0px","horizontalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
lbl_tips_isValid:boolean = true;
lbl_tips_attrs:LabelAttributes={};
lbl_tips_childs: Array<JSX.Element> = [];
lbl_agree_isValid:boolean = true;
lbl_agree_attrs:LabelAttributes={};
lbl_agree_childs: Array<JSX.Element> = [];
lbl_disagree_isValid:boolean = true;
lbl_disagree_attrs:LabelAttributes={};
lbl_disagree_childs: Array<JSX.Element> = [];
lbl_resulttips_isValid:boolean = true;
lbl_resulttips_attrs:LabelAttributes={};
lbl_resulttips_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.lbl_tips_isValid && 
<Label text="组队成功" ref={this.lbl_tips} key="compId_2" style={this.CSS_1_0}  {...this.lbl_tips_attrs} >
{this.lbl_tips_childs}
</Label>
}
    <Button key="compId_4" style={this.CSS_1_1} >
</Button>
    <Button key="compId_5" style={this.CSS_1_2} >
</Button>
    {this.lbl_agree_isValid && 
<Label text="0" ref={this.lbl_agree} key="compId_7" style={this.CSS_1_3}  {...this.lbl_agree_attrs} >
{this.lbl_agree_childs}
</Label>
}
    {this.lbl_disagree_isValid && 
<Label text="10" ref={this.lbl_disagree} key="compId_8" style={this.CSS_1_4}  {...this.lbl_disagree_attrs} >
{this.lbl_disagree_childs}
</Label>
}
    {this.lbl_resulttips_isValid && 
<Label text="(请队伍成员开始做任务)" ref={this.lbl_resulttips} key="compId_9" style={this.CSS_1_5}  {...this.lbl_resulttips_attrs} >
{this.lbl_resulttips_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}