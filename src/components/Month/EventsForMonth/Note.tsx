import { isSameDay } from "date-fns";
import React from "react";
import { EventsType } from "../../../Dictionary/Enums"
import ToolTipElement from "./TooltipElement"
import { iMREVT_EVENT, ToolTip } from "@eos/mrsoft-core";
import Icon from "../../../UI/components/Icon";

import shortDay from "../ShortDay.module.scss"

interface iProps {
    notes: iMREVT_EVENT[];
    date: Date;
}

export default function Note({ notes, date }: iProps) {
    let count = notes.filter(item =>
        item.EVENT_TYPE === EventsType.NOTE
        && isSameDay(new Date(item.EVENT_DATE || 0), date)
    ).length
    if (count > 0) return (
        <ToolTip position='bottom-end' element={<ToolTipElement text={'Заметка'} />}>
            <div className={`${shortDay.monthStartItem}`}>
                <Icon name="message" color="#fff" width="20px" height="100%" />
            </div>
        </ToolTip>
    )
    else return null;
}
