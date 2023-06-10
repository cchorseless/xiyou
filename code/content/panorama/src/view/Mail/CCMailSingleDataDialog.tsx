import React from "react";
import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { EMailState, TMail } from "../../../../scripts/tscripts/shared/service/mail/TMail";
import { NetHelper } from "../../helper/NetHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { CCButton } from "../AllUIElement/CCButton/CCButton";
import { CCLabel } from "../AllUIElement/CCLabel/CCLabel";
import { CCPanel } from "../AllUIElement/CCPanel/CCPanel";
import { CCMainPanel } from "../MainPanel/CCMainPanel";
import { CCStorageIconItem } from "../Storage/CCStorageIconItem";
import { CCStorageItemGetDialog } from "../Storage/CCStorageItemGetDialog";
import { CCMailPanel } from "./CCMailPanel";
import "./CCMailSingleDataDialog.less";


interface ICCMailSingleDataDialog {
    mail: TMail,
}

export class CCMailSingleDataDialog extends CCPanel<ICCMailSingleDataDialog> {

    onInitUI() {
        this.ListenClassUpdate(TMail, (e) => {
            if (e.Id == this.props.mail.Id) {
                this.UpdateSelf();
            }
        })
    }
    onbtndelete_click() {
        const Mail = this.props.mail;
        if (Mail == null) { return }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Handle_CharacterMail, {
            HandleType: GameProtocol.EMailHandleType.MailDelete,
            IsOneKey: false,
            MailId: Mail.Id,
        }, GHandler.create(this, () => {
            CCMailPanel.GetInstance()?.UpdateSelf();
        }))
    }
    onbtngetprize_click() {
        const Mail = this.props.mail;
        if (Mail == null) { return }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Handle_CharacterMail, {
            HandleType: GameProtocol.EMailHandleType.MailGetItem,
            IsOneKey: false,
            MailId: Mail.Id,
        }, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (e.state) {
                const items = JSON.parse(e.message!) as IFItemInfo[];
                CCMainPanel.GetInstance()!.addOnlyPanel(CCStorageItemGetDialog, {
                    Items: items
                })
            }
            CCMailPanel.GetInstance()?.UpdateSelf();
        }))
    }


    onReadMail() {
        const Mail = this.props.mail;
        if (Mail == null) { return }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Handle_CharacterMail, {
            HandleType: GameProtocol.EMailHandleType.MailRead,
            IsOneKey: false,
            MailId: Mail.Id,
        })
    }

    render() {
        const Mail = this.props.mail;
        let time = TimerHelper.GetFullTimeDes(GToNumber(Mail.Time));
        if (Mail.ValidTime > 0) {
            time += `(有效期:${(Mail.ValidTime / 24 / 3600).toFixed(0)}天)`;
        }
        let state = "[未读]";
        if (Mail.State && Mail.State.includes(EMailState.Read)) {
            state = "[已读]"
        }
        if (Mail.State && Mail.State.includes(EMailState.UnItemGet)) {
            state = "[物品奖励]"
        }
        if (Mail.State && Mail.State.includes(EMailState.ItemGet)) {
            state = "[奖励已领取]"
        }
        let cangetitem = false;
        if (Mail.Items && Mail.Items.length > 0 && Mail.State && Mail.State.includes(EMailState.UnItemGet) && !Mail.State.includes(EMailState.ItemGet)) {
            cangetitem = true
        }
        // 自动阅读
        if (Mail.State && Mail.State.includes(EMailState.UnRead)) {
            this.onReadMail();
        }

        return <Panel className={"CCMailSingleDataDialog"} ref={this.__root__}  {...this.initRootAttrs()}>
            <CCLabel type="UnitName" text={"标题：" + Mail.Title} hittest={false} marginLeft={"10px"} />
            <CCLabel type="UnitName" text={"来自：" + Mail.FromDes} hittest={false} marginLeft={"10px"} />
            <CCLabel type="UnitName" text={"时间：" + time} hittest={false} marginLeft={"10px"} />
            <CCPanel width="100%" flowChildren="right" height="300px" marginTop={"20px"} marginLeft={"10px"}>
                <CCLabel type="UnitName" text={"内容：" + Mail.Content} hittest={false} />
            </CCPanel>
            {
                Mail.Items && Mail.Items.length > 0 && <CCPanel width="100%" flowChildren="down" verticalAlign="bottom" marginBottom={"120px"}>
                    <CCLabel type="UnitName" text={"奖励："} hittest={false} marginLeft={"10px"} />
                    <CCPanel flowChildren="right-wrap" width="100%">
                        {
                            Mail.Items.map((v, index) => {
                                return <CCStorageIconItem key={index + ""} itemid={v.ItemConfigId} count={v.ItemCount} />
                            })
                        }
                    </CCPanel>

                </CCPanel>
            }
            <CCPanel horizontalAlign="center" flowChildren="right" height="200px" verticalAlign="bottom" marginBottom={"20px"}>
                <CCButton color="Purple" type="Tui3" onactivate={() => { this.onbtndelete_click() }}>
                    <CCLabel type="UnitName" align="center center" text={"删除邮件"} />
                </CCButton>
                {
                    cangetitem && <CCButton color="Gold" type="Tui3" marginLeft={"20px"} onactivate={() => { this.onbtngetprize_click() }}>
                        <CCLabel type="UnitName" align="center center" text={"领取奖励"} />
                    </CCButton>
                }
            </CCPanel>

        </Panel>
    }
}