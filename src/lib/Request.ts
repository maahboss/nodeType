import { Request } from "express";

export interface IRequest extends Request {
    [key: string]: any;
}
