
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes,DOTAHeroImageAttributes,LabelAttributes } from "react-panorama-eom";


export class Task_TalkListDialog_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
heroimaage: React.RefObject<HeroImage>;
lbl_task1: React.RefObject<LabelPanel>;
lbl_task2: React.RefObject<LabelPanel>;
lbl_task3: React.RefObject<LabelPanel>;
NODENAME = {  __root__: '__root__',  heroimaage: 'heroimaage',  lbl_task1: 'lbl_task1',  lbl_task2: 'lbl_task2',  lbl_task3: 'lbl_task3',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.heroimaage = createRef<HeroImage>();
this.lbl_task1 = createRef<LabelPanel>();
this.lbl_task2 = createRef<LabelPanel>();
this.lbl_task3 = createRef<LabelPanel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"600px","height":"180px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"15px","x":"8px","width":"150px","height":"150px"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"24px","x":"182px","width":"400px","height":"41px"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"71px","x":"182px","width":"400px","height":"41px"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"118px","x":"182px","width":"400px","height":"41px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
heroimaage_isValid:boolean = true;
heroimaage_attrs:DOTAHeroImageAttributes={};
heroimaage_childs: Array<JSX.Element> = [];
lbl_task1_isValid:boolean = true;
lbl_task1_attrs:LabelAttributes={};
lbl_task1_childs: Array<JSX.Element> = [];
lbl_task2_isValid:boolean = true;
lbl_task2_attrs:LabelAttributes={};
lbl_task2_childs: Array<JSX.Element> = [];
lbl_task3_isValid:boolean = true;
lbl_task3_attrs:LabelAttributes={};
lbl_task3_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.heroimaage_isValid && 
<DOTAHeroImage ref={this.heroimaage} key="compId_2" style={this.CSS_1_0}  {...this.heroimaage_attrs} >
{this.heroimaage_childs}
</DOTAHeroImage>
}
    {this.lbl_task1_isValid && 
<Label ref={this.lbl_task1} key="compId_3" style={this.CSS_1_1}  {...this.lbl_task1_attrs} >
{this.lbl_task1_childs}
</Label>
}
    {this.lbl_task2_isValid && 
<Label ref={this.lbl_task2} key="compId_4" style={this.CSS_1_2}  {...this.lbl_task2_attrs} >
{this.lbl_task2_childs}
</Label>
}
    {this.lbl_task3_isValid && 
<Label ref={this.lbl_task3} key="compId_5" style={this.CSS_1_3}  {...this.lbl_task3_attrs} >
{this.lbl_task3_childs}
</Label>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}