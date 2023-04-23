import { Hotel } from '@prisma/client';
import { notFoundError, paymentError } from '@/errors';
import hotelsRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicket(enrollment.id);
  if (!ticket) throw notFoundError();

  const hotels = await hotelsRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();

  const ticketType = await ticketsRepository.getTicketTypeById(ticket.id);

  if (ticket.status !== 'PAID' || ticketType.isRemote || !ticketType.includesHotel) throw paymentError();

  return hotels;
}

const hotelsService = { getHotels };

export default hotelsService;
