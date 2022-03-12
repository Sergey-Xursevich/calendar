import React from "react";
import { useSelector } from "react-redux";
import { EventsType } from "../../../Dictionary/Enums";
import CountEvents from "../CountEvents";
import { State } from "../../../store";

import info from "./Info.module.scss"

export default function Info() {
    const isMTG = useSelector((state: State) => state.calendar.isMTG);
    return (
        <div className={info.info}>
            <div className={info.date}>{`Все документы в работе`}</div>
            <div className={info.circles}>
                <CountEvents type={EventsType.RESOLUTION} />
                {isMTG && <CountEvents type={EventsType.MEETING} />}
                <CountEvents type={EventsType.VISA_SIGN} />
                <CountEvents type={EventsType.NOTE} />
            </div>
        </div>
    );
}