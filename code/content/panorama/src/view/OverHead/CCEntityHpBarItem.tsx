import React, { createRef } from "react";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { FuncHelper } from "../../helper/FuncHelper";

import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";

import "./CCEntityHpBarItem.less";


interface ICCEntityHpBarItem extends NodePropsData {
    entityid: EntityIndex,
}

export class CCEntityHpBarItem extends CCPanel<ICCEntityHpBarItem> {
    fLastHealthPercent: number = 0;
    manyBuffCount: number = 0;

    onInitUI() {
        const iUnitEntIndex = this.props.entityid;
        let iBuff = Entities.GetBuffByName(iUnitEntIndex, GameEnum.Dota2.EReserveModifierName.modifier_many_hp_bar);
        if (iBuff !== -1) {
            this.manyBuffCount = Buffs.GetStackCount(iUnitEntIndex, iBuff);
        }
        else {
            this.manyBuffCount = 0;
        }
    }
    onRefreshUI() {
        if (this.manyBuffCount > 0) {
            this.updateManyHpBar()
        }
        else {
            this.updateSingleHpBar()
        }
    }
    private updateSingleHpBar() {
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
    private updateManyHpBar() {
        const iUnitEntIndex = this.props.entityid;
        const HealthLossLastContainer = this.hpManyContainer.current!;
        let iBuff = Entities.GetBuffByName(iUnitEntIndex, GameEnum.Dota2.EReserveModifierName.modifier_many_hp_bar);
        if (iBuff != -1) {
            let buffcount = Buffs.GetStackCount(iUnitEntIndex, iBuff);
            let bNewLayer = this.manyBuffCount != buffcount;
            this.manyBuffCount = buffcount;
            let newBar: ProgressBar | undefined = undefined;
            if (bNewLayer) {
                newBar = $.CreatePanel("ProgressBar", HealthLossLastContainer, "");
                newBar.value = 1;
                newBar.DeleteAsync(0.3);
                newBar.AddClass("HealthLossLast");
            }
            for (let i = 0; i < HealthLossLastContainer.GetChildCount(); i++) {
                const b = HealthLossLastContainer.GetChild(i) as ProgressBar;
                if (b) {
                    b.style.zIndex = -i;
                    b.style.brightness = (1 + i / 2).toString();
                    if (b != newBar) {
                        if (!b.BHasClass("TransitionBar")) {
                            b.AddClass("TransitionBar");
                            b.value = 0;
                        }
                    }
                }
            }
        }
    }
    hpLoss = createRef<Panel>();
    hpLeft = createRef<Panel>();
    hpManyContainer = createRef<Panel>();

    render() {
        const entityid = this.props.entityid as EntityIndex;
        const isfriend = Entities.GetTeamNumber(entityid) == Game.GetLocalPlayerInfo().player_team_id;
        return (<Panel className="CC_EntityHpBarItem" ref={this.__root__}  {...this.initRootAttrs()}>
            <Panel id="HealthProgress_Loss" ref={this.hpLoss} className="isfriend" />
            <Panel id="HealthProgress_Left" ref={this.hpLeft} />
            {
                this.manyBuffCount > 0 && <Panel id="HealthLossLastContainer" ref={this.hpManyContainer} hittest={false} />
            }
            {this.__root___childs}
            {this.props.children}
        </Panel>)
    }
}