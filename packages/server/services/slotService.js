const { format } = require('date-fns');
const stringSimilarity = require('string-similarity');
const slots = require('../slots');

const nameCorrections = {
  don: 'dan',
  kara: 'cara',
  alison: 'alice',
};

function normalize(str) {
  const normalized = str?.toLowerCase().trim();
  return nameCorrections[normalized] || normalized;
}

function isSimilar(a, b) {
  if (!a || !b) return false;
  const similarity = stringSimilarity.compareTwoStrings(normalize(a), normalize(b));
  return similarity > 0.5;
}

exports.findMatchingSlot = ({ service, stylist, date, branch }) => {
  let inputDate = new Date(date);

  if (isNaN(inputDate.getTime())) {
    throw new Error(`Invalid time value for date: ${date}`);
  }

  const readableDate = format(inputDate, "EEEE d MMMM yyyy 'at' HH:mm");

  console.log('🔍 Searching for slot (fuzzy):', {
    service,
    stylist: stylist || 'any',
    date: readableDate,
    branch,
  });

  const serviceMatch = slots.some((s) => isSimilar(s.service, service));
  if (!serviceMatch) {
    return {
      slot: null,
      reason: `The service '${service}' is not provided by any stylist.`,
    };
  }

  if (stylist) {
    const stylistServiceMatch = slots.some(
      (s) => isSimilar(s.stylist, stylist) && isSimilar(s.service, service)
    );
    if (!stylistServiceMatch) {
const stylistServices = [
  ...new Set(
    slots
      .filter((s) => isSimilar(s.stylist, stylist))
      .map((s) => s.service)
  ),
].join(', ') || 'none';

      return {
        slot: null,
        reason: `The stylist '${stylist}' does not provide the service '${service}'. They offer: ${stylistServices}.`,
      };
    }

    const stylistBranchMatch = slots.some(
      (s) => isSimilar(s.stylist, stylist) && isSimilar(s.branch, branch)
    );
    if (!stylistBranchMatch) {
      return {
        slot: null,
        reason: `The stylist '${stylist}' is not available at the branch '${branch}'.`,
      };
    }
  }

  const slot = slots.find((s) => {
    const matches =
      isSimilar(s.service, service) &&
      isSimilar(s.branch, branch) &&
      new Date(s.datetime).getTime() === inputDate.getTime() &&
      !s.booked;

    return stylist ? matches && isSimilar(s.stylist, stylist) : matches;
  });

  if (slot) {
    slot.booked = true;
    return { slot, reason: null };
  }

  const nearbySlots = slots
    .filter((s) => {
      const matches =
        isSimilar(s.service, service) &&
        isSimilar(s.branch, branch) &&
        !s.booked;

      return stylist ? matches && isSimilar(s.stylist, stylist) : matches;
    })
    .map((s) => format(new Date(s.datetime), 'HH:mm'));

  const uniqueNearbyTimes = [...new Set(nearbySlots)];

  const nearbyTimes = uniqueNearbyTimes.length > 0
    ? uniqueNearbyTimes.join(', ')
    : 'No nearby times available';

  return {
    slot: null,
    reason: `The requested time '${readableDate}' is not available${stylist ? ` for stylist '${stylist}'` : ''}. Nearby available times: ${nearbyTimes}.`,
  };
};
