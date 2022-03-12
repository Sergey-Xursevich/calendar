import "react-app-polyfill/ie9";
import "mdn-polyfills/Array.prototype.find";
import "mdn-polyfills/Array.prototype.includes";
import "mdn-polyfills/Array.prototype.findIndex";
import "mdn-polyfills/String.prototype.includes";
import "mdn-polyfills/String.prototype.endsWith"; // Используется в @mrsoft/core
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from 'react-redux'
import { store } from './store'
import preval from "preval.macro";
import "./components/App/App.scss";

// import cfg from "./mrconfig";
import { Core } from "@eos/mrsoft-core";

import App from "./components/App";
import { NotificationsProvider } from "@eos/mrsoft-core";

Core.init({ dontShowNotificationsOnErrors: true, useSvc: false, forceUseSvc: false });
Core.importLegacyCode(["jq", "jqui", "pop1", "pop2", "c", 'pipe']);

const dateTimeStamp = preval`module.exports = (() => {
  const date = new Date();
  const dd = date.getDate() > 9 ? date.getDate() : \`0\${date.getDate()}\`;
  const mm = date.getMonth() >= 9 ? date.getMonth() + 1 : \`0\${date.getMonth() + 1}\`
  const yyyy = date.getFullYear();
  const HH = date.getHours() > 9 ? date.getHours() : \`0\${date.getHours()}\`;
  const MM = date.getMinutes() > 9 ? date.getMinutes() : \`0\${date.getMinutes()}\`;
  return \`Дата сборки: \${dd}.\${mm}.\${yyyy} \${HH}:\${MM}\`
})()`;
console.log(`Дата сборки: ${dateTimeStamp}`);

document.title = 'Календарь'

ReactDOM.render(
    <Provider store={store}>
        <NotificationsProvider />
        <App />
        <div style={{
            position: "fixed",
            bottom: 3,
            right: 3,
            fontSize: 10,
            opacity: .5,
            userSelect: "none"
        }}>{dateTimeStamp}</div>
    </Provider>,
    document.getElementById("root")
);
