import React from "react";
import { useSelector } from "react-redux";
import EventTypeAndInsDate from "./Rows/EventTypeAndInsDate";
import { State } from "../../store";
import { StatusTypePlan } from "../../Dictionary/Enums";
import EventDates from "./Rows/EventDates";
import Title from "./Rows/Title";
import Place from "./Rows/Place";
import Responsible from "./Rows/Responsible";
import Reason from "./Rows/Reason";
import IsPersonalAndIsCommonAndStatus from "./Rows/IsPersonalAndIsCommonAndStatus";
import MrEvtAssociation from "./Rows/MrEvtAssociation";
import Note from "./Rows/Note";
import Results from "./Rows/Results";

import dialogNewPlan from "./DialogNewPlan.module.scss";

export default function Layout() {
    const STATUS = useSelector((state: State) => state.dialogPlan.STATUS);
    return (
        <div className={dialogNewPlan.dialogNewPlanLayout}>
            <EventTypeAndInsDate />
            <EventDates />
            <Title />
            <Place />
            <Responsible />
            <Reason />
            <IsPersonalAndIsCommonAndStatus />
            <MrEvtAssociation />
            <Note />
            {(STATUS === StatusTypePlan.CANCELLED || STATUS === StatusTypePlan.DONE) &&
                <Results />
            }
        </div >
    )
}