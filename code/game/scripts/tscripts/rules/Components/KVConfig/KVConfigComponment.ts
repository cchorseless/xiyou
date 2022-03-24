import { ET } from "../../Entity/Entity";

export class KVConfigComponment extends ET.Component {
    readonly ConfigID: string;
    readonly Config: any;
    onAwake(ConfigID: string, config: any): void {
        (this as any).ConfigID = ConfigID;
        (this as any).Config = config;
    }
}