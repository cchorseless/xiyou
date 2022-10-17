
import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, ImageAttributes, LabelAttributes, DOTAScenePanelAttributes } from "@demon673/react-panorama";


export class HeroInfoPanel_UI extends BasePureComponent {
        __root__: React.RefObject<Panel>;
        btn_gohome: React.RefObject<ImagePanel>;
        onbtn_gohome = (...args: any[]) => { };
        btn_goback: React.RefObject<ImagePanel>;
        onbtn_goback = (...args: any[]) => { };
        lbl_starstone: React.RefObject<LabelPanel>;
        img_rarety: React.RefObject<ImagePanel>;
        heroscene: React.RefObject<ScenePanel>;
        lbl_name: React.RefObject<LabelPanel>;
        NODENAME = { __root__: '__root__', btn_gohome: 'btn_gohome', btn_goback: 'btn_goback', lbl_starstone: 'lbl_starstone', img_rarety: 'img_rarety', heroscene: 'heroscene', lbl_name: 'lbl_name', };
        FUNCNAME = { onbtn_gohome: { nodeName: "btn_gohome", type: "onmouseactivate" }, onbtn_goback: { nodeName: "btn_goback", type: "onmouseactivate" }, };

        constructor(props: any) {
                super(props);
                this.__root__ = createRef<Panel>();
                this.btn_gohome = createRef<ImagePanel>();
                this.btn_goback = createRef<ImagePanel>();
                this.lbl_starstone = createRef<LabelPanel>();
                this.img_rarety = createRef<ImagePanel>();
                this.heroscene = createRef<ScenePanel>();
                this.lbl_name = createRef<LabelPanel>();

        };
        CSS_0_0: Partial<VCSSStyleDeclaration> = { "width": "1200px", "height": "900px" }
        CSS_1_0: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/Background.png\")", "backgroundSize": "100% 100%" }
        CSS_2_0: Partial<VCSSStyleDeclaration> = { "y": "0px", "x": "0px", "width": "1200px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/title_bg.png\")", "backgroundSize": "100% 100%" }
        CSS_2_1: Partial<VCSSStyleDeclaration> = { "width": "85px", "marginTop": "10px", "marginRight": "10px", "height": "82px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/icon_home.png\")", "backgroundSize": "100% 100%", "horizontalAlign": "right" }
        CSS_2_2: Partial<VCSSStyleDeclaration> = { "width": "104px", "marginTop": "5px", "marginLeft": "10px", "height": "93px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/btn_top_back.png\")", "backgroundSize": "100% 100%" }
        CSS_2_3: Partial<VCSSStyleDeclaration> = { "x": "733px", "width": "351px", "marginTop": "15px", "height": "80px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/status_bg.png\")", "backgroundSize": "100% 100%" }
        CSS_3_0: Partial<VCSSStyleDeclaration> = { "y": "-1px", "x": "10px", "width": "76px", "height": "83px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/shop/icon_StarStone.png\")", "backgroundSize": "100% 100%" }
        CSS_3_1: Partial<VCSSStyleDeclaration> = { "y": "16px", "x": "97px", "fontWeight": "bold", "fontSize": "50", "color": "#ffffff" }
        CSS_2_4: Partial<VCSSStyleDeclaration> = { "y": "118px", "x": "553px", "width": "628px", "height": "86px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/tab_bg.png\")", "backgroundSize": "100% 100%" }
        CSS_2_5: Partial<VCSSStyleDeclaration> = { "y": "154px", "x": "100px", "width": "338px", "height": "385px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/glow.png\")", "backgroundSize": "100% 100%" }
        CSS_2_6: Partial<VCSSStyleDeclaration> = { "y": "142px", "x": "105px", "width": "330px", "height": "440px" }
        CSS_2_7: Partial<VCSSStyleDeclaration> = { "y": "172px", "x": "579px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/deco.png\")", "backgroundSize": "100% 100%" }
        CSS_2_8: Partial<VCSSStyleDeclaration> = { "y": "140px", "x": "9px", "width": "100px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/equip_item.png\")", "backgroundSize": "100% 100%" }
        CSS_2_9: Partial<VCSSStyleDeclaration> = { "y": "293px", "x": "3px", "width": "100px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/equip_item.png\")", "backgroundSize": "100% 100%" }
        CSS_2_10: Partial<VCSSStyleDeclaration> = { "y": "470px", "x": "1px", "width": "100px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/equip_item.png\")", "backgroundSize": "100% 100%" }
        CSS_2_11: Partial<VCSSStyleDeclaration> = { "y": "143px", "x": "438px", "width": "100px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/equip_item.png\")", "backgroundSize": "100% 100%" }
        CSS_2_12: Partial<VCSSStyleDeclaration> = { "y": "289px", "x": "432px", "width": "100px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/equip_item.png\")", "backgroundSize": "100% 100%" }
        CSS_2_13: Partial<VCSSStyleDeclaration> = { "y": "474px", "x": "430px", "width": "100px", "height": "100px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/equip_item.png\")", "backgroundSize": "100% 100%" }
        CSS_2_14: Partial<VCSSStyleDeclaration> = { "y": "585px", "x": "16px", "width": "74px", "height": "79px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/rarity/rare_C.png\")", "backgroundSize": "100% 100%" }
        CSS_2_15: Partial<VCSSStyleDeclaration> = { "y": "605px", "x": "107px", "width": "153px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_16: Partial<VCSSStyleDeclaration> = { "y": "604px", "x": "282px", "width": "38px", "height": "43px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/icon_prop_2.png\")", "backgroundSize": "100% 100%" }
        CSS_2_17: Partial<VCSSStyleDeclaration> = { "y": "668px", "x": "41px", "width": "271px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_18: Partial<VCSSStyleDeclaration> = { "y": "530px", "x": "191px", "width": "153px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_19: Partial<VCSSStyleDeclaration> = { "y": "715px", "x": "30px", "width": "311px", "height": "43px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/prg.png\")", "backgroundSize": "100% 100%" }
        CSS_2_20: Partial<VCSSStyleDeclaration> = { "y": "715px", "x": "36px", "width": "191px", "height": "43px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/bar.png\")", "backgroundSize": "100% 100%" }
        CSS_2_21: Partial<VCSSStyleDeclaration> = { "y": "700px", "x": "302px", "width": "74px", "height": "73px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/btn_buy.png\")", "backgroundSize": "100% 100%" }
        CSS_2_22: Partial<VCSSStyleDeclaration> = { "y": "723px", "x": "132px", "width": "125px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_23: Partial<VCSSStyleDeclaration> = { "y": "604px", "x": "367px", "width": "175px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_24: Partial<VCSSStyleDeclaration> = { "y": "791px", "x": "26px", "width": "114px", "height": "82px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/herolabel/language_brz.png\")", "backgroundSize": "100% 100%" }
        CSS_2_25: Partial<VCSSStyleDeclaration> = { "y": "789px", "x": "155px", "width": "114px", "height": "82px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/herolabel/language_brz.png\")", "backgroundSize": "100% 100%" }
        CSS_2_26: Partial<VCSSStyleDeclaration> = { "y": "787px", "x": "292px", "width": "114px", "height": "82px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/herolabel/language_brz.png\")", "backgroundSize": "100% 100%" }
        CSS_2_27: Partial<VCSSStyleDeclaration> = { "y": "789px", "x": "424px", "width": "114px", "height": "82px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/herolabel/language_brz.png\")", "backgroundSize": "100% 100%" }
        CSS_2_28: Partial<VCSSStyleDeclaration> = { "y": "141px", "x": "908px", "width": "69px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_29: Partial<VCSSStyleDeclaration> = { "y": "223px", "x": "554px", "width": "626px", "height": "655px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/hero/bg_55.png\")", "backgroundSize": "100% 100%" }
        CSS_2_30: Partial<VCSSStyleDeclaration> = { "y": "141px", "x": "752px", "width": "69px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_31: Partial<VCSSStyleDeclaration> = { "y": "130px", "x": "595px", "width": "69px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
        CSS_2_32: Partial<VCSSStyleDeclaration> = { "y": "139px", "x": "1066px", "width": "69px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }

        __root___isValid: boolean = true;
        __root___attrs: PanelAttributes = {};
        __root___childs: Array<JSX.Element> = [];
        btn_gohome_isValid: boolean = true;
        btn_gohome_attrs: ImageAttributes = {};
        btn_gohome_childs: Array<JSX.Element> = [];
        btn_goback_isValid: boolean = true;
        btn_goback_attrs: ImageAttributes = {};
        btn_goback_childs: Array<JSX.Element> = [];
        lbl_starstone_isValid: boolean = true;
        lbl_starstone_attrs: LabelAttributes = {};
        lbl_starstone_childs: Array<JSX.Element> = [];
        img_rarety_isValid: boolean = true;
        img_rarety_attrs: ImageAttributes = {};
        img_rarety_childs: Array<JSX.Element> = [];
        heroscene_isValid: boolean = true;
        heroscene_attrs: DOTAScenePanelAttributes = {};
        heroscene_childs: Array<JSX.Element> = [];
        lbl_name_isValid: boolean = true;
        lbl_name_attrs: LabelAttributes = {};
        lbl_name_childs: Array<JSX.Element> = [];

        render() {
                return (
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
                                                <Image key="compId_7" style={this.CSS_3_0} >
                                                </Image>
                                                {this.lbl_starstone_isValid &&
                                                        <Label text="6666" ref={this.lbl_starstone} key="compId_8" style={this.CSS_3_1}  {...this.lbl_starstone_attrs} >
                                                                {this.lbl_starstone_childs}
                                                        </Label>
                                                }

                                        </Image>
                                        <Image key="compId_12" style={this.CSS_2_4} >
                                        </Image>
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_26" style={this.CSS_2_5}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.heroscene_isValid &&
                                                <DOTAScenePanel ref={this.heroscene} key="compId_13" style={this.CSS_2_6}  {...this.heroscene_attrs} >
                                                        {this.heroscene_childs}
                                                </DOTAScenePanel>
                                        }
                                        <Image key="compId_14" style={this.CSS_2_7} >
                                        </Image>
                                        <Image key="compId_15" style={this.CSS_2_8} >
                                        </Image>
                                        <Image key="compId_16" style={this.CSS_2_9} >
                                        </Image>
                                        <Image key="compId_17" style={this.CSS_2_10} >
                                        </Image>
                                        <Image key="compId_18" style={this.CSS_2_11} >
                                        </Image>
                                        <Image key="compId_19" style={this.CSS_2_12} >
                                        </Image>
                                        <Image key="compId_20" style={this.CSS_2_13} >
                                        </Image>
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_21" style={this.CSS_2_14}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="水晶侍女啊" ref={this.lbl_name} key="compId_22" style={this.CSS_2_15}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_23" style={this.CSS_2_16}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="熟练度等级：10/25" ref={this.lbl_name} key="compId_24" style={this.CSS_2_17}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="套装未激活" ref={this.lbl_name} key="compId_25" style={this.CSS_2_18}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_27" style={this.CSS_2_19}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_28" style={this.CSS_2_20}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_29" style={this.CSS_2_21}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="100/200" ref={this.lbl_name} key="compId_30" style={this.CSS_2_22}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="战力：1000" ref={this.lbl_name} key="compId_31" style={this.CSS_2_23}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_32" style={this.CSS_2_24}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_33" style={this.CSS_2_25}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_34" style={this.CSS_2_26}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_35" style={this.CSS_2_27}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="套装" ref={this.lbl_name} key="compId_36" style={this.CSS_2_28}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.img_rarety_isValid &&
                                                <Image ref={this.img_rarety} key="compId_37" style={this.CSS_2_29}  {...this.img_rarety_attrs} >
                                                        {this.img_rarety_childs}
                                                </Image>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="天赋" ref={this.lbl_name} key="compId_38" style={this.CSS_2_30}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="属性" ref={this.lbl_name} key="compId_39" style={this.CSS_2_31}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }
                                        {this.lbl_name_isValid &&
                                                <Label text="礼包" ref={this.lbl_name} key="compId_40" style={this.CSS_2_32}  {...this.lbl_name_attrs} >
                                                        {this.lbl_name_childs}
                                                </Label>
                                        }

                                </Image>

                                {this.props.children}
                                {this.__root___childs}
                        </Panel>
                )
        };
}