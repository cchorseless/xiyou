
import { render } from "@demon673/react-panorama";
import React, { createRef } from "react";
import { NotificationConfig } from "../../../../scripts/tscripts/shared/NotificationConfig";
import { PlayerConfig } from "../../../../scripts/tscripts/shared/PlayerConfig";
import { CSSHelper } from "../../helper/CSSHelper";
import { NetHelper } from "../../helper/NetHelper";
import { CCAvatar } from "../AllUIElement/CCAvatar/CCAvatar";
import { CCIcon_CoinType } from "../AllUIElement/CCIcons/CCIcon_CoinType";
import { CCItemImage } from "../AllUIElement/CCItem/CCItemImage";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCToastManager } from "../AllUIElement/CCTips/CCToastManager";
import { CCShopItemIcon } from "../Shop/CCShopItemIcon";
import "./CCNotificationPanel.less";

interface ICCNotificationPanel extends NodePropsData {

}

export class CCNotificationPanel extends CCPanel<ICCNotificationPanel> {

    onStartUI() {
        this.GetCombatToastManager();
        this.GetRightToastManager();
        /**监听推送信息 */
        NetHelper.ListenOnLua(NotificationConfig.EProtocol.push_notification_combat,
            GHandler.create(this, (event: CLIENT_DATA<INotificationConfig.INotificationData>) => {
                if (event.data != null) {
                    this.onNotificationCombat(event.data)
                }
            }));
    }


    CreateNotification(tParams: INotificationConfig.INotificationData, parent: Panel, id: string) {
        let localPlayerID = Players.GetLocalPlayer();
        let panel = $.CreatePanel("Panel", parent, id);
        let iPlayerID: PlayerID = null as any;
        let iPlayerID2: PlayerID = null as any;
        let dialogV: { [k: string]: any } = {};
        let itemInfo: { [k: string]: any } = {};
        let bCoin = false;
        if (tParams.player_id != null && typeof (tParams.player_id) == "number" && Players.IsValidPlayerID(tParams.player_id)) {
            dialogV["player_name"] = "<panel class='CCNotificationReRenderRoot CombatEventHeroPlayer_" + tParams.player_id + "' />";
            panel.SetHasClass("LocalPlayerInvolved", tParams.player_id == localPlayerID);
            iPlayerID = tParams.player_id;
            delete tParams.player_id;
        }
        if (tParams.player_id2 != null && typeof (tParams.player_id2) == "number") {
            panel.SetDialogVariable("player_name2", "<panel class='CCNotificationReRenderRoot CombatEventHeroPlayer_" + tParams.player_id2 + "' />");
            panel.SetHasClass("LocalPlayerInvolved", tParams.player_id2 == localPlayerID);
            iPlayerID2 = tParams.player_id2;
            delete tParams.player_id2;
        }
        if (tParams.teamnumber != null && typeof (tParams.teamnumber) == "number" && tParams.teamnumber != -1 as DOTATeam_t) {
            if (Players.GetTeam(localPlayerID) == tParams.teamnumber) {
                panel.SetHasClass("AllyEvent", true);
            }
            else {
                panel.SetHasClass("EnemyEvent", true);
            }
            delete tParams.teamnumber;
        }
        let sMessage = "";
        if (tParams.message != null) {
            for (let key in tParams) {
                let value = tParams[key];
                dialogV[key] = value;
                if (key.indexOf("string_") != -1) {
                    dialogV[key] = $.Localize(value[0] == "#" ? value : ("#" + value));
                }
                // 局内和局外物品图标
                else if (key.indexOf("item_get") != -1) {
                    let sItemClass = `NotificationItem_${key}`;
                    let sLoc = ` <panel class=\"CCNotificationReRenderRoot NotificationItem ${sItemClass}\" />`;
                    dialogV[key] = sLoc;
                    if ((value as string).includes("|")) {
                        let tInfo = (value as string).split("|");
                        if (tInfo.length == 2) {
                            itemInfo[sItemClass] = { itemname: tInfo[0], count: GToNumber(tInfo[1]) };
                        }
                        else if (tInfo.length == 3) {
                            itemInfo[sItemClass] = { itemname: tInfo[0], count: GToNumber(tInfo[1]), level: GToNumber(tInfo[2]) };
                        }
                    }
                    else {
                        itemInfo[sItemClass] = { itemname: value };
                    }
                }
                // 带coin的各种类型都在后面渲染一个货币图片
                else if (key.indexOf("coin_") != -1) {
                    let sLoc = `${value}<panel class=\"CCNotificationReRenderRoot ChatCoinParent ${key}\" />`;
                    dialogV[key] = sLoc;
                    bCoin = true;
                }
                // 带coin的各种类型都在后面渲染一个货币图片
                else if (key == "roundresult") {
                    let sLoc = `<panel class=\"CCNotificationReRenderRoot RoundResultParent ${value}\" />`;
                    dialogV[key] = sLoc;
                }
            }
            sMessage = tParams.message;
            if (sMessage[0] != "#") {
                sMessage = "#" + sMessage;
            }
        }
        render(<CCNotification str={sMessage} bCoin={bCoin} itemInfo={itemInfo} dialogV={dialogV} iPlayerID={iPlayerID} iPlayerID2={iPlayerID2} />, panel);
        return panel;
    }
    /**
     * 战斗消息
     * @param tParams 
     */
    onNotificationCombat(tParams: INotificationConfig.INotificationData) {
        let panel = this.CreateNotification(tParams, this.GetCombatToastManager(), "");
        this.GetCombatToastManager().QueueToast(panel);
    }

    // Right
    onRightNotification(tParams: INotificationConfig.INotificationData) {
        tParams.teamnumber = undefined;
        let panel = this.CreateNotification(tParams, this.GetRightToastManager(), "");
        this.GetRightToastManager().QueueToast(panel);
    }

    private CombatToastManager: ToastManager;
    GetCombatToastManager() {
        if (!this.CombatToastManager || !this.CombatToastManager.IsValid()) {
            this.CombatToastManager = this.__root__.current!.FindChildTraverse("CombatNotificationToastManager") as ToastManager;
        }
        return this.CombatToastManager;
    }
    private RightToastManager: ToastManager;
    GetRightToastManager() {
        if (!this.RightToastManager || !this.RightToastManager.IsValid()) {
            this.RightToastManager = this.__root__.current!.FindChildTraverse("RightNotificationContainer") as ToastManager;
        }
        return this.RightToastManager;
    }
    render() {
        return (
            <Panel className="CCNotificationPanel" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
                <Panel id="ToastManager" hittest={false}>
                </Panel>
                <Panel id="UpperNotificationContainer" hittest={false}>
                </Panel>
                <Panel id="CombatNotificationContainer" hittest={false}>
                    <Panel id="CombatNotificationLinesWrapper" hittest={false}>
                        <CCToastManager id="CombatNotificationToastManager" hittest={false} toastduration="10s" maxtoastsvisible={50} maxtoastbehavior="deleteoldest" preservefadedtoasts={true} delaytime={0} addtoaststohead={false} />
                    </Panel>
                </Panel>
                <CCToastManager id="RightNotificationContainer" hittest={false} toastduration="8.0s" maxtoastsvisible={3} />
                <Panel id="BottomNotificationContainer" hittest={false}>
                </Panel>
            </Panel>)
    }
}


export class CCCombatEventPlayerIconWithName extends CCPanel<{ iPlayerID: PlayerID }>{
    render() {
        const playerinfo = Game.GetPlayerInfo(this.props.iPlayerID);
        let sPlayerColor = PlayerConfig.GetPlayerColor(this.props.iPlayerID);
        const str = "<font color='" + sPlayerColor + "'>" + playerinfo.player_name + "</font>";
        return (
            <Panel className="CCNotificationImageRoot" ref={this.__root__} hittest={false} hittestchildren={false} {...this.initRootAttrs()}>
                <CCAvatar width="30px" height="30px" nocompendiumborder={true} steamid={playerinfo.player_steamid} hittest={false} hittestchildren={false} />
                <Label id="PlayerName" text={str} html={true} hittest={false} />
            </Panel>)
    }
}


export class CCCombatEventItemIconWithName extends CCPanel<{ itemname: string, iLevel?: number, iCount?: number }>{
    render() {
        const itemname = this.props.itemname;
        const icount = this.props.iCount || 1;
        const isshopitem = GJSONConfig.ItemConfig.getDataMap().has(itemname as any);
        const iLevel = this.props.iLevel || -1;
        const sitemColor = Abilities.GetAbilityColor(itemname);
        const itemlocname = Abilities.GetLocalizeAbilityName(itemname);
        let str = "<font color='" + sitemColor + "'>[" + itemlocname + (icount > 1 ? `]x${icount}` : "]") + "</font>";
        return (
            <Panel className="CCNotificationImageRoot" ref={this.__root__} hittest={false} hittestchildren={false}  {...this.initRootAttrs()}>
                {
                    isshopitem ? <CCShopItemIcon width="36px" height="30px" itemid={itemname} showtooltip={false} hittest={false} hittestchildren={false} />
                        : <CCItemImage width="36px" height="30px" itemname={itemname} iLevel={iLevel} showtooltip={false} hittest={false} hittestchildren={false} />

                }
                <Label id="ItemName" text={str} html={true} hittest={false} />
            </Panel>)
    }
}

export class CCCombatEventCoinIconWithName extends CCPanel<{ cointype: ICoinType; }>{
    render() {
        const cointype = this.props.cointype;
        const nodename = GEEnum.EMoneyType[cointype].toLowerCase();
        const sCoinColor = CSSHelper.EColor.Red;
        const str = "<font color='" + sCoinColor + "'>" + $.Localize("#lang_" + nodename) + "</font>";
        return (
            <Panel className="CCNotificationImageRoot" ref={this.__root__} hittest={false} hittestchildren={false}  {...this.initRootAttrs()}>
                <CCIcon_CoinType width="24px" height="24px" verticalAlign="center" cointype={cointype} hittest={false} hittestchildren={false} />
                <CCLabel id="ItemName" fontSize="18px" text={str} html={true} hittest={false} verticalAlign="center" />
            </Panel>)
    }
}



interface ICCNotification {
    str: string;
    iPlayerID?: PlayerID;
    iPlayerID2?: PlayerID;
    dialogV?: { [k: string]: any };
    bCoin?: boolean;
    itemInfo: { [k: string]: { itemname: string, level?: number, count?: number } }
}

export class CCNotification extends CCPanel<ICCNotification>{

    onStartUI() {
        if (this.props.iPlayerID != null) {
            this.ReplacePlayerIcon(this.props.iPlayerID)
        }
        if (this.props.iPlayerID2 != null) {
            this.ReplacePlayerIcon(this.props.iPlayerID2)
        }
        if (this.props.bCoin) {
            this.RenderCoinImg();
        }

        if (this.props.itemInfo && Object.keys(this.props.itemInfo).length > 0) {
            Object.keys(this.props.itemInfo).forEach((itemcls: string) => {
                let itemInfo = this.props.itemInfo[itemcls];
                this.RenderItemImg(itemInfo.itemname, itemcls, itemInfo.count, itemInfo.level);
            });
        }
    }
    ReplacePlayerIcon(playerID: PlayerID) {
        $.Schedule(0, () => {
            let current = this.lbl_notifica.current;
            if (!(current && current.IsValid())) {
                return
            }
            let heroIconPanels: Panel[] = current.FindChildrenWithClassTraverse("CombatEventHeroPlayer_" + playerID) || [] as Panel[];
            for (let index = 0; index < heroIconPanels.length; index++) {
                let pHeroIconPanel = heroIconPanels[index];
                pHeroIconPanel.RemoveClass("CombatEventHeroPlayer_" + playerID);
                render(<CCCombatEventPlayerIconWithName iPlayerID={playerID} />, pHeroIconPanel);
            }
        });
    }

    RenderCoinImg() {
        $.Schedule(0, () => {
            let current = this.lbl_notifica.current;
            if (!(current && current.IsValid())) {
                return
            }
            let pParents = current.FindChildrenWithClassTraverse("ChatCoinParent") || [] as Panel[];;
            pParents.forEach(pParent => {
                let cointype = 0;
                if (pParent.BHasClass("coin_gold")) {
                    cointype = GEEnum.EMoneyType.Gold;
                }
                else if (pParent.BHasClass("coin_wood")) {
                    cointype = GEEnum.EMoneyType.Wood;
                }
                else if (pParent.BHasClass("coin_population")) {
                    cointype = GEEnum.EMoneyType.Population;
                }
                else if (pParent.BHasClass("coin_soulcrystal")) {
                    cointype = GEEnum.EMoneyType.SoulCrystal;
                }
                render(<CCCombatEventCoinIconWithName cointype={cointype} />, pParent);
            });
        });
    }


    /**
     * 将物品图片渲染到Panel内
     * @param panel 目标panel的parent
     * @param itemName 物品名
     * @param sItemClass 根据class寻找panel
     */
    RenderItemImg(itemName: string, sItemClass: string, iItemCount?: number, iItemLevel?: number) {
        $.Schedule(0, () => {
            let current = this.lbl_notifica.current;
            if (!(current && current.IsValid())) {
                return
            }
            let itemIconPanels = current.FindChildrenWithClassTraverse(sItemClass) || [] as Panel[];
            itemIconPanels.forEach((itemIconPanel) => {
                itemIconPanel.RemoveClass(sItemClass);
                if (itemName.indexOf("artifact") != -1) {
                    itemIconPanel.AddClass("Artifact");
                }
                render(<CCCombatEventItemIconWithName itemname={itemName} iLevel={iItemLevel} iCount={iItemCount} />, itemIconPanel);
            });
        });
    }
    lbl_notifica = createRef<LabelPanel>();

    render() {
        const str = this.props.str || "";
        const dialogV = this.props.dialogV || {};
        return (
            <Panel className="CCNotification" ref={this.__root__} hittest={false} hittestchildren={false} {...this.initRootAttrs()}>
                <Panel id="SlashContainer">
                    <Panel id="TeamColorBar" />
                </Panel>
                <Label id="NotificationLabel" ref={this.lbl_notifica} className="NotificationListLabel" localizedText={str} dialogVariables={dialogV} html={true} hittest={false} />
                <Panel id="NotificationIcon" />
            </Panel>)
    }
}
