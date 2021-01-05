console.log('Interesting! Global')
async function getDataFromAjax(url) {
	let data;
	try {
	  data = await fetch(url);
	  // This will wait 
	  // until fetch returns
	  fillClientStateWithData(data.json()); 
	} catch(error) {
	  // This will execute if the
	  // API returns an error
	  handleAjaxError(error);
	}
  }

  var fillClientStateWithData = data => console.log(data);
  var handleAjaxError = data => console.log(data)
  getDataFromAjax('https://jsonplaceholder.typicode.com/posts');
  