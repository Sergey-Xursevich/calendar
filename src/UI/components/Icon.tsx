import React, { Component, CSSProperties } from "react";
import {
    Cross, Message, Down, Left, Right, Up, Settings, FullScreen,
    AddDL, AddLink, EditNote, NoteMultipleSend, Logout, CompactScreen,
    KindIncoming, KindCitizen, KindOutcoming, KindControl, KindProject, MessageSmall,
    Expertise, Event, Session, Private, AddDLSquare, AddLinkSquare, ExpertiseEmpty,
    EventEmpty, SessionEmpty, PrivateEmpty, Print, Spiner, Union, Save, DatePicker,
    EventFill, PrivateFill, SessionFill, ExpertiseFill, Reminder, ReminderHover,
} from "./assets";

import styles from "./Spiner.module.scss"

interface iProps {
    name: Icons;
    size?: string;
    width?: string | number;
    height?: string | number;
    className?: string;
    onClick?: Function;
    onMouseEnter?: Function;
    onMouseLeave?: Function;
    padding?: string;
    margin?: string;
    color?: string;
    title?: string;
    disabled?: boolean;
}

interface iState {
    toggled: boolean
}
export type Icons =
    // 'spinner' |
    'up' |
    'down' |
    'left' |
    'right' |
    'cross' |
    'message' |
    'settings' |
    'kindIncoming' |
    'kindCitizen' |
    'kindOutcoming' |
    'kindControl' |
    'kindProject' |
    'messageSmall' |
    'editNote' |
    'noteMultipleSend' |
    'logout' |
    'fullScreen' |
    'compactScreen' |
    'expertise' |
    'event' |
    'private' |
    'session' |
    'expertiseEmpty' |
    'eventEmpty' |
    'privateEmpty' |
    'sessionEmpty' |
    'addDL' |
    'addDLSquare' |
    'addLink' |
    'addLinkSquare' |
    'print' |
    'spiner' |
    'union' |
    'save' |
    'timeLabel' |
    'eventFill' |
    'privateFill' |
    'sessionFill' |
    'expertiseFill' |
    'reminder' |
    'reminderHover';

export default class Icon extends Component<iProps, iState> {
    constructor(props: iProps) {
        super(props);
        this.state = {
            toggled: false
        }
    }

    upperCaseFirstLetter(str: string | undefined) {
        if (str)
            return str[0].toUpperCase() + str.slice(1)
        return ''
    }

    handleClick = () => {
        if (this.props.disabled) return false;
        return this.props.onClick ? this.props.onClick() : false
    }

    handleMouseEnter = () => {
        if (this.props.disabled) return false;
        return this.props.onMouseEnter ? this.props.onMouseEnter() : false
    }

    handleMouseLeave = () => {
        if (this.props.disabled) return false;
        return this.props.onMouseLeave ? this.props.onMouseLeave() : false
    }

    options() {
        let style: CSSProperties = {
            padding: this.props.padding ? this.props.padding : undefined,
            margin: this.props.margin ? this.props.margin : undefined,
            opacity: this.props.disabled ? 0.5 : undefined,
            cursor: this.props.onClick && !this.props.disabled ? 'pointer' : undefined,
        }
        return {
            width: this.props.width || "10px",
            height: this.props.height || "10px",
            fill: this.props.color || "#BCBEC1",
            onClick: this.handleClick,
            onMouseEnter: this.handleMouseEnter,
            onMouseLeave: this.handleMouseLeave,
            className: this.props.className,
            style: style,
            title: this.props.title,
        }
    }

    setElementType() {
        let element = React.createElement(this.props.name, this.options())
        return element
    }

    chooseComponent(name: Icons) {
        switch (name) {
            case "up":
                return <Up {...this.options()} />;
            case "down":
                return <Down {...this.options()} />;
            case "left":
                return <Left {...this.options()} />;
            case "right":
                return <Right {...this.options()} />;
            case "cross":
                return <Cross {...this.options()} />;
            case "message":
                return <Message {...this.options()} />;
            case "settings":
                return <Settings {...this.options()} />;
            case "kindIncoming":
                return <KindIncoming {...this.options()} />;
            case "kindCitizen":
                return <KindCitizen {...this.options()} />;
            case "kindOutcoming":
                return <KindOutcoming {...this.options()} />;
            case "kindControl":
                return <KindControl {...this.options()} />;
            case "kindProject":
                return <KindProject {...this.options()} />;
            case "messageSmall":
                return <MessageSmall {...this.options()} />
            case "addLink":
                return <AddLink {...this.options()} />
            case "addDL":
                return <AddDL {...this.options()} />
            case "editNote":
                return <EditNote {...this.options()} />
            case "noteMultipleSend":
                return <NoteMultipleSend {...this.options()} />
            case "logout":
                return <Logout {...this.options()} />
            case "fullScreen":
                return <FullScreen {...this.options()} />
            case "compactScreen":
                return <CompactScreen {...this.options()} />
            case "expertise":
                return <Expertise {...this.options()} />
            case "event":
                return <Event {...this.options()} />
            case "private":
                return <Private {...this.options()} />
            case "session":
                return <Session {...this.options()} />
            case "addDLSquare":
                return <AddDLSquare {...this.options()} />
            case "addLinkSquare":
                return <AddLinkSquare {...this.options()} />
            case "expertiseEmpty":
                return <ExpertiseEmpty  {...this.options()} />
            case "eventEmpty":
                return <EventEmpty {...this.options()} />
            case "privateEmpty":
                return <PrivateEmpty {...this.options()} />
            case "sessionEmpty":
                return <SessionEmpty {...this.options()} />
            case "print":
                return <Print {...this.options()} />
            case "union":
                return <Union {...this.options()} />
            case "save":
                return <Save {...this.options()} />
            case "spiner":
                return <Spiner {...this.options()} className={[this.options().className, styles.spinner].join(' ')} />
            case "timeLabel":
                return <DatePicker {...this.options()} />
            case "eventFill":
                return <EventFill {...this.options()} />
            case "sessionFill":
                return <SessionFill {...this.options()} />
            case "privateFill":
                return <PrivateFill {...this.options()} />
            case "expertiseFill":
                return <ExpertiseFill {...this.options()} />
            case "reminder":
                return <Reminder {...this.options()} />
            case "reminderHover":
                return <ReminderHover {...this.options()} />
            // case "spinner":
            //     return <Spinner {...this.options()} />;

            default:
                return <div>Error IconName</div>
        }
    }

    render() {
        return (
            this.chooseComponent(this.props.name)
        );
    }
}