import test from 'ava';
import request from 'supertest';
import app from '../../server';
import Guest from '../guest';
import { connectDB, dropDB } from '../../util/test-helpers';

// Initial guests added into test db
const guests = [
  new Guest({ email: 'edg@email.com', name: 'Etienne DG', cuid: 'cikqgkv4q01ck7453ualdn3hd' }),
  new Guest({ email: 'edg2@email.com', name: 'Etienne DG2', cuid: 'cikqgkv4q01ck7453ualdn3hf' }),
  new Guest({ email: 'edg2@email.com', name: 'Etienne DG2', cuid: 'cikqgkv4q01ck7453ualdn3hf', isDeleted: true })
];

test.beforeEach('connect and add two guest entries', t => {
  connectDB(t, () => {
    Guest.create(guests, err => {
      if (err) t.fail('Unable to create guests');
    });
  });
});

test.afterEach.always(t => {
  dropDB(t);
});

test.serial('Should correctly give number of guests', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/guests')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(2, res.body.guests.length);
});

test.serial('Should send correct data when queried against a cuid', async t => {
  t.plan(2);

  const guest = new Guest({ email: 'edg@email.com', name: 'Etienne DG', cuid: 'cikqgkv4q01ck7453ualdn3hd' });
  guest.save();

  const res = await request(app)
    .get('/api/guests/cikqgkv4q01ck7453ualdn3hd')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.is(res.body.guest.name, guest.name);
});

test.serial('Should correctly add a guest', async t => {
  t.plan(2);

  const res = await request(app)
    .post('/api/guests')
    .send({ guest: { email: 'edg@email.com', name: 'Etienne DG' } })
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const savedguest = await Guest.findOne({ name: 'Etienne DG' }).exec();
  t.is(savedguest.name, 'Etienne DG');
});

test.serial('Should correctly delete a guest', async t => {
  t.plan(2);

  const guest = new Guest({ email: 'edg@email.com', name: 'Etienne DG', cuid: 'cikqgkv4q01ck7453ualdn3hd' });
  guest.save();

  const res = await request(app)
    .delete(`/api/guests/${guest.cuid}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedguest = await Guest.findOne({ cuid: guest.cuid }).exec();
  t.is(queriedguest.isDeleted, true);
});

