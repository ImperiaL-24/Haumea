    /**
     * Gets the click location relative to a HTML Element. Returns an (x,y) pair with x,y = [0,1]
     * @param obj Clicked object
     * @param event mouse event
     */

    export function getMappedClickLocation(obj: HTMLElement, event:any): {x:number, y:number} {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate) / Dimension;
        return {
            x: Math.max(0,Math.min(rect.width,(event.pageX-Math.floor(rect.left + window.scrollX)+1)))/rect.width,
            y: Math.max(0,Math.min(rect.height,(event.pageY-Math.floor(rect.top + window.scrollY)+1)))/rect.height
        };
    }

    /**
     * Gets the click location relative to a HTML Element. Returns an (x,y) pair.
     * @param obj Clicked object
     * @param event mouse event
     */

    export function getClickLocation(obj: HTMLElement, event:any): {x:number, y:number} {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate);
        return {
            x: Math.max(0,Math.min(rect.width,(event.pageX-Math.floor(rect.left + window.scrollX)+1))),
            y: Math.max(0,Math.min(rect.height,(event.pageY-Math.floor(rect.top + window.scrollY)+1)))
        }
    }