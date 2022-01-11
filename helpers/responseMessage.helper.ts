import { Response } from "express";

export const successResponse = (res: Response, message: any, statusCode=200): Response => {
    return res.status(statusCode).send({message});
};

export const failureResponse = (res: Response, error: any, statusCode=500): Response => {
    return res.status(statusCode).send({error});
};