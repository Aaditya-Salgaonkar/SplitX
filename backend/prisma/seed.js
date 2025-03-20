import { PrismaClient } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library'; // ✅ Correct import
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 🔹 Create 50 Users
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push(
      prisma.user.create({
        data: {
          email: faker.internet.email(),
          name: faker.person.fullName(),
          avatar: faker.image.avatar(),
        },
      })
    );
  }
  const createdUsers = await Promise.all(users);

  // 🔹 Create 50 Friendships (Avoid duplicates)
  const friends = [];
  for (let i = 0; i < 5; i++) {
    const user = faker.helpers.arrayElement(createdUsers);
    let friend = faker.helpers.arrayElement(createdUsers);

    // Ensure user and friend are different
    while (user.id === friend.id) {
      friend = faker.helpers.arrayElement(createdUsers);
    }

    friends.push(
      prisma.friend.create({
        data: {
          userId: user.id,
          friendId: friend.id,
        },
      })
    );
  }
  await Promise.all(friends);

  // 🔹 Create 50 Transactions
  const transactions = [];
  for (let i = 0; i < 10; i++) {
    const payer = faker.helpers.arrayElement(createdUsers);
    transactions.push(
      prisma.transaction.create({
        data: {
          title: faker.commerce.productName(),
          amount: new Decimal(faker.number.float({ min: 10, max: 500, fractionDigits: 2 })), // ✅ Fix
          payerId: payer.id,
          isSplit: faker.datatype.boolean(),
        },
      })
    );
  }
  const createdTransactions = await Promise.all(transactions);

  // 🔹 Create 50 Split Records
  const splits = [];
  for (let i = 0; i < 1; i++) {
    const transaction = faker.helpers.arrayElement(createdTransactions);
    const user = faker.helpers.arrayElement(createdUsers);

    if (transaction.payerId !== user.id) {
      const transactionAmount = new Decimal(transaction.amount).toNumber(); // ✅ Fix
      splits.push(
        prisma.split.create({
          data: {
            transactionId: transaction.id,
            userId: user.id,
            amountOwed: new Decimal(faker.number.float({ min: 5, max: transactionAmount / 2, fractionDigits: 2 })), // ✅ Fix
            isSettled: faker.datatype.boolean(),
          },
        })
      );
    }
  }
  await Promise.all(splits);

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
