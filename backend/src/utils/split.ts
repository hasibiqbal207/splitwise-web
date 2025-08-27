import { findGroupByID } from "../services/group.service.js";
import GroupModel from "../models/group.model.js";

type TransactionMap = Map<string, number>;
type Split = [string, string, number];

// Settles transactions that cancel each other out
function settleSimilarFigures(transactionMap: TransactionMap): Split[] {
  const splits: Split[] = [];
  const visited: Map<string, boolean> = new Map();

  for (const tr1 of transactionMap.keys()) {
    visited.set(tr1, true);
    for (const tr2 of transactionMap.keys()) {
      if (!visited.has(tr2) && tr1 !== tr2) {
        const balance1 = transactionMap.get(tr1)!;
        const balance2 = transactionMap.get(tr2)!;

        if (balance1 === -balance2) {
          if (balance2 > balance1) {
            splits.push([tr1, tr2, balance2]);
          } else {
            splits.push([tr2, tr1, balance1]);
          }
          transactionMap.set(tr1, 0);
          transactionMap.set(tr2, 0);
        }
      }
    }
  }

  return splits;
}

// Returns the person with the largest credit and the person with the largest debt
function getMaxMinCredit(
  transactionMap: TransactionMap
): [string | undefined, string | undefined] {
  let maxCreditor: string | undefined;
  let minDebtor: string | undefined;
  let maxCredit = Number.MIN_VALUE;
  let minDebit = Number.MAX_VALUE;

  for (const [person, balance] of transactionMap.entries()) {
    if (balance < minDebit) {
      minDebit = balance;
      minDebtor = person;
    }
    if (balance > maxCredit) {
      maxCredit = balance;
      maxCreditor = person;
    }
  }

  return [minDebtor, maxCreditor];
}

// Recursively settles remaining debts between the largest debtor and creditor
function settleDebts(transactionMap: TransactionMap, splits: Split[]): void {
  const [minDebtor, maxCreditor] = getMaxMinCredit(transactionMap);
  if (!minDebtor || !maxCreditor) return;

  const minValue = Math.min(
    -transactionMap.get(minDebtor)!,
    transactionMap.get(maxCreditor)!
  );

  transactionMap.set(minDebtor, transactionMap.get(minDebtor)! + minValue);
  transactionMap.set(maxCreditor, transactionMap.get(maxCreditor)! - minValue);

  const roundedValue = Math.round((minValue + Number.EPSILON) * 100) / 100;
  splits.push([minDebtor, maxCreditor, roundedValue]);

  settleDebts(transactionMap, splits); // Recursively settle remaining debts
}

// Main function to simplify debts
export function simplifyDebts(transactions: Record<string, number>): Split[] {
  const splits: Split[] = [];
  const transactionMap: TransactionMap = new Map(Object.entries(transactions)); // Convert JSON to map object

  // First, settle the debts that cancel each other out directly
  splits.push(...settleSimilarFigures(transactionMap));

  // Then, recursively settle the remaining debts
  settleDebts(transactionMap, splits);

  return splits;
}

export const splitNewExpense = async (
  groupId: string,
  expenseAmount: number,
  expenseOwner: string,
  expenseMembers: string[]
): Promise<any> => {
  try {
    // Find the group by ID
    const group = await findGroupByID(groupId);

    if (!group) {
      throw new Error(`Group with ID ${groupId} not found`);
    }

    // Update the group's total expense
    group.groupTotal += expenseAmount;

    // Add the expense amount to the expense owner's balance
    group.split[expenseOwner] += expenseAmount;

    // Calculate the expense per member
    const expensePerMember =
      Math.round(
        (expenseAmount / expenseMembers.length + Number.EPSILON) * 100
      ) / 100;

    // Update the split values for each member
    for (const memberEmail of expenseMembers) {
      group.split[memberEmail] -= expensePerMember;
    }

    // Check if the group balance is zero; if not, adjust the owner's balance
    let totalBalance = 0;
    for (const [, balance] of Object.entries(group.split)) {
      totalBalance += balance;
    }

    group.split[expenseOwner] -= totalBalance;
    group.split[expenseOwner] =
      Math.round((group.split[expenseOwner] + Number.EPSILON) * 100) / 100;

    // Update the group with the new split values
    await GroupModel.updateOne({ _id: groupId }, group);
    return { success: true, message: "Split completed successfully" };
  } catch (error) {
    // Catch and propagate meaningful errors
    throw new Error(`Failed to complete split: ${(error as Error).message}`);
  }
};

export const revertSplit = async (
  groupId: string,
  expenseAmount: number,
  expenseOwner: string,
  expenseMembers: string[]
): Promise<any> => {
  try {
    // Find the group by ID
    const group = await findGroupByID(groupId);

    if (!group) {
      throw new Error(`Group with ID ${groupId} not found`);
    }

    // Update the group's total expense
    group.groupTotal -= expenseAmount;

    // Add the expense amount to the expense owner's balance
    group.split[expenseOwner] -= expenseAmount;

    // Calculate the expense per member
    const expensePerMember =
      Math.round(
        (expenseAmount / expenseMembers.length + Number.EPSILON) * 100
      ) / 100;

    // Update the split values for each member
    for (const memberEmail of expenseMembers) {
      group.split[memberEmail] += expensePerMember;
    }

    // Check if the group balance is zero; if not, adjust the owner's balance
    let totalBalance = 0;
    for (const [, balance] of Object.entries(group.split)) {
      totalBalance += balance;
    }

    group.split[expenseOwner] -= totalBalance;
    group.split[expenseOwner] =
      Math.round((group.split[expenseOwner] + Number.EPSILON) * 100) / 100;

    // Update the group with the new split values
    await GroupModel.updateOne({ _id: groupId }, group);

    return { success: true, message: "Split reverted successfully" };
  } catch (error) {
    // Catch and propagate meaningful errors
    throw new Error(`Failed to revert split: ${(error as Error).message}`);
  }
};

export default simplifyDebts;