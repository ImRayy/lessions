import { input, number, select } from "@inquirer/prompts";
import { db } from "./db.js";
import {
  addTrasnaction,
  createAccount,
  deleteAccount,
  getAccount,
  getTotalTransactionAmount,
  updateAccountBalance,
} from "./helpers.js";

export async function createGetAccountIdPrompt() {
  return await select({
    message: "Select account...",
    choices: db.accounts.map((account, index) => ({
      name: `${index + 1}. ${account.name} [${account.balance}]`,
      value: account.id,
    })),
  });
}

export async function createAccountPrompt() {
  // Step 1: Get account name as input and validate
  const name = await input({
    message: "Account name: ",
    validate: (value) => {
      const isNameExists =
        db.accounts.findIndex(
          (acc) => acc.name.toLowerCase() === value.trim().toLowerCase(),
        ) >= 0;
      if (isNameExists) {
        return `Account with name ${value} already exists`;
      }
      return !isNameExists;
    },
  });
  const amount = await number({ message: "Initial balance: " });

  createAccount(name, amount);
  console.log(`\nCreated account ${name} with initial balance ${amount}\n`);
}

export async function createAccountDeletePrompt() {
  // Step 1: Select Account
  const accountId = await createGetAccountIdPrompt();

  // Step 2: Delete Account
  deleteAccount(accountId);

  console.log(`Account deleted`);
}

export async function createAddTransactionPrompt(type) {
  // Step 1: Get inputs for income/expense
  const title = await input({ message: "Title:" });
  const amount = await number({ message: "Amount:" });

  // Step 2: Select Account
  const accountId = await createGetAccountIdPrompt();

  // Step 3: Calculate account balance
  const account = getAccount(accountId);
  let newBalance = account.balance;

  if (type === "income") {
    newBalance += amount;
  } else {
    newBalance -= amount;
  }

  // Step 4: Update account balance
  updateAccountBalance(accountId, newBalance);
  console.log(`${account.name} updated. Balance: ${account.balance}`);

  // Step 5: Create transaction either income/expense
  addTrasnaction(accountId, title, amount, type);
  console.log(`Added ${amount} to ${account.name}`);
}

export async function createGetTotalTransactionAmount(type) {
  // Step 1: Select Account
  const accountId = await createGetAccountIdPrompt();

  // Steap 2: Get total
  const total = getTotalTransactionAmount(accountId, type) || 0;

  // Step 3: Print Total
  console.log(`\nTotal ${type} is ${total.toFixed(2).toLocaleString()}\n`);
}
