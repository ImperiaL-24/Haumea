import { Vector2 } from "./engine/Vector2";

    /**
    * Gets the click location relative to a HTML Element.
    * @param obj Clicked object
    * @param event mouse event
    */
    export function getMappedClickLocation(obj: HTMLElement, event:any): Vector2 {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate) / Dimension;
        const location = getClickLocation(obj, event);
        return new Vector2(
            location.x/rect.width,
            location.y/rect.height
        );
    }

    /**
    * Gets the clamped click location relative to a HTML Element. Returns an (x,y) pair.
    * @param obj Clicked object
    * @param event mouse event
    */
    export function getClampedClickLocation(obj: HTMLElement, event:any): Vector2 {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate);
        return getClickLocation(obj, event).clamp(new Vector2(),new Vector2(rect.width, rect.height));
    }

    /**
    * Gets the click location relative to a HTML Element. Returns an (x,y) pair.
    * @param obj Clicked object
    * @param event mouse event
    */
    export function getClickLocation(obj: HTMLElement, event:any): Vector2 {
        const rect = obj.getBoundingClientRect();
        // Formula -> MouseCoordinate - ElementCoordinate;
        return new Vector2(
            event.pageX-Math.floor(rect.left + window.scrollX)+1,
            event.pageY-Math.floor(rect.top + window.scrollY)+1
        );
    }

    export let clamp = (value: number, min: number, max: number): number => {
        return Math.max(min,Math.min(max,value));
    }