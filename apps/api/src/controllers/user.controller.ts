import prisma from '@/prisma';
import { Request, Response } from 'express';
import { compare, genSalt, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import handlebars from 'handlebars';
import { transporter } from '@/helpers/nodemailer';

export class UserController {
  async createUser(req: Request, res: Response) {
    try {
      const { name, email, password, role = 'User', referredBy } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (existingUser)
        return res.status(400).send({
          status: 'error',
          msg: 'Email has been used!',
        });

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      function generateReferralCode(length = 8): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return Array.from({ length }, () =>
          characters.charAt(Math.floor(Math.random() * characters.length)),
        ).join('');
      }

      const referralCode = generateReferralCode();
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          password: hashPassword,
          role,
          referredBy,
          referralCode,
        },
      });

      if (referredBy) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode: referredBy },
        });

        if (referrer) {
          await prisma.pointLog.create({
            data: {
              userId: referrer.id,
              points: 10000,
              transactionType: 'Referral',
            },
          });
        }

        await prisma.pointLog.create({
          data: {
            userId: newUser.id,
            points: 5000,
            transactionType: 'Referral',
          },
        });
      }

      const payload = { id: newUser.id };
      const token = sign(payload, process.env.SECRET_JWT!, {
        expiresIn: '15m',
      });

      const templatePath = path.join(
        __dirname,
        '../templates',
        'verification.hbs',
      );

      const templateSource = fs.readFileSync(templatePath, 'utf-8');
      const compiledTemplate = handlebars.compile(templateSource);
      const html = compiledTemplate({
        name: newUser.name,
        link: `http://localhost:3000/verify/${token}`,
      });

      await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: newUser.email,
        subject: 'Welcome to the Web Application',
        html,
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Successfully created user',
        user: newUser,
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async logInUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });
      if (!existingUser)
        return res.status(400).send({
          status: 'error',
          msg: 'User not found!',
        });

      if (!existingUser.isVerify)
        return res.status(400).send({
          status: 'error',
          msg: 'User not verified!',
        });

      const isValidPass = await compare(password, existingUser.password);
      if (!isValidPass)
        return res.status(400).send({
          status: 'error',
          msg: 'Incorrect password!',
        });

      const payload = { id: existingUser.id, role: existingUser.role };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });

      res.status(200).send({
        status: 'ok',
        msg: 'Login successful!',
        token,
        user: existingUser,
      });
    } catch (err) {
      console.error('Error logging in user:', err);
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });

      if (!user)
        return res.status(400).send({ status: 'error', msg: 'Invalid link' });

      if (user.isVerify)
        return res.status(400).send({
          status: 'error',
          msg: 'User already verified',
        });

      await prisma.user.update({
        data: { isVerify: true },
        where: { id: req.user?.id },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'User verified successfully!',
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async getUser(req: Request, res: Response) {
    try {
      const users = await prisma.user.findMany();
      res.status(200).send({
        status: 'ok',
        users,
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: +req.params.id },
      });

      if (!user)
        return res.status(404).send({
          status: 'error',
          msg: 'User not found!',
        });

      res.status(200).send({
        status: 'ok',
        user,
      });
    } catch (err) {
      console.error('Error retrieving user by ID:', err);
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      const { saldo } = req.body;
      const { id } = req.params;

      const user = await prisma.user.update({
        data: { saldo: { increment: saldo } },
        where: { id: +id },
      });

      res.status(200).send({
        status: 'Success',
        msg: 'Deposit successful',
        user,
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }

  async editAvatar(req: Request, res: Response) {
    try {
      const { name, email, avatar } = JSON.parse(req.body.data);

      if (!req.file) throw new Error('No file uploaded');

      const avatarUrl =
        typeof avatar === 'object'
          ? `http://localhost:8000/api/public/avatar/${req.file.filename}`
          : avatar;

      await prisma.user.update({
        data: { avatar: avatarUrl, name, email },
        where: { id: req.user?.id },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'Avatar updated successfully!',
      });
    } catch (err) {
      res.status(500).send({
        status: 'error',
        msg: 'Internal server error',
      });
    }
  }
}
