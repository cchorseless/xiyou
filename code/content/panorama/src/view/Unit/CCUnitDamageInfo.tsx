/** Create By Editor*/
import React from "react";
import { RoundConfig } from "../../../../scripts/tscripts/shared/RoundConfig";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { FuncHelper } from "../../helper/FuncHelper";

import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCTxtTable } from "../AllUIElement/CCTable/CCTxtTable";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import "./CCUnitDamageInfo.less";


interface ICCUnitDamageInfo extends NodePropsData {
}
export class CCUnitDamageInfo extends CCPanel<ICCUnitDamageInfo> {
    onReady() {
        return Boolean(ERoundBoard.CurRoundBoard);
    }
    onInitUI() {
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            this.updateSelf();
            return 0.1
        }));
    }

    render() {
        if (!this.__root___isValid) {
            return this.defaultRender("CC_UnitDamageInfo");
        }
        let round = ERoundBoard.CurRoundBoard;
        if (round.roundState == RoundConfig.ERoundBoardState.start) {
            return this.defaultRender("CC_UnitDamageInfo");
        }
        const isdamage = this.GetState<Boolean>("isdamage", true);
        let infos = Object.keys(round.unitDamageInfo).map(key => {
            let _info = round.unitDamageInfo[key];
            return {
                SUnitName: _info.name,
                fDamageTotal: isdamage ? (_info.phyD + _info.magD + _info.pureD) : (_info.byphyD + _info.bymagD + _info.bypureD),
                fDamagePhysic: isdamage ? _info.phyD : _info.byphyD,
                fDamageMagic: isdamage ? _info.magD : _info.bymagD,
                fDamagePure: isdamage ? _info.pureD : _info.bypureD,
            }
        });
        infos.sort((a, b) => {
            return (b.fDamageTotal) - (a.fDamageTotal);
        })
        let fMaxDamage = 0;
        if (infos[0]) fMaxDamage = infos[0].fDamageTotal;
        return (
            <Panel id="CC_UnitDamageInfo" ref={this.__root__}    {...this.initRootAttrs()}>
                <CCPanel id="CC_tableBg" >
                    <CCTxtTable align="center center" list={["damage", "hurt"]}
                        separatorclass="Sptxt"
                        onChange={(index: number, text: string) => {
                            this.UpdateState({ isdamage: index == 1 })
                        }} />
                </CCPanel>
                {
                    fMaxDamage > 0 && infos.map((info, index) => {
                        if (info.fDamageTotal > 0)
                            return <CCUnitDamageProgressItem key={index + ""} fMaxDamage={fMaxDamage}  {...info} />
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
                    <Label className="TotalDamage" text={Math.floor(fDamageTotal) + ""} hittest={false} />
                </Panel>
                <CCUnitSmallIcon itemname={SUnitName} width="40px" height="40px" />
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

}