import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import paymentsRepository from '@/repositories/payments-repository';
import { notFoundError, unauthorizedError } from '@/errors';
import { CardData } from '@/protocols';

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

export async function processPayment(paymentData: CardData, userId: number) {
  const ticket = await ticketsRepository.getTicketById(paymentData.ticketId);
  if (!ticket) {
    throw notFoundError();
  }
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (enrollment.id !== ticket.enrollmentId) {
    throw unauthorizedError();
  }
  const ticketType = await ticketsRepository.getTicketTypeById(ticket.ticketTypeId);

  const payment = await paymentsRepository.processPayment(paymentData, ticketType.price);

  await ticketsRepository.updateTicket(ticket.id);

  return payment;
}

const paymentsService = { getPayment, processPayment };

export default paymentsService;
