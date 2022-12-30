import { ET } from "../../../shared/lib/Entity";

export class KVConfigComponment extends ET.Component {
    readonly ConfigID: string;
    readonly Config: any;
    onAwake(ConfigID: string, config: any): void {
        (this.ConfigID as any) = ConfigID;
        (this.Config as any) = config;
    }
}