import { DrawConfig } from "../../../../../scripts/tscripts/shared/DrawConfig";
import { ET } from "../../../../../scripts/tscripts/shared/lib/Entity";
import { FuncHelper } from "../../../helper/FuncHelper";
import { NetHelper } from "../../../helper/NetHelper";
import { CCDrawArtifactPanel } from "../../../view/Draw/CCDrawArtifactPanel";
import { CCDrawCardPanel } from "../../../view/Draw/CCDrawCardPanel";
import { CCDrawEquipPanel } from "../../../view/Draw/CCDrawEquipPanel";
import { CCMainPanel } from "../../../view/MainPanel/CCMainPanel";

/**抽卡 */
@GReloadable
export class DrawComponent extends ET.Component {
    onSerializeToEntity() {
        if (this.IsBelongLocalPlayer()) {
            this.startListen();
        }
    }
    tLastCards: string[];
    tWashCards: string[] = [];
    /**锁定详情 */
    tLockChess: { [k: string]: string } = {}
    startListen() {
        // 监听服务器数据推送
        NetHelper.ListenOnLua(DrawConfig.EProtocol.DrawCardNotice,
            GHandler.create(this, (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state) {
                    CCDrawCardPanel.GetInstance()?.close();
                    let card = Array<string>().concat(this.tLastCards);
                    CCMainPanel.GetInstance()?.addOnlyPanel(CCDrawCardPanel, { cards: card })
                }
            }));

        NetHelper.ListenOnLua(DrawConfig.EProtocol.DrawArtifactNotice,
            GHandler.create(this, (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state) {
                    CCDrawArtifactPanel.GetInstance()?.close();
                    let card = FuncHelper.toArray(event.data!)
                    GLogHelper.print("抽到神器", card)
                    CCMainPanel.GetInstance()?.addOnlyPanel(CCDrawArtifactPanel, { cards: card })
                }
            }));
        NetHelper.ListenOnLua(DrawConfig.EProtocol.DrawEquipNotice,
            GHandler.create(this, (event: CLIENT_DATA<ArrayLikeObject<string>>) => {
                if (event.state) {
                    CCDrawEquipPanel.GetInstance()?.close();
                    let card = FuncHelper.toArray(event.data!)
                    GLogHelper.print("抽到装备", card)
                    CCMainPanel.GetInstance()?.addOnlyPanel(CCDrawEquipPanel, { cards: card })
                }
            }));
    }
    static IsCardWanted(sTowerName: string) {
        let AllEntity = DrawComponent.GetAllInstance();
        for (let r of AllEntity) {
            if (r.tWashCards.includes(sTowerName)) {
                return true;
            }
        }
        return false;
    }
    async SelectCard(index: number, sTowerName: string, b2Public: 0 | 1 = 0) {
        let cbmsg = await NetHelper.SendToLuaAsync<IDrawConfig.ICardSelected>(DrawConfig.EProtocol.CardSelected, {
            index: index,
            itemName: sTowerName,
            b2Public: b2Public,
        });
        return cbmsg.state!;
    }
    WantedChess(itemname: string, isadd: boolean) {
        if (isadd) {
            if (this.tWashCards.includes(itemname)) {
                return
            }
        }
        NetHelper.SendToLua(DrawConfig.EProtocol.Add2WishList, {
            itemName: itemname,
            isadd: isadd ? 1 : 0,
        })
    }
    LockChess(index: number, itemname: string, block: boolean) {
        if (block) {
            this.tLockChess[index + ""] = itemname;
        }
        else {
            delete this.tLockChess[index + ""];
        }
        NetHelper.SendToLua(DrawConfig.EProtocol.LockSelectedCard, {
            index: index,
            itemName: itemname,
            block: block ? 1 : 0,
        })
    }

}



declare global {
    var GDrawComponent: typeof DrawComponent;
}

if (_G.GDrawComponent == undefined) {
    _G.GDrawComponent = DrawComponent;
}