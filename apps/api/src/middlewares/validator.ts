import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateRegister = [
    body('name').notEmpty().withMessage('name required!'),
    body('email').notEmpty().withMessage('email required!').isEmail().withMessage('invalid email format!'),
    body('password').notEmpty().withMessage('password required!'),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).send({
                status: 'error',
                msg: errors.array()
            })
        }
        next()
    }
]