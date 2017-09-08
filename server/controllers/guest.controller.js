import Guest from '../models/guest';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';

/**
 * Get all guests
 * @param req
 * @param res
 * @returns void
 */
export function getGuests(req, res) {
  Guest.find().where('isDeleted').equals('true').sort('-dateUpdated').exec((err, guests) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ guests });
  });
}

/**
 * Get a single guest
 * @param req
 * @param res
 * @returns void
 */
export function getGuest(req, res) {
  Guest.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ post });
  });
}



/**
 * Save a guest
 * @param req
 * @param res
 * @returns void
 */
export function addGuest(req, res) {
  const newGuest = new Guest(req.body.post);

  // Let's sanitize inputs
  newGuest.email = sanitizeHtml(newGuest.email);
  newGuest.name = sanitizeHtml(newGuest.name);
  newGuest.cuid = cuid();

  newGuest.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json({ guest: saved });
  });
}

/**
 * Delete a guest (soft delete)
 * @param req
 * @param res
 * @returns void
 */
export function deleteGuest(req, res) {
  Guest.findOneAndUpdate({ cuid: req.params.cuid }, { isDeleted: true }).exec((err, guest) => {
    if (err) {
      res.status(500).send(err);
    }

    guest.save((err2, saved) => {
      if (err2) {
        res.status(500).send(err2);
      }
      res.json({ guest: saved });
    });
  });
}
