import React from "react";
import Icon from '../../../UI/components/Icon';

import legend from "./Legend.module.scss"

export default function Legend() {
    return (
        <div className={legend.legend}>
            <div className={legend.title}>Категории событий в календаре</div>
            <div className={legend.types}>
                <div className={legend.type}>
                    <span className={`${legend.dayItem} ${legend.yellowDot}`}></span>
                    <span>Поступившие документы</span>
                </div>
                <div className={legend.type}>
                    <span className={`${legend.dayItem} ${legend.redDot}`}></span>
                    <span>Окончание срока</span>
                </div>
                <div className={legend.type}>
                    <span className={`${legend.dayItem} ${legend.greenDot}`}></span>
                    <span>Совещания</span>
                </div>
                <div className={legend.type}>
                    <Icon name="message" className={legend.message} />
                    <span>Заметка</span>
                </div>
            </div>
        </div>
    );
}