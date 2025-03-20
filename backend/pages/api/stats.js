import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const transactions = await prisma.transaction.findMany();

        if (!transactions.length) {
            return res.status(200).json({
                totalSpent: 0,
                split: 0,
                unsplit: 0,
                categories: [],
            });
        }

        let totalSpent = 0;
        let split = 0;
        let unsplit = 0;
        let categoryMap = {};

        transactions.forEach((tx) => {
            totalSpent += Number(tx.amount); // Ensure amount is a number
            if (tx.isSplit) {
                split += Number(tx.amount);
            } else {
                unsplit += Number(tx.amount);
            }

            const category = tx.category || "Other";
            if (!categoryMap[category]) {
                categoryMap[category] = 0;
            }
            categoryMap[category] += Number(tx.amount);
        });

        const formattedCategories = Object.entries(categoryMap).map(([key, value]) => ({
            name: key,
            amount: Number(value), // Ensure this is a number
        }));

        return res.status(200).json({
            totalSpent: Number(totalSpent),
            split: Number(split),
            unsplit: Number(unsplit),
            categories: formattedCategories,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
