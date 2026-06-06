import { db, saveToFile } from "./db.js";

export function createAccount(name, initialBalance = 0) {
  db.accounts.push({
    id: crypto.randomUUID(),
    name,
    balance: initialBalance,
    transactions: [],
  });
  saveToFile(db.accounts);
}

export function getAccount(id) {
  return db.accounts.find((acc) => acc.id === id);
}

export function updateAccountBalance(accountId, balance) {
  const account = getAccount(accountId);
  account.balance = balance;
  saveToFile(db.accounts);
}

export function deleteAccount(id) {
  db.accounts = db.accounts.filter((account) => account.id !== id);
  saveToFile(db.accounts);
}

export function addTrasnaction(accountId, title, amount, type) {
  const account = getAccount(accountId);
  account.transactions.push({ id: crypto.randomUUID(), title, amount, type });
  saveToFile(db.accounts);
}

export function getTotalTransactionAmount(accountId, type) {
  const account = getAccount(accountId);
  return account.transactions
    .filter((tx) => tx.type === type)
    .reduce((acc, obj) => acc + obj.amount, 0);
}
