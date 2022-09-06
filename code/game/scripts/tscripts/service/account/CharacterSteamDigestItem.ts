import { ET, registerET } from "../../rules/Entity/Entity";

@registerET()
export class CharacterSteamDigestItem extends ET.Entity {
    public readonly IsSerializeEntity: boolean = true;

    public CharacterId: string;
    public SteamName: string;
    public SteamIconUrl: string;
    onSerializeToEntity() {

    }
}
