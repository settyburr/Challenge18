import UserModel from '../models/User';
import BookModel from '../models/Book'; 

const resolvers = {
    Query: {
      me: async (_: any, __: any, { token }: any) => {
        if (!token) throw new Error('You must be logged in');
  
        try {
          const user = await UserModel.findById(token).populate('savedBooks');
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
          const newUser = new UserModel({ username, email, password });
          await newUser.save();
          return newUser;
        } catch (err) {
          console.error(err);
          throw new Error('Error creating user');
        }
      },
  
      saveBook: async (_: any, { bookId, userId }: { bookId: string; userId: string }) => {
        try {
          const user = await UserModel.findById(userId);
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
          const user = await UserModel.findById(userId);
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
          const user = await UserModel.findOne({ email });
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