import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import { notFoundError, unauthorizedError } from '@/errors';

export async function getPayment(userId: number, ticketId: number) {
  const ticket = await ticketsRepository.getTicketById(ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment.id !== ticket.enrollmentId) {
    throw unauthorizedError();
  }
  const payment = await paymentsRepository.getPayment(ticketId);
  return payment;
}

const paymentsService = { getPayment };

export default paymentsService;
