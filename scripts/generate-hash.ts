import bcrypt from 'bcrypt';

async function generateHash() {
  const password = 'Admin';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log('Generated hash:', hash);
  
  // Verify the hash
  const isValid = await bcrypt.compare(password, hash);
  console.log('Hash verification:', isValid);
}

generateHash(); 