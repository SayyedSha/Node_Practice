const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
// Define the MongoDB URI. Replace '<username>', '<password>', and '<cluster>' with your own credentials and cluster information.
const uri = 'mongodb+srv://shahwork005:Naruto0@cluster0.joqddru.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password:String,
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    const saltRounds = 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Export the Mongoose instance for use in other parts of your application
module.exports = {mongoose,
User
}
