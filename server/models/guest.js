import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const guestSchema = new Schema({
  email: { type: 'String', required: true },
  name: { type: 'String', required: true },
  response: { type: 'Boolean', required: false },
  cuid: { type: 'String', required: true },
  dateAdded: { type: 'Date', required: true, default: Date.now },
  dateUpdated: { type: 'Date', required: false },
  isDeleted: { type: 'Boolean', required: true, default: false },
});

export default mongoose.model('Guest', guestSchema);
