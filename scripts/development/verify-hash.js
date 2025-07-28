const bcrypt = require('bcryptjs');

const hash = '$2a$12$c4Y/tOvWZnHUy7KSQIYR0OVNnMZs5c2I2M0bSX01Ihkl5uJx9Nyme';
const password = 'admin123';

bcrypt.compare(password, hash).then(result => {
  console.log(`Password "${password}" matches hash: ${result}`);
  
  // Generate a new hash to be sure
  bcrypt.hash(password, 12).then(newHash => {
    console.log(`New hash for "${password}": ${newHash}`);
    
    // Test the new hash
    bcrypt.compare(password, newHash).then(newResult => {
      console.log(`New hash verification: ${newResult}`);
    });
  });
});