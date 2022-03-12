
import React, { useEffect, useState } from "react";
import { DM, iMTG_ISSUE, iMTG_MEETING, Piper } from "@eos/mrsoft-core";
import { getEVENT_TYPE } from "../../../Utils/getField";

import week from "../Week.module.scss";
import { getPlanName } from "../../../Utils/CalendarHelper";
import { format } from "date-fns";
import { EventsType } from "../../../Dictionary/Enums";
import { useSelector } from "react-redux";
import { State } from "../../../store";

interface iToolTipElementProps {
    event?: iMTG_MEETING;
}

export default function ToolTipElement({ event }: iToolTipElementProps) {
    const [allIssues, setAllIssues] = useState<iMTG_ISSUE[]>([]);
    const [issuesThisDL, setIssuesThisDL] = useState<iMTG_ISSUE[]>([]);
    const DUE_CURRENT_USER = useSelector((state: State) => state.common.DUE_CURRENT_USER);
    const [responsible, setResponsible] = useState('')
    const responsibleQuestion = DUE_CURRENT_USER ? DM.get('DEPARTMENT', DUE_CURRENT_USER, 'CLASSIF_NAME') : '';
    useEffect(() => {
        if (event?.DUE_DEP)
            Piper.load('DEPARTMENT', event?.DUE_DEP, { saveToStore: true }).then(() => {
                setResponsible(DM.get('DEPARTMENT', event.DUE_DEP, 'CLASSIF_NAME'))
            })
    }, [event])
    useEffect(() => {
        if (!event?.ISN_MTG_MEETING || !DUE_CURRENT_USER) return;
        Piper.load<iMTG_ISSUE[]>(
            'MTG_ISSUE',
            {
                criteries:
                {
                    ISN_MTG_MEETING: event?.ISN_MTG_MEETING
                }
            },
            {
                expectArray: true,
                expand: 'MTG_INVITED_List'
            }
        ).then((allIssues) => {
            setAllIssues(allIssues);

            const isnParticipantsCurrentUser = event.MTG_PARTICIPANT_List?.filter(item => {
                return item.DUE_DL === DUE_CURRENT_USER
            }).map(item => item.ISN_MTG_PARTICIPANT) || [];
            const issuesThiDL = allIssues.filter(item => {
                return item.MTG_INVITED_List?.filter(item => {
                    return ~isnParticipantsCurrentUser.indexOf(item.ISN_MTG_PARTICIPANT)
                }).length;
            });
            setIssuesThisDL(issuesThiDL.sort((a, b) => {
                if (a.ISN_PARENT_ISSUE && b.ISN_PARENT_ISSUE) {
                    const parentIssueNumA = allIssues.find(item => item.ISN_MTG_ISSUE === a.ISN_PARENT_ISSUE);
                    const parentIssueNumB = allIssues.find(item => item.ISN_MTG_ISSUE === b.ISN_PARENT_ISSUE);
                    return parentIssueNumA?.ISSUE_NUM! - parentIssueNumB?.ISSUE_NUM!;
                }
                else if (a.ISN_PARENT_ISSUE) {
                    const parentIssueNumA = allIssues.find(item => item.ISN_MTG_ISSUE === a.ISN_PARENT_ISSUE);
                    return parentIssueNumA?.ISSUE_NUM! - b.ISSUE_NUM!;
                }
                else if (b.ISN_PARENT_ISSUE) {
                    const parentIssueNumB = allIssues.find(item => item.ISN_MTG_ISSUE === b.ISN_PARENT_ISSUE);
                    return a.ISSUE_NUM! - parentIssueNumB?.ISSUE_NUM!;
                }
                else if (a.ISSUE_NUM && b.ISSUE_NUM) return a.ISSUE_NUM - b.ISSUE_NUM;
                else return 0;
            }))
        })
    }, [DUE_CURRENT_USER, event])

    if (!event) return null;
    return (
        <div className={week.tooltipElement}>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>{getPlanName(getEVENT_TYPE(event) || 0)}:</div>
                <div className={week.columnRight}>{event?.NAME}</div>
            </div>
            <div className={week.tooltipRow}>
                <div className={week.columnLeft}>Время начала:</div>
                <div className={week.columnRight}>{format(new Date(event?.MEETING_DATE || 0), 'dd.MM.yyyy HH:mm')}</div>
            </div>
            {event?.REVIEW_END_DATE &&
                <div className={week.tooltipRow}>
                    <div className={week.columnLeft}>Время окончания:</div>
                    <div className={week.columnRight}>{format(new Date(event?.REVIEW_END_DATE), 'dd.MM.yyyy HH:mm')}</div>
                </div>}
            {event?.MEETING_PLACE &&
                <div className={week.tooltipRow}>
                    <div className={week.columnLeft}>Место:</div>
                    <div className={week.columnRight}>{event?.MEETING_PLACE}</div>
                </div>
            }
            <div className={week.tooltipRow}>
                {(getEVENT_TYPE(event) === EventsType.MEETING || getEVENT_TYPE(event) === EventsType.EXPERTISE || getEVENT_TYPE(event) === EventsType.SESSION) &&
                    <div className={week.columnLeft}>Секретарь:</div>
                }
                {getEVENT_TYPE(event) === EventsType.EVENT &&
                    <div className={week.columnLeft}>Ответственный:</div>
                }
                <div className={week.columnRight}>{responsible}</div>
            </div>
            {issuesThisDL.length > 0 &&
                <>
                    <div className={week.tooltipRow}>
                        {(getEVENT_TYPE(event) === EventsType.MEETING || getEVENT_TYPE(event) === EventsType.EXPERTISE || getEVENT_TYPE(event) === EventsType.SESSION) &&
                            <div className={week.columnLeft}>Докладчик:</div>
                        }
                        {getEVENT_TYPE(event) === EventsType.EVENT &&
                            <div className={week.columnLeft}>Ответственный:</div>
                        }
                        <div className={week.columnRight}>{responsibleQuestion}</div>
                    </div>
                    <div className={week.tooltipRow}>
                        {(getEVENT_TYPE(event) === EventsType.MEETING || getEVENT_TYPE(event) === EventsType.EXPERTISE || getEVENT_TYPE(event) === EventsType.SESSION) &&
                            <div className={week.columnLeft}>По вопросам:</div>
                        }
                        {getEVENT_TYPE(event) === EventsType.EVENT &&
                            <div className={week.columnLeft}>По задачам:</div>
                        }
                        <div className={week.columnRight}>{issuesThisDL.map(item => <Question key={item.ISN_MTG_ISSUE} allIssues={allIssues} issue={item} />)}</div>
                    </div>
                </>
            }
        </div >
    )
}


function Question({ issue, allIssues }: { issue: iMTG_ISSUE, allIssues: iMTG_ISSUE[] }) {
    const number = issue.ISN_PARENT_ISSUE ? allIssues.find(itemFromAll => itemFromAll.ISN_MTG_ISSUE === issue.ISN_PARENT_ISSUE)?.ISSUE_NUM + '.' + issue.ISSUE_NUM : issue.ISSUE_NUM;
    const beginDate = issue.BEG_DATE ? format(new Date(issue.BEG_DATE), 'dd.MM.yyyy HH:mm') : 'Дата не установлена';
    const endDate = issue.END_DATE ? format(new Date(issue.END_DATE), 'dd.MM.yyyy HH:mm') : 'Дата не установлена';
    return <div>№{number} ({`${beginDate} - ${endDate}`})</div>
}