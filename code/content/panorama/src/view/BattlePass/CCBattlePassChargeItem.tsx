import React from "react";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { TBattlePassTaskItem } from "../../../../scripts/tscripts/shared/service/battlepass/TBattlePassTaskItem";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCShopItem } from "../Shop/CCShopItem";
import "./CCBattlePassChargeItem.less";
import { CCBPTimerAndLevelItem } from "./CCBattlePassPrizeItem";
interface ICCBattlePassChargeItem extends NodePropsData {

}

export class CCBattlePassChargeItem extends CCPanel<ICCBattlePassChargeItem> {

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter.BattlePassComp)
    }




    render() {
        const BattlePassComp = GGameScene.Local.TCharacter.BattlePassComp!;
        const BagComp = GGameScene.Local.TCharacter.BagComp!;
        const chargebyCount = BagComp.getItemCount(BattlePassComp.ChargeItemConfigId + "");
        const SeasonConfigId = BattlePassComp.SeasonConfigId;
        const allConfig = GJSONConfig.BattlePassChargeConfig.getDataList().filter(v => v.SeasonId == SeasonConfigId);
        const allSkin = allConfig.filter(v => !v.IsCourier);
        const allCourier = allConfig.filter(v => v.IsCourier);
        allSkin.sort((a, b) => { return a.ChargeTo.ItemConfigId - b.ChargeTo.ItemConfigId })
        allCourier.sort((a, b) => { return a.ChargeTo.ItemConfigId - b.ChargeTo.ItemConfigId })
        return (<Panel className="CCBattlePassChargeItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCPanel flowChildren="right" horizontalAlign="center" height="120px" >
                <CCPanel width="200px" flowChildren="down" verticalAlign="center" >
                    <CCLabel text={"第10赛季"} type="Title" fontSize="20px" horizontalAlign="center" />
                    <CCLabel text={"战令通行证"} type="UnitName" fontSize="30px" horizontalAlign="center" />
                </CCPanel>
                <CCBPTimerAndLevelItem marginLeft="10px" verticalAlign="center" />
                <CCBpChargeCoinItem chargebyCount={chargebyCount} marginLeft="20px" verticalAlign="center" />
            </CCPanel>
            <CCPanel flowChildren="right" width="100%" height="800px" >
                <CCPanel id="CourierChargeMain">
                    <Panel id="CourierChargeTitle" className="TaskTypeTitle" hittest={false}>
                        <Label className="TaskType" localizedText="#lang_hud_bp_charge_courier" />
                        <Countdown endTime={GToNumber(BattlePassComp.SeasonEndTimeSpan)}>
                            <Label className="TaskRefreshTime" localizedText="#lang_hud_bp_task_refresh_time" />
                        </Countdown>
                    </Panel>
                    <CCPanel id="CourierChargeList" scroll={"y"}>
                        {allCourier.map((v, index) => {
                            return <CCBpChargeItem key={index + ""} configId={v.id} marginLeft={"10px"} marginTop={"5px"} chargebyCount={chargebyCount} />
                        })}
                    </CCPanel>
                </CCPanel>
                <CCPanel id="SkinChargeMain">
                    <Panel id="SkinChargeTitle" className="TaskTypeTitle" hittest={false}>
                        <Label className="TaskType" localizedText="#lang_hud_bp_charge_skin" />
                        <Countdown endTime={GToNumber(BattlePassComp.SeasonEndTimeSpan)}>
                            <Label className="TaskRefreshTime" localizedText="#lang_hud_bp_task_refresh_time" />
                        </Countdown>
                    </Panel>
                    <CCPanel id="SkinChargeList" scroll={"y"}>
                        {allSkin.map((v, index) => {
                            return <CCBpChargeItem key={index + ""} configId={v.id} marginLeft={"10px"} marginTop={"5px"} chargebyCount={chargebyCount} />
                        })}
                    </CCPanel>
                </CCPanel>
            </CCPanel>


        </Panel>)
    }
}

export class CCBpChargeCoinItem extends CCPanel<{ chargebyCount: number }> {


    render() {
        const chargebyCount = this.props.chargebyCount;

        return <Panel className={"CCBpChargeCoinItem"} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <Image id="BPCourierVoucherIcon" />
            <Label id="BPCourierVoucherCount" text={"x" + chargebyCount} />
        </Panel>
    }
}



export class CCBpChargeItem extends CCPanel<{ configId: number, chargebyCount: number }> {

    OnBtnChargeGet(entity: TBattlePassTaskItem) {
        if (!entity.IsAchieve) {
            TipsHelper.showErrorMessage("任务尚未完成");
            return;
        }
        if (entity.IsPrizeGet) {
            TipsHelper.showErrorMessage("奖励已领取");
            return;
        }
        const configId = this.props.configId;
        NetHelper.SendToCSharp(GameProtocol.Protocol.BattlePass_ChargePrize, {
            ConfigId: configId
        })
    }

    render() {
        const configId = this.props.configId;
        const chargebyCount = this.props.chargebyCount;
        const config = GJSONConfig.BattlePassChargeConfig.get(configId)!;
        const ItemCount = config.ChargeBy.ItemCount;

        return <Panel className={"CCBpChargeItem"} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCButtonBox uiScale={"60%"} onactivate={() => { }}>
                <CCShopItem itemid={config.ChargeTo.ItemConfigId} count={config.ChargeTo.ItemCount} isUnAvailable={chargebyCount < ItemCount}>
                    <CCBpChargeCoinItem chargebyCount={ItemCount} align="center bottom" marginBottom={"3px"} />
                </CCShopItem>
            </CCButtonBox>
        </Panel>
    }
}