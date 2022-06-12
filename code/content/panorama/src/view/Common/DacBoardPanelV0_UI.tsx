
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes } from "react-panorama-eom";


export class DacBoardPanelV0_UI extends BasePureComponent {
__root__: React.RefObject<Panel>;
panel_PortraitGroup: React.RefObject<Panel>;
panel_AbilityList: React.RefObject<Panel>;
panel_HealthMana: React.RefObject<Panel>;
panel_Inventory: React.RefObject<Panel>;
NODENAME = {  __root__: '__root__',  panel_PortraitGroup: 'panel_PortraitGroup',  panel_AbilityList: 'panel_AbilityList',  panel_HealthMana: 'panel_HealthMana',  panel_Inventory: 'panel_Inventory',  };
FUNCNAME = {  };

    constructor(props: any) {
		super(props);
this.__root__ = createRef<Panel>();
this.panel_PortraitGroup = createRef<Panel>();
this.panel_AbilityList = createRef<Panel>();
this.panel_HealthMana = createRef<Panel>();
this.panel_Inventory = createRef<Panel>();

    };
CSS_0_0 : Partial<VCSSStyleDeclaration>  = {"width":"1000px","height":"250px"}
CSS_1_0 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"0px","width":"250px","height":"250px"}
CSS_1_1 : Partial<VCSSStyleDeclaration>  = {"y":"3px","x":"254px","width":"487px","height":"150px"}
CSS_1_2 : Partial<VCSSStyleDeclaration>  = {"y":"159px","x":"252px","width":"487px","height":"80px"}
CSS_1_3 : Partial<VCSSStyleDeclaration>  = {"y":"0px","x":"745px","width":"250px","height":"250px"}

__root___isValid:boolean = true;
__root___attrs:PanelAttributes={};
__root___childs: Array<JSX.Element> = [];
panel_PortraitGroup_isValid:boolean = true;
panel_PortraitGroup_attrs:PanelAttributes={};
panel_PortraitGroup_childs: Array<JSX.Element> = [];
panel_AbilityList_isValid:boolean = true;
panel_AbilityList_attrs:PanelAttributes={};
panel_AbilityList_childs: Array<JSX.Element> = [];
panel_HealthMana_isValid:boolean = true;
panel_HealthMana_attrs:PanelAttributes={};
panel_HealthMana_childs: Array<JSX.Element> = [];
panel_Inventory_isValid:boolean = true;
panel_Inventory_attrs:PanelAttributes={};
panel_Inventory_childs: Array<JSX.Element> = [];

render() {
    return(
        this.__root___isValid && 
<Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
    {this.panel_PortraitGroup_isValid && 
<Panel ref={this.panel_PortraitGroup} key="compId_3" style={this.CSS_1_0}  {...this.panel_PortraitGroup_attrs} >
{this.panel_PortraitGroup_childs}
</Panel>
}
    {this.panel_AbilityList_isValid && 
<Panel ref={this.panel_AbilityList} key="compId_4" style={this.CSS_1_1}  {...this.panel_AbilityList_attrs} >
{this.panel_AbilityList_childs}
</Panel>
}
    {this.panel_HealthMana_isValid && 
<Panel ref={this.panel_HealthMana} key="compId_5" style={this.CSS_1_2}  {...this.panel_HealthMana_attrs} >
{this.panel_HealthMana_childs}
</Panel>
}
    {this.panel_Inventory_isValid && 
<Panel ref={this.panel_Inventory} key="compId_6" style={this.CSS_1_3}  {...this.panel_Inventory_attrs} >
{this.panel_Inventory_childs}
</Panel>
}

{this.props.children}
{this.__root___childs}
 </Panel>
    )};
}