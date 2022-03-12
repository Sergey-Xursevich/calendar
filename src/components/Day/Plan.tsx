import { iDEPARTMENT, iMREVT_EVENT, Piper } from "@eos/mrsoft-core";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { iDay } from "../../Dictionary/Interfaces";
import { State } from "../../store";
import { setSelection } from "../../store/calendar/actions";
import Icon from "../../UI/components/Icon";
import Link from "../../UI/components/Link";
import { getIconPlanName, getPlanName } from "../../Utils/CalendarHelper";
import { getISN_EVENT } from "../../Utils/getField";
import dayClass from "./Day.module.scss"

interface iProps {
    item: iMREVT_EVENT;
}

export default function Plan(props: iProps) {
    const { item,
        item: {
            ISN_EVENT,
            EVENT_DATE,
            BODY, EVENT_TYPE,
            PLACE,
            STATUS,
            EVENT_DATE_TO,
            DUE_DEPARTMENT,
            TITLE,
            REASON,
            IS_COMMON,
            IS_PERSONAL,
            MREVT_ASSOCIATION_List,
            MREVT_REF_List
        }
    } = props;
    const classes = [dayClass.timeLineItem];
    const currentEvent = useSelector((state: State) => state.calendar.currentEvent)
    const [responsible, setResponsible] = useState('')
    const reasonsDocs = MREVT_REF_List?.filter(item => item.REF_KIND === 'DOC_RC' || item.REF_KIND === 'PRJ_RC');
    useEffect(() => {
        if (!DUE_DEPARTMENT) return;
        setResponsible('Загрузка...');
        Piper.load<iDEPARTMENT>('DEPARTMENT', DUE_DEPARTMENT, { saveToStore: true }).then((res) => {
            setResponsible(res.CLASSIF_NAME || res.SURNAME || res.FULLNAME || DUE_DEPARTMENT);
        })
    }, [DUE_DEPARTMENT]);

    const dispatch = useDispatch();
    const setSelected = (selection: { day?: iDay, event?: iMREVT_EVENT }, e: React.MouseEvent) => {
        e.stopPropagation();
        dispatch(setSelection({ event: selection.event }))
    }
    const [mrEvtAssociationList, setMrEvtAssociationList] = useState<iDEPARTMENT[]>([]);

    useEffect(() => {
        if (MREVT_ASSOCIATION_List?.length)
            Piper.load<iDEPARTMENT[]>('DEPARTMENT', MREVT_ASSOCIATION_List?.map(item => item.DUE_DEPARTMENT)?.join('|'), { saveToStore: true, expectArray: true }).then((res) => {
                setMrEvtAssociationList(res);
            });
    }, [MREVT_ASSOCIATION_List])
    if (getISN_EVENT(currentEvent) === ISN_EVENT) classes.push(dayClass.selected)
    return (
        <div className={classes.join(' ')} onClick={(e) => { if (ISN_EVENT) setSelected({ event: item }, e) }}>
            <div className={dayClass.time}>{format(new Date(EVENT_DATE || 0), 'HH:mm')}</div>
            <div className={[dayClass.body, dayClass.plan].join(' ')}>
                <div className={dayClass.title}>
                    <Icon color="#58B070" width={14} height={14} name={getIconPlanName(EVENT_TYPE)} />
                    <span className={dayClass.TitleName}>
                        <span>{getPlanName(EVENT_TYPE)}:</span>
                        <span>{TITLE}</span>
                    </span>
                    <span>{STATUS === 1 ? 'ОТМЕНЕНО' : format(new Date(EVENT_DATE || 0), 'dd.MM.yyyy HH:mm')}</span>
                </div>
                <div className={dayClass.content}>
                    <div className={dayClass.row}>
                        <span className={dayClass.column}>{BODY}</span>
                    </div>
                    <div className={dayClass.row}>
                        <span className={dayClass.column}>Время начала:</span>
                        <span className={dayClass.column}>{format(new Date(EVENT_DATE || 0), 'dd.MM.yyyy HH:mm')}</span>
                        {PLACE &&
                            <>
                                <span className={dayClass.column}>Место:</span>
                                <span className={dayClass.column}>{PLACE}</span>
                            </>
                        }
                    </div>
                    {EVENT_DATE_TO &&
                        <div className={dayClass.row}>
                            <span className={dayClass.column}>Время окончания:</span>
                            <span className={dayClass.column}>{format(new Date(EVENT_DATE_TO), 'dd.MM.yyyy HH:mm')}</span>
                        </div>
                    }
                    <div className={dayClass.row}>
                        <span className={dayClass.column}>Ответственный:</span>
                        <span className={dayClass.column}>{responsible}</span>
                    </div>
                    {(REASON || (reasonsDocs && reasonsDocs.length > 0)) &&
                        <div className={dayClass.row}>
                            <span className={dayClass.column}>Основание:</span>
                            <div className={dayClass.column}>
                                <span>{REASON}</span>
                                <span>
                                    {reasonsDocs?.map(item =>
                                        <Link key={item.ISN_REF} backGround={false} href={item} isEdit={false} />
                                    )}
                                </span>
                            </div>
                        </div>
                    }
                    <div className={dayClass.row}>
                        <div className={dayClass.column}>Принадлежность:</div>
                        {IS_PERSONAL === 1 &&
                            <div className={dayClass.column}>Личный</div>
                        }
                        {IS_COMMON === 1 &&
                            <div className={dayClass.column}>Общий</div>
                        }
                        {(IS_COMMON === 0 && IS_PERSONAL === 0) &&
                            <div className={dayClass.column}>
                                {mrEvtAssociationList.map(item =>
                                    <div key={item.DUE}>{item.CLASSIF_NAME}</div>
                                )}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}
