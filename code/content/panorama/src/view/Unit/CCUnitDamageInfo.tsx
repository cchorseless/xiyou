/** Create By Editor*/
import React, { createRef, useState } from "react";
import { PlayerScene } from "../../game/components/Player/PlayerScene";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { RoundConfig } from "../../game/system/Round/RoundConfig";
import { FuncHelper } from "../../helper/FuncHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../allCustomUIElement/CCUnit/CCUnitSmallIcon";
import "./CCUnitDamageInfo.less";


interface ICCUnitDamageInfo extends NodePropsData {
}
export class CCUnitDamageInfo extends CCPanel<ICCUnitDamageInfo> {
    onReady() {
        return Boolean(PlayerScene.Local.RoundManagerComp && PlayerScene.Local.RoundManagerComp.getCurrentBoardRound());
    }
    onInitUI() {
        TimerHelper.AddIntervalFrameTimer(1, 1, FuncHelper.Handler.create(this, () => {
            let round = PlayerScene.Local.RoundManagerComp.getCurrentBoardRound();
            if (round.roundState == RoundConfig.ERoundBoardState.battle) {
                this.updateSelf();
            }
        }), -1, false);
    }

    render() {
        let round = PlayerScene.Local.RoundManagerComp.getCurrentBoardRound();
        if (!this.__root___isValid || round.roundState == RoundConfig.ERoundBoardState.start) {
            return <Panel id="CC_UnitDamageInfo" ref={this.__root__}    {...this.initRootAttrs()} />
        }
        let infos = Object.keys(round.unitDamageInfo).map(key => {
            let _info = round.unitDamageInfo[key];
            return {
                SUnitName: Entities.GetUnitName(Number(key) as EntityIndex),
                fDamageTotal: _info.phyD + _info.magD + _info.pureD,
                fDamagePhysic: _info.phyD,
                fDamageMagic: _info.magD,
                fDamagePure: _info.pureD,
            }
        });
        infos.sort((a, b) => {
            return (a.fDamageTotal) - (b.fDamageTotal);
        })
        let fMaxDamage = 0;
        if (infos[0]) fMaxDamage = infos[0].fDamageTotal;

        return (
            <Panel id="CC_UnitDamageInfo" ref={this.__root__}    {...this.initRootAttrs()}>
                {
                    infos.map((info) => {
                        return <CCUnitDamageProgressItem fMaxDamage={fMaxDamage}  {...info} />
                    })
                }
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };
}



interface ICCUnitDamageProgressItem {
    SUnitName: string,
    fMaxDamage: number,
    fDamageTotal: number,
    fDamagePure: number,
    fDamagePhysic: number,
    fDamageMagic: number,
}
export class CCUnitDamageProgressItem extends CCPanel<ICCUnitDamageProgressItem> {
    render() {
        const SUnitName = this.props.SUnitName;
        const fMaxDamage = this.props.fMaxDamage;
        const fDamageTotal = this.props.fDamageTotal;
        const fDamagePure = this.props.fDamagePure;
        const fDamagePhysic = this.props.fDamagePhysic;
        const fDamageMagic = this.props.fDamageMagic;
        return (
            this.__root___isValid &&
            <Panel id="CC_UnitDamageProgressItem" ref={this.__root__}    {...this.initRootAttrs()}>
                <Panel className="TowerDamageBar" >
                    <CCPanel className="TowerDamageBar_Left" width={`${FuncHelper.Round(FuncHelper.ToFiniteNumber(fDamageTotal / fMaxDamage * 100), 2)}%`} hittest={false}>
                        <CCPanel id="PhysicalDamage" className="DamageLabel" width={`${FuncHelper.Round(FuncHelper.ToFiniteNumber(fDamagePhysic / fDamageTotal) * 100, 2)}%`}
                            tooltip={$.Localize("#Tooltip_Round_Damage_Physical")}
                        />
                        <CCPanel id="MagicalDamage" className="DamageLabel" width={`${FuncHelper.Round(FuncHelper.ToFiniteNumber(fDamageMagic / fDamageTotal) * 100, 2)}%`}
                            tooltip={$.Localize("#Tooltip_Round_Damage_Magical")}
                        />
                        <CCPanel id="PureDamage" className="DamageLabel" width={`${FuncHelper.Round(FuncHelper.ToFiniteNumber(fDamagePure / fDamageTotal) * 100, 2)}%`}
                            tooltip={$.Localize("#Tooltip_Round_Damage_Pure")}
                        />
                    </CCPanel>
                    <Label className="TotalDamage" localizedText="{s:total_damage}" hittest={false} />
                </Panel>
                <CCUnitSmallIcon className="TowerIcon" itemname={SUnitName} />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}