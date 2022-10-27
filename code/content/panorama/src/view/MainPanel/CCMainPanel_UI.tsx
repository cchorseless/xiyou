
import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";


export class CCMainPanel_UI<T extends NodePropsData> extends CCPanel<T> {
    __root__: React.RefObject<Panel>;
    btn_debug: React.RefObject<Button>;
    onbtn_click = (...args: any[]) => { };
    panel_base: React.RefObject<Panel>;
    panel_allpanel: React.RefObject<Panel>;
    panel_alldialog: React.RefObject<Panel>;
    NODENAME = { __root__: '__root__', btn_debug: 'btn_debug', panel_base: 'panel_base', panel_allpanel: 'panel_allpanel', panel_alldialog: 'panel_alldialog', };

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.btn_debug = createRef<Button>();
        this.panel_base = createRef<Panel>();
        this.panel_allpanel = createRef<Panel>();
        this.panel_alldialog = createRef<Panel>();
        this.InitUI();

    };
    __root___isValid: boolean = true;
    __root___childs: Array<JSX.Element> = [];
    btn_debug_isValid: boolean = true;
    btn_debug_childs: Array<JSX.Element> = [];
    panel_base_isValid: boolean = true;
    panel_base_childs: Array<JSX.Element> = [];
    panel_allpanel_isValid: boolean = true;
    panel_allpanel_childs: Array<JSX.Element> = [];
    panel_alldialog_isValid: boolean = true;
    panel_alldialog_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                {this.btn_debug_isValid &&
                    <Button ref={this.btn_debug} onactivate={this.onbtn_click} className="CommonButton" key="compId_2"   >
                        {this.btn_debug_childs}
                    </Button>
                }
                {this.panel_base_isValid &&
                    <Panel ref={this.panel_base} className="CC_root" key="compId_16" hittest={false}>
                            {this.panel_base_childs}
                    </Panel>
                }
                {this.panel_allpanel_isValid &&
                    <Panel ref={this.panel_allpanel} className="CC_root" key="compId_13" hittest={false}>
                        {this.panel_allpanel_childs}
                    </Panel>
                }
                {this.panel_alldialog_isValid &&
                    <Panel ref={this.panel_alldialog} className="CC_root" key="compId_17" hittest={false}>
                        {this.panel_alldialog_childs}
                    </Panel>
                }

                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}