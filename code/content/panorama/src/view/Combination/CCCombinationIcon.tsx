import React from "react";
import { CombinationConfig } from "../../../../scripts/tscripts/shared/CombinationConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { PathHelper } from "../../helper/PathHelper";
import { CCIcon_Lock } from "../AllUIElement/CCIcons/CCIcon_Lock";
import { CCImage } from "../AllUIElement/CCImage/CCImage";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import "./CCCombinationIcon.less";

interface ICCCombinationIcon {
    sectName: string;
    lock?: boolean;
}


export class CCCombinationIcon extends CCPanel<ICCCombinationIcon> {
    defaultClass = () => { return CSSHelper.ClassMaker("CC_CombinationIcon", this.props.sectName); };
    getIndex() {
        let index = CombinationConfig.ESectNameList.indexOf(this.props.sectName) + 1;
        if (index < 10) {
            return "0" + index;
        }
        else if (index > 16) {
            return "16";
        }
        else {
            return index + "";
        }
    }
    getColor() {
        let em = CombinationConfig.ESectName;
        let index = CombinationConfig.ESectNameList.indexOf(this.props.sectName) + 1;
        let colorname = CSSHelper.EColorList[index];
        return (CSSHelper.EColor as any)[colorname];
    }
    getSectImage() {
        return this.props.sectName;
    }
    render() {
        const picindex = this.getIndex();
        const lock = this.props.lock;
        return (
            <Panel ref={this.__root__}   {...this.initRootAttrs()}>

                <CCImage className="SectIconBGBorder" backgroundImage={PathHelper.getCustomImageUrl("combination/icons/iconbg/leftcapsule_border" + picindex + "_psd.png")} />
                <CCImage className="SectIconBG" washColor={this.getColor()} backgroundImage={PathHelper.getCustomImageUrl("combination/icons/iconbg/leftcapsule" + picindex + "_psd.png")} />
                <CCImage className="SectIconBGBottom" washColor={this.getColor()} backgroundImage={PathHelper.getCustomImageUrl("combination/icons/iconbg/leftcapsule_border_bottom_pop" + picindex + "_psd.png")} />
                {
                    lock ? <CCIcon_Lock align="center center" /> :
                        <CCImage className="SectImage" backgroundImage={PathHelper.getCustomImageUrl("combination/icons/" + this.getSectImage() + ".png")} />

                }
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}