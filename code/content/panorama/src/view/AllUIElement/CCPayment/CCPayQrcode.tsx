import React from "react";
import { FuncHelper } from "../../../helper/FuncHelper";
import { QRcodeHelper } from "../../../helper/QRcodeHelper";
import { CCPanel } from "../CCPanel/CCPanel";

import "./CCPayQrcode.less";

interface ICCPayQrcode extends NodePropsData {
    link: string, logo?: string, qrcodesize?: number;
}

export class CCPayQrcode extends CCPanel<ICCPayQrcode> {
    static defaultProps = { qrcodesize: 200, logo: "" }

    render() {
        const logo = this.props.logo;
        const link = this.props.link;
        const qrcodesize = this.props.qrcodesize!;
        let qrcode = new QRcodeHelper.QRCode(-1, 3);
        qrcode.addData(link);
        qrcode.make();
        let size = qrcode.getModuleCount();
        let pix_size = Math.floor(qrcodesize / size);
        const w = FuncHelper.ToFiniteNumber(pix_size) + "px";
        return (
            <Panel className="CC_PayQrcode" ref={this.__root__} {...this.initRootAttrs()}>
                <CCPanel flowChildren="down">
                    {
                        [...Array(size)].map((a, i) => {
                            return <CCPanel key={i + ""} flowChildren="right">
                                {
                                    [...Array(size)].map((b, j) => {
                                        return <CCPanel key={j + "10"} width={w} height={w} backgroundColor={qrcode.isDark(i, j) ? "#000000" : "#ffffff"} />
                                    })
                                }
                            </CCPanel>
                        })
                    }
                </CCPanel>
                {logo && logo.length > 0 && <Image className="logo" src={logo} />}
            </Panel>
        )
    }
}