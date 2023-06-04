import React from "react";
import { DrawConfig } from "../../../../scripts/tscripts/shared/DrawConfig";
import { ERoundBoard } from "../../game/components/Round/ERoundBoard";
import { FuncHelper } from "../../helper/FuncHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCCircleAbilityItem } from "../AllUIElement/CCAbility/CCCircleAbilityItem";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCIconButton } from "../AllUIElement/CCButton/CCIconButton";
import { CCEconItemImage } from "../AllUIElement/CCEconItem/CCEconItemImage";
import { CCIcon_BattleScore } from "../AllUIElement/CCIcons/CCIcon_BattleScore";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCIcon_Star } from "../AllUIElement/CCIcons/CCIcon_Star";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCLevelxp } from "../AllUIElement/CCLevelxp/CCLevelxp";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCPanelBG } from "../AllUIElement/CCPanel/CCPanelPart";
import { CCUnitSmallIcon } from "../AllUIElement/CCUnit/CCUnitSmallIcon";
import { CCUserName } from "../AllUIElement/CCUserName/CCUserName";
import { CCCombinationIcon } from "../Combination/CCCombinationIcon";
import { CCCombinationInfoDialog } from "../Combination/CCCombinationInfoDialog";
import "./CCDrawEnemyPanel.less";
interface ICCDrawEnemyPanel {
    cards: ICCDrawEnemyInfoItem[];
}


export class CCDrawEnemyPanel extends CCPanel<ICCDrawEnemyPanel> {

    onStartUI() {
        this.__root__.current!.AddClass("PopUpEffect");
        let lefttime = DrawConfig.DrawEnemyWaitingTime - 5;
        GTimerHelper.AddTimer(1, GHandler.create(this, () => {
            if (this.IsClosed) { return }
            lefttime--;
            if (lefttime > 0) {
                this.UpdateState({ gametime: lefttime.toFixed(0) });
                return 1
            }
            else {
                const EnemySelection = this.props.cards!;
                const index = FuncHelper.Random.RandomInt(0, EnemySelection.length - 1)
                this.onSelectEnemy(index, EnemySelection[index].SteamAccountId);
            }
        }))
    }

    onSelectEnemy(index: number, accountid?: string) {
        NetHelper.SendToLua(DrawConfig.EProtocol.DrawEnemySelected, {
            index: index,
            itemName: accountid
        });
        this.close();
    }

    render() {
        const roundindex = ERoundBoard.CurRoundBoard.config.roundIndex;
        const EnemySelection = this.props.cards!;
        const score = ERoundBoard.CurRoundBoard.config.rankScore;
        const gametime = this.GetState<number>("gametime") || (DrawConfig.DrawEnemyWaitingTime - 5);
        return (<Panel ref={this.__root__} className="CCDrawEnemyPanel" hittest={false} {...this.initRootAttrs()}>
            <CCPanelBG type="Tui3">
                <CCPanel flowChildren="down" margin="20px 20px">
                    <CCLabel className="EnemyTitle" text={`Round ${roundindex}    选择对手`} />
                    <CCPanel flowChildren="right" horizontalAlign="center">
                        {EnemySelection.map((Info, index) => {
                            const accountid = Info.SteamAccountId;
                            return (
                                <CCIconButton key={index + ""} className="EnemyContainer" onactivate={() => this.onSelectEnemy(index, accountid)}>
                                    <CCDrawEnemyInfoItem {...Info as any} />
                                </CCIconButton>
                            );
                        })}
                    </CCPanel>
                    <CCPanel flowChildren="down" horizontalAlign="center">
                        <CCLabel type="UnitName" text={`选择一位对手进行战斗,${gametime}秒后自动选择`} horizontalAlign="center" marginTop={"10px"} color="white" />
                        <CCLabel type="UnitName" text={`本轮奖惩天梯分数：${score}点`} horizontalAlign="center" marginTop={"10px"} color="white" />

                        {/* <EOM_Button color="Blue" text={"刷新"} onactivate={() => onActive(undefined, 1)} /> */}
                        {/* <CCButton color="Blue" text={"刷新"} onactivate={() => this.onSelectEnemy(-1)} tooltip="#Tooltip_EnemyRandom" /> */}
                    </CCPanel>
                </CCPanel>

            </CCPanelBG>
        </Panel>)
    }
}

interface ICCDrawEnemyInfoItem extends ITBattleTeamRecord {
}

export class CCDrawEnemyInfoItem extends CCPanel<ICCDrawEnemyInfoItem> {

    render() {
        const accountid = this.props.SteamAccountId;
        const playername = this.props.SteamAccountName
        const score = this.props.Score
        const BattleWinCount = this.props.BattleWinCount!;
        const BattleLoseCount = this.props.BattleLoseCount!;
        const BattleDrawCount = this.props.BattleDrawCount!;
        const sectInfo = FuncHelper.toArray<string>(this.props.SectInfo!);
        const heroInfo = FuncHelper.toArray<IBattleUnitInfoItem>(this.props.UnitInfo!);
        return (<Panel ref={this.__root__} className="CCDrawEnemyInfoItem" hittest={false} {...this.initRootAttrs()}>
            <CCPanelBG type="Tui3" flowChildren="down">
                <CCPanel flowChildren="right" horizontalAlign="center">
                    <CCAvatar id="PlayerAvatar" width="48px" height="48px" accountid={accountid} />
                    <CCPanel flowChildren="down" marginLeft={"5px"}>
                        <CCUserName width="80px" height="24px" fontSize={"16"} accountid={accountid} hittest={false} />
                        <CCLabel type="UnitName" text={"天梯:1002"} hittest={false} />
                    </CCPanel>

                </CCPanel>
                <CCPanel className="BattleTeamDiv" flowChildren="down" >
                    <CCPanel flowChildren="right" marginTop={"5px"} >
                        <CCLabel text={"统计:"} verticalAlign="center" />
                        <CCPanel flowChildren="right" marginLeft={"10px"} verticalAlign="center" tooltip="战斗力">
                            <CCIcon_BattleScore hittest={false} />
                            <CCLabel type="UnitName" text={":" + score} fontSize="25px" verticalAlign="center" hittest={false} />
                        </CCPanel>
                        <CCPanel flowChildren="right" marginLeft={"20px"} verticalAlign="center" tooltip="人口">
                            <CCIcon_CoinType cointype={GEEnum.EMoneyType.Population} hittest={false} />
                            <CCLabel type="UnitName" text={"x" + heroInfo.length} fontSize="25px" verticalAlign="center" hittest={false} />
                        </CCPanel>
                        <CCPanel flowChildren="down" marginLeft={"20px"} tooltip="历史对战记录">
                            <CCLabel type="UnitName" text={"胜负平"} fontSize="14px" hittest={false} />
                            <CCLabel type="Level" text={`${BattleWinCount}/${BattleLoseCount}/${BattleDrawCount}`} hittest={false} />
                        </CCPanel>
                    </CCPanel>
                    <CCPanel flowChildren="right" marginTop={"5px"}>
                        <CCLabel text={"流派:"} verticalAlign="center" />
                        <CCPanel flowChildren="right">
                            {sectInfo.map((sectstr, index) => {
                                const _sectstr = sectstr.split("|");
                                const sectName = _sectstr[0];
                                return <CCCombinationIcon key={index + ""} uiScale={"60% 60% 60%"} marginLeft={"3px"} sectName={sectName} count={GToNumber(_sectstr[1])} dialogTooltip={
                                    {
                                        cls: CCCombinationInfoDialog,
                                        props: {
                                            showBg: true,
                                            sectName: sectName,
                                            showSectName: true,
                                        }
                                    }
                                } />
                            })}
                        </CCPanel>
                    </CCPanel>
                    <CCPanel flowChildren="down" marginTop={"10px"} scroll={"y"}>
                        {heroInfo.map((info, index) => {
                            return <CCDrawHeroInfoItem key={index + ""} {...info} marginTop={"5px"} />
                        })}
                    </CCPanel>
                </CCPanel>

            </CCPanelBG>
        </Panel>)
    }
}

interface ICCDrawHeroInfoItem extends IBattleUnitInfoItem {
}

export class CCDrawHeroInfoItem extends CCPanel<ICCDrawHeroInfoItem> {

    render() {
        const unitname = this.props.UnitName;
        const level = this.props.Level!;
        const localname = Entities.GetLocalizeUnitName(this.props.UnitName);
        const star = this.props.Star! || 1;
        const WearBundleId = this.props.WearBundleId!;
        const equip = FuncHelper.toArray<string>(this.props.EquipInfo!).filter(v => v != "") || [];
        const buffs = FuncHelper.toArray<string>(this.props.Buffs!).filter(v => v != "") || {};
        return (<Panel ref={this.__root__} className="CCDrawHeroInfoItem" hittest={false} {...this.initRootAttrs()}>
            <CCPanel flowChildren="down" >
                <CCPanel flowChildren="right" >
                    <CCLevelxp level={level} verticalAlign="center" width="30px" height="30px" tooltip="熟练度等级" />
                    <CCUnitSmallIcon itemname={unitname} />
                    <CCPanel flowChildren="down">
                        <CCPanel flowChildren="right">
                            {[...Array(star)].map((_, index) => {
                                return <CCIcon_Star width="23px" height="23px" key={index + ""} type={"Filled"} />
                            })}
                        </CCPanel>
                        <CCLabel type="UnitName" width="80px" fontSize="16px" verticalAlign="center" text={localname} />
                    </CCPanel>
                    {
                        WearBundleId != null && WearBundleId != "" && <CCEconItemImage itemdef={WearBundleId} showName={true} />
                    }
                    <CCPanel flowChildren="right">
                        {(buffs).map((buffname, index) => {
                            const buffInfo = buffname.split("|");
                            return <CCCircleAbilityItem key={index + ""} itemname={buffInfo[0]}   >
                                <CCLabel type="UnitName" align="center center" text={buffInfo[1]} />
                            </CCCircleAbilityItem>
                        })}
                    </CCPanel>
                    {
                        equip.length <= 3 && <CCPanel flowChildren="right" verticalAlign="center">
                            {
                                equip.map((itemname, index) => {
                                    return <CCItemImage key={index + ""} width="44px" height="32px" marginLeft={"3px"} itemname={itemname} showtooltip={true} />
                                })}
                        </CCPanel>
                    }
                    {
                        equip.length > 3 && <CCPanel flowChildren="right-wrap" verticalAlign="center" >
                            {
                                equip.map((itemname, index) => {
                                    return <CCItemImage key={index + ""} width="33px" height="22px" marginLeft={"3px"} itemname={itemname} showtooltip={true} />
                                })}
                        </CCPanel>
                    }
                </CCPanel>

            </CCPanel>
        </Panel>)
    }
}