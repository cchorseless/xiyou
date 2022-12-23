import React, { createRef, useState } from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import "./CCOverheadTitle.less";


interface ICCOverheadTitle extends NodePropsData {
    sCourierTitleID: string | number,
}

export class CCOverheadTitle extends CCPanel<ICCOverheadTitle> {

    render() {
        const sCourierTitleID = this.props.sCourierTitleID + "";
        return <Panel ref={this.__root__}  {...this.initRootAttrs()}>
            <Image src={`file://{images}/custom_game/couriertitle/${sCourierTitleID}.png`} className={CSSHelper.ClassMaker("CCOverheadTitle", "CourierTitle_" + sCourierTitleID)}>
                <Label localizedText={`#overhead_title_${sCourierTitleID}`} />
            </Image>
        </Panel>
    }
}