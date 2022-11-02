import { LogHelper } from "../../../helper/LogHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CCMainPanel } from "../../../view/MainPanel/CCMainPanel";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class GameStateSystemComponent extends ET.Component {
    BindHeroPlayer: number[] = [];
    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
        this.onReload();
    }
    private _IsAllPlayerBindHero: boolean = false;
    get IsAllPlayerBindHero() {
        return this._IsAllPlayerBindHero;
    }
    // 网表把boolean 转成数字
    set IsAllPlayerBindHero(v: boolean) {
        v = Boolean(v);
        let oldv = this._IsAllPlayerBindHero;
        this._IsAllPlayerBindHero = v;
        if (oldv != v && v) {
            CCMainPanel.GetInstance()?.StartRenderUI();
        }
    }
    onReload(): void {
    }
}