import React from "react";
import { iMRGENERATED_EVENT } from "../../../store/calendar/types";
import { getEVENT_TYPE } from "../../../Utils/getField";

import week from "../Week.module.scss";

interface iToolTipElementProps {
    event?: iMRGENERATED_EVENT;
}

export default function ToolTipElement({ event }: iToolTipElementProps) {
    const type = getEVENT_TYPE(event)
    return (
        <div className={week.tooltipElement}>
            <div style={{ display: 'flex', flexDirection: "column" }}>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <div className={week.columnLeft}>{type}</div>
                    <div className={week.columnRight}>{event?.NAME_DOCUMENT}</div>
                </div>
                {/* <div style={{ display: 'flex', flexDirection: "row" }}>
                    <div className={week.columnLeft}>Время начала:</div>
                    <div className={week.columnRight}>EVENT_DATE</div>
                </div>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <div className={week.columnLeft}>Время окончания:</div>
                    <div className={week.columnRight}>EVENT_DATE_TO</div>
                </div>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <div className={week.columnLeft}>Место:</div>
                    <div className={week.columnRight}>BODY</div>
                </div>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <div className={week.columnLeft}>Принадлежность:</div>
                    <div className={week.columnRight}>BODY</div>
                </div>
                <div style={{ display: 'flex', flexDirection: "row" }}>
                    <div className={week.columnLeft}>Ответственный:</div>
                    <div className={week.columnRight}>BODY</div>
                </div> */}
            </div>

        </div >
    )
}