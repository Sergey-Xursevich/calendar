import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { iMREVT_EVENT } from "@eos/mrsoft-core";
import { useSelector, useDispatch } from "react-redux";
import { setEditingNote } from "../../../../store/common/actions";
import { State } from "../../../../store";
import EditNote from "./NoteEditMode";
import ViewNote from "./NoteViewMode";

import "../NoteBodyAnimations.scss";


interface iProps {
    event?: iMREVT_EVENT;
    isNewNote?: boolean;
}

export default function Note(props: iProps) {
    const { event, isNewNote } = props;
    const dispatch = useDispatch();
    const editingNote = useSelector((state: State) => state.common.editingNote);

    if (editingNote || isNewNote) return <EditNote setEdit={(isnEvent) => dispatch(setEditingNote(isnEvent))} event={event} />
    else return <ViewNote setEdit={(isnEvent) => dispatch(setEditingNote(isnEvent))} event={event} />
}
