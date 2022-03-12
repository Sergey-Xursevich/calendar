import React, { useEffect, useState } from "react";
import { DM, iDEPARTMENT, iMREVT_EVENT, Piper } from "@eos/mrsoft-core";
import { getEVENT_TYPE } from "../../../Utils/getField";

import week from "../Week.module.scss";
import { getPlanName } from "../../../Utils/CalendarHelper";
import { format } from "date-fns";

interface iToolTipElementProps {
    event?: iMREVT_EVENT;
}

export default function ToolTipElement({ event }: iToolTipElementProps) {
    const [mrEvtAssociationList, setMrEvtAssociationList] = useState<iDEPARTMENT[]>([]);
    useEffect(() => {
        if (event?.MREVT_ASSOCIATION_List?.length)
            Piper.load<iDEPARTMENT[]>('DEPARTMENT', event?.MREVT_ASSOCIATION_List?.map(item => item.DUE_DEPARTMENT)?.join('|'), { saveToStore: true, expectArray: true }).then((res) => {
                setMrEvtAssociationList(res);
            });
    }, [event])
    return (
        <div className={week.tooltipElement}>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>{getPlanName(getEVENT_TYPE(event) || 0)}:</div>
                <div className={week.columnRight}>{event?.TITLE}</div>
            </div>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>Время начала:</div>
                <div className={week.columnRight}>{format(new Date(event?.EVENT_DATE || 0), 'dd.MM.yyyy HH:mm')}</div>
            </div>
            {event?.EVENT_DATE_TO &&
                <div className={week.tooltipRow}>
                    <div className={week.columnLeft}>Время окончания:</div>
                    <div className={week.columnRight}>{format(new Date(event?.EVENT_DATE_TO || 0), 'dd.MM.yyyy HH:mm')}</div>
                </div>}
            {event?.PLACE &&
                <div className={week.tooltipRow}>
                    <div className={week.columnLeft}>Место:</div>
                    <div className={week.columnRight}>{event?.PLACE}</div>
                </div>
            }
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>Принадлежность:</div>
                {event?.IS_PERSONAL === 1 &&
                    <div className={week.columnRight}>Личный</div>
                }
                {event?.IS_COMMON === 1 &&
                    <div className={week.columnRight}>Общий</div>
                }
                {(event && event.IS_COMMON === 0 && event.IS_PERSONAL === 0) &&
                    <div className={week.columnRight}>
                        {mrEvtAssociationList.map(item =>
                            <div key={item.DUE}>{item.CLASSIF_NAME}</div>
                        )}
                    </div>
                }
            </div>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>Ответственный:</div>
                <div className={week.columnRight}>{DM.get('DEPARTMENT', event?.DUE_DEPARTMENT, 'CLASSIF_NAME')}</div>
            </div>
        </div >
    )
}