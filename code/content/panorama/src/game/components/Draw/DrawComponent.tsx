import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CCDrawCardPanel } from "../../../view/Draw/CCDrawCardPanel";
import { CCMainPanel } from "../../../view/MainPanel/CCMainPanel";
import { MainPanel } from "../../../view/MainPanel/MainPanel";
import { DrawConfig } from "../../system/Draw/DrawConfig";
import { PlayerScene } from "../Player/PlayerScene";

/**抽卡 */
@registerET()
export class DrawComponent extends ET.Component {
    onSerializeToEntity() {
        PlayerScene.GetPlayer(this.BelongPlayerid)?.AddOneComponent(this);
        if (this.IsBelongLocalPlayer()) {
            this.startListen();
        }
    }
    tLastCards: string[];

    startListen() {
        // 监听服务器数据推送
        NetHelper.ListenOnLua(
            this,
            DrawConfig.EProtocol.DrawCardResult,
            (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state) {
                    let card = Array<string>().concat(this.tLastCards);
                    CCMainPanel.GetInstance()?.addOnlyPanel(CCDrawCardPanel, { cards: card })
                }
            }
        );
    }

    async SelectCard(index: number, sTowerName: string, b2Public: number = 0) {
        let cbmsg = await NetHelper.SendToLuaAsync<DrawConfig.I.ICardSelected>(DrawConfig.EProtocol.CardSelected, {
            index: index,
            itemName: sTowerName,
            b2Public: b2Public,
        });
        if (!cbmsg.state) {
            TipsHelper.showTips(cbmsg.message!, MainPanel.GetInstance()!);
        }
        return cbmsg.state!;
    }
}
