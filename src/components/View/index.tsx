import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { State } from "../../store";
import { ViewRange } from "../../Dictionary/Enums";
import Panel from "../Panel";
import ToDoList from "../ToDoList";
import Year from "../Year";
import Month from "../Month";
import Week from "../Week";
import Day from "../Day";
import Settings from "../Settings";
import Icon from "../../UI/components/Icon";
import { showSettings } from "../../store/common/actions";
import { loadGeneratedEvents, loadMeetings, loadNotes, loadPlans } from "../../store/calendar/actions";

import "./ViewGridAnimations.scss";
import view from "./View.module.scss";
import { Core, Piper } from "@eos/mrsoft-core";

export default function View() {
    const dispatch = useDispatch();
    const rangeType = useSelector((state: State) => state.calendar.rangeType)
    const isShowSettings = useSelector((state: State) => state.common.showSettings)
    const todoListFullView = useSelector((state: State) => state.common.todoListFullView)
    const compatibilityIE = navigator.userAgent.match(/Trident/i) != null

    const DUES = useSelector((state: State) => state.settings.DLPlanDUES)
    const CURRENT_DUE = useSelector((state: State) => state.common.DUE_CURRENT_USER)
    const DATE_START_FROM = useSelector((state: State) => state.settings.DLPlanDateStartFrom)
    const DATE_START_TO = useSelector((state: State) => state.settings.DLPlanDateStartTo)
    const DATE_FINISH_FROM = useSelector((state: State) => state.settings.DLPlanDateFinishFrom)
    const DATE_FINISH_TO = useSelector((state: State) => state.settings.DLPlanDateFinishTo)

    const print = async () => {
        const nDUES = DUES.length ? DUES.join("|") : CURRENT_DUE;
        const isnRefFile = await Piper.load<number>(
            "PrintEvent",
            {
                args: {
                    DUES: `${nDUES}`,
                    DATE_START_FROM: `${DATE_START_FROM?.toISOString()}`,
                    DATE_START_TO: `${DATE_START_TO?.toISOString()}`,
                    DATE_FINISH_FROM: `${DATE_FINISH_FROM?.toISOString()}`,
                    DATE_FINISH_TO: `${DATE_FINISH_TO?.toISOString()}`
                }
            },
        );

        const url = `${Core.DeloPath}/getfile.aspx/${isnRefFile}`;
        window.location.assign(url);
    };

    const refresh = () => {
        dispatch(loadGeneratedEvents())
        dispatch(loadNotes())
        dispatch(loadPlans())
        dispatch(loadMeetings())
    }

    return (
        <div className={view.view}>
            <div className={view.header}>
                <div className={view.homeLinkWrapper}>
                    <a className={view.homeLinkButton} href='../../'><Icon name='logout' />&nbsp;На главную</a>
                </div>
                <div className={view.title}>Календарь</div>
                <div className={view.icons}>
                    <span title="Обновить">
                        <Icon className={view.print} onClick={refresh} name="union" width={20} height={20} />&nbsp;
                    </span>
                    <span title="Печать">
                        <Icon className={view.print} onClick={print} name="print" width={20} height={20} />&nbsp;
                    </span>
                    <span title="Настройки">
                        <Icon className={view.settings} onClick={() => { dispatch(showSettings(true)) }} name="settings" width={20} height={20} />
                    </span>
                </div>
            </div>
            {isShowSettings && <Settings />}
            {!isShowSettings && (
                <>
                    <Panel />
                    {rangeType === ViewRange.Year && <Year />}
                    {rangeType !== ViewRange.Year && <CSSTransition
                        in={!todoListFullView}
                        classNames={'view'}
                        timeout={compatibilityIE ? 0 : { appear: 0, enter: 200, exit: 200 }}
                        mountOnEnter
                        unmountOnExit
                        appear
                    >
                        <div className={`${view.rangeGrid} ${rangeType !== ViewRange.Month ? view.rangeGridExclusion : ""}`}>
                            {rangeType === ViewRange.Month && <Month />}
                            {rangeType === ViewRange.Week && <Week />}
                            {rangeType === ViewRange.Day && <Day />}
                        </div>
                    </CSSTransition>}
                    {rangeType !== ViewRange.Year && <ToDoList />}
                </>
            )}
        </div>
    );
}