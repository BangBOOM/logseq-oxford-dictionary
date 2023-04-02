export default {
    async fetch(request) {
      const url = new URL(request.url)
      const word_to_search = url.pathname.split('/')[1]
      
      const word = await fetch(
              "https://www.oxfordlearnersdictionaries.com/definition/english/" + word_to_search,
          {
          headers: {
              "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36",
          },
          }
      )
  
      const status_code = word.status
      const definition = await word.text()
  
  
      const data = {
        status_code: status_code,
        word: word_to_search,
        definition: definition
      };
      const json = JSON.stringify(data, null, 2);
  
      return new Response(json, {
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
      });
    },
  };