import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { iDEPARTMENT, Piper } from "@eos/mrsoft-core";
import { State } from "../../../store";
import NewNote from "./NewNote";
import EditNote from "./EditNote";
import AllNotes from "./AllNotes";

export default function Notes() {
    const allNotes = useSelector((state: State) => state.calendar.notes)
    const showNewNote = useSelector((state: State) => state.common.showNewNote);
    const editingNote = useSelector((state: State) => state.common.editingNote);

    //Загрузка департментов в DM
    useEffect(() => {
        const dep = allNotes?.reduce((acc, item) => {
            acc.push(...(item.MREVT_ASSOCIATION_List?.map(item => item.DUE_DEPARTMENT || '') || []));
            return acc;
        }, [] as string[]).join('|');
        if (dep) Piper.load<iDEPARTMENT[]>("DEPARTMENT", dep, { saveToStore: true });
    }, [allNotes]);
    if (showNewNote) return <NewNote />;
    else if (editingNote) return <EditNote editNote={editingNote} />
    else return <AllNotes />
}