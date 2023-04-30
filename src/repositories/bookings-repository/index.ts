import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getBooking(userId: number): Promise<Booking & { Room: Room }> {
  return prisma.booking.findFirst({ where: { userId }, include: { Room: true } });
}

const bookingsRepository = { getBooking };

export default bookingsRepository;
