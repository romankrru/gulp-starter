const logThis = (word) => {
  [...word].forEach((letter, i) => {
    setTimeout(() => {
      console.log(letter);
    }, i * 200);
  });
};

logThis('Happy Codding');
