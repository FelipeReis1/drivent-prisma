import { prisma } from '@/config';
import { CardData } from '@/protocols';

async function getPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: { ticketId },
  });
}

async function processPayment(paymentData: CardData, price: number) {
  return prisma.payment.create({
    data: {
      ticketId: paymentData.ticketId,
      value: price,
      cardIssuer: paymentData.cardData.issuer,
      cardLastDigits: paymentData.cardData.number.toString().substring(11, 16),
    },
  });
}

const paymentsRepository = {
  getPayment,
  processPayment,
};

export default paymentsRepository;
