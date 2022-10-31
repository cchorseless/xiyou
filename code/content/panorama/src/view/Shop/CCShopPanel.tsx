
import React, { createRef, PureComponent } from "react";
import { NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes, ImageAttributes, LabelAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";


export class CCShopPanel<T extends NodePropsData> extends CCPanel<T> {
    __root__: React.RefObject<Panel>;
    btn_gohome: React.RefObject<ImagePanel>;
    onbtn_gohome = (...args: any[]) => { };
    btn_goback: React.RefObject<ImagePanel>;
    onbtn_goback = (...args: any[]) => { };
    lbl_starstone: React.RefObject<LabelPanel>;
    lbl_metastone: React.RefObject<LabelPanel>;
    NODENAME = { __root__: '__root__', };


    onInitUI() {
        this.btn_gohome = createRef<ImagePanel>();
        this.btn_goback = createRef<ImagePanel>();
        this.lbl_starstone = createRef<LabelPanel>();
        this.lbl_metastone = createRef<LabelPanel>();
    }
    __root___isValid: boolean = true;
    __root___childs: Array<JSX.Element> = [];
    btn_gohome_isValid: boolean = true;
    btn_gohome_childs: Array<JSX.Element> = [];
    btn_goback_isValid: boolean = true;
    btn_goback_childs: Array<JSX.Element> = [];
    lbl_starstone_isValid: boolean = true;
    lbl_starstone_childs: Array<JSX.Element> = [];
    lbl_metastone_isValid: boolean = true;
    lbl_metastone_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid &&
            <Panel key="compId_1" ref={this.__root__}    {...this.initRootAttrs()}>
                <Image className="root" key="compId_2" >
                    <Image key="compId_3"  >
                    </Image>
                    {this.btn_gohome_isValid &&
                        <Image ref={this.btn_gohome} onmouseactivate={this.onbtn_gohome} key="compId_4"  >
                            {this.btn_gohome_childs}
                        </Image>
                    }
                    {this.btn_goback_isValid &&
                        <Image ref={this.btn_goback} onmouseactivate={this.onbtn_goback} key="compId_5" >
                            {this.btn_goback_childs}
                        </Image>
                    }
                    <Image key="compId_6" >
                        <Image key="compId_9"  >
                        </Image>
                        {this.lbl_starstone_isValid &&
                            <Label text={666} ref={this.lbl_starstone} key="compId_11"  >
                                {this.lbl_starstone_childs}
                            </Label>
                        }
                    </Image>
                    <Image key="compId_7" >
                        <Image key="compId_8"  >
                        </Image>
                        {this.lbl_metastone_isValid &&
                            <Label text="6666" ref={this.lbl_metastone} key="compId_10" >
                                {this.lbl_metastone_childs}
                            </Label>
                        }
                    </Image>
                </Image>
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}