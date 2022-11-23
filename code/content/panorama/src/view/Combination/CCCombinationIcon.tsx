import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { CCImage } from "../allCustomUIElement/CCImage/CCImage";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";

import "./CCCombinationIcon.less";

interface ICCCombinationIcon {
    sectName: string;
}


export class CCCombinationIcon extends CCPanel<ICCCombinationIcon> {
    defaultClass = () => { return CSSHelper.ClassMaker("SectIcon", this.props.sectName); };
    getIndex() {
        switch (this.props.sectName) {
            case "sect_attack":
                return "14";
            case "sect_evade":
                return "13";
            case "sect_crit":
                return "12";
            case "sect_health":
                return "11";
            case "sect_regen":
                return "10";
            case "sect_ulti":
                return "09";
            case "sect_poison":
                return "08";
            case "sect_ice":
                return "07";
            case "sect_fury":
                return "06";
            case "sect_shield":
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
        switch (this.props.sectName) {
            case "sect_attack":
                return "#9194ac";
            case "sect_evade":
                return "#a25ea5";
            case "sect_crit":
                return "#fd3600";
            case "sect_health":
                return "#e36b12";
            case "sect_regen":
                return "#51fb9a";
            case "sect_ulti":
                return "#4c68fc";
            case "sect_poison":
                return "#2e6340";
            case "sect_ice":
                return "#5ad1ee";
            case "sect_fury":
                return "#cd3f13";
            case "sect_shield":
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
        switch (this.props.sectName) {
            case "sect_attack":
                return "swordsman_psd";
            case "sect_evade":
                return "wild_psd";
            case "sect_crit":
                return "assassin_psd";
            case "sect_health":
                return "brawny_psd";
            case "sect_regen":
                return "healer_psd";
            case "sect_ulti":
                return "mage_psd";
            case "sect_poison":
                return "poisoner_psd";
            case "sect_ice":
                return "ice_psd";
            case "sect_fury":
                return "fury_psd";
            case "sect_shield":
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
            <Panel ref={this.__root__} id="CC_CombinationIcon"    {...this.initRootAttrs()}>
                <CCImage className="SectIconBGBorder" backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/synergy_backing_layers/leftcapsule_border" + this.getIndex() + "_psd.png")} />
                <CCImage className="SectIconBG" washColor={this.getColor()} backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/synergy_backing_layers/leftcapsule" + this.getIndex() + "_psd.png")} />
                <CCImage className="SectIconBGBottom" washColor={this.getColor()} backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/synergy_backing_layers/leftcapsule_border_bottom_pop" + this.getIndex() + "_psd.png")} />
                <CCImage className="SectImage" backgroundImage={CSSHelper.getCustomImageUrl("synergyicons/" + this.getSectImage() + ".png")} />
            </Panel>
        );
    }
}