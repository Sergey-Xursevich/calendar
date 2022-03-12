import React, { Component } from "react";
import ReactDOM from "react-dom";

import confirm from "../styles/Confirm.module.scss"
import Button from "./Button";

interface iProps {
    submitConfirm: Function;
    toggleConfirm: Function;
    question: string;
    title?: string;
}

interface iState {
}


export default class Confirm extends Component<iProps, iState> {
    confirm: HTMLElement;
    modalRoot: HTMLElement | null;

    constructor(props: iProps) {
        super(props);
        this.state = {
            isConfirmOpen: false
        }
        this.confirm = document.createElement('div');
        this.confirm.className = "modal-root__confirm"
        this.modalRoot = document.getElementById('root');
    }

    componentDidMount() {
        if (this.modalRoot) this.modalRoot.appendChild(this.confirm)
    }

    componentWillUnmount() {
        if (this.modalRoot) this.modalRoot.removeChild(this.confirm)
    }

    handleSubmitConfirm = () => {
        this.props.toggleConfirm()
        this.props.submitConfirm()
    }

    render() {
        const { toggleConfirm, question, title } = this.props;
        return ReactDOM.createPortal(
            <div className={confirm.overlay} onClick={() => toggleConfirm()}>
                <div className={confirm.window} onClick={event => event.stopPropagation()}>
                    <div className={confirm.header}>{title ? title : "Подтвердите действие"}</div>
                    <div className={confirm.wrapper}>
                        <div className={confirm.body}>{question}</div>
                        <div className={confirm.footer}>
                            <Button onClick={() => this.handleSubmitConfirm()} text="Удалить" />
                            <Button onClick={toggleConfirm} text="Отмена" />
                        </div>
                    </div>
                </div>
            </div>,
            this.confirm,
        );
    }
}