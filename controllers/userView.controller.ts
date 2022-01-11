import UserViews from "../models/userView.model"
import User from "../models/user.model"
import { Request, Response } from "express";
import { successResponse, failureResponse } from "../helpers/responseMessage.helper"
import { constructFilter, formatResponse} from "../helpers/userView.helper";

const NOTFOUND = 0;
const TIME_RANGES = ["daily", "weekly", "monthly", "custom"]

class UserView {
  /**
   * @function getAll
   * @param req
   * @param res
   */
  public async getAll(req: Request, res: Response) {
    const productId = req.params.productId
    const p         = req.query.p ? parseInt(req.query.p.toString(), 10) : 1;
    const limit     = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 10;
    const offset    = limit * (p - 1);

    const timeRange  = req.query.timeRange ? JSON.parse(req.query.timeRange.toString()) : "" 
    const start_date = req.query.start_time ? JSON.parse(req.query.start_time.toString()) : ""
    const end_date   = req.query.end_time ? JSON.parse(req.query.end_time.toString()) : ""

    if (timeRange && !TIME_RANGES.includes(timeRange)) {
      return failureResponse(res, "Invalid time range type", 400);
    }

    if (timeRange == "custom" && ( start_date == "" || end_date == "")) {
      return failureResponse(res, "Kindly add both start and end date for custom time range", 400);
    }

    let where = constructFilter(timeRange, start_date, end_date)
    where = { productId: productId, ...where }
    
    const totalUserViews = await UserViews.find(where, { _id: 0, userId: 1, productId: 1}).limit(+limit).skip(+offset)
    const totalDocuments = await UserViews.countDocuments(where)
    const users          = await User.find({id: {$in: totalUserViews.map((x: any) => { return x.userId })}})

    const result = formatResponse(totalUserViews, users)

    return successResponse(res, { "total users": result, "page count": result.length, "total count": totalDocuments }, 200)
  }

  /**
   * @function getAllUniqueViews
   * @param req
   * @param res
   */
  public async getAllUniqueViews(req: Request, res: Response) {
    const productId = req.params.productId
    const p         = req.query.p ? parseInt(req.query.p.toString(), 10) : 1;
    const limit     = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 10;

    const timeRange  = req.query.timeRange ? JSON.parse(req.query.timeRange.toString()) : "" 
    const start_date = req.query.start_time ? JSON.parse(req.query.start_time.toString()) : ""
    const end_date   = req.query.end_time ? JSON.parse(req.query.end_time.toString()) : ""

    if (timeRange && !TIME_RANGES.includes(timeRange)) {
      return failureResponse(res, "Invalid time range type", 400);
    }

    if (timeRange == "custom" && ( start_date == "" || end_date == "")) {
      return failureResponse(res, "Kindly add both start and end date for custom time range", 400);
    }

    let where = constructFilter(timeRange, start_date, end_date)
    where = { productId: productId, ...where}

    const distinctUserViews = await UserViews.aggregate([{ "$group": { "_id": "$userId" } }, { "$skip": ( p - 1 ) * limit }, { "$limit": limit } ]);
    const totalDocuments    = await UserViews.countDocuments(where).distinct("userId")
    const users             = await User.find({id: { $in: distinctUserViews }})
    
    return successResponse(res, { "total unique views": totalDocuments.length, "current page views": distinctUserViews.length, "unique users": users }, 200)
  }
}

export const userView: UserView = new UserView();