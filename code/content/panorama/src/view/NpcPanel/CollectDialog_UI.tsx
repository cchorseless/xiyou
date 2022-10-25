
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";


export class CollectDialog_UI<T extends NodePropsData> extends BasePureComponent<T> {
__root__: React.RefObject<Panel>;
btn_end: React.RefObject<Button>;
onbtn_makeTeam = (...args: any[]) => { };
NODENAME = {  __root__: '__root__',  btn_end: 'btn_end',  };
FUNCNAME = {  onbtn_makeTeam: {nodeName:"btn_end",type:"onactivate"}, };

    constructor(props: T) {
		super(props);
this.__root__ = createRef<Panel>();
this.btn_end = createRef<Button>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"400px","height":"180px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"57px","width":"150px","height":"70px","backgroundRepeat":"no-repeat","backgroundImage":"url(\"file://{images}/common/btn_green.png\")","backgroundSize":"100% 100%","x":"-102px","horizontalAlign":"middle"}
CSS_2_0 : Partial<VCSSStyleDeclaration>  = {"height":"40px","fontWeight":"bold","fontSize":"30","color":"#f9f4f4","x":"0px","horizontalAlign":"middle","y":"0px","verticalAlign":"middle"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
btn_end_isValid:boolean = true;
btn_end_attrs:PanelAttributes={};
btn_end_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.btn_end_isValid && 
<Button ref={this.btn_end} onactivate={this.onbtn_makeTeam} key="compId_2" style={this.CSS_1_0}  {...this.btn_end_attrs}>
        <Label text="采集" key="compId_3" style={this.CSS_2_0} >
</Label>
    
{this.btn_end_childs}
</Button>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}