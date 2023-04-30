import { notFoundError, paymentError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import bookingsRepository from '@/repositories/bookings-repository';

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

const bookingsService = { getBooking };
export default bookingsService;
