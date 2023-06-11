import React from "react";

import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCButtonBox } from "../AllUIElement/CCButton/CCButtonBox";
import { CCIcon_BattlepassLogo } from "../AllUIElement/CCIcons/CCIcon_BattlepassLogo";
import { CCIcon_Check } from "../AllUIElement/CCIcons/CCIcon_Check";
import { CCIcon_Point } from "../AllUIElement/CCIcons/CCIcon_Point";
import { CCIcon_Vip } from "../AllUIElement/CCIcons/CCIcon_Vip";
import { CCImageNumber } from "../AllUIElement/CCImageNumber/CCImageNumber";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCShopItem } from "../Shop/CCShopItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import "./CCRecordMainItem.less";
interface ICCRecordMainItem extends NodePropsData {

}

export class CCRecordMainItem extends CCPanel<ICCRecordMainItem> {

    onInitUI() {
        this.ListenUpdate(GGameScene.Local.TCharacter)
        this.ListenUpdate(GGameScene.Local.TCharacter.BattlePassComp)
    }

    OnBtnOnlyKeyPrizeGet() {
        NetHelper.SendToCSharp(GameProtocol.Protocol.InfoPass_GetInfoPassPrize, {
            PrizeLevel: 0,
            IsOnlyKey: true,
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo;
                CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
                    Items: [
                        { ItemConfigId: info.ItemConfigId, ItemCount: info.ItemCount },
                    ]
                })
            }
        }))
    }

    OnBtnVipGet(IsVip: boolean) {

    }
    OnBtnBattlePassGet() {

    }
    render() {
        const tCharacter = GGameScene.Local.TCharacter!;
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!)!;
        const IsVip = tCharacter.IsVip();
        const IsVipSeason = tCharacter.IsVipSeason();
        const IsVipForever = tCharacter.IsVipForever();
        const IsBattlePass = BattlePassComp.IsBattlePass;
        const SumHeroLevel = HeroManageComp.SumHeroLevel;
        const HeroLevelPrizeGet = HeroManageComp.HeroLevelPrizeGet;
        const allConfig = GJSONConfig.InfoPassLevelUpConfig.getDataList();
        allConfig.sort((a, b) => { return a.id - b.id })
        let hasPrize = false;
        for (let info of allConfig) {
            if (info.id < SumHeroLevel && !HeroLevelPrizeGet.includes(info.id)) {
                hasPrize = true;
                break
            }
        }
        return (<Panel className="CCRecordMainItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>

            <CCPanel flowChildren="right" width="100%" marginTop={"10px"}>
                <CCPanel flowChildren="down" width="200px">
                    <CCPanelHeader type="Tui7" localizedStr="#档案等级" />
                    <CCLabel type="UnitName" localizedText="#InfoPassLevelDesc" fontSize="16px" horizontalAlign="center" />
                    <CCRecordLevelNum iLevel={SumHeroLevel} uiScale={"250%"} horizontalAlign="center" marginTop={"50px"} />
                    <CCButton color="Green" marginTop={"20px"} onactivate={() => {
                        if (!hasPrize) { return }
                        this.OnBtnOnlyKeyPrizeGet()
                    }} text={"一键领取"} horizontalAlign="center" />
                </CCPanel>
                <CCPanel flowChildren="right" width="100%" scroll={"x"} marginTop={"20px"}>
                    {
                        allConfig.map((v, index) => {
                            const InfoPassLevel = v.id;
                            return <CCRecordLevelRewards key={index + ""} iLevel={InfoPassLevel} widthPect={
                                SumHeroLevel > InfoPassLevel ? 100 : (SumHeroLevel == InfoPassLevel ? 50 : 0)
                            } info={{
                                ItemConfigId: v.TaskComPrize.ItemConfigId,
                                ItemCount: v.TaskComPrize.ItemCount,
                                check: HeroLevelPrizeGet.includes(InfoPassLevel),
                                gray: SumHeroLevel < InfoPassLevel,
                            }} />
                        })
                    }
                </CCPanel>
            </CCPanel>
            <CCPanel flowChildren="right" width="100%" marginTop={"10px"}>
                <CCPanel flowChildren="down" width="400px" height="300px">
                    <CCPanelHeader type="Tui7" localizedStr="#档案信息" />
                    <CCPanel flowChildren="right" >
                        <CCPanel flowChildren="down" width="150px" height="250px">
                            <CCAvatar id="CCRecordAvatar" steamid="local" horizontalAlign="center" marginTop={"20px"} />
                            <CCUserName accountid={tCharacter.Name} fontSize={"30px"} marginLeft={"10px"} width="100%" marginTop={"20px"} height="50px" />
                        </CCPanel>
                        <CCPanel flowChildren="down" width="250px" marginTop={"30px"}>
                            <Panel className='RecordInfoBox'>
                                <CCIcon_Point type="Full" width="20px" height="20px" />
                                <Label id='Record_Time' html={true} localizedText={"#Record_Time"} dialogVariables={{ hrs: '999' }} />
                            </Panel>
                            <Panel className='RecordInfoBox'>
                                <CCIcon_Point type="Full" width="20px" height="20px" />
                                <Label id='Record_Difficulty' html={true} localizedText={"#Record_Difficulty"} dialogVariables={{ diff: 1 }} />
                            </Panel>
                            {/* <Panel className='RecordInfoBox'>
									<Label id='Record_HeroLevel' html={true} localizedText={"#Record_HeroLevel"} dialogVariables={{ ilevel: iLevel }} />
								</Panel> */}
                            <Panel className='RecordInfoBox'>
                                <CCIcon_Point type="Full" width="20px" height="20px" />
                                <Label id='Record_CourierProgress' html={true} localizedText={"#Record_CourierProgress"} dialogVariables={{ unlock: 1, lock: 20 }} />
                            </Panel>
                            {/* <Panel className='RecordInfoBox'>
									<Label id='Record_ArtifactProgress' html={true} localizedText={"#Record_ArtifactProgress"} dialogVariables={{ unlock: '3', lock: '333' }} />
								</Panel>
								<Panel className='RecordInfoBox'>
									<Label id='Record_ItemProgress' html={true} localizedText={"#Record_ItemProgress"} dialogVariables={{ unlock: '322', lock: '5556' }} />
								</Panel> */}
                            {/* <Panel className='RecordInfoBox'>
									<Label id='Record_pppProgress' html={true} localizedText={"#Record_pppProgress"} dialogVariables={{ unlock: '0', lock: '1' }} />
								</Panel> */}
                        </CCPanel>
                    </CCPanel>

                </CCPanel>
                <CCPanel flowChildren="down" width="300px" height="300px" marginLeft={"30px"}>
                    <CCPanelHeader type="Tui7" localizedStr="#会员" />
                    <CCIcon_Vip id="RecordVipIcon" type={IsVipForever ? "Gold" : (IsVipSeason ? "Purple" : "Blue")} className={CSSHelper.ClassMaker({ IsVip: IsVip })} horizontalAlign="center" />
                    <CCPanel marginTop={"20px"} horizontalAlign="center">
                        {IsVipForever ? <CCLabel type="Title" localizedText={"#永久会员"} fontSize="16px" />
                            : <Countdown id="BPCountDown" endTime={GToNumber(BattlePassComp.SeasonEndTimeSpan)}>
                                <CCLabel localizedText="#lang_hud_bp_deadline" fontSize="16px" />
                            </Countdown>
                        }
                    </CCPanel>
                    <CCButton text={IsVip ? "开通永久会员" : "开通会员"} marginTop={"20px"} onactivate={() => {
                        if (IsVipForever) { return }
                        this.OnBtnVipGet(IsVip)
                    }} color={IsVip ? "Purple" : "Blue"} horizontalAlign="center" visible={!IsVipForever} />
                </CCPanel>
                <CCPanel flowChildren="down" width="300px" height="300px" marginLeft={"30px"}>
                    <CCPanelHeader type="Tui7" localizedStr="#战令通行证" />
                    <CCIcon_BattlepassLogo id="RecordBattlePassIcon" type={IsBattlePass ? "Plus" : "Common"} />
                    <CCPanel marginTop={"20px"} horizontalAlign="center">
                        {!IsBattlePass ? <CCLabel type="Title" localizedText={"#第10赛季 普通战令"} fontSize="16px" />
                            : <Countdown id="BPCountDown" endTime={GToNumber(BattlePassComp.SeasonEndTimeSpan)}>
                                <CCLabel localizedText="#lang_hud_bp_deadline" fontSize="16px" />
                            </Countdown>
                        }
                    </CCPanel>
                    <CCButton color="Green" marginTop={"20px"} onactivate={() => {
                        if (IsBattlePass) { return }
                        this.OnBtnBattlePassGet()
                    }} width="200px" horizontalAlign="center" flowChildren="right">
                        <CCLabel type="UnitName" text={"启用高级战令"} verticalAlign="center" marginLeft={"15px"} />
                        <CCIcon_BattlepassLogo visible={!IsBattlePass} type="Plus" width="40px" height="40px" verticalAlign="center" />
                    </CCButton>
                </CCPanel>
            </CCPanel>
        </Panel>)
    }
}

export class CCRecordLevelNum extends CCPanel<{ iLevel: number, isUnActive?: boolean }> {
    render() {
        const iLevel = this.props.iLevel;
        const isUnActive = this.props.isUnActive || false;
        return <Panel className={CSSHelper.ClassMaker("CCRecordLevelNum", { isUnActive: isUnActive })} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCImageNumber type="9" value={Math.floor(iLevel)} align="center center" uiScale={iLevel >= 1000 ? "70%" : (iLevel >= 100 ? "90%" : "110%")} />
        </Panel>
    }
}

interface IRewardInfo extends IFItemInfo {
    check: boolean,
    gray: boolean,
}
interface ICCRecordLevelRewards {
    iLevel: number, info?: IRewardInfo, widthPect?: 0 | 50 | 100,
}

export class CCRecordLevelRewards extends CCPanel<ICCRecordLevelRewards> {


    onGetPrize() {
        const iLevel = this.props.iLevel;
        NetHelper.SendToCSharp(GameProtocol.Protocol.InfoPass_GetInfoPassPrize, {
            PrizeLevel: iLevel,
            IsOnlyKey: false,
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                let info = JSON.parse(e.message!) as IFItemInfo;
                CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
                    Items: [
                        { ItemConfigId: info.ItemConfigId, ItemCount: info.ItemCount },
                    ]
                })
            }
        }))

    }


    render() {
        const info = this.props.info;
        const widthPect = this.props.widthPect || 0;
        const iLevel = this.props.iLevel;
        return (<Panel className="CCRecordLevelRewards" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            {info && <CCButtonBox onactivate={() => {
                if (info.check) { return }
                if (info.gray) { return }
                this.onGetPrize();
            }}>
                <CCShopItem id="FreeItem" hittest={false} isUnAvailable={info.gray} itemid={info.ItemConfigId} count={info.ItemCount} >
                    {info.check && <CCIcon_Check align="right bottom" width="60px" height="60px" marginRight={"20px"} marginBottom={"20px"} />}
                </CCShopItem>
            </CCButtonBox>

            }
            <CCPanel height="100px" width="100%" >
                <Panel id="BPListProgressBar" hittest={false}>
                    <Panel id="BPListProgressBarCenter" hittest={false} />
                </Panel>
                <CCPanel className="BPListProgressBarLeft" width={widthPect + "%"} hittest={false} />
                <CCRecordLevelNum id={`BPLevel${iLevel}`} iLevel={iLevel} align="center center" />
            </CCPanel>

        </Panel>
        )
    }
}

