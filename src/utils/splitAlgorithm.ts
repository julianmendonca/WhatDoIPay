import { use } from "react";
import { User } from "../types/user";

type MappedUser = { id: string; amount: number; name: string };

const formatTo2Decimals = (num: number) => parseFloat(num.toFixed(2));

export const splitExpences = (users: User[]) => {
  // The sum of all payments in the group
  const totalAmount = users.reduce((prev, curr) => {
    return prev + curr.amountPaid;
  }, 0);
  // The amount each user should pay
  const amountPerUser = totalAmount / users.length;
  const mappedDebts = {
    shouldPay: [] as MappedUser[],
    shouldGetPaid: [] as MappedUser[],
  };

  for (const user of users) {
    const amountPaid = user.amountPaid;
    if (amountPaid > amountPerUser) {
      const pendingAmount = formatTo2Decimals(amountPaid - amountPerUser);
      mappedDebts.shouldGetPaid.push({
        id: user.id,
        amount: pendingAmount,
        name: user.name,
      });
    } else if (amountPaid < amountPerUser) {
      mappedDebts.shouldPay.push({
        id: user.id,
        amount: amountPerUser - amountPaid,
        name: user.name,
      });
    }
  }
  const paymentsMap: Record<string, MappedUser[]> = {};
  for (const user of mappedDebts.shouldPay) {
    let paidDebt = false;
    let amountToPay = user.amount;
    const shouldPayTo: MappedUser[] = [];
    for (const userToGetPaid of mappedDebts.shouldGetPaid) {
      if (paidDebt) {
        break;
      }
      const amountToGetPaid = userToGetPaid.amount;
      if (!amountToGetPaid) continue;
      if (amountToGetPaid >= amountToPay) {
        userToGetPaid.amount = amountToGetPaid - amountToPay;
        shouldPayTo.push({
          id: userToGetPaid.id,
          amount: amountToPay,
          name: userToGetPaid.name,
        });
        paidDebt = true;
      } else {
        const paymentAmount = userToGetPaid.amount;
        shouldPayTo.push({
          id: userToGetPaid.id,
          amount: paymentAmount,
          name: userToGetPaid.name,
        });
        userToGetPaid.amount = 0;
        amountToPay = amountToPay - paymentAmount;
      }
    }
    paymentsMap[user.id] = shouldPayTo;
  }

  const userPaymentMap = mappedDebts.shouldPay.map((user) => ({
    id: user.id,
    name: user.name,
    shouldPayTo: paymentsMap[user.id],
  }));

  return userPaymentMap;
};
