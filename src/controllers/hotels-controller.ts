import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  try {
    const hotels = await hotelsService.getHotels(userId);
    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    next(error);
  }
}

export async function getHotelById(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const hotelId = req.params as { id: string };
  try {
    const hotel = await hotelsService.getHotelById(userId, Number(hotelId));
    return res.status(httpStatus.OK).send(hotel);
  } catch (error) {
    next(error);
  }
}
