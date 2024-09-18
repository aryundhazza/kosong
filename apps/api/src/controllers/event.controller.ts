import { Request, Response } from 'express';
import prisma from '../prisma';
import { Category, Prisma } from '@prisma/client';

export class EventController {
  async createEvent(req: Request, res: Response) {
    try {
      if (!req.file) throw 'no file uploaded';
      const link = `http://localhost:8000/api/public/event/${req?.file?.filename}`;

      const {
        name,
        category,
        price,
        dateTime,
        location,
        description,
        seatsAvailable,
        ticketTypes,
        slug,
        organizerId,
      } = JSON.parse(req.body.data);

      const event = await prisma.event.create({
        data: {
          name,
          category,
          price,
          dateTime,
          location,
          description,
          seatsAvailable,
          ticketTypes,
          slug,
          image: link,
          organizerId: organizerId,
        },
      });

      res.status(201).send({
        status: 'ok',
        msg: 'event created !',
        event,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getMyEvents(req: Request, res: Response) {
    try {
      // Retrieve query parameters
      const {
        search,
        page = 1,
        pageSize = 10,
        organizerId,
        category,
      } = req.query;

      // Convert page and pageSize to numbers
      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

      // Validate pagination parameters
      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid page number',
        });
      }

      if (isNaN(pageSizeNumber) || pageSizeNumber <= 0) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid page size',
        });
      }

      let filter: Prisma.EventWhereInput = {};

      if (search) {
        filter.name = { contains: search as string };
      }

      if (category && category !== 'all') {
        try {
          filter.category = category as Category;
        } catch (error) {
          return res.status(400).send({
            status: 'error',
            msg: 'Invalid category value',
          });
        }
      }

      if (organizerId) {
        const organizerIdNumber = parseInt(organizerId as string, 10);
        if (!isNaN(organizerIdNumber)) {
          filter.organizerId = organizerIdNumber;
        } else {
          return res.status(400).send({
            status: 'error',
            msg: 'Invalid organizerId',
          });
        }
      }

      const [events, totalCount] = await Promise.all([
        prisma.event.findMany({
          where: filter,
          orderBy: { createdAt: 'desc' },
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),
        prisma.event.count({ where: filter }),
      ]);

      res.status(200).send({
        status: 'ok',
        events,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSizeNumber,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSizeNumber),
        },
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getEvents(req: Request, res: Response) {
    try {
      const { search, page = 1, pageSize = 10, category } = req.query;

      const pageNumber = parseInt(page as string, 10);
      const pageSizeNumber = parseInt(pageSize as string, 10);

      if (isNaN(pageNumber) || pageNumber <= 0) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid page number',
        });
      }
      if (isNaN(pageSizeNumber) || pageSizeNumber <= 0) {
        return res.status(400).send({
          status: 'error',
          msg: 'Invalid page size',
        });
      }

      let filter: Prisma.EventWhereInput = {};
      if (search) {
        filter.name = { contains: search as string };
      }
      if (category && category !== 'all') {
        try {
          filter.category = category as Category;
        } catch (error) {
          return res.status(400).send({
            status: 'error',
            msg: 'Invalid category value',
          });
        }
      }

      const [events, totalCount] = await Promise.all([
        prisma.event.findMany({
          where: filter,
          orderBy: { createdAt: 'desc' },
          skip: (pageNumber - 1) * pageSizeNumber,
          take: pageSizeNumber,
        }),
        prisma.event.count({ where: filter }),
      ]);

      res.status(200).send({
        status: 'ok',
        events,
        pagination: {
          currentPage: pageNumber,
          pageSize: pageSizeNumber,
          totalItems: totalCount,
          totalPages: Math.ceil(totalCount / pageSizeNumber),
        },
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getEventSlug(req: Request, res: Response) {
    try {
      const events = await prisma.event.findFirst({
        where: { slug: req.params.slug },
        include: { organizer: true },
        orderBy: { createdAt: 'desc' },
      });
      res.status(200).send({
        status: 'ok',
        events,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async buyTicket(req: Request, res: Response) {
    try {
      const { eventId, totalTicket, userId } = req.body;

      const result = await prisma.$transaction(async (prisma) => {
        const user = await prisma.user.findUnique({
          where: { id: +userId },
        });

        const event = await prisma.event.findUnique({
          where: { id: eventId },
        });

        const organizer = await prisma.user.findUnique({
          where: { id: event?.organizerId },
        });

        let price = 0;
        let saldo = 0;
        if (!event) {
          throw new Error('event not found');
        } else {
          price = event.price * totalTicket;
        }

        let ticketAvail = event.seatsAvailable;
        let ticketSesudahDipesan = ticketAvail - totalTicket;

        if (user && user.saldo < price) {
          return res.status(500).send({
            status: 'error',
            msg: 'Saldo Tidak Mencukupi!',
          });
        }

        if (user && user.saldo) {
          saldo = user.saldo - price;
        }

        await prisma.event.update({
          where: { id: eventId },
          data: { seatsAvailable: ticketSesudahDipesan },
        });

        await prisma.user.update({
          where: { id: userId },
          data: { saldo: saldo },
        });

        if (organizer) {
          await prisma.user.update({
            where: { id: organizer?.id },
            data: { saldo: organizer?.saldo + price },
          });
        }

        await prisma.registration.create({
          data: {
            userId,
            eventId,
            totalTicket,
            ticketPrice: totalTicket * event.price,
          },
        });

        res.status(200).send({
          status: 'ok',
          msg: 'Ticket Purchase Successful!',
        });
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: 'user not found!',
      });
    }
  }

  async review(req: Request, res: Response) {
    try {
      const { eventId, userId, rating, comment } = req.body;

      const review = await prisma.review.create({
        data: {
          rating,
          comment,
          userId,
          eventId,
        },
      });
      res.status(201).send({
        status: 'ok',
        msg: 'Review Successfully added!',
        review,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getReview(req: Request, res: Response) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).send({
          status: 'error',
          msg: 'Event ID is required',
        });
      }

      let fixReviews: any[] = [];
      let reviews = await prisma.review.findMany({
        where: { eventId: +id },
        include: { user: true },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Reviews retrieved successfully!',
        reviews,
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'An unexpected error occurred',
      });
    }
  }

  async getPeserta(req: Request, res: Response) {
    try {
      const { organizerId } = req.params;
      const organizerIdNumber = parseInt(organizerId as string, 10);

      const reviews = await prisma.registration.findMany({
        where: {
          event: {
            organizerId: organizerIdNumber,
          },
        },
        include: {
          event: true,
        },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Peserta retrieved successfully!',
        reviews,
      });
    } catch (err) {
      console.error(err);
      res.status(500).send({
        status: 'error',
        msg: 'An unexpected error occurred',
      });
    }
  }
}
