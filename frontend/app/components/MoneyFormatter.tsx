import React from 'react';

export interface MoneyFormatterProps {
  /** The amount in Nepali Rupees (NPR) as a number. */
  amount: number;
  /** Optional: Currency code prefix (e.g., 'NPR '). Defaults to 'NPR '. */
  currencyCode?: string;
  /** Optional: If true, formats the number in plain lakh/crore style (1,23,45,678.90). Defaults to true. */
  useNepaliFormat?: boolean;
}

/**
 * Formats a number into the Nepali/Indian numerical system (Lakhs/Crores)
 * (e.g., 12345678.90 becomes 1,23,45,678.90).
 * @param {number} num - The number to format.
 * @returns {string} The formatted string.
 */
const formatInLakhCrore = (num: number): string => {
    if (isNaN(num)) return 'N/A';
    
    // Use toFixed(2) for standard two decimal places for currency
    const [integerPart, fractionalPart] = num.toFixed(2).split('.');
    
    // Use regex for Indian/Nepali comma style
    // Inserts a comma after the first three digits from the right, and then every two digits.
    let lastThree = integerPart.slice(-3);
    let remaining = integerPart.slice(0, -3);
    
    if (remaining !== '') {
        // Add commas every two digits in the remaining part
        remaining = remaining.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    }

    const formattedIntegerPart = remaining + (remaining ? ',' : '') + lastThree;
    
    return fractionalPart ? `${formattedIntegerPart}.${fractionalPart}` : formattedIntegerPart;
};

/**
 * A component to display financial amounts formatted in the Nepali Lakh/Crore system.
 * @param {MoneyFormatterProps} props - The component props.
 */
export default function MoneyFormatter({ amount, currencyCode = 'NPR ', useNepaliFormat = true }: MoneyFormatterProps) {
  
  if (typeof amount !== 'number' || isNaN(amount)) {
    return <span className="text-gray-400">{currencyCode}0.00</span>;
  }

  const formattedAmount = useNepaliFormat 
    ? formatInLakhCrore(amount)
    : amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <span className="font-mono text-gray-900 font-semibold">
      {currencyCode}
      {formattedAmount}
    </span>
  );
}