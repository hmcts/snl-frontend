/**
 * Catch any exceptions in given function.
 * I.e. prevents throwing an exception when getting from object unexisting property
 * @param  {()=>T} sel Function that can throw an exception
 */
export function safe<T>(sel: () => T): T {
    'use strict';

    try {
        return sel();
    } catch (e) {
        return;
    }
}
