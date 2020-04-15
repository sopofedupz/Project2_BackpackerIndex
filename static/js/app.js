var url = "/climate";

d3.json(url).then(function(climate) {
  console.log(climate);
});


// d3.json(url, (function(error, climate) {
//   if (error) throw error;
//   console.log("Climate Data:", climate);
// }));
