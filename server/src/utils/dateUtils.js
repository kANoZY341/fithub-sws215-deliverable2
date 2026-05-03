const DUBAI_OFFSET_MINUTES = 4 * 60;

const getDubaiDayRange = (date = new Date()) => {
  const shifted = new Date(date.getTime() + DUBAI_OFFSET_MINUTES * 60 * 1000);
  const startShifted = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
    0,
    0,
    0,
    0
  );

  const startUtc = new Date(startShifted - DUBAI_OFFSET_MINUTES * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + 24 * 60 * 60 * 1000);

  return { startUtc, endUtc };
};

module.exports = { getDubaiDayRange };
