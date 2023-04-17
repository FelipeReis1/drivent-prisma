import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

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

export async function createTicket(userId: number, ticketTypeId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  return await ticketsRepository.createTicket(enrollment.id, ticketTypeId);
}

const ticketsService = {
  getTicketsTypes,
  getTicket,
  createTicket,
};

export default ticketsService;
