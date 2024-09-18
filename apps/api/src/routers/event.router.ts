import { Router } from 'express';
import { EventController } from '../controllers/event.controller';
import { uploader } from '../middlewares/uploader';
import { verifyToken } from '../middlewares/token';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.eventController = new EventController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/createEvent',
      uploader('event-', '/event').single('image'),
      verifyToken,
      this.eventController.createEvent,
    );
    this.router.get('/events', this.eventController.getEvents);
    this.router.get('/myevents', this.eventController.getMyEvents);
    this.router.get('/events/:slug', this.eventController.getEventSlug);
    this.router.get('/review/:id', verifyToken, this.eventController.getReview);
    this.router.get(
      '/peserta/:organizerId',
      verifyToken,
      this.eventController.getPeserta,
    );

    this.router.post('/buy', verifyToken, this.eventController.buyTicket);
    this.router.post('/review', verifyToken, this.eventController.review);
  }

  getRouter(): Router {
    return this.router;
  }
}
