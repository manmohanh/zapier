import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { SigninSchema, SignupSchema } from "../types";
import { client } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

router.post("/signup", async (req, res) => {
  const body = req.body;
  const parseData = SignupSchema.safeParse(body);

  if (!parseData.success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  const userExists = await client.user.findFirst({
    where: {
      email: parseData.data.email,
    },
  });

  if (userExists) {
    return res.status(403).json({ message: "User already exists" });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(parseData.data.password, salt);

  await client.user.create({
    data: {
      name: parseData.data.name,
      email: parseData.data.email,
      password: hashedPassword,
    },
  });

  //send email

  res.json({
    message: "Please verify your account by checking your email",
  });
});

router.post("/signin", async (req, res) => {
  const body = req.body;
  const parseData = SigninSchema.safeParse(body);

  if (!parseData.success) {
    return res.status(411).json({ message: "Incorrect inputs" });
  }

  const userExists = await client.user.findFirst({
    where: {
      email: parseData.data.email,
    },
  });

  if (!userExists) {
    return res.status(403).json({ message: "User does not exist" });
  }

  if (!bcrypt.compareSync(parseData.data.password, userExists.password)) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  const payload = {
    id: userExists.id,
    name: userExists.name,
    email: userExists.email,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "15d" });

  res.json({token:token})
});

router.get("/user", authMiddleware, async (req, res) => {});

export default router;
