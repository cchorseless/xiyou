import { GameProtocol } from "../../../../scripts/tscripts/shared/GameProtocol";
import { GameServiceConfig } from "../../../../scripts/tscripts/shared/GameServiceConfig";
import { GameServiceSystem } from "../../../../scripts/tscripts/shared/rules/System/GameServiceSystem";
import { TItem } from "../../../../scripts/tscripts/shared/service/bag/TItem";
import { NetHelper } from "../../helper/NetHelper";
import { TipsHelper } from "../../helper/TipsHelper";

@GReloadable
export class GameServiceSystemComponent extends GameServiceSystem {

    get LocalPlayerGameSelection() {
        return this.tPlayerGameSelection[Players.GetLocalPlayer()];
    }

    SelectDifficultyChapter(difficulty: GameServiceConfig.EDifficultyChapter) {
        if (this.LocalPlayerGameSelection.Difficulty.Chapter == difficulty) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectDifficultyChapter, difficulty);
    }

    SelectDifficultyEndlessLevel(level: number) {
        if (this.LocalPlayerGameSelection.Difficulty.Level == level) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectDifficultyEndlessLevel, level);
    }

    SelectCourier(name: string) {
        if (this.LocalPlayerGameSelection.Courier == name) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectCourier, name);
    }

    SelectReady() {
        if (this.LocalPlayerGameSelection.IsReady) {
            return
        }
        NetHelper.SendToLua(GameProtocol.Protocol.SelectReady, true);
    }

    /**
     * 使用背包道具
     * @param itemEntityId 
     * @param count 
     */
    UseBagItem(itemEntity: TItem, count = 1) {
        if (!itemEntity) {
            return
        }
        if (!itemEntity.IsCanUse()) {
            TipsHelper.showErrorMessage("该道具无法使用")
            return
        }
        NetHelper.SendToCSharp(GameProtocol.Protocol.Use_BagItem, {
            ItemId: itemEntity.Id,
            ItemCount: count,
        } as C2H_Use_BagItem, GHandler.create(this, (e: JS_TO_LUA_DATA) => {
            if (!GToBoolean(e.state)) {
                TipsHelper.showErrorMessage(e.message!)
            }
            else {
                TipsHelper.showErrorMessage("使用成功")
            }
        }))
    }

}