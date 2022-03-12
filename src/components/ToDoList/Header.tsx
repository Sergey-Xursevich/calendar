import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { format, isBefore, isSameDay } from "date-fns";
import ruLocale from "date-fns/locale/ru";
import { iMREVT_EVENT, iMTG_MEETING } from "@eos/mrsoft-core";
import { iMRGENERATED_EVENT } from "../../store/calendar/types";
import { State } from "../../store";
import { MeetingStart, ResolutionStart, VisaSignStart } from "./../Month/EventsForMonth";
import ButtonGroup from "../../UI/components/ButtonGroup";
import Button from "../../UI/components/Button";
import { setToDoListFullView, setToDoListViewType } from "../../store/common/actions";
import cl from "classnames";

import todolist from "./ToDoList.module.scss"

interface iProps {
    generatedEventsCount: iMRGENERATED_EVENT[];
    plansCount: iMREVT_EVENT[];
    meetingsCount: iMTG_MEETING[];
}

export default function Header({ generatedEventsCount, plansCount, meetingsCount }: iProps) {
    const dispatch = useDispatch();
    const selection = useSelector((state: State) => state.calendar.selection);
    const todoListFullView = useSelector((state: State) => state.common.todoListFullView);
    const todoListViewType = useSelector((state: State) => state.common.todoListViewType);
    const commonViewType = useSelector((state: State) => state.common.commonViewType);

    return (
        <div className={todolist.header}>
            <div className={todolist.title}>
                {todoListViewType === "all" && <span>Все&nbsp;</span>}
                {commonViewType === "calendar" &&
                    <>
                        <ResolutionStart
                            events={generatedEventsCount}
                            date={selection?.date || new Date()}
                            compareCallback={(fDate, sDate) => isBefore(fDate, sDate) || isSameDay(fDate, sDate)}
                        />
                        <VisaSignStart
                            events={generatedEventsCount}
                            date={selection?.date || new Date()}
                            compareCallback={(fDate, sDate) => isBefore(fDate, sDate) || isSameDay(fDate, sDate)}
                        />
                        <MeetingStart
                            meetings={meetingsCount}
                            plans={[]}
                            date={selection?.date || new Date()}
                            compareCallback={(fDate, sDate) => isBefore(fDate, sDate) || isSameDay(fDate, sDate)}
                        />
                    </>
                }
                {commonViewType === 'plan' &&
                    <MeetingStart
                        meetings={meetingsCount}
                        plans={plansCount}
                        date={selection?.date || new Date()}
                        compareCallback={(fDate, sDate) => isBefore(fDate, sDate) || isSameDay(fDate, sDate)}
                    />
                }
                <span>&nbsp;в работе на&nbsp;
            <span className={cl({ [todolist.holiday]: selection?.isHoliday })}>{format(new Date(selection?.date || 0), 'd MMMM', { locale: ruLocale })}</span>
                </span>
            </div>
            <ButtonGroup className={todolist.switcher}>
                <Button
                    text="На дату"
                    onClick={() => dispatch(setToDoListViewType('onDate'))}
                    isActive={todoListViewType === 'onDate'}
                    styles={{ width: "70px", height: '24px', padding: 0, lineHeight: 'normal' }}
                    white
                />
                <Button
                    text="Все"
                    onClick={() => dispatch(setToDoListViewType('all'))}
                    isActive={todoListViewType === 'all'}
                    styles={{ width: "70px", height: '24px', padding: 0, lineHeight: 'normal' }}
                    white
                />
            </ButtonGroup>
            <Button
                title={todoListFullView ? 'Свернуть список документов' : 'Развернуть список документов'}
                icon={todoListFullView ? 'fullScreen' : 'compactScreen'}
                iconHeight={'20px'}
                iconWidth={'20px'}
                styles={{ padding: '0 10px 0 0' }}
                onClick={() => dispatch(setToDoListFullView(!todoListFullView))}
                transparent
            />
        </div>
    );
}
