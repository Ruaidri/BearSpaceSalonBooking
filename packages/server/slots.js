const stringSimilarity = require('string-similarity');

// The list of services, stylists, and branches
const branches = ['Dublin', 'Kerry', 'Galway'];
const services = ['haircut', 'color', 'nails', 'massage', 'facial'];
const stylists = [
  { name: 'Alice', branch: 'Dublin', services: ['haircut', 'color'] },
  { name: 'Mark', branch: 'Kerry', services: ['haircut', 'nails'] },
  { name: 'Cara', branch: 'Galway', services: ['massage', 'facial'] },
  { name: 'Dan', branch: 'Dublin', services: ['haircut', 'massage'] },
  { name: 'Eva', branch: 'Kerry', services: ['nails', 'facial'] },
  { name: 'Frank', branch: 'Galway', services: ['color', 'massage'] },
  { name: 'Grace', branch: 'Dublin', services: ['facial', 'color'] },
  { name: 'Henry', branch: 'Kerry', services: ['massage', 'haircut'] },
  { name: 'Isla', branch: 'Galway', services: ['haircut', 'nails'] },
  { name: 'Jack', branch: 'Dublin', services: ['color', 'facial'] },
];

const generateTimeSlotsForWeek = (startDate, hours = [9, 10, 11, 13, 14, 15]) => {
  const slots = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(currentDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];

    hours.forEach((hour) => {
      const localDateTime = `${dateString}T${hour.toString().padStart(2, '0')}:00:00`;
      slots.push(localDateTime);
    });
  }

  return slots;
};


let idCounter = 1;
const mockSlots = [];

// Generate mock slots for all stylists and services
stylists.forEach((stylist) => {
  stylist.services.forEach((service) => {
    generateTimeSlotsForWeek(new Date()).forEach((datetime) => {
      mockSlots.push({
        id: idCounter++,
        service,
        stylist: stylist.name,
        branch: stylist.branch,
        datetime,
        booked: false,
      });
    });
  });
});

module.exports = mockSlots;
