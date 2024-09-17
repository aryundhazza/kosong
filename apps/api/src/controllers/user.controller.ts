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

      const existhingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existhingUser) throw 'email has been used!';

      const salt = await genSalt(10);
      const hashPassword = await hash(password, salt);

      function generateReferralCode(length = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let referralCode = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          referralCode += characters[randomIndex];
        }
        return referralCode;
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
              transactionType: 'Refferal',
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

      // OLAH REFERALL
      // const userReadyReferal = await prisma.user.findUnique({
      //   where: { referralCode: referredBy },
      // });

      // if (userReadyReferal) {
      //   const userId = userReadyReferal.id;
      //   const points = 10000;
      //   const transactionType = 'Referral';
      //   const pointLog = await prisma.pointLog.create({
      //     data: { userId, points, transactionType },
      //   });
      // }

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
        html: html,
      });

      res.status(201).send({
        status: 'ok',
        msg: 'Successfully created user',
        user: newUser,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async logInUser(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const existhingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (!existhingUser) throw 'user not found!';
      if (!existhingUser.isVerify) throw 'user not verify!';

      const isValidPass = await compare(password, existhingUser.password);

      if (!isValidPass) throw 'incorrect password!';

      const payload = { id: existhingUser.id, role: existhingUser.role };
      const token = sign(payload, process.env.SECRET_JWT!, { expiresIn: '1d' });

      res.status(200).send({
        status: 'ok',
        msg: 'login succes!',
        token,
        user: existhingUser,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async verifyUser(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
      });

      if (user?.isVerify) throw 'invalid link';

      await prisma.user.update({
        data: { isVerify: true },
        where: { id: req.user?.id },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'succes verify user!',
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
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
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async getUserId(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: +req.params.id },
      });
      if (!user) throw 'author not found!';
      res.status(200).send({
        status: 'ok',
        user,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async deposit(req: Request, res: Response) {
    try {
      console.log(req.body, '>>>>????');
      const { saldo } = req.body;
      const { id } = req.params;
      const user = await prisma.user.update({
        data: { saldo },
        where: { id: +id },
      });
      res.status(200).send({
        status: 'Success Deposit',
        user,
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }

  async editAvatar(req: Request, res: Response) {
    try {
      console.log(req.body);
      let { name, email, avatar } = JSON.parse(req.body.data);
      // if (!req.file) throw "no file uploaded"
      if (typeof avatar == 'object') {
        avatar = `http://localhost:8000/api/public/avatar/${req?.file?.filename}`;
      }

      await prisma.user.update({
        data: { avatar: avatar, name, email },
        where: { id: req.user?.id },
      });

      res.status(200).send({
        status: 'ok',
        msg: 'edit Update success!',
      });
    } catch (err) {
      res.status(400).send({
        status: 'error',
        msg: err,
      });
    }
  }
}
