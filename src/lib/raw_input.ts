import * as dfd from "danfojs";
import {parse} from "csv-parse/browser/esm/sync";
import type {LumberjackDocument} from "@/lib/types";


export function toDataFrame(document: LumberjackDocument) : dfd.DataFrame {
    switch (document.format.kind) {
        case "csv": {
            let records = parse(document.contents, {columns: true, cast: true});
            return new dfd.DataFrame(records);
        }
        case "log": {
            let lines = document.contents.split(/\r?\n|\r|\n/g);
            lines = lines.filter(l => l.length != 0);
            return new dfd.DataFrame({line: lines});
        }
    }
}