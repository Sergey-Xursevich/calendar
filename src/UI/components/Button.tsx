import React, { Component, CSSProperties } from "react";
import Icon, { Icons } from "./Icon"
import Confirm from "./Confirm";

import button from "../styles/Button.module.scss"

interface iProps {
    onClick: Function;
    className?: string;
    confirm?: {
        question: string;
        title?: string;
    };
    text?: string | JSX.Element | null;
    icon?: Icons;
    iconWidth?: string;
    iconHeight?: string;
    isActive?: boolean;
    transparent?: boolean;
    fluid?: boolean;
    disable?: boolean;
    loading?: boolean;
    white?: boolean;
    title?: string

    styles?: CSSProperties;
}

interface iState {
    isConfirmOpen: boolean;
}

export default class Button extends Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = { isConfirmOpen: false };
    }

    setClassNames() {
        let classNames: string[] = [];
        classNames.push(button.button);
        if (this.props.white) classNames.push(button.white)
        if (this.props.transparent) classNames.push(button.transparent);
        if (this.props.fluid) classNames.push(button.fluid);
        if (this.props.isActive) classNames.push(button.active);
        if (this.props.className) classNames.push(this.props.className);
        return classNames.join(' ')
    }

    handleClick = (e: React.MouseEvent) => {
        if (this.props.confirm) return this.toggleConfirm()
        return this.props.onClick(e)
    }

    toggleConfirm = () => {
        this.setState({ isConfirmOpen: this.state.isConfirmOpen ? false : true })
    }

    render() {
        const { styles, text, icon, children, confirm, title, iconWidth, iconHeight } = this.props
        return (<>
            <button
                className={this.setClassNames()}
                onClick={this.handleClick}
                style={styles}
                title={title}
            >
                <div className={button.wrapper}>
                    <div>
                        {text}
                        {children}
                    </div>
                    <div className={icon === "down" ? "" : button.arrowDown}>
                        {icon && <span style={{ margin: "0 5px" }}>
                            <Icon name={icon} color={"#505050"} width={iconWidth} height={iconHeight} />
                        </span>}
                    </div>
                </div>
            </button >

            {confirm && this.state.isConfirmOpen &&
                <Confirm
                    title={confirm.title}
                    question={confirm.question}
                    submitConfirm={this.props.onClick}
                    toggleConfirm={this.toggleConfirm}
                />
            }
        </>);
    }
}