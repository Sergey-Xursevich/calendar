
import React from "react";
import { DAYS_SHORT } from "../../Dictionary/Constants";
import year from "./Year.module.scss";

interface iProps { }

export default function WeekDays(props: iProps) {
    return (
        <div className={year.wrapWeekDays}>
            {DAYS_SHORT.map(item =>
                <div className={year.weekDays} key={item}>{item}</div>)
            }
        </div>
    )
}
