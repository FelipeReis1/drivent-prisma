import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketsTypes, getTicket } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', getTicketsTypes).get('/', getTicket);

export { ticketsRouter };
