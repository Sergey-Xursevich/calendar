import React, { Component } from "react";

import button from "../styles/Button.module.scss"

interface iProps {
    className?: string;
}

interface iState {
}


export default class ButtonGroup extends Component<iProps, iState> {
    getClassName() {
        let classNames: string[] = [button.buttonGroup];
        if (this.props.className) classNames.push(this.props.className)
        return classNames.join(" ")
    }

    render() {
        return (
            <div className={this.getClassName()}>
                {this.props.children}
            </div>
        );
    }
}