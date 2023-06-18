
import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { ERoundBoardResultRecord } from "../../../../scripts/tscripts/shared/rules/Round/ERoundBoardResultRecord";
import { THeroUnit } from "../../../../scripts/tscripts/shared/service/hero/THeroUnit";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCIcon_BattlepassLogo } from "../AllUIElement/CCIcons/CCIcon_BattlepassLogo";
import { CCIcon_Vip } from "../AllUIElement/CCIcons/CCIcon_Vip";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCLevelxp } from "../AllUIElement/CCLevelxp/CCLevelxp";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelHeader } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCPopupBG } from "../AllUIElement/CCPopUpDialog/CCPopUpDialog";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import { CCRankProgressItem } from "../Rank/CCRankProgressItem";
import { CCRecordLevelNum } from "../Record/CCRecordMainItem";
import { CCStorageIconItem } from "../Storage/CCStorageIconItem";
import "./CCPlayerEndPanel.less";
interface ICCPlayerEndPanel extends NodePropsData {
}

export class CCPlayerEndPanel extends CCPanel<ICCPlayerEndPanel> {

    onInitUI() {
        NetHelper.ListenOnLua(GameProtocol.Protocol.push_PlayerGameEnd, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            const data = e.data;
            this.UpdateState({ PopUpEffect: true, })
        }))
    }



    render() {
        const difficultydes = GGameScene.GameServiceSystem.getDifficultyChapterDes();
        const round = ERoundBoard.CurRoundBoard || { config: { roundIndex: 1 } };
        const HeroManageComp = (GGameScene.Local.TCharacter.HeroManageComp!);
        const PopUpEffect = this.GetState<boolean>("PopUpEffect") || true;
        const tCharacter = GGameScene.Local.TCharacter!;
        const BattlePassComp = (GGameScene.Local.TCharacter.BattlePassComp!)!;
        const IsVip = tCharacter.IsVip();
        const IsVipSeason = tCharacter.IsVipSeason();
        const IsVipForever = tCharacter.IsVipForever();
        const IsBattlePass = BattlePassComp.IsBattlePass;
        const SumHeroLevel = HeroManageComp.SumHeroLevel;

        const RankComp = GGameScene.Local.TCharacter.RankComp!;
        const selfdata0 = RankComp.GetRankData(GameProtocol.ERankType.SeasonBattleSorceRank)!;
        const tBattleRecords = ERoundBoardResultRecord.GetGroupInstance(GGameScene.Local.BelongPlayerid);
        let scorechange = 0;
        let wincount = 0;
        let losecount = 0;
        let drawcount = 0;
        const heroExps: { [unitname: string]: number } = {};
        const prizeItems: { [itemconfigid: string]: number } = {};
        tBattleRecords.forEach(v => {
            if (v.heroExps) {
                for (let heroname in v.heroExps) {
                    heroExps[heroname] = heroExps[heroname] || 0;
                    heroExps[heroname] += v.heroExps[heroname];
                }
            }
            if (v.prizeItems) {
                for (let itemconfigid in v.prizeItems) {
                    prizeItems[itemconfigid] = prizeItems[itemconfigid] || 0;
                    prizeItems[itemconfigid] += v.prizeItems[itemconfigid];
                }
            }
            scorechange += v.iBattleScoreChange;
            if (v.isWin == 1) {
                wincount++;
            }
            else if (v.isWin == 0) {
                drawcount++
            }
            else if (v.isWin == -1) {
                losecount++;
            }
        })
        return (<Panel className={CSSHelper.ClassMaker("CCPlayerEndPanel", { PopUpEffect: PopUpEffect })} ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCPopupBG type="Tui7" hasTitle={false} />
            <CCPanel flowChildren="down" width="100%" height="100%">
                <CCLabel type="Title" text={"你已阵亡···"} color="Red" fontSize="40px" horizontalAlign="center" marginTop={"40px"} />
                <CCPanel flowChildren="right" width="100%" marginTop={"10px"} visible={false}>
                    <CCPanel flowChildren="down" width="400px" height="300px">
                        <CCPanelHeader type="Tui7" localizedStr="#档案信息" />
                        <CCPanel flowChildren="right" >
                            <CCPanel flowChildren="down" width="150px" height="250px">
                                <CCAvatar id="CCRecordAvatar" steamid="local" horizontalAlign="center" marginTop={"20px"} />
                                <CCUserName accountid={tCharacter.Name} fontSize={"30px"} marginLeft={"10px"} width="100%" marginTop={"20px"} height="50px" />
                            </CCPanel>
                            <CCPanel flowChildren="down" width="250px" marginTop={"30px"}>
                                <CCRecordLevelNum iLevel={SumHeroLevel} uiScale={"250%"} horizontalAlign="center" marginTop={"50px"} />
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
                            // this.OnBtnVipGet(IsVip)
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
                            // this.OnBtnBattlePassGet()
                        }} width="200px" horizontalAlign="center" flowChildren="right">
                            <CCLabel type="UnitName" text={"启用高级战令"} verticalAlign="center" marginLeft={"15px"} />
                            <CCIcon_BattlepassLogo visible={!IsBattlePass} type="Plus" width="40px" height="40px" verticalAlign="center" />
                        </CCButton>
                    </CCPanel>
                </CCPanel>
                <CCPanel flowChildren="right" horizontalAlign="center">
                    <CCPanel flowChildren="down" width="150px" height="250px">
                        <CCAvatar id="CCRecordAvatar" steamid="local" horizontalAlign="center" />
                        <CCUserName accountid={tCharacter.Name} fontSize={"30px"} marginLeft={"10px"} width="100%" marginTop={"20px"} height="50px" />
                    </CCPanel>
                    <CCPanel flowChildren="down" height="250px">
                        <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                            <CCLabel text={`游戏用时：`} verticalAlign="center" fontSize="20px" type="Title" />
                            <CCLabel text={`${selfdata0.Score}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                        </CCPanel>
                        <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                            <CCLabel text={`挑战难度：`} verticalAlign="center" fontSize="20px" type="Title" />
                            <CCLabel text={`${difficultydes}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                            <CCLabel text={`回合：`} marginLeft={"5px"} verticalAlign="center" fontSize="20px" type="Title" />
                            <CCLabel text={`${"Round " + round.config.roundIndex}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                        </CCPanel>
                        <CCPanel id="BattleRecordTongJi" flowChildren="right" hittest={false} marginTop={"5px"}>
                            <CCLabel text={`胜负平：`} marginLeft={"5px"} verticalAlign="center" fontSize="20px" type="Title" />
                            <CCLabel text={`${wincount}/${losecount}/${drawcount}`} verticalAlign="center" fontSize="20px" type="UnitName" />
                            <CCLabel text={`本局获得积分：`} marginLeft={"5px"} verticalAlign="center" fontSize="20px" type="Title" />
                            <CCLabel text={`${scorechange > 0 ? "+" : ""}${scorechange}`} color={scorechange > 0 ? "Green" : "Red"} verticalAlign="center" fontSize="20px" type="UnitName" />
                        </CCPanel>
                        <CCRankProgressItem />
                    </CCPanel>

                </CCPanel>

                <CCPanel flowChildren="right" horizontalAlign="center">
                    {

                        Object.keys(prizeItems).length > 0 && < CCLabel type="Title" text={"道具随机奖励："} fontSize="20px" verticalAlign="center" />
                    }
                    <CCPanel flowChildren="right">
                        {
                            Object.keys(prizeItems).map((ItemConfigId, index) => {
                                const ItemCount = heroExps[ItemConfigId];
                                if (ItemConfigId && ItemCount) {
                                    return <CCStorageIconItem key={index + ""} itemid={ItemConfigId} count={ItemCount} />
                                }
                            })
                        }
                    </CCPanel>
                </CCPanel>
                <CCPanel flowChildren="down" horizontalAlign="center">
                    {
                        Object.keys(heroExps).length > 0 && <CCPanelHeader type="Tui7" localizedStr="#英雄熟练度" horizontalAlign="center" fontSize="30px" width="400px" />
                    }
                    <CCPanel flowChildren="right-wrap" width="600px" scroll={"y"}>
                        {
                            Object.keys(heroExps).map((unitname, index) => {
                                const exp = heroExps[unitname];
                                const herounit = HeroManageComp.GetHeroUnit(unitname)!;
                                return <CCHeroExpProgressItem key={index + ""} entity={herounit} addexp={exp} />
                            })
                        }

                    </CCPanel>
                </CCPanel>
                <CCPanel flowChildren="right" horizontalAlign="center">
                    <CCButton color="Gold" text={"继续观战"} horizontalAlign="center" onactivate={(pSelf) => {
                        this.hide();
                    }} />
                    <CCButton color="Purple" marginLeft={"100px"} text={"离开游戏"} horizontalAlign="center" onactivate={(pSelf) => {
                        $.DispatchEvent("DOTAHUDShowDashboard", pSelf);
                    }} />
                </CCPanel>

            </CCPanel>
            {this.props.children}
            {this.__root___childs}
        </Panel >)
    };
}


export class CCHeroExpProgressItem extends CCPanel<{ entity: THeroUnit, addexp: number }> {
    render() {
        const herounit = this.props.entity;
        const addexp = this.props.addexp;
        const unitname = herounit.ConfigId;
        const rarity = Entities.GetUnitRarity(unitname);
        const localname = Entities.GetLocalizeUnitName(unitname);
        const maxexp = GJSONConfig.BuildingLevelUpExpConfig.get(herounit.Level + 1)!.Exp;
        return <Panel className="CCHeroExpProgressItem" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <CCUnitSmallIcon itemname={unitname} />
            <CCLabel type="Menu" width="80px" fontSize="18px" verticalAlign="center" text={localname} color={CSSHelper.GetRarityColor(rarity)} />
            <CCLevelxp level={herounit.Level} width="30px" height="30px" verticalAlign="center" />
            <ProgressBar className="CardLevelBar" value={herounit.Exp / maxexp} >
                <Label text={`${herounit.Exp}/${maxexp}`} hittest={false} />
            </ProgressBar>
            <CCLabel type="Menu" width="40px" fontSize="18px" verticalAlign="center" text={"+" + addexp} color={"Green"} />
        </Panel>
    }
}
