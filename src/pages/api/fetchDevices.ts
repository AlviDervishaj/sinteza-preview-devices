import { ApiDevices } from "@/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default async function GET(req: NextApiRequest, res: NextApiResponse) {
  const result = await fetch('http://localhost:3000/api/readDevices');
  const data: ApiDevices = await result.json();
  return res.json(data);
}
