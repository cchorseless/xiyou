import { FuncHelper } from "../../../helper/FuncHelper";
import { LogHelper } from "../../../helper/LogHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { TimerHelper } from "../../../helper/TimerHelper";
import { TipsHelper } from "../../../helper/TipsHelper";
import { ET, registerET } from "../../../libs/Entity";
import { DrawCardPanel } from "../../../view/Draw/DrawCardPanel";
import { MainPanel } from "../../../view/MainPanel/MainPanel";
import { DrawConfig } from "../../system/Draw/DrawConfig";
import { PlayerScene } from "../Player/PlayerScene";

/**抽卡 */
@registerET()
export class DrawComponent extends ET.Component {
    onSerializeToEntity() {
        if (PlayerScene.Local && NetHelper.IsFromLocalNetTable(this)) {
            PlayerScene.Local.AddOneComponent(this);
            this.startListen();
        }
    }
    private _tLastCards: string[];
    get tLastCards() {
        return this._tLastCards;
    }
    set tLastCards(v: string[]) {
        this._tLastCards = FuncHelper.toArray(v as any);
    }

    startListen() {
        // 监听服务器数据推送
        NetHelper.ListenOnLua(
            this,
            DrawConfig.EProtocol.DrawCardResult,
            (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state) {
                    let card = Array<string>().concat(this.tLastCards);
                    MainPanel.GetInstance()!.addOnlyDialog(DrawCardPanel, { cards: card });
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
