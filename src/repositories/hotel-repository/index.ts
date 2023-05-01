import { Hotel, Room, Booking } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function getHotelById(hotelId: number): Promise<Hotel & { Rooms: Room[] }> {
  return prisma.hotel.findFirst({ where: { id: hotelId }, include: { Rooms: true } });
}

async function getBookedRoom(id: number): Promise<Room & { Booking: Booking[] }> {
  return prisma.room.findUnique({
    where: { id },
    include: { Booking: true },
  });
}

const hotelRepository = { getHotels, getHotelById, getBookedRoom };

export default hotelRepository;
