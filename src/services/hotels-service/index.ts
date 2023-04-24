import { Hotel, Room } from '@prisma/client';
import { notFoundError, paymentError } from '@/errors';
import hotelsRepository from '@/repositories/hotel-repository';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicket(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentError();

  const hotels = await hotelsRepository.getHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

export async function getHotelById(userId: number, hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicket(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentError();

  const hotel = await hotelsRepository.getHotelById(hotelId);
  if (!hotel) throw notFoundError();

  return hotel;
}

const hotelsService = { getHotels, getHotelById };

export default hotelsService;
