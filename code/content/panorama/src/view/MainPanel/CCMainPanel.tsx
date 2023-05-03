
import React, { createRef } from "react";
import { GameEnum } from "../../../../scripts/tscripts/shared/GameEnum";
import { CSSHelper } from "../../helper/CSSHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { BaseEasyPureComponent, BasePureComponent } from "../../libs/BasePureComponent";
import { CCActivityPanel } from "../Activity/CCActivityPanel";
import { CCDacBoard } from "../AllUIElement/CCDacBoard/CCDacBoard";
import { CCMiniMap } from "../AllUIElement/CCMiniMap/CCMiniMap";
import { CCMenuNavigation } from "../AllUIElement/CCNavigation/CCMenuNavigation";
import { CCPanel, dialogTooltipInfo } from "../AllUIElement/CCPanel/CCPanel";
import { CCArtifactListPanel } from "../Artifact/CCArtifactListPanel";
import { CCBattlePassPanel } from "../BattlePass/CCBattlePassPanel";
import { CCChallengeShopPanel } from "../Challenge/CCChallengeShopPanel";
import { CCCombinationBottomPanel } from "../Combination/CCCombinationBottomPanel";
import { CCHandBookPanel } from "../HandBook/CCHandBookPanel";
import { CCLuckyDrawPanel } from "../LuckyDraw/CCLuckyDrawPanel";
import { CCMailPanel } from "../Mail/CCMailPanel";
import { CCNotificationPanel } from "../Notification/CCNotificationPanel";
import { CCPlayerListPanel } from "../Player/CCPlayerListPanel";
import { CCPublicShopBagPanel } from "../PublicShopBag/CCPublicShopBagPanel";
import { CCRankPanel } from "../Rank/CCRankPanel";
import { CCRecordPanel } from "../Record/CCRecordPanel";
import { CCShopPanel } from "../Shop/CCShopPanel";
import { CCShopSixShenFuPanel } from "../Shop/CCShopSixShenFuPanel";
import { CCStoragePanel } from "../Storage/CCStoragePanel";
import { CCTopBarCenter, CCTopBarGameCoin } from "../TopBarPanel/CCTopBarPanel";
import { CCUnitDamageInfo } from "../Unit/CCUnitDamageInfo";


export class CCMainPanel extends CCPanel<NodePropsData> {
    panel_base: React.RefObject<Panel> = createRef<Panel>();;
    panel_allpanel: React.RefObject<Panel> = createRef<Panel>();;
    panel_alldialog: React.RefObject<Panel> = createRef<Panel>();
    NODENAME = { __root__: '__root__', panel_base: 'panel_base', panel_allpanel: 'panel_allpanel', panel_alldialog: 'panel_alldialog', };

    onInitUI() {
        this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() || -1 });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_selected_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });
        this.addGameEvent(GameEnum.GameEvent.dota_player_update_query_unit, (e) => {
            this.UpdateState({ curunit: Players.GetLocalPlayerPortraitUnit() });
        });

    };


    panel_base_isValid: boolean = true;
    panel_base_childs: Array<JSX.Element> = [];
    panel_allpanel_isValid: boolean = true;
    panel_allpanel_childs: Array<JSX.Element> = [];
    panel_alldialog_isValid: boolean = true;
    panel_alldialog_childs: Array<JSX.Element> = [];

    render() {
        const curunit = this.GetState<EntityIndex>('curunit');
        const courier = GCourierEntityRoot.GetEntity(curunit);
        const fakerhero = GFakerHeroEntityRoot.GetEntity(curunit);
        const BShowBuffList = (courier == null && fakerhero == null);
        return (
            <Panel ref={this.__root__} className="CC_root" hittest={false} {...this.initRootAttrs()}>
                {this.panel_base_isValid &&
                    <Panel ref={this.panel_base} className="CC_root" hittest={false}>
                        <CCMenuNavigation
                            list={["setting", "mail", "store", "battlepass", "draw", "handbook", "rank", "activity", "record", "storage"]}
                            onToggle={this.onMenuNavigationToggle} />
                        <CCTopBarCenter />
                        <CCTopBarGameCoin />
                        <CCPlayerListPanel />
                        <CCMiniMap />
                        <CCChallengeShopPanel />
                        <CCShopSixShenFuPanel />
                        <CCDacBoard BShowBuffList={BShowBuffList} CurSelectUnit={curunit} />
                        <CCUnitDamageInfo />
                        <CCCombinationBottomPanel CurSelectUnit={curunit} />
                        <CCArtifactListPanel />
                        <CCPublicShopBagPanel />
                        <CCNotificationPanel />
                        {this.panel_base_childs}
                    </Panel>
                }
                {this.panel_allpanel_isValid &&
                    <Panel ref={this.panel_allpanel} className="CC_root" hittest={false}>
                        {this.panel_allpanel_childs}
                    </Panel>
                }
                {this.panel_alldialog_isValid &&
                    <Panel ref={this.panel_alldialog} className="CC_root" hittest={false}>
                        {this.panel_alldialog_childs}
                    </Panel>
                }
                {this.props.children}
                {this.__root___childs}
            </Panel>
        )
    };

    private onMenuNavigationToggle = (menuName: string, state: boolean) => {
        CCShopPanel.GetInstance()?.close();
        CCMailPanel.GetInstance()?.close();
        CCBattlePassPanel.GetInstance()?.close();
        CCHandBookPanel.GetInstance()?.close();
        CCLuckyDrawPanel.GetInstance()?.close();
        CCRankPanel.GetInstance()?.close();
        CCActivityPanel.GetInstance()?.close();
        CCRecordPanel.GetInstance()?.close();
        CCStoragePanel.GetInstance()?.close();
        if (state) {
            if (menuName == "store") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCShopPanel)
            }
            else if (menuName == "mail") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCMailPanel)
            }
            else if (menuName == "handbook") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCHandBookPanel)
            }
            else if (menuName == "battlepass") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCBattlePassPanel)
            }
            else if (menuName == "draw") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCLuckyDrawPanel)
            }
            else if (menuName == "rank") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCRankPanel)
            }
            else if (menuName == "activity") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCActivityPanel)
            }
            else if (menuName == "record") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCRecordPanel)
            }
            else if (menuName == "storage") {
                this.addOnlyOneNodeChild(this.NODENAME.panel_allpanel, CCStoragePanel)
            }
        }
        this.UpdateSelf();
    }


    public stagePos(panel: Panel) {
        let position = { x: 0, y: 0 };
        while (panel && panel !== this.__root__.current!) {
            position.x += panel.actualxoffset;
            position.y += panel.actualyoffset;
            panel = panel.GetParent()!;
        }
        position.x = position.x / (this.__root__.current!.actualuiscale_x || 1);
        position.y = position.y / (this.__root__.current!.actualuiscale_y || 1);
        return position;
    }
    //#region tooltips
    private CustomToolTip: BaseEasyPureComponent | null;
    private HideToolTipFunc: (() => void) | null;
    private UpdateToolTipPos(bindpanel: Panel, layoutleftRight: boolean) {
        const offset = 20;
        let pos = this.stagePos(bindpanel);
        let panelsize = CSSHelper.getPanelSize(bindpanel);
        let panelwidth = panelsize[0];
        let panelheight = panelsize[1];
        let windowsize = CSSHelper.getPanelSize(this.__root__.current!);
        let windowwidth = windowsize[0];
        let windowheight = windowsize[1];
        let isleft = pos.x <= windowwidth / 2;
        let istop = pos.y <= windowheight / 2;
        let setPosFunc = () => {
            let dialogpanel = this.CustomToolTip!.__root__.current!;
            dialogpanel.hittest = false;
            dialogpanel.hittestchildren = false;
            let posdialog = { x: 0, y: 0 };
            let size = CSSHelper.getPanelSize(dialogpanel);
            if (dialogpanel.IsSizeValid()) {
                dialogpanel.style.opacity = 1 + ""
            }
            else {
                // 设置成0 不计算
                dialogpanel.style.opacity = 0.01 + ""
            }
            let dialogwidth = size[0];
            let dialogheight = size[1];
            if (layoutleftRight) {
                if (isleft) {
                    posdialog.x = pos.x + panelwidth + offset;
                }
                else {
                    posdialog.x = pos.x - dialogwidth - offset;
                }
                posdialog.y = pos.y + panelheight / 2 - dialogheight / 2;
                if (posdialog.y < 0) {
                    posdialog.y = 0;
                }
                else if (posdialog.y + dialogheight > windowheight) {
                    posdialog.y = windowheight - dialogheight;
                }
            }
            else {
                if (istop) {
                    posdialog.y = pos.y + panelheight + offset;
                }
                else {
                    posdialog.y = pos.y - dialogheight - offset;
                }
                posdialog.x = pos.x + panelwidth / 2 - dialogwidth / 2;
                if (posdialog.x < 0) {
                    posdialog.x = 0;
                }
            }
            dialogpanel.SetPositionInPixels(posdialog.x, posdialog.y, 0);

        }
        setPosFunc();
        let i = 0;
        GTimerHelper.AddTimer(0.1, GHandler.create(this, () => {
            i++;
            let issizevalid = this.CustomToolTip?.__root__.current?.IsSizeValid();
            if (issizevalid) {
                setPosFunc();
                return
            }
            else if (issizevalid == null || i >= 10) {
                return
            }
            return 0.1
        }), true);
    }
    /**显示tooltip弹窗 */
    public async ShowCustomToolTip<M extends NodePropsData, T extends typeof CCPanel<M>>(bindpanel: Panel, dialoginfo: dialogTooltipInfo<T, any>) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        if (dialoginfo.cls == null) { return };
        let tipTypeClass = dialoginfo.cls;
        let obj = dialoginfo.props || {};
        let layoutleftRight = dialoginfo.posRight || false;
        let isinrange = true;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.style.brightness = brightness + 0.5 + "";
        let newtip = await this.addNodeChildAsyncAt<M, T>(this.NODENAME.panel_alldialog, tipTypeClass, obj);
        if (!isinrange) {
            newtip?.close();
            return;
        }
        this.HideToolTip();
        this.CustomToolTip = newtip;
        this.UpdateToolTipPos(bindpanel, layoutleftRight);
        this.HideToolTipFunc = () => {
            isinrange = false;
            bindpanel.style.brightness = brightness + "";
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
                this.UpdateSelf();
            }
        };
    }
    /**注册tooltip弹窗事件 */
    public RegCustomToolTip<M extends NodePropsData, T extends typeof CCPanel<M>>(bindpanel: Panel, cls: T, attrFunc: (() => { [k: string]: any } | void) | null = null, layoutleftRight: boolean = false) {
        if (bindpanel == null || !bindpanel.IsValid()) { return };
        let isinrange = false;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.SetPanelEvent('onmouseover', async () => {
            let obj: any = {};
            if (attrFunc) {
                obj = attrFunc();
                // 有函数且返回null,不显示
                if (obj == null) {
                    return
                }
            }
            bindpanel.style.brightness = brightness + 0.5 + "";
            isinrange = true;
            let newtip = await this.addNodeChildAsyncAt<M, T>(this.NODENAME.panel_alldialog, cls, obj);
            if (!isinrange) {
                newtip.close();
                return;
            }
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
            }
            this.CustomToolTip = newtip;
            this.UpdateToolTipPos(bindpanel, layoutleftRight)
            this.HideToolTipFunc = hideFunc;
        });
        let hideFunc = () => {
            isinrange = false;
            bindpanel.style.brightness = brightness + "";
            if (this.CustomToolTip) {
                this.CustomToolTip.close();
                this.CustomToolTip = null;
                this.UpdateSelf();
            }
        };
        bindpanel.SetPanelEvent('onmouseout', hideFunc)
    }
    public RegTextToolTip(bindpanel: Panel, attrFunc: (() => string | void)) {
        if (!bindpanel) { return };
        let tipType = TipsHelper.ToolTipType.DOTAShowTextTooltip;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.SetPanelEvent('onmouseover', () => {
            let tips = attrFunc();
            if (tips) {
                bindpanel.style.brightness = brightness + 0.5 + "";
                $.DispatchEvent(tipType, bindpanel, tips);
                this.HideToolTipFunc = hideFunc;
            }
        });
        let hideFunc = () => {
            bindpanel.style.brightness = brightness + "";
            $.DispatchEvent(tipType.replace('Show', 'Hide'), bindpanel)
        }
        bindpanel.SetPanelEvent('onmouseout', hideFunc)
    }
    public RegTitleTextToolTip(bindpanel: Panel, attrFunc: (() => { title: string, tip: string } | void)) {
        if (!bindpanel) { return };
        let tipType = TipsHelper.ToolTipType.DOTAShowTitleTextTooltip;
        let brightness = Number(bindpanel.style.brightness) || 1;
        bindpanel.SetPanelEvent('onmouseover', () => {
            let data = attrFunc();
            if (data) {
                bindpanel.style.brightness = brightness + 0.5 + "";
                $.DispatchEvent(tipType, bindpanel, data.title, data.tip);
                this.HideToolTipFunc = hideFunc;
            }
        });
        let hideFunc = () => {
            bindpanel.style.brightness = brightness + "";
            $.DispatchEvent(tipType.replace('Show', 'Hide'), bindpanel)
        };
        bindpanel.SetPanelEvent('onmouseout', hideFunc)
    }
    /**隐藏tooltip弹窗事件 */
    public HideToolTip() {
        if (this.HideToolTipFunc) {
            this.HideToolTipFunc();
            this.HideToolTipFunc = null;
        }
    }
    //#endregion


    private allPanelInMain: { [k: string]: BaseEasyPureComponent[] } = {};
    async addOnlyPanel<M extends NodePropsData, T extends typeof BasePureComponent<M>>(nodeType: T, nodeData: M | any = {}, zorder: number = -1) {
        if (zorder > -1) {
            for (let k of Object.keys(this.allPanelInMain)) {
                let _zorder = parseInt(k);
                if (_zorder > zorder) {
                    this.allPanelInMain[k].forEach(c => c.close());
                    delete this.allPanelInMain[k];
                }
            }
        }
        let panel = await this.addOrShowOnlyNodeChild(this.NODENAME.panel_allpanel, nodeType, nodeData);
        this.allPanelInMain[zorder] = this.allPanelInMain[zorder] || [];
        for (let i = 0, len = this.allPanelInMain[zorder].length; i < len; i++) {
            let comp = this.allPanelInMain[zorder][i];
            if (comp && comp.IsRegister == false) {
                this.allPanelInMain[zorder].splice(i, 1);
                i--;
                len--;
            }
        }
        this.allPanelInMain[zorder].push(panel);
        return panel;
    }



}