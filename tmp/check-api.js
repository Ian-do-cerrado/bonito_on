fetch('https://www.bonitoon.com.br/api/tours/flutuacao-abismo-anhumas')
  .then(r=>r.json())
  .then(j=>console.log("Price:", j.price, "MainPriceRow:", j.prices?.mainPriceRow?.adulto));
