import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingsService from '@/services/bookings-service';

export async function getBooking(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  try {
    const booking = await bookingsService.getBooking(userId);
    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    next(error);
  }
}
