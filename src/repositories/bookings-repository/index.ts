import { prisma } from '@/config';

async function getBooking(userId: number) {
  return prisma.booking.findFirst({ where: { userId }, include: { Room: true } });
}

async function createBooking(userId: number, roomId: number) {
  return prisma.booking.create({ data: { userId, roomId } });
}

async function getBookingById(userId: number, bookingId: number) {
  return prisma.booking.findFirst({ where: { userId, id: bookingId } });
}

async function updateBooking(userId: number, bookingId: number, roomId: number) {
  return prisma.booking.update({ where: { id: bookingId }, data: { userId, roomId } });
}

async function getBookedRoom(roomId: number) {
  return prisma.room.findFirst({
    where: {
      id: roomId,
    },
    include: {
      Booking: true,
    },
  });
}

const bookingsRepository = { getBooking, createBooking, getBookingById, updateBooking, getBookedRoom };

export default bookingsRepository;
