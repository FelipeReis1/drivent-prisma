import { TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

const ticketsRepository = {
  getTicketsTypes,
};

export default ticketsRepository;
