import z from "zod";


export const hint_schema = z.array(
    z.object({
        level: z.number().describe("ヒントの強力さ。1-10の値を取り、大きいほど解答の核に近い。"),
        content: z.string().describe("ヒントの内容")
    }).describe("ヒント")
);