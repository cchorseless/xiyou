import { LogHelper } from "../../../helper/LogHelper";
import { ET, registerET } from "../../../libs/Entity";
import { CCMainPanel } from "../../../view/MainPanel/CCMainPanel";
import { PlayerScene } from "../Player/PlayerScene";


@registerET()
export class GameStateSystemComponent extends ET.Component {
    BindHeroPlayer: number[] = [];
    IsAllPlayerBindHero: boolean = false;
    onSerializeToEntity() {
        PlayerScene.Scene.AddOneComponent(this);
        this.onReload();
    }
    onReload(): void {
    }
}