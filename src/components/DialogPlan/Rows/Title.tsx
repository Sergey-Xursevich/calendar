import React, { useCallback } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import { setTitle } from "../../../store/dialogPlan/actions";
import { State } from "../../../store";

import dialogNewPlan from "../DialogNewPlan.module.scss";

export default function Title() {
    const dispatch = useCallback(useDispatch(), []);
    const { edit, dialogCancelled, dialogDone, TITLE } = useSelector((state: State) => state.dialogPlan);
    const resultEdit = (dialogCancelled || dialogDone) ? false : edit;
    const onChangeTitle = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setTitle(event.target.value));
    }
    return (
        <div className={dialogNewPlan.row}>
            <span className={dialogNewPlan.label}>Тема:</span>
            <TextareaAutosize
                disabled={!resultEdit}
                className={dialogNewPlan.textarea}
                value={TITLE}
                onChange={onChangeTitle}
                minRows={3}
                maxRows={5}
                maxLength={255}
            />
        </div>
    )
}