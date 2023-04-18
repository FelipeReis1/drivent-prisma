import { Ticket, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function getTicketsTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function getTicket(userId: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      TicketType: {
        select: {
          id: true,
          name: true,
          price: true,
          isRemote: true,
          includesHotel: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      createdAt: true,
      updatedAt: true,
    },
    where: {
      Enrollment: {
        userId: userId,
      },
    },
  });
}

async function createTicket(enrollmentId: number, ticketTypeId: number) {
  return prisma.ticket.create({
    data: {
      enrollmentId,
      ticketTypeId,
      status: 'RESERVED',
    },
    include: {
      TicketType: true,
    },
  });
}

async function getTicketById(id: number): Promise<Ticket> {
  return prisma.ticket.findFirst({
    where: { id },
  });
}

async function getTicketTypeById(id: number): Promise<TicketType> {
  return prisma.ticketType.findFirst({
    where: { id },
  });
}
async function updateTicket(id: number) {
  return prisma.ticket.update({
    where: {
      id,
    },
    data: {
      status: 'PAID',
    },
  });
}

const ticketsRepository = {
  getTicketsTypes,
  getTicket,
  createTicket,
  getTicketById,
  getTicketTypeById,
  updateTicket,
};

export default ticketsRepository;
