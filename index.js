const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;


app.get('/', (req, res) => {
    res.json({
        crunchyroll: "/cookies",
        pasteBin: "/paste?q="
    })
});
app.get('/cookies', async (req, res) => {
    const url = 'https://techhelpbd.com/en/crunchyroll/';

    axios.get(url)
        .then(response => {
            const $ = cheerio.load(response.data);
            const textareaElement = $('#techhelpbd');
            const contentToPost = textareaElement.text();


            const extension = 'none';
            const spaceBinUrl = 'https://spaceb.in/api/v1/documents';
            axios.post(spaceBinUrl, {
                    content: contentToPost,
                    extension: extension
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    const documentId = response.data.payload.id;
                    const spaceBinLink = `https://spaceb.in/${documentId}`;
                    res.status(200).json({
                        status: 'success',
                        cookies: spaceBinLink
                    });

                })
        })
        .catch(error => {
            console.error('Error fetching the website:', error);
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
                error: error
            });
        });
});

app.get('/paste', (req, res) => {
    const contentToPost = req.query.q;
    const extension = 'none';

    if(!contentToPost){
        return res.status(400).json({ error: "Please provide a query parameter 'q'" });
    }

    const spaceBinUrl = 'https://spaceb.in/api/v1/documents';

    axios.post(spaceBinUrl, {
            content: contentToPost,
            extension: extension
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            const documentId = response.data.payload.id;
            const spaceBinLink = `https://spaceb.in/${documentId}`;

            res.status(200).json({
                Document_ID: documentId,
                SpaceBinLink: spaceBinLink
            });
        })
        .catch(error => {
            if (error.response) {
                console.error('Error posting to SpaceB.in:', error);
                console.error('Error details:', error.response.data);
                res.status(500).json({
                    error: error.response
                });
            } else {
                res.status(500).json({
                    error: error.message
                });
                console.error('Error posting to SpaceB.in:', error);
            }
        });
})

app.listen(PORT, () => console.log(`Listening on port http://localhost:${PORT}`));