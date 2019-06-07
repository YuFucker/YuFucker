module.exports = {
  bell: () => {
    new Array(5).fill('\x07').map((value, index) => setTimeout(() => {
      console.log(value);
    }, index * 500));
  },
};
