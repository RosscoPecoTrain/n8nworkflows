#!/usr/bin/env node

/**
 * Update Excel Cell Script
 * Usage: node update-excel.js <filePath> <cellAddress> <cellValue>
 * Example: node update-excel.js /path/to/file.xlsx E8 "4/19/2026"
 */

const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error('Usage: node update-excel.js <filePath> <cellAddress> <cellValue>');
  process.exit(1);
}

const [filePath, cellAddress, cellValue] = args;

try {
  // Validate file exists
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Read the workbook
  const workbook = xlsx.readFile(filePath);
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // Update the cell
  worksheet[cellAddress] = { v: cellValue, t: 's' };

  // Write back to file
  xlsx.writeFile(workbook, filePath);

  console.log(JSON.stringify({
    success: true,
    message: `Updated ${cellAddress} with value: ${cellValue}`,
    filePath: filePath,
    cellAddress: cellAddress,
    cellValue: cellValue
  }));

  process.exit(0);
} catch (error) {
  console.error(JSON.stringify({
    success: false,
    error: error.message
  }));
  process.exit(1);
}
