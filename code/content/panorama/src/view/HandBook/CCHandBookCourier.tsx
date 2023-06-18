import React from "react";
import { CSSHelper } from "../../helper/CSSHelper";
import { KVHelper } from "../../helper/KVHelper";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCCourierCard } from "../Courier/CCCourierCard";
import "./CCHandBookCourier.less";


interface ICCHandBookCourier {
}

export class CCHandBookCourier extends CCPanel<ICCHandBookCourier> {

    render() {
        const courier_units = KVHelper.KVData().courier_units;
        const allunlockCourier = (GGameScene.Local.TCharacter.DataComp!).getAllCourierNames();;
        const courierNames = Object.keys(courier_units);
        courierNames.sort((a, b) => {
            const tCourierData_a = courier_units[a];
            const sRarity_a = tCourierData_a.Rarity || "A";
            const tCourierData_b = courier_units[b];
            const sRarity_b = tCourierData_b.Rarity || "A";
            return KVHelper.GetRarityNumber(sRarity_a) - KVHelper.GetRarityNumber(sRarity_b);
        });
        const sCourierSelected = this.GetState<string>("sCourierSelected") || courierNames[0];
        const isCurLocked = !allunlockCourier.includes(sCourierSelected);
        const allCourierinfo: { [k: string]: string[] } = {};
        const allUnLockedCourierinfo: { [k: string]: string[] } = {};
        courierNames.forEach(a => {
            const tCourierData_a = courier_units[a];
            const sRarity_a = tCourierData_a.Rarity || "A";
            allCourierinfo[sRarity_a] = allCourierinfo[sRarity_a] || [];
            allCourierinfo[sRarity_a].push(a);
        })
        allunlockCourier.forEach(a => {
            const tCourierData_a = courier_units[a];
            const sRarity_a = tCourierData_a.Rarity || "A";
            allUnLockedCourierinfo[sRarity_a] = allUnLockedCourierinfo[sRarity_a] || [];
            allUnLockedCourierinfo[sRarity_a].push(a);
        });
        return <Panel className={CSSHelper.ClassMaker("CCHandBookCourier")}
            hittest={false}
            ref={this.__root__}  {...this.initRootAttrs()}>
            <CCPanel id="HandBookCourierLeft" flowChildren="right-wrap" width="70%" height="100%" scroll={"y"}>
                {
                    courierNames.map((sCourierName, index) => {
                        const isLocked = !allunlockCourier.includes(sCourierName);
                        return (
                            <CCCourierCard key={sCourierName + ""}
                                className={CSSHelper.ClassMaker("PlayerCourierCard", { "Locked": isLocked, "Selected": sCourierSelected == sCourierName })}
                                sCourierName={sCourierName}
                                allowrotation={false}
                                showability={true}
                                onactivate={p => {
                                    this.UpdateState({ "sCourierSelected": sCourierName })
                                }} >
                                {isLocked && <CCLabel verticalAlign="bottom" marginBottom={"10px"} horizontalAlign="center" type="UnitName" text={`10场通关获取`} hittest={false} />}
                            </CCCourierCard>
                        );
                    })
                }
            </CCPanel>
            <CCPanel id="HandBookCourierRight" flowChildren="down" width="30%" height="100%">
                <CCCourierCard
                    key="sCourierSelected"
                    horizontalAlign="center"
                    sCourierName={sCourierSelected}
                    allowrotation={false}
                    showability={true} />
                <CCLabel className="CourierGetFrom" horizontalAlign="center" type="UnitName" text={`10场通关获取`} hittest={false} />
                <CCPanel flowChildren="down" width="100%" marginTop={"20px"}>
                    <CCLabel horizontalAlign="center" type="UnitName" text={`信使收藏进度`} hittest={false} />
                    {
                        ["B", "A", "S"].map((sRarity, index) => {
                            const maxexp = allCourierinfo[sRarity]?.length || 0;
                            const exp = allUnLockedCourierinfo[sRarity]?.length || 0;
                            return (<CCPanel key={"sRarity" + index} flowChildren="right" marginTop={"10px"} horizontalAlign="center">
                                <CCLabel type="UnitName" text={`${sRarity}信使：`} color={CSSHelper.GetRarityColor(sRarity)} hittest={false} />
                                <ProgressBar className="CourierProgressBar" value={exp / maxexp} >
                                    <CCLabel horizontalAlign="center" text={`${exp}/${maxexp}`} hittest={false} />
                                </ProgressBar>
                            </CCPanel>)
                        })
                    }


                </CCPanel>


            </CCPanel>


        </Panel>
    }
}