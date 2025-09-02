import { Order } from '../models';

export class OrderNumberGenerator {
  private static readonly PREFIX = 'ORD';
  private static readonly SUFFIX_LENGTH = 6;

  /**
   * Generate a unique order number
   * Format: ORD-YYYYMMDD-XXXXXX
   */
  static async generate(): Promise<string> {
    const date = new Date();
    const dateStr = date.getFullYear().toString() +
                   (date.getMonth() + 1).toString().padStart(2, '0') +
                   date.getDate().toString().padStart(2, '0');
    
    const suffix = this.generateRandomSuffix();
    const orderNumber = `${this.PREFIX}-${dateStr}-${suffix}`;

    // Check if this order number already exists
    const existingOrder = await Order.findOne({ orderNumber });
    if (existingOrder) {
      // If exists, generate a new one recursively
      return this.generate();
    }

    return orderNumber;
  }

  /**
   * Generate a random suffix for the order number
   */
  private static generateRandomSuffix(): string {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < this.SUFFIX_LENGTH; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  /**
   * Validate order number format
   */
  static validate(orderNumber: string): boolean {
    const pattern = new RegExp(`^${this.PREFIX}-\\d{8}-\\d{${this.SUFFIX_LENGTH}}$`);
    return pattern.test(orderNumber);
  }

  /**
   * Extract date from order number
   */
  static extractDate(orderNumber: string): Date | null {
    if (!this.validate(orderNumber)) {
      return null;
    }

    const parts = orderNumber.split('-');
    if (parts.length !== 3) {
      return null;
    }

    const dateStr = parts[1];
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // Month is 0-indexed
    const day = parseInt(dateStr.substring(6, 8));

    return new Date(year, month, day);
  }
}
