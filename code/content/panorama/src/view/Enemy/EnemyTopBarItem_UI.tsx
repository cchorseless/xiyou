
import React, { createRef, PureComponent } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";


export class EnemyTopBarItem_UI<T extends NodePropsData> extends BasePureComponent<T> {
    __root__: React.RefObject<Panel>;
    panel_hpbar: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', panel_hpbar: 'panel_hpbar', };
    FUNCNAME = {};

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.panel_hpbar = createRef<Panel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "250px", "height": "50px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "2px", "width": "246px", "height": "50px" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    panel_hpbar_isValid: boolean = true;
    panel_hpbar_attrs: PanelAttributes = {};
    panel_hpbar_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__} style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs}>
                {this.panel_hpbar_isValid &&
                    <Panel ref={this.panel_hpbar} key="compId_5" style={this.CSS_1_0}  {...this.panel_hpbar_attrs} >
                        {this.panel_hpbar_childs}
                    </Panel>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}