import React from "react";
import { CombinationConfig } from "../../../../../game/scripts/tscripts/shared/CombinationConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { LogHelper } from "../../helper/LogHelper";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";

import "./CCCombinationIcon.less";

interface ICCCombinationIcon {
    sectName: string;
}


export class CCCombinationIcon extends CCPanel<ICCCombinationIcon> {
    defaultClass = () => { return CSSHelper.ClassMaker("CC_CombinationIcon", this.props.sectName); };
    getIndex() {
        let em = CombinationConfig.ECombinationLabel;
        switch (this.props.sectName) {
            case em.phyarm_up:
                return "14";
            case em.mgcarm_down:
                return "13";
            case em.phycrit_up:
                return "12";
            case em.disarm:
                return "11";
            case em.suck_blood:
                return "10";
            case em.shield:
                return "09";
            case em.invent:
                return "08";
            case em.tranform:
                return "07";
            case em.seckill:
                return "06";
            case em.betrayal:
                return "05";
            case "sect_injury":
                return "16";
            case "sect_wisp":
                return "15";
            default:
                return "01";
        }
    }
    getColor() {
        let em = CombinationConfig.ECombinationLabel;
        switch (this.props.sectName) {
            case em.phyarm_up:
                return "#9194ac";
            case em.mgcarm_down:
                return "#a25ea5";
            case em.phycrit_up:
                return "#fd3600";
            case em.disarm:
                return "#e36b12";
            case em.suck_blood:
                return "#51fb9a";
            case em.shield:
                return "#4c68fc";
            case em.invent:
                return "#2e6340";
            case em.tranform:
                return "#5ad1ee";
            case em.seckill:
                return "#cd3f13";
            case em.betrayal:
                return "#faba0b";
            case "sect_injury":
                return "#c726a7";
            case "sect_wisp":
                return "#1c66b2";
            default:
                return "#17a3c6";
        }
    }
    getSectImage() {
        let em = CombinationConfig.ECombinationLabel;
        switch (this.props.sectName) {
            case em.phyarm_up:
                return "swordsman_psd";
            case em.mgcarm_down:
                return "wild_psd";
            case em.phycrit_up:
                return "assassin_psd";
            case em.disarm:
                return "brawny_psd";
            case em.suck_blood:
                return "healer_psd";
            case em.shield:
                return "mage_psd";
            case em.invent:
                return "poisoner_psd";
            case em.tranform:
                return "ice_psd";
            case em.seckill:
                return "fury_psd";
            case em.betrayal:
                return "warrior_psd";
            case "sect_injury":
                return "beast_psd";
            case "sect_wisp":
                return "void_psd";
            default:
                return "";
        }
    }
    render() {
        return (
            <Panel ref={this.__root__}   {...this.initRootAttrs()}>
                <CCImage className="SectIconBGBorder" backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/synergy_backing_layers/leftcapsule_border" + this.getIndex() + "_psd.png")} />
                <CCImage className="SectIconBG" washColor={this.getColor()} backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/synergy_backing_layers/leftcapsule" + this.getIndex() + "_psd.png")} />
                <CCImage className="SectIconBGBottom" washColor={this.getColor()} backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/synergy_backing_layers/leftcapsule_border_bottom_pop" + this.getIndex() + "_psd.png")} />
                <CCImage className="SectImage" backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/" + this.getSectImage() + ".png")} />
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}