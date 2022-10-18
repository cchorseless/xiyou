import { reloadable } from "../../GameCache";
import { ET } from "../../rules/Entity/Entity";

@reloadable
export class CharacterSteamDigestItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public CharacterId: string;
    public SteamName: string;
    public SteamIconUrl: string;
    onSerializeToEntity() {

    }
}
