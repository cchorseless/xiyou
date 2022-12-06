import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { FuncHelper } from "../../helper/FuncHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { EntityHpBarItem } from "../Common/EntityHpBarItem";
interface ICCEntityHpBarItem extends NodePropsData {
    entityid: EntityIndex,

}

export class CCEntityHpBarItem extends CCPanel<ICCEntityHpBarItem> {

    fLastHealthPercent: number = 0;
    onRefreshUI() {
        const iUnitEntIndex = this.props.entityid;
        const fHealthPercent = Entities.GetHealth(iUnitEntIndex) / Entities.GetMaxHealth(iUnitEntIndex);
        if ((this.fLastHealthPercent) != (fHealthPercent)) {
            let fLose = (this.fLastHealthPercent) - fHealthPercent;
            if (fLose >= 0.25) {
                this.hpLoss.current!.TriggerClass("BigDamageShine");
            }
            this.fLastHealthPercent = fHealthPercent;
            const width = FuncHelper.ToFiniteNumber(fHealthPercent * 100) + "%"
            this.hpLeft.current!.style.width = width;
            this.hpLoss.current!.style.width = width;
        }
    }
    hpLoss = createRef<Panel>();
    hpLeft = createRef<Panel>();

    render() {
        return (<Panel className="CC_EntityHpBarItem" ref={this.__root__}  {...this.initRootAttrs()}>
            <Panel id="HealthProgress_Loss" ref={this.hpLoss} />
            <Panel id="HealthProgress_Left" ref={this.hpLeft} />
            <Panel id="HealthLossLastContainer" hittest={false} />
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}