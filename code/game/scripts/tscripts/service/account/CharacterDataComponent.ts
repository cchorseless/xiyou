import { ET, registerET, serializeETProps } from "../../rules/Entity/Entity";
import { NumericComponent } from "../common/NumericComponent";
import { CharacterInGameDataComponent } from "./CharacterInGameDataComponent";
import { TCharacter } from "./TCharacter";

export class EMoneyType {
    public static InGame_Gold = 1;
    public static InGameMax = 100;
    public static MetaStone = 101;
    public static StarStone = 102;
    public static ComHeroExp = 103;

    public static FireEventMin = 500;

    public static BattlePassExp = 501;

    public static AchieveMentMin = 600;

    public static KillEnemyCount = 601;

    public static AchieveMentMax = 699;

    public static DailyDataMin = 700;

    public static DailyDataMax = 799;

    public static WeekDataMin = 800;

    public static WeekDataMax = 899;

    public static SeasonDataMin = 900;

    public static SeasonDataMax = 999;

    public static MoneyMax = 1000;

}
@registerET()
export class CharacterDataComponent extends ET.Component {
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
            this.onReload();
        }
    }

    onReload(): void {
        this.Domain.ETRoot.AsPlayer().SyncClientEntity(this);
    }


    NumericComp() {
        return this.GetComponentByName<NumericComponent>("NumericComponent");
    }
    InGameDataComp() {
        return this.GetComponentByName<CharacterInGameDataComponent>("CharacterInGameDataComponent");
    }

    public Character(): TCharacter { return this.GetParent<TCharacter>(); }

}
