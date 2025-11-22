import { IntegrationConfig, Product } from '../types';

// Mock function to simulate syncing with Shopee
export const syncWithShopee = async (config: IntegrationConfig, products: Product[]): Promise<boolean> => {
  console.log("Connecting to Shopee API...", config.shopeeApiKey);
  console.log("Shop ID:", config.shopeeShopId);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Synced ${products.length} items to Shopee successfully.`);
      resolve(true);
    }, 1500);
  });
};

// Mock function to simulate issuing an invoice
export const issueInvoice = async (config: IntegrationConfig, amount: number, carrierId?: string): Promise<string> => {
  console.log("Connecting to Guangmao Invoice API...", config.invoiceApiKey);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const invoiceNumber = `AB-${Math.floor(Math.random() * 100000000)}`;
      console.log(`Invoice issued: ${invoiceNumber} for amount $${amount}`);
      resolve(invoiceNumber);
    }, 1000);
  });
};