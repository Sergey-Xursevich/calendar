
import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss";
import { CommonViewType } from "../../store/common/types";
import Dots from "./Dots";
import Lines from "./Lines";
import Note from "./Note";

interface iProps {
    day: iDay;
    commonViewType: CommonViewType;
}

export default function DayItems({ day, commonViewType }: iProps) {
    return (
        <div className={year.dayItems}>
            <Dots day={day} commonViewType={commonViewType} />
            <Lines day={day} commonViewType={commonViewType} />
            <Note day={day} />
        </div>
    )
}
