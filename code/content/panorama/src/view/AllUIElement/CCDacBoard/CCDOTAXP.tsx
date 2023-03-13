import React, { createRef } from "react";
import { GameEnum } from "../../../../../scripts/tscripts/shared/GameEnum";
import { GEventHelper } from "../../../../../scripts/tscripts/shared/lib/GEventHelper";
import { THeroUnit } from "../../../../../scripts/tscripts/shared/service/hero/THeroUnit";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCDOTAXP.less";

export interface ICCDOTAXP {
    CurSelectUnit: EntityIndex;
}

/** 等级 */
export class CCDOTAXP extends CCPanel<ICCDOTAXP> {
    onInitUI() {
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.OnSelectUnit();
        });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, (e) => {
            this.OnSelectUnit();
        });

        GEventHelper.AddEvent(THeroUnit.updateEventClassName(), GHandler.create(this, (unit: THeroUnit) => {
            this.OnSelectUnit();
        }), GGameScene.Local.BelongPlayerid);

    };

    OnSelectUnit() {
        let unit = Players.GetLocalPlayerPortraitUnit();
        let buildingroot = GBuildingEntityRoot.GetEntity(unit);
        if (buildingroot) {
            let herounit = buildingroot.GetHeroUnit();
            if (herounit && herounit.Level > 0) {
                let maxexp = GJSONConfig.HeroLevelUpConfig.get(herounit.Level)!.Exp;
                this.SetExp(herounit.Exp, maxexp);
                return;
            }
        }
        this.SetExp(0, GJSONConfig.HeroLevelUpConfig.get(1)!.Exp);
    }
    SetExp(exp: number, max: number) {
        let xp = this.__DOTAXP__.current!.FindChildTraverse("CircularXPProgress") as any as CircularProgressBar;
        if (xp) {
            xp.max = max;
            xp.value = exp;
            this.UpdateState({ xpvalue: exp, xpmax: max });
        }
    }
    __DOTAXP__ = createRef<Panel>();

    onStartUI() {
        let LifetimeLabel = this.__DOTAXP__.current!.FindChildTraverse("LifetimeLabel") as any as LabelPanel;
        LifetimeLabel.style.fontSize = "16px";
        this.OnSelectUnit();
    }
    render() {
        const xpvalue = this.GetState("xpvalue", 0);
        const xpmax = this.GetState("xpmax", 0);
        return (
            <Panel id="CC_DOTAXP" className="ShowXPBar" ref={this.__root__}      {...this.initRootAttrs()}>
                <CCPanel tooltipPosition="top" tooltip={`${xpvalue}/${xpmax}`}>
                    <GenericPanel type="DOTAXP" id="xp" ref={this.__DOTAXP__} style={{ width: "45px", height: "45px" }} hittest={false} always-cache-composition-layer={true} require-composition-layer={true} />
                </CCPanel>
                {this.__root___childs}
                {this.props.children}
            </Panel>
        );
    }
}