import { getStatus as statusFn } from "@crypto-jambot/dataflow-utils";
import { Request, Response } from "@google-cloud/functions-framework";
import "dotenv/config";
type CustomRequest = Request & {
    headers: CustomHeader;
};
type CustomHeader = HeadersInit & {
    id: string;
    project: string;
};
export async function getStatus(req: CustomRequest, res: Response) {
    if (req.method != "GET") {
        res.status(400).send("Must be a GET request.");
        return;
    }
    const { id: jobId, project } = req.headers;
    if (!jobId || !project) {
        res.status(400).send("Missing jobId header or project header");
        return;
    }
    try {
        const result = await statusFn(project, jobId);
        res.status(200).json({ status: result });
    } catch (err) {
        res.status(500).send(err);
    }
}
