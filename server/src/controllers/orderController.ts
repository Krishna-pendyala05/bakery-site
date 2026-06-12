import { Response } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

export const createOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized session' });
    return;
  }

  const { items, totalAmount, deliveryDetails } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    res.status(400).json({ message: 'Order items are required' });
    return;
  }

  if (totalAmount === undefined || typeof totalAmount !== 'number') {
    res.status(400).json({ message: 'Valid totalAmount is required' });
    return;
  }

  try {
    // Perform database transaction to ensure order and items are created together
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the base Order record
      const order = await tx.order.create({
        data: {
          userId: req.user!.id,
          totalAmount,
          status: 'PENDING',
        },
      });

      // 2. Create the associated Order Items
      const orderItemsData = items.map((item: any) => ({
        orderId: order.id,
        cakeId: Number(item.cakeId),
        quantity: Number(item.quantity),
        price: Number(item.price),
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      // 3. Fetch order with its items to return
      const fullOrder = await tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: {
            include: {
              cake: true
            }
          }
        }
      });

      return fullOrder;
    });

    console.log(`[Order Services] New order placed successfully: ID ${result?.id} for User ID ${req.user.id}`);
    if (deliveryDetails) {
      console.log(`[Order Services] Deliver to: ${deliveryDetails.name}, Address: ${deliveryDetails.address}, Scheduled: ${deliveryDetails.date} at ${deliveryDetails.time}`);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: result,
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error processing order placement in database' });
  }
};
