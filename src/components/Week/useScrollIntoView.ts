import { useEffect } from "react";
import { iCurrentEvent } from "../../store/calendar/types";
import { getISN_EVENT } from "../../Utils/getField";
const compatibilityIE = navigator.userAgent.match(/Trident/i) != null

export const useScrollIntoView = (ref: React.RefObject<HTMLDivElement>, ISN_EVENT?: number, currentEvent?: iCurrentEvent) => {
    useEffect(() => {
        if (getISN_EVENT(currentEvent) === ISN_EVENT && !compatibilityIE) {
            ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'end' })
        }
        if (getISN_EVENT(currentEvent) === ISN_EVENT && compatibilityIE && !isElementInViewport(ref.current)) ref.current?.scrollIntoView(false)
    }, [currentEvent, ISN_EVENT, ref])
}

export function isElementInViewport(el: HTMLElement | null) {
    if (!el) return;
    var rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}