import React from "react";
import { TipsHelper } from "../../../helper/TipsHelper";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCFriendMenu.less";

export interface ICCFriendMenu {

}

/** 闪光 */
export class CCFriendMenu extends CCPanel<ICCFriendMenu> {
    onStartUI() {
        const rootpanel = this.__root__.current
        if (rootpanel) {
            rootpanel.SetHasClass("Hidden", false);
            const RankTierContainer = rootpanel.FindChildTraverse("RankTierContainer");
            if (RankTierContainer) {
                RankTierContainer.visible = false;
                // RankTierContainer.DeleteAsync(1)
            }
            const adspanel = rootpanel.GetChild(0)!.GetChild(1);
            // print(adspanel)
            if (adspanel) {
                adspanel.visible = false;
                // adspanel.DeleteAsync(1)
            }
            // rootpanel.FindChild
            const FriendsPlayingDota = rootpanel.FindChildTraverse("FriendsPlayingDota");
            if (FriendsPlayingDota) {
                // 游戏名称
                const FriendsHeader = FriendsPlayingDota.FindChildTraverse("FriendsHeader")
                const lbl = FriendsHeader?.GetChild(1) as LabelPanel;
                lbl!.text = lbl!.text.replace("Dota", "电子斗蛐蛐");
                // 玩家列表筛选
                const FriendList = FriendsPlayingDota.FindChildTraverse("FriendList")
                // 玩家邀请队伍
                const listDiv = FriendList?.GetChild(0);
                const len = listDiv?.GetChildCount() || 0;
                for (let i = 0; i < len; i++) {
                    const frienddiv = listDiv?.GetChild(i);
                    if (frienddiv && frienddiv.paneltype == "DOTAFriend") {
                        const InviteButtonContainer = frienddiv.FindChildTraverse("InviteButtonContainer");
                        if (InviteButtonContainer) {
                            const inviteBtn = InviteButtonContainer.GetChild(0)!;
                            inviteBtn.SetPanelEvent("onactivate", () => {
                                TipsHelper.showErrorMessage("invite todo")
                            })
                        }
                    }
                }
            }
        }
    }

    render() {
        return (
            this.__root___isValid &&
            <GenericPanel type="DOTAFriendMenu" id="FriendMenu"
                showLobbies={false} showBroadcastingParties={true} showBroadcastingPartiesAsRegularParties={true}
                ref={this.__root__} {...this.initRootAttrs()} />
        );
    }
}