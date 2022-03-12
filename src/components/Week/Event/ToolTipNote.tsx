import React from "react";
import { DM, iMREVT_ASSOCIATION, iMREVT_EVENT, iMREVT_REF } from "@eos/mrsoft-core";

import week from "../Week.module.scss";
import { format } from "date-fns";
import Link from "../../../UI/components/Link";

interface iToolTipElementProps {
    event?: iMREVT_EVENT;
}

export default function ToolTipElement({ event }: iToolTipElementProps) {
    return (
        <div className={week.tooltipElement}>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>Заметка:</div>
                <div className={week.columnRight}>{event?.BODY}</div>
            </div>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>На дату:</div>
                <div className={week.columnRight}>{format(new Date(event?.EVENT_DATE || 0), 'dd.MM.yyyy HH:mm')}</div>
            </div>
            <DLs items={event?.MREVT_ASSOCIATION_List || []} />
            <Links items={event?.MREVT_REF_List || []} />
        </div >
    )
}

interface iDLsProps {
    items: iMREVT_ASSOCIATION[];
}

function DLs({ items }: iDLsProps) {
    const isMore = items.length > 1;
    if (items.length) return (
        <div className={week.tooltipRow}>
            <div className={week.columnLeft}>Кому:</div>
            <div className={week.columnRight}>
                {items.slice(0, 1).map(item => <div key={item.ISN_ASSOCIATION}>{DM.get('DEPARTMENT', item.DUE_DEPARTMENT, 'CLASSIF_NAME')}</div>)}
                {isMore ? <span>, ...</span> : ''}
            </div>
        </div>
    )
    else return null;
}

interface iLinksProps {
    items: iMREVT_REF[];
}

function Links({ items }: iLinksProps) {
    const isMore = items.length > 1;
    if (items.length) return (
        <div className={week.tooltipRow}>
            <div className={week.columnLeft}>Прикрепл. ссылки:</div>
            <div className={week.columnRight}>
                {items.slice(0, 1).map(item => <Link key={item.ISN_REF} href={item} isEdit={false} />)}
                {isMore ? <span>, ...</span> : ''}
            </div>
        </div>
    )
    else return null;
}