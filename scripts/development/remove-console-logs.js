const fs = require('fs');
const path = require('path');

// Configuration
const FRONTEND_DIR = './frontend/src';
const BACKEND_DIR = './backend';
const EXCLUDE_PATTERNS = [
  'node_modules',
  '.git',
  'build',
  'dist',
  '.next',
  'logger.ts',
  'logger.js',
  'winston',
  'remove-console-logs.js'
];

let totalReplacements = 0;
let filesModified = 0;

// Check if file should be processed
function shouldProcessFile(filePath) {
  return !EXCLUDE_PATTERNS.some(pattern => filePath.includes(pattern));
}

// Replace console statements in a file
function processFile(filePath) {
  if (!shouldProcessFile(filePath)) return;
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // For TypeScript/JavaScript files
    if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
      // Track if we need to import logger
      let needsLoggerImport = false;
      let replacements = 0;
      
      // Replace console.log
      content = content.replace(/console\.log\(/g, () => {
        needsLoggerImport = true;
        replacements++;
        return 'logger.log(';
      });
      
      // Replace console.error
      content = content.replace(/console\.error\(/g, () => {
        needsLoggerImport = true;
        replacements++;
        return 'logger.error(';
      });
      
      // Replace console.warn
      content = content.replace(/console\.warn\(/g, () => {
        needsLoggerImport = true;
        replacements++;
        return 'logger.warn(';
      });
      
      // Replace console.info
      content = content.replace(/console\.info\(/g, () => {
        needsLoggerImport = true;
        replacements++;
        return 'logger.info(';
      });
      
      // Replace console.debug
      content = content.replace(/console\.debug\(/g, () => {
        needsLoggerImport = true;
        replacements++;
        return 'logger.debug(';
      });
      
      // Add logger import if needed and not already present
      if (needsLoggerImport && !content.includes('import logger') && !content.includes('require') && filePath.includes('frontend')) {
        // For frontend TypeScript files
        const importStatement = "import logger from '../utils/logger';\n";
        
        // Try to add after other imports
        const importMatch = content.match(/(import[\s\S]*?from[\s\S]*?;)\n/);
        if (importMatch) {
          const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
          content = content.slice(0, lastImportIndex) + importStatement + content.slice(lastImportIndex);
        } else {
          // Add at the beginning if no imports found
          content = importStatement + '\n' + content;
        }
      }
      
      // For backend files, just comment out console statements
      if (filePath.includes('backend') && replacements > 0) {
        content = originalContent;
        content = content.replace(/console\.log\(/g, '// console.log(');
        content = content.replace(/console\.error\(/g, '// console.error(');
        content = content.replace(/console\.warn\(/g, '// console.warn(');
        content = content.replace(/console\.info\(/g, '// console.info(');
        content = content.replace(/console\.debug\(/g, '// console.debug(');
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✅ Processed: ${filePath} (${replacements} replacements)`);
        totalReplacements += replacements;
        filesModified++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Recursively process directory
function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && shouldProcessFile(fullPath)) {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      processFile(fullPath);
    }
  });
}

// Main execution
console.log('🔍 Removing console.log statements from production code...\n');

// Process frontend
if (fs.existsSync(FRONTEND_DIR)) {
  console.log('📁 Processing frontend files...');
  processDirectory(FRONTEND_DIR);
}

// Process backend
if (fs.existsSync(BACKEND_DIR)) {
  console.log('\n📁 Processing backend files...');
  processDirectory(BACKEND_DIR);
}

console.log('\n✨ Summary:');
console.log(`   Files modified: ${filesModified}`);
console.log(`   Total replacements: ${totalReplacements}`);
console.log('\n✅ Console.log removal complete!');

// Create production build script
const buildScript = `#!/bin/bash
# Production build script with console.log removal

echo "🏗️  Building for production..."

# Remove console.logs
node remove-console-logs.js

# Build frontend
cd frontend
npm run build

# The build process will use NODE_ENV=production which activates our logger

echo "✅ Production build complete!"
`;

fs.writeFileSync('./build-production.sh', buildScript);
fs.chmodSync('./build-production.sh', '755');
console.log('\n📄 Created build-production.sh script');