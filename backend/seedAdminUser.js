const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://dineingoapp:FzyC357xJaxj6oXM@cluster0dine.sofa1gx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0dine';

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  isAdmin: Boolean,
  name: String,
});

const User = mongoose.model('User', userSchema);

async function seedAdmin() {
  const email = 'puttasujith265@admin.com';
  const plainPassword = 'adminsuj@dine';
  const name = 'Admin User';

  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  const hash = await bcrypt.hash(plainPassword, 10);

  const update = {
    email,
    password: hash,
    isAdmin: true,
    name,
  };

  const user = await User.findOneAndUpdate(
    { email },
    update,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log('Admin user seeded:', user);
  await mongoose.disconnect();
}

seedAdmin().catch(err => {
  console.error('Error seeding admin user:', err);
  process.exit(1);
}); 