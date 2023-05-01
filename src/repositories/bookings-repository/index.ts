import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getBooking(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({ where: { userId }, include: { Room: true } });
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function getBookingById(bookingId: number): Promise<{ Room: Room }> {
  const booking = await prisma.booking.findFirst({ select: { Room: true }, where: { id: bookingId } });

  return booking;
}

async function updateBooking(userId: number, bookingId: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({ where: { id: bookingId }, data: { userId, roomId } });
}

const bookingsRepository = { getBooking, createBooking, getBookingById, updateBooking };

export default bookingsRepository;
