const numberFormatter = (amount) => {
  return amount.toFixed(0).replace(/\d(?=(\d{3})+$)/g, '$&.')
};

export default numberFormatter;