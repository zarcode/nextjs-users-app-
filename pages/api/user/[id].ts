import type { NextApiRequest, NextApiResponse } from 'next'
import { users } from "../dummyusers"

export default function userHandler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
    method,
  } = req

  switch (method) {
    case 'DELETE': 
        res.status(200).json({ id, name: `User ${id}` })
        break
    case 'GET':
      // Get data from your database
      res.status(200).json(users[0])
      break
    case 'PUT':
      // Update or create data in your database
      res.status(200).json({ name: `User` })
      break
    // default:
    //   res.setHeader('Allow', ['GET', 'PUT'])
    //   res.status(405).end(`Method ${method} Not Allowed`)
  }
}