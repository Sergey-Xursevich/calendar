import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeloDialog, deloDialogAlert, EntityHelper, iMREVT_EVENT, Piper } from "@eos/mrsoft-core";
import { EventsType } from "../../Dictionary/Enums";
import { loadPlans } from "../../store/calendar/actions";
import { State } from "../../store";
import Layout from "./Layout";
import { setDialogCancelled, setDialogDone, setEdit, setShow } from "../../store/dialogPlan/actions";
import { findErrors } from "./Validation";
import { DB_DATE_FORMAT } from "../../Utils/CalendarHelper";
import { format } from "date-fns";

interface iProps { }

export default function DialogPlan(props: iProps) {
    const dispatch = useDispatch();
    const createByDefault = useSelector((state: State) => state.settings.createByDefault)
    const plan = useSelector((state: State) => state.dialogPlan.plan)
        || EntityHelper.createEntity<iMREVT_EVENT>('MREVT_EVENT')
    const {
        show, edit, ISN_EVENT,
        EVENT_TYPE,
        EVENT_DATE, EVENT_DATE_TO, EVENT_DATE_FACT, EVENT_DATE_TO_FACT,
        TITLE,
        PLACE,
        DUE_DEPARTMENT,
        REASON, MREVT_REF_REASON,
        IS_PERSONAL, STATUS, IS_COMMON,
        MREVT_ASSOCIATION,
        BODY,
        RESULTS, MREVT_REF_RESULTS
    } = useSelector((state: State) => state.dialogPlan)

    const onSubmit = () => {
        if (!edit) {
            dispatch(setEdit(true))
            return false;
        }
        const validationErrors = findErrors({ EVENT_TYPE, TITLE, DUE_DEPARTMENT, EVENT_DATE, EVENT_DATE_TO, EVENT_DATE_FACT, EVENT_DATE_TO_FACT, IS_PERSONAL, IS_COMMON, MREVT_ASSOCIATION });
        if (validationErrors.length > 0) {
            deloDialogAlert(validationErrors)
            return false;
        }
        plan.ISN_EVENT = ISN_EVENT;
        plan.EVENT_TYPE = (EVENT_TYPE === EventsType.SESSION || EVENT_TYPE === EventsType.MEETING) ? createByDefault : EVENT_TYPE;
        plan.EVENT_DATE = EVENT_DATE ? format(EVENT_DATE, DB_DATE_FORMAT) : '';
        plan.EVENT_DATE_TO = EVENT_DATE_TO ? format(EVENT_DATE_TO, DB_DATE_FORMAT) : void 0;
        plan.EVENT_DATE_FACT = EVENT_DATE_FACT ? format(EVENT_DATE_FACT, DB_DATE_FORMAT) : void 0;
        plan.EVENT_DATE_TO_FACT = EVENT_DATE_TO_FACT ? format(EVENT_DATE_TO_FACT, DB_DATE_FORMAT) : void 0;
        plan.TITLE = TITLE;
        plan.PLACE = PLACE;
        plan.DUE_DEPARTMENT = DUE_DEPARTMENT || '';
        plan.REASON = REASON;
        plan.MREVT_REF_List = [...MREVT_REF_REASON, ...MREVT_REF_RESULTS];
        plan.IS_COMMON = IS_COMMON;
        plan.IS_PERSONAL = IS_PERSONAL;
        plan.STATUS = STATUS;
        plan.BODY = BODY;
        plan.MREVT_ASSOCIATION_List = MREVT_ASSOCIATION;
        plan.RESULTS = RESULTS;
        return Piper.save(plan).then(() => {
            dispatch(loadPlans());
            return true
        });
    }

    const name = () => {
        if (!edit) return 'Редактировать';
        else if (ISN_EVENT > 0) return 'Сохранить';
        else return 'Создать';
    }

    return (
        <DeloDialog
            title="Создание пункта плана"
            show={show}
            onClose={() => {
                dispatch(setShow(false));
                dispatch(setEdit(false));
                dispatch(setDialogCancelled(false))
                dispatch(setDialogDone(false))
            }}
            config={
                {
                    actions: [
                        { name: name(), marked: true, click: onSubmit },
                        { name: 'Отмена', click: () => true }
                    ],
                    layout: <Layout />,
                    width: 700
                }
            }
        />
    );
}
