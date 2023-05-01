import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({ where: { userId }, include: { Room: true } });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function getBookingById(bookingId: number) {
  return prisma.booking.findFirst({ select: { Room: true }, where: { id: bookingId } });
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  return prisma.booking.update({ where: { id: bookingId }, data: { userId, roomId } });
}

const bookingsRepository = { getBooking, createBooking, getBookingById, updateBooking };

export default bookingsRepository;
