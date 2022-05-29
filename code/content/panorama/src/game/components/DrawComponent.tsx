import { FuncHelper } from "../../helper/FuncHelper";
import { LogHelper } from "../../helper/LogHelper";
import { NetHelper } from "../../helper/NetHelper";
import { TimerHelper } from "../../helper/TimerHelper";
import { TipsHelper } from "../../helper/TipsHelper";
import { ET, registerET } from "../../libs/Entity";
import { DrawCardPanel } from "../../view/Draw/DrawCardPanel";
import { MainPanel } from "../../view/MainPanel/MainPanel";
import { DrawConfig } from "../system/Draw/DrawConfig";

/**抽卡 */
@registerET()
export class DrawComponent extends ET.Component {
    onAwake() {
        this.startListen();
    }
    startListen() {
        // 监听服务器数据推送
        NetHelper.ListenOnLua(
            DrawConfig.EProtocol.DrawCardResult,
            (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state && event.data) {
                    let card = FuncHelper.toArray(event.data);
                    MainPanel.GetInstance()!.addOnlyDialog(DrawCardPanel, { cards: card });
                }
            },
            this
        );
    }

    async SelectCard(index: number, sTowerName: string, b2Public: boolean = false) {
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
