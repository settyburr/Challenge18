import { Schema, model, Document } from 'mongoose';

// Define the Book document interface
interface BookDocument extends Document {
  bookId: string;
  title: string;
  authors: string[];
  description: string;
  image: string;
  link: string;
}

// Define the Book schema
const bookSchema = new Schema<BookDocument>({
  authors: [String],
  description: { type: String, required: true },
  bookId: { type: String, required: true },
  image: String,
  link: String,
  title: { type: String, required: true },
});

// Create and export the Book model from the schema
const BookModel = model<BookDocument>('Book', bookSchema);
export {type BookDocument, bookSchema} 
export default BookModel;
