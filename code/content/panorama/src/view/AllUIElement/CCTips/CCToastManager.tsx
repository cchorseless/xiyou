
import React from "react";
import { CCPanel } from "../CCPanel/CCPanel";
import "./CCToastManager.less";

interface ICCToastManager extends NodePropsData {
    toastduration?: string;
    maxtoastsvisible?: number;
    maxtoastbehavior?: "deleteoldest" | string;
    preservefadedtoasts?: boolean;
    delaytime?: number;
    addtoaststohead?: boolean;
}
export class CCToastManager extends CCPanel<ICCToastManager, ToastManager> {

    // toastManager = createRef<ToastManager>();

    QueueToast(p: Panel): void {
        if (!this.__root__.current) return;
        this.__root__.current.QueueToast(p);
    }
    RemoveToast(p: Panel): void {
        if (!this.__root__.current) return;
        this.__root__.current.RemoveToast(p);
    }
    render() {
        return (
            // <Panel className="CCToastManager" ref={this.__root__} hittest={false} {...this.initRootAttrs()}>
            <GenericPanel ref={this.__root__} type="ToastManager" hittest={false} {...this.initRootAttrs()} />
            // </Panel>
        )
    }
}
