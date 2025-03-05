import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { User } from "../../../../types";

export default function createNewUser(
  req: NextApiRequest,
  res: NextApiResponse,
  User: User
) {
  if (req.method === "POST") {
  } else {
  }
}
