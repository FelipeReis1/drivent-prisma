import { TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

export async function getTicketsTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.getTicketsTypes();
  if (!ticketTypes) {
    throw notFoundError();
  }
  return ticketTypes;
}

const ticketsService = {
  getTicketsTypes,
};

export default ticketsService;
