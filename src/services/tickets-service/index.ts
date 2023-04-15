import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

export async function getTicketsTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.getTicketsTypes();
  if (!ticketTypes) {
    throw notFoundError();
  }
  return ticketTypes;
}

export async function getTicket(userId: number): Promise<Ticket> {
  const ticket = await ticketsRepository.getTicket(userId);
  if (!ticket) {
    throw notFoundError();
  }
  return ticket;
}

const ticketsService = {
  getTicketsTypes,
  getTicket,
};

export default ticketsService;
