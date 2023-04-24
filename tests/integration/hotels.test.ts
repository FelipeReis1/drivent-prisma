import faker from '@faker-js/faker';
import { TicketStatus } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import {
  createEnrollmentWithAddress,
  createUser,
  createTicketType,
  createTicket,
  remoteTicket,
  noHotelTicket,
  ticketWithHotel,
  createHotel,
  createRoom,
} from '../factories';
import { cleanDb, generateValidToken } from '../helpers';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /hotels', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it(`should respond with status 404 if no hotels are found`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await ticketWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when user have not paid the ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await remoteTicket();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await noHotelTicket();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it(`should respond with status 200 and with hotels data`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await ticketWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createHotel();

      const response = await server.get('/hotels').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toHaveLength(1);
    });
  });
});

describe('GET /hotels/:hotelId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/hotels/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 404 when user doesnt have an enrollment yet', async () => {
      const token = await generateValidToken();

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it('should respond with status 404 when user doesnt have a ticket yet', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    it(`should respond with status 404 if no hotels are found`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await ticketWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();

      const response = await server.get(`/hotels/${hotel.id + 1}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 402 when user have not paid the ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket type is remote', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await remoteTicket();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it('should respond with status 402 if ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await noHotelTicket();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      const response = await server.get('/hotels/1').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it(`should respond with status 200 and with hotels data`, async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await ticketWithHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoom(hotel.id);

      const response = await server.get(`/hotels/${hotel.id}`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toMatchObject({
        name: hotel.name,
        image: hotel.image,
        Rooms: [
          {
            name: room.name,
            capacity: room.capacity,
            hotelId: room.hotelId,
          },
        ],
      });
    });
  });
});
