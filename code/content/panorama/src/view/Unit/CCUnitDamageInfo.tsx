/** Create By Editor*/
import React, { createRef, useState } from "react";
import { FuncHelper } from "../../helper/FuncHelper";
import { NodePropsData } from "../../libs/BasePureComponent";
import { CCLabel } from "../allCustomUIElement/CCLabel/CCLabel";
import { CCPanel } from "../allCustomUIElement/CCPanel/CCPanel";
import { CCUnitSmallIcon } from "../allCustomUIElement/CCUnit/CCUnitSmallIcon";

interface ICCUnitDamageInfo extends NodePropsData {
}
export class CCUnitDamageInfo extends CCPanel<ICCUnitDamageInfo> {


    render() {
        return (
            this.__root___isValid &&
            <Panel id="CC_UnitDamageInfo" ref={this.__root__}    {...this.initRootAttrs()}>


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