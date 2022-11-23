import * as dfd from "danfojs"
import * as csv from 'csv-parse/browser/esm/sync'
import type {LumberjackDocument} from "@/lib/types";


export function toDataFrame(document: LumberjackDocument) : dfd.DataFrame {
    switch (document.format.kind) {
        case "csv": {
            let records = csv.parse(document.contents, {columns: true});
            return new dfd.DataFrame(records);
        }
        case "log": {
            let lines = document.contents.split(/\r?\n|\r|\n/g);
            return new dfd.DataFrame({lines: lines});
        }
    }
}