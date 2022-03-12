
import { iDay } from "../../Dictionary/Interfaces"
import React from "react";
import year from "./Year.module.scss";
import Icon from "../../UI/components/Icon";

interface iProps {
    day: iDay;
}

export default function Note({ day }: iProps) {
    if (day.notes.length) return <Icon name="messageSmall" className={year.message} />
    return null
}
