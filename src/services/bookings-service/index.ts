import { notFoundError, paymentError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import bookingsRepository from '@/repositories/bookings-repository';
import hotelRepository from '@/repositories/hotel-repository';
import { forbiddenError } from '@/errors/forbidden-error';

export async function getBooking(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicket(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentError();

  const booking = await bookingsRepository.getBooking(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}

export async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicket(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) throw paymentError();

  const room = await hotelRepository.getBookedRoom(roomId);
  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingsRepository.createBooking(userId, roomId);

  return booking;
}

const bookingsService = { getBooking, createBooking };
export default bookingsService;
