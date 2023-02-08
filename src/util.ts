import { get, writable, type Subscriber, type Writable } from "svelte/store";
import { Vector2 } from "haumea/math";
import { clickState } from "./store";

    /**
    * Gets the click location relative to a HTML Element.
    * @param obj Clicked object
    * @param event mouse event
    */
    export function getMappedClickLocation(obj: HTMLElement): Vector2 {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate) / Dimension;
        const location = getClickLocation(obj);
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
    export function getClampedClickLocation(obj: HTMLElement): Vector2 {
        const rect = obj.getBoundingClientRect();
        // Formula -> clamp(MouseCoordinate - ElementCoordinate);
        return getClickLocation(obj).clamp(new Vector2(),new Vector2(rect.width, rect.height));
    }

    /**
    * Gets the click location relative to a HTML Element. Returns an (x,y) pair.
    * @param obj Clicked object
    * @param event mouse event
    */
    export function getClickLocation(obj: HTMLElement): Vector2 {
        const rect = obj.getBoundingClientRect();
        // Formula -> MouseCoordinate - ElementCoordinate;
        const elemPosition = new Vector2(Math.floor(rect.left)+1,Math.floor(rect.top)+1)
        return get(clickState).position.add(elemPosition.negate());
    }

    export let clamp = (value: number, min: number, max: number): number => {
        return Math.max(min,Math.min(max,value));
    }

    export class Reactive<T> {
        private _value:T;
        private _$value: Writable<T> = writable(undefined);
        constructor(value: T) {
            this._value = value;
            this._$value.set(value);
        }
        set value(value:T) {
            this._value = value;
            this._$value.set(value);
        }
        get value() {
            return this._value;
        }
        get $() {
            return this._$value;
        }
    }

    export class Signal {

        private _signal: Writable<boolean> = writable(true);
        constructor() {}
        signal() {
            this._signal.update(n => !n);
        }
        subscribe(fn: Function) {
            return this._signal.subscribe(() => fn());
        }
    }