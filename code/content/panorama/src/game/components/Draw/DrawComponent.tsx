import { DrawConfig } from "../../../../../scripts/tscripts/shared/DrawConfig";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { NetHelper } from "../../../helper/NetHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { CCDrawCardPanel } from "../../../view/Draw/CCDrawCardPanel";
import { CCMainPanel } from "../../../view/MainPanel/CCMainPanel";

/**抽卡 */
@GReloadable
export class DrawComponent extends ET.Component {
    onSerializeToEntity() {
        GGameScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
        if (this.IsBelongLocalPlayer()) {
            this.startListen();
        }
    }
    tLastCards: string[];

    startListen() {
        // 监听服务器数据推送
        NetHelper.ListenOnLua(DrawConfig.EProtocol.DrawCardResult,
            GHandler.create(this, (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state) {
                    CCDrawCardPanel.GetInstance()?.close();
                    let card = Array<string>().concat(this.tLastCards);
                    CCMainPanel.GetInstance()?.addOnlyPanel(CCDrawCardPanel, { cards: card })
                }
            }));
    }

    async SelectCard(index: number, sTowerName: string, b2Public: number = 0) {
        let cbmsg = await NetHelper.SendToLuaAsync<DrawConfig.I.ICardSelected>(DrawConfig.EProtocol.CardSelected, {
            index: index,
            itemName: sTowerName,
            b2Public: b2Public,
        });
        if (!cbmsg.state && cbmsg.message) {
            TipsHelper.showErrorMessage(cbmsg.message);
        }
        return cbmsg.state!;
    }
}
