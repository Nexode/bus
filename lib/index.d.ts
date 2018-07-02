declare module '@nexode/bus' {

    import * as EventEmitter from 'events';
    import * as express from 'express-serve-static-core';

    namespace Bus {
        class Unit {
            constructor(name: string);
            publish(event: string, data: any): void;
            listen(unit: string): EventEmitter;
            attach(url: string): Unit;
        }

        function unit(name: string): Unit;
        function middleware(unit: Unit): express.RequestHandler;
    }

    export = Bus;
}
