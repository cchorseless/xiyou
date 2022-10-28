
import React, { createRef, PureComponent, useState } from "react";
import { BasePureComponent, NodePropsData } from "../../libs/BasePureComponent";
import { PanelAttributes, LabelAttributes, ImageAttributes } from "@demon673/react-panorama";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";


export class CCTopBarPanel<T extends NodePropsData> extends CCPanel<T> {
    __root__: React.RefObject<Panel>;
    lbl_roundstagedes: React.RefObject<LabelPanel>;
    lbl_population: React.RefObject<LabelPanel>;
    lbl_gold: React.RefObject<LabelPanel>;
    lbl_round: React.RefObject<LabelPanel>;
    lbl_food: React.RefObject<LabelPanel>;
    lbl_wood: React.RefObject<LabelPanel>;
    lbl_roundDes: React.RefObject<LabelPanel>;
    lbl_populationDes: React.RefObject<LabelPanel>;
    lbl_goldDes: React.RefObject<LabelPanel>;
    lbl_foodDes: React.RefObject<LabelPanel>;
    lbl_woodDes: React.RefObject<LabelPanel>;
    lbl_lefttime: React.RefObject<LabelPanel>;
    lbl_gametime: React.RefObject<LabelPanel>;
    btn_drawcard: React.RefObject<ImagePanel>;
    onbtn_click = (...args: any[]) => { };
    NODENAME = { __root__: '__root__' };
    FUNCNAME = { onbtn_click: { nodeName: "btn_drawcard", type: "onmouseactivate" }, };

    constructor(props: T) {
        super(props);
        this.__root__ = createRef<Panel>();
        this.lbl_roundstagedes = createRef<LabelPanel>();
        this.lbl_population = createRef<LabelPanel>();
        this.lbl_gold = createRef<LabelPanel>();
        this.lbl_round = createRef<LabelPanel>();
        this.lbl_food = createRef<LabelPanel>();
        this.lbl_wood = createRef<LabelPanel>();
        this.lbl_roundDes = createRef<LabelPanel>();
        this.lbl_populationDes = createRef<LabelPanel>();
        this.lbl_goldDes = createRef<LabelPanel>();
        this.lbl_foodDes = createRef<LabelPanel>();
        this.lbl_woodDes = createRef<LabelPanel>();
        this.lbl_lefttime = createRef<LabelPanel>();
        this.lbl_gametime = createRef<LabelPanel>();
        this.btn_drawcard = createRef<ImagePanel>();

    };

    CSS_2_4: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "615px", "width": "169px", "height": "42px", "fontWeight": "bold", "fontSize": "40", "color": "#39f909" }
    CSS_2_5: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "454px", "width": "115px", "height": "42px", "fontWeight": "bold", "fontSize": "40", "color": "#ffffff" }
    CSS_2_6: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "877px", "height": "42px", "fontWeight": "bold", "fontSize": "40", "color": "#ffffff" }
    CSS_2_7: Partial<VCSSStyleDeclaration> = { "y": "6px", "x": "206px", "width": "48px", "height": "48px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/rank_active_png.png\")", "backgroundSize": "100% 100%" }
    CSS_2_8: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "261px", "width": "115px", "height": "42px", "fontWeight": "bold", "fontSize": "40", "color": "#ffffff" }
    CSS_2_9: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "1270px", "height": "42px", "fontWeight": "bold", "fontSize": "40", "color": "#ffffff" }
    CSS_2_10: Partial<VCSSStyleDeclaration> = { "y": "9px", "x": "1070px", "height": "42px", "fontWeight": "bold", "fontSize": "40", "color": "#ffffff" }
    CSS_1_1: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "206px", "height": "42px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }
    CSS_1_2: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "437px", "height": "42px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }
    CSS_1_3: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "825px", "height": "42px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }
    CSS_1_4: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "1225px", "height": "42px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }
    CSS_1_5: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "1025px", "height": "42px", "fontWeight": "bold", "fontSize": "25", "color": "#ffffff" }
    CSS_1_6: Partial<VCSSStyleDeclaration> = { "y": "82px", "fontWeight": "bold", "fontSize": "50", "color": "#ffffff", "x": "0px", "horizontalAlign": "middle" }
    CSS_1_7: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "641px", "height": "42px", "fontWeight": "bold", "fontSize": "30", "color": "#ffffff" }
    CSS_1_8: Partial<VCSSStyleDeclaration> = { "y": "5px", "x": "14px", "width": "147px", "height": "93px", "backgroundRepeat": "no-repeat", "backgroundImage": "url(\"file://{images}/common/5chess_png.png\")", "backgroundSize": "100% 100%" }

    __root___isValid: boolean = true;
    __root___childs: Array<JSX.Element> = [];

    state: { round?: ERoundBoard } = { round: undefined };

    render() {
        // 初始化数据问题
        let playerdata = PlayerScene.Local.PlayerDataComp.Ref();
        const [time, setTime] = useState(-1);
        return (
            this.__root___isValid &&
            <Panel ref={this.__root__} id="CC_TopBarPanel" horizontalAlign="center"   {...this.initRootAttrs()} hittest={false}>
                <Image id="TopBarBg" >
                    <Image id="ImageMoney" />
                    <Image id="ImagePolulation" />
                    <Image id="ImageFood" />
                    <Image id="ImageWood" />
                    <Image key="compId_16" />
                    <Label id="RoundStageDes" text={this.state.round?.getCurStateDes()} ref={this.lbl_roundstagedes} />
                    <Label text={$.Localize('#lang_round') + playerdata.difficulty} key="compId_17" />
                    <Label text={`${playerdata.population}/${playerdata.populationRoof}`} ref={this.lbl_population} />
                    <Label text={`${playerdata.gold}(+${playerdata.perIntervalGold})`} ref={this.lbl_gold} />
                    <Label text={`${playerdata.food}(+${playerdata.perIntervalWood})`} ref={this.lbl_food} key="compId_19" />
                    <Label text={`${playerdata.wood}(+${playerdata.perIntervalWood})`} ref={this.lbl_wood} key="compId_20" />
                </Image>
                <Label localizedText="#lang_round" key="compId_18" />
                <Label localizedText="#lang_population" key="compId_14" />
                <Label localizedText="#lang_gold" key="compId_21" />
                <Label localizedText="#lang_food" key="compId_22" />
                <Label localizedText="#lang_wood" key="compId_23" />
                <Label text="600" ref={this.lbl_lefttime} key="compId_7" />
                <Label text="00:11:11" ref={this.lbl_gametime} key="compId_6" />
                <Image ref={this.btn_drawcard} onmouseactivate={this.onbtn_click} key="compId_24" />
                {this.props.children}
                {this.__root___childs}
            </Panel >
        )
    };
}