const stringFormatter = (string) => {
  return string.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
};

export default stringFormatter;