import { notFoundError, forbiddenError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import bookingsRepository from '@/repositories/bookings-repository';

export async function getBooking(userId: number) {
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

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await bookingsRepository.getBookedRoom(roomId);
  if (!room) throw notFoundError();

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingsRepository.createBooking(userId, roomId);

  return booking.id;
}

export async function updateBooking(userId: number, roomId: number, bookingId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.getTicket(userId);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw forbiddenError();
  }

  const room = await bookingsRepository.getBookedRoom(roomId);
  if (!room) {
    throw notFoundError();
  }

  if (room.capacity <= room.Booking.length) throw forbiddenError();

  const booking = await bookingsRepository.getBookingById(userId, bookingId);
  if (!booking) throw forbiddenError();

  const updateBooking = await bookingsRepository.updateBooking(userId, bookingId, roomId);

  return updateBooking;
}

const bookingsService = { getBooking, createBooking, updateBooking };
export default bookingsService;
