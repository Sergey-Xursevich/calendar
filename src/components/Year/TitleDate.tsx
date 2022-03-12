import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss";

interface iProps {
    day: iDay;
}

export default function TitleDate({ day }: iProps) {
    if (!day.mock)
        return (
            <div className={year.date}>{day.date.getDate()}</div>
        );
    return null;
}
