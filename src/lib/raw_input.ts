import * as dfd from "danfojs";
import {parse} from "csv-parse/browser/esm/sync";
import type {KustoSchema, LumberjackDocument} from "@/lib/types";


export function toDataFrame(document: LumberjackDocument) : dfd.DataFrame {
    switch (document.format.kind) {
        case "csv": {
            let records = parse(document.contents, {columns: true, cast: true, cast_date: true});
            return new dfd.DataFrame(records);
        }
        case "log": {
            let lines = document.contents.split(/\r?\n|\r|\n/g);
            lines = lines.filter(l => l.length != 0);
            return new dfd.DataFrame({line: lines});
        }
    }
}

export function inferSchema(input: dfd.DataFrame) : KustoSchema {
    let dtypeToKustoType = {
        "string": "string",
        "int32": "int"
    }
    let result = []
    for (let i = 0; i < input.columns.length; i++) {
        result.push({
            name: input.columns[i],
            type: dtypeToKustoType[input.dtypes[i]],
        });
    }

    return {columns: result};
}
