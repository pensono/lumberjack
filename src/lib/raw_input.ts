import * as dfd from "danfojs"

export function toDataFrame(input: string) : dfd.DataFrame {
    let lines = input.split(/\r?\n|\r|\n/g);
    return new dfd.DataFrame({lines: lines});
}