import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const friends = await prisma.friend.findMany({
            include: {
                user: true,
                friend: true
            }
        });

        return res.status(200).json(friends);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
