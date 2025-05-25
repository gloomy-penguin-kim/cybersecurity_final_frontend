    // src/services/userService.js
    import axios from 'axios';
    
    const API_URL = 'http://127.0.0.1:8000';
    

    const dataService = {

      // async getDataAttacks () {
      //   try {
      //     const response = await axios.get(`${API_URL}/attacks/`);
      //     console.error("Got attacks:", response.data);

      //     if (response.data?.next != null) { 

      //     } 


      //     return response.data;
      //   } catch (error) {
      //     console.error("Error fetching attacks:", error);
      //     throw error;
      //   }
      // },

      async getAllData (url = API_URL, allData = []) {
        const response = await fetch(url);
        const data = await response.json();

        // Add current page's data to the accumulated data
        allData = allData.concat(data.results); // Adjust 'data.items' based on your API response structure

        // Check if there's a next page
        if (data.next) { // Adjust 'data.next' based on your API response structure
          return getAllData(data.next, allData);
        } else {
          return allData;
        }
    }
    }
 
    
    export default dataService;