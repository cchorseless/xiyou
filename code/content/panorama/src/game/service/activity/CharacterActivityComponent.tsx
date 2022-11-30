import { EEnum } from "../../../../../../game/scripts/tscripts/shared/Gen/Types";
import Dictionary from "../../../helper/DataContainerHelper";
import { ET, registerET } from "../../../libs/Entity";
import { TCharacter } from "../account/TCharacter";
import { TActivityData } from "./TActivityData";
import { TActivityMemberShipData } from "./TActivityMemberShipData";

@registerET()
export class CharacterActivityComponent extends ET.Component {
    public ActivityData: Dictionary<number, string> = new Dictionary<
        number,
        string
    >();
    public set _ActivityData(data: Dictionary<number, string>) {
        this.ActivityData.copy(data);
    }
    public get Character(): TCharacter { return this.GetParent<TCharacter>(); }
    onSerializeToEntity() {
        let character = ET.EntityEventSystem.GetEntity(this.Id + "TCharacter");
        if (character) {
            character.AddOneComponent(this);
        }
    }
    public GetActivityData<T extends TActivityData>(activityconfigid: number) {
        let activityid = this.ActivityData.get(activityconfigid)
        if (activityid) {
            return this.GetChild<T>(activityid);
        }
        return null;
    }


    public get MemberShip() {
        return this.GetActivityData<TActivityMemberShipData>(EEnum.EActivityType.TActivityMemberShip)
    }
}
