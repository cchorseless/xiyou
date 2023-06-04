import React from 'react';
import { CCPanel } from '../CCPanel/CCPanel';
import "./CCLevelxp.less";

interface ICCLevelxp {
    level: number;
    exp?: number;
    min?: number;
    max?: number;
    showProgress?: boolean;
}

export class CCLevelxp extends CCPanel<ICCLevelxp> {

    render() {
        const showExpProgress = this.props.showProgress || false;
        const exp = this.props.exp || 100;
        const min = this.props.min || 0;
        const max = this.props.max || 100;
        return (
            <Panel className='CCLevelxp' ref={this.__root__}  {...this.initRootAttrs()}>
                {
                    showExpProgress ?
                        <CCPanel tooltip={`${exp}/${max}`}>
                            <CircularProgressBar className='CCLevelxpProgressBar' max={max} min={min} value={exp} />
                        </CCPanel>
                        : <Panel className="CCLevelxpBorder" />
                }
                <Label className="CCLevelxpLabel" text={this.props.level} />
            </Panel>
        );
    }
}

