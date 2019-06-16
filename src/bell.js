module.exports = {
  bell: (interval = 0.5) => {
    new Array(5).fill('\x07').map((value, index) => setTimeout(() => {
      console.log(value);
    }, index * interval * 1000));
  },
};
