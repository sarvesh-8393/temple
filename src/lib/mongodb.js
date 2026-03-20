import { connectToDatabase } from './mongodb.ts';

export * from './mongodb.ts';
export { connectToDatabase, connectToDatabase as connectDB };
export default connectToDatabase;
