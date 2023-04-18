import { NextFunction, Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';
import { CardData } from '@/protocols';

export async function getPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const userId = req.userId as number;
  const { ticketId } = req.query;
  try {
    if (!ticketId) {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    const payment = await paymentsService.getPayment(userId, Number(ticketId));
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}

export async function processPayment(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const cardData = req.body as CardData;
  const userId = req.userId as number;
  try {
    const payment = await paymentsService.processPayment(cardData, userId);
    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    next(error);
  }
}
