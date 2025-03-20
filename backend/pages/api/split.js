import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        console.log("🔹 Incoming Request:", req.body);

        const { title, amount, payerId, userIds, transactionId } = req.body;

        if (!title || !amount || !payerId || !userIds?.length || !transactionId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Fetch transaction
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id: transactionId }
        });

        if (!existingTransaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (existingTransaction.isSplit) {
            return res.status(400).json({ error: 'Transaction already split' });
        }

        console.log("✅ Transaction Found:", existingTransaction);

        // Mark transaction as split
        await prisma.transaction.update({
            where: { id: transactionId },
            data: { isSplit: true }
        });

        console.log("🔹 Transaction Updated");

        // Validate user IDs
        const validUsers = await prisma.user.findMany({
            where: { id: { in: userIds } }
        });

        if (validUsers.length !== userIds.length) {
            return res.status(400).json({ error: 'One or more users not found' });
        }

        console.log("✅ Valid Users:", validUsers.map(u => u.id));

        // Create split records
        const splitAmount = amount / userIds.length;
        await prisma.split.createMany({
            data: userIds.map(userId => ({
                transactionId,
                userId,
                amountOwed: splitAmount,
                isSettled: false
            }))
        });

        console.log("✅ Split Records Created");

        return res.status(201).json({ message: 'Transaction split successfully', transactionId });

    } catch (error) {
        console.error("🔥 Server Error:", error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
