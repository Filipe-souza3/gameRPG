import e from "express";


export class EventEmitter {
    private listeners: { [event: string]: Function[] } = {};

    on(event: string, listener: Function) {
        if (!this.listeners[event]) this.listeners[event] = []
        this.listeners[event].push(listener);
    }

    emit(event: string, data?: any) {
        if (!this.listeners[event]) return;
        this.listeners[event].forEach((listener) => listener(data));
    }
}