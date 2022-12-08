import React, { createRef, useState } from "react";
import { GameEnum } from "../../../../../game/scripts/tscripts/shared/GameEnum";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { FuncHelper } from "../../helper/FuncHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCEntityHpBarItem } from "./CCEntityHpBarItem";

import "./CCEntityHpMpBarItem.less";


interface ICCEntityHpMpBarItem extends NodePropsData {
    entityid: EntityIndex,
}

export class CCEntityHpMpBarItem extends CCPanel<ICCEntityHpMpBarItem> {
    fLastManaPercent: number = 0;
    onRefreshUI() {
        const iUnitEntIndex = this.props.entityid;
        const fManaPercent = Entities.GetMana(iUnitEntIndex) / Entities.GetMaxMana(iUnitEntIndex);
        if ((this.fLastManaPercent) != (fManaPercent)) {
            let fLose = (this.fLastManaPercent) - fManaPercent;
            if (fLose >= 0.25) {
                this.mpLoss.current!.TriggerClass("BigDamageShine");
            }
            this.fLastManaPercent = fManaPercent;
            const width = FuncHelper.ToFiniteNumber(fManaPercent * 100) + "%"
            this.mpLeft.current!.style.width = width;
            this.mpLoss.current!.style.width = width;

        }
    }

    mpLoss = createRef<Panel>();
    mpLeft = createRef<Panel>();
    render() {
        const entityid = this.props.entityid as EntityIndex;
        const isfriend = Entities.GetTeamNumber(entityid) == Game.GetLocalPlayerInfo().player_team_id;
        return (
            <Panel ref={this.__root__}  {...this.initRootAttrs()}>
                <CCEntityHpBarItem entityid={entityid} />
                <Panel className="CC_EntityHpBarItem">
                    <Panel id="ManaProgress_Loss" ref={this.mpLoss} />
                    <Panel id="ManaProgress_Left" ref={this.mpLeft} />
                </Panel>
                {this.__root___childs}
                {this.props.children}
            </Panel>)
    }
}