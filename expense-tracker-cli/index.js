import { select } from "@inquirer/prompts";
import { db } from "./db.js";
import {
  createAccountDeletePrompt,
  createAccountPrompt,
  createAddTransactionPrompt,
  createGetTotalTransactionAmount,
} from "./prompts.js";
import { ExitPromptError } from "@inquirer/core";

async function main() {
  let isRunning = true;

  while (isRunning) {
    const action = await select({
      message: "Expense Tracker\n-------------------\n",
      choices: [
        "Create Account",
        ...(db.accounts.length > 0
          ? [
              "Add Income",
              "Add Expense",
              "Delete Account",
              "Total Expense",
              "Total Income",
            ]
          : []),
        "Exit",
      ],
    });

    switch (action) {
      case "Create Account":
        await createAccountPrompt();
        break;
      case "Add Income":
        await createAddTransactionPrompt("income");
        break;
      case "Add Expense":
        await createAddTransactionPrompt("expense");
        break;
      case "Delete Account":
        await createAccountDeletePrompt();
        break;
      case "Total Income":
        await createGetTotalTransactionAmount("income");
        break;
      case "Total Expense":
        await createGetTotalTransactionAmount("expense");
        break;
      case "Exit":
        isRunning = false;
        break;
    }
  }
}

try {
  await main();
} catch (err) {
  if (err instanceof ExitPromptError) {
    console.clear();
    process.exit(0);
  }

  console.error(err);
}
