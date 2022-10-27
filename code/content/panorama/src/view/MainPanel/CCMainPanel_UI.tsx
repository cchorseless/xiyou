
import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";


export class CCMainPanel_UI<T extends NodePropsData> extends CCPanel<T> {
    __root__: React.RefObject<Panel>;
    btn_debug: React.RefObject<Button>;
    onbtn_click = (...args: any[]) => { };
    panel_base: React.RefObject<Panel>;
    panel_allpanel: React.RefObject<Panel>;
    panel_alldialog: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', btn_debug: 'btn_debug', panel_base: 'panel_base', panel_allpanel: 'panel_allpanel', panel_alldialog: 'panel_alldialog', };
    FUNCNAME = { onbtn_click: { nodeName: "btn_debug", type: "onactivate" }, };

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.btn_debug = createRef<Button>();
        this.panel_base = createRef<Panel>();
        this.panel_allpanel = createRef<Panel>();
        this.panel_alldialog = createRef<Panel>();

    };
    CSS_0_0: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px" }
    CSS_1_0: Partial<VCSSStyleDeclaration> = { "x": "5px", "width": "38px", "height": "38px", "marginBottom": "245px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/control_icons/arrow_popout.png\")", "backgroundSize": "100% 100%", "verticalAlign": "bottom" }
    CSS_1_1: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px", "horizontalAlign": "middle", "verticalAlign": "middle" }
    CSS_1_2: Partial<VCSSStyleDeclaration> = { "x": "0px", "horizontalAlign": "middle", "y": "0px", "verticalAlign": "middle" }
    CSS_1_3: Partial<VCSSStyleDeclaration> = { "x": "0px", "horizontalAlign": "middle", "y": "0px", "verticalAlign": "middle" }

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    btn_debug_isValid: boolean = true;
    btn_debug_attrs: PanelAttributes = {};
    btn_debug_childs: Array<JSX.Element> = [];
    panel_base_isValid: boolean = true;
    panel_base_attrs: PanelAttributes = {};
    panel_base_childs: Array<JSX.Element> = [];
    panel_allpanel_isValid: boolean = true;
    panel_allpanel_attrs: PanelAttributes = {};
    panel_allpanel_childs: Array<JSX.Element> = [];
    panel_alldialog_isValid: boolean = true;
    panel_alldialog_attrs: PanelAttributes = {};
    panel_alldialog_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} className="root" key="compId_1" style={this.CSS_0_0}  {...this.props}   {...this.__root___attrs} hittest={false}>
                {this.btn_debug_isValid &&
                    <Button ref={this.btn_debug} onactivate={this.onbtn_click} className="CommonButton" key="compId_2" style={this.CSS_1_0}  {...this.btn_debug_attrs} >
                        {this.btn_debug_childs}
                    </Button>
                }
                {this.panel_base_isValid &&
                    <Panel ref={this.panel_base} className="root" key="compId_16" style={this.CSS_1_1}  {...this.panel_base_attrs} hittest={false}>
                        {this.panel_base_childs}
                    </Panel>
                }
                {this.panel_allpanel_isValid &&
                    <Panel ref={this.panel_allpanel} className="root" key="compId_13" style={this.CSS_1_2}  {...this.panel_allpanel_attrs}  hittest={false}>
                        {this.panel_allpanel_childs}
                    </Panel>
                }
                {this.panel_alldialog_isValid &&
                    <Panel ref={this.panel_alldialog} className="root" key="compId_17" style={this.CSS_1_3}  {...this.panel_alldialog_attrs} hittest={false}>
                        {this.panel_alldialog_childs}
                    </Panel>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}