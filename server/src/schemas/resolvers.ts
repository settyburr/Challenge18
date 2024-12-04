import { User, BookModel } from '../models/index.js';
// import { BookModel } from '../models/index.js'; 

const resolvers = {
    Query: {
      me: async (_: any, __: any, { token }: any) => {
        if (!token) throw new Error('You must be logged in');
  
        try {
          const user = await User.findById(token).populate('savedBooks');
          if (!user) throw new Error('User not found');
          return user;
        } catch (err) {
          console.error(err);
          throw new Error('Something went wrong while fetching user data');
        }
      },
      getBooks: async () => {
        try {
          const books = await BookModel.find();
          return books;
        } catch (err) {
          console.error(err);
          throw new Error('Could not fetch books');
        }
      },
    },
  
    Mutation: {
      addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
        try {
          const newUser = await User.create({ username, email, password });
          await newUser.save();
          return newUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error creating user');
        }
      },
  
      saveBook: async (_: any, { bookId, userId }: { bookId: string; userId: string }) => {
        try {
          const user = await User.findById(userId);
          if (!user) throw new Error('User not found');
  
          const book = await BookModel.findById(bookId);
          if (!book) throw new Error('Book not found');
  
          user.savedBooks.push(book);
          await user.save();
          return user;
        } catch (err) {
          console.error(err);
          throw new Error('Error saving book');
        }
      },
  
      removeBook: async (_: any, { bookId, userId }: { bookId: string; userId: string }) => {
        try {
          const user = await User.findById(userId);
          if (!user) throw new Error('User not found');
  
          user.savedBooks = user.savedBooks.filter((book: any) => book._id.toString() !== bookId);
          await user.save();
          return user;
        } catch (err) {
          console.error(err);
          throw new Error('Error removing book');
        }
      },
  
      loginUser: async (_: any, { email, password }: { email: string; password: string }) => {
        try {
          const user = await User.findOne({ email });
          if (!user) throw new Error('No user found with this email');
  
          const isMatch = await user.isCorrectPassword(password); 
          if (!isMatch) throw new Error('Invalid password');
  
          const token = user.generateAuthToken(); 
          return { token };
        } catch (err) {
          console.error(err);
          throw new Error('Error logging in');
        }
      },
    },
  };
  
  export default resolvers;