const ExcelJS = require('exceljs');

async function checkExcelContent() {
  const filepath = '/Users/adityapachauri/Downloads/whisky-export-from-backend.xlsx';
  
  // console.log('Checking Excel file content...\n');
  
  try {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filepath);
    
    // console.log(`Total worksheets: ${workbook.worksheets.length}\n`);
    
    workbook.eachSheet((worksheet, sheetId) => {
      // console.log(`=== Sheet ${sheetId}: "${worksheet.name}" ===`);
      // console.log(`Rows: ${worksheet.rowCount}`);
      // console.log(`Columns: ${worksheet.columnCount}`);
      
      if (worksheet.rowCount > 0) {
        // console.log('\nALL DATA IN THIS SHEET:');
        worksheet.eachRow((row, rowNumber) => {
          const values = [];
          row.eachCell((cell) => {
            values.push(cell.value || '(empty)');
          });
          // console.log(`Row ${rowNumber}: ${values.join(' | ')}`);
        });
      } else {
        // console.log('(No data in this sheet)');
      }
      // console.log('\n');
    });
    
  } catch (error) {
    // console.error('Error:', error.message);
  }
}

checkExcelContent();