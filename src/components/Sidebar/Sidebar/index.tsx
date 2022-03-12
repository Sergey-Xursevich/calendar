import React from "react";
import Avatar from "../Avatar";
import Info from "../Info";
import Notes from "../Notes";

import sidebar from "./Sidebar.module.scss";

export default function Sidebar() {

    return (
        <div className={sidebar.sidebar}>
            <Avatar />
            <Info />
            <Notes />
        </div>
    );
}