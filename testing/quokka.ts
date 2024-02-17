'use strict';
interface Client {
  date: string;
  email: string;
  clientNameENG: string;
  clientSalesManager: string;
  sumOfDepositILS: number;
  sumOfDepositUSD: number;
  transactionID: string;
  screenshot: string;
  confirmation: boolean;
}

interface MoneyConversion {
  date: string;
  purchasedUSD: number;
  soldILS: number;
  rate: number;
  clientName: string;
}

// client deposit ILS → Mizrahi Tfahot → convert to USD → deposit to Profitzon Payoneer → deposit to Roy's payoneer 
interface ClientDepositILSLogs {
  sumOfDepositILS: number;
  sumOfDepositUSD: number;
  MoneyConversion: MoneyConversion;
  transactionID: string;
  confirmation: boolean;
}

// amazon pays USD to client → client deposits USD to Roy's payoneer
interface AmazonPaysUSDLogs {
  sumOfDepositUSD: number;
  transactionID: string;
  confirmation: boolean;
}

type LogEntry = Map<Date, string[]>;

const logOptions: string[] = [
  'Client deposited {{ amount }} ILS to Mizrahi Tfahot',
  '{{ amount }} ILS converted to {{ amount }} USD at a rate of {{ ILS / USD }}',
  '{{ amount }} USD deposited to Profitzon Payoneer',
  '{{ amount }} USD deposited to Roy\'s payoneer',
];

const logs: LogEntry = new Map();

