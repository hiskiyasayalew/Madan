const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin'; // Change this to your desired password
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Password hash:', hash);
  console.log('Use this hash to update your database');
}

generateHash();