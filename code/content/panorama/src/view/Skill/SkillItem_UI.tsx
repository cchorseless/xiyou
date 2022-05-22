import React, { createRef, PureComponent } from "react";
import { BasePureComponent } from "../../libs/BasePureComponent";
import { PanelAttributes, ImageAttributes, DOTAAbilityImageAttributes } from "react-panorama-eom";

export class SkillItem_UI extends BasePureComponent {
    __root__: React.RefObject<Panel>;
    img_bg: React.RefObject<ImagePanel>;
    img_skillicon: React.RefObject<AbilityImage>;
    NODENAME = { __root__: "__root__", img_bg: "img_bg", img_skillicon: "img_skillicon" };
    FUNCNAME = {};

    constructor(props: any) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.img_bg = createRef<ImagePanel>();
        this.img_skillicon = createRef<AbilityImage>();
    }
    CSS_0_0: Partial<VCSSStyleDeclaration> = { width: "140px", height: "140px" };
    CSS_1_0: Partial<VCSSStyleDeclaration> = {
        width: "140px",
        height: "140px",
        backgroundRepeat: "no-repeat",
        backgroundImage: 'url("file://{images}/skill/skill_border_3.png")',
        backgroundSize: "100% 100%",
    };
    CSS_1_1: Partial<VCSSStyleDeclaration> = {
        y: "6px",
        x: "6px",
        width: "128px",
        height: "128px",
        backgroundRepeat: "no-repeat",
        backgroundImage: 'url("file://{images}/spellicons/fire_chess.png")',
        backgroundSize: "100% 100%",
    };
    CSS_1_2: Partial<VCSSStyleDeclaration> = { y: "6px", x: "6px", width: "128px", height: "128px" };

    __root___isValid: boolean = true;
    __root___attrs: PanelAttributes = {};
    __root___childs: Array<JSX.Element> = [];
    img_bg_isValid: boolean = true;
    img_bg_attrs: ImageAttributes = {};
    img_bg_childs: Array<JSX.Element> = [];
    img_skillicon_isValid: boolean = true;
    img_skillicon_attrs: DOTAAbilityImageAttributes = {};
    img_skillicon_childs: Array<JSX.Element> = [];

    render() {
        return (
            this.__root___isValid && (
                <Panel ref={this.__root__} key="compId_1" style={this.CSS_0_0} {...this.props} {...this.__root___attrs}>
                    {this.img_bg_isValid && (
                        <Image ref={this.img_bg} key="compId_3" style={this.CSS_1_0} {...this.img_bg_attrs}>
                            {this.img_bg_childs}
                        </Image>
                    )}
                    <Image visible={false} key="compId_4" style={this.CSS_1_1}></Image>
                    {this.img_skillicon_isValid && (
                        <DOTAAbilityImage ref={this.img_skillicon} key="compId_5" style={this.CSS_1_2} {...this.img_skillicon_attrs}>
                            {this.img_skillicon_childs}
                        </DOTAAbilityImage>
                    )}

                    {this.props.children}
                    {this.__root___childs}
                </Panel>
            )
        );
    }
}
