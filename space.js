const axios = require('axios');

const contentToPost = "Lorem ipsum ougaf oiehfafa oahfajb oahoahf";
const extension = 'none';

const spaceBinUrl = 'https://spaceb.in/api/v1/documents';

axios.post(spaceBinUrl, { content: contentToPost, extension: extension }, { headers: { 'Content-Type': 'application/json' } })
  .then(response => {
    const documentId = response.data.payload.id;
    const spaceBinLink = `https://spaceb.in/${documentId}`;
    
    console.log('Document ID:', documentId);
    console.log('SpaceB.in Link:', spaceBinLink);
  })
  .catch(error => {
    if (error.response) {
      console.error('Error posting to SpaceB.in:', error.message);
      console.error('Error details:', error.response.data);
    } else {
      console.error('Error posting to SpaceB.in:', error.message);
    }
  });
