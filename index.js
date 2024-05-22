const express = require("express");
const axios = require("axios");
const cors = require("cors");
// const { BigQuery } = require('@google-cloud/bigquery');

const app = express();
const port = 3000;

// Включення CORS для всіх запитів
app.use(cors());

// Парсинг JSON тіла запиту
app.use(express.json());

// Telegram бот токен і ID групи
const TELEGRAM_BOT_TOKEN = "7077738581:AAEqoAWJvox6ouc6foEcZNLTNWO6N8MSaNw";
const TELEGRAM_CHAT_ID = "-1001682516809";

// Конфігурація BigQuery
// const bigquery = new BigQuery({
//   projectId: 'your_project_id',
//   keyFilename: 'path_to_your_service_account_key.json',
// });

// Ім'я набору даних і таблиці в BigQuery
// const datasetId = 'your_dataset_id';
// const tableId = 'your_table_id';

// Прийом POST запитів
app.post("/webhook", async (req, res) => {
  try {
    const requestData = req.body;
    console.log("Request data:", requestData);

    // Витягування необхідних даних з тіла запиту (згідно з ТЗ)
    const {
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      fbp,
      fbc,
      ip_address,
      user_agent
    } = requestData;

    // Формування повідомлення для Telegram
    const message = `
      UTM Source: ${utm_source}
      UTM Medium: ${utm_medium}
      UTM Campaign: ${utm_campaign}
      UTM Term: ${utm_term}
      UTM Content: ${utm_content}
      FBP: ${fbp}
      FBC: ${fbc}
      IP Address: ${ip_address}
      User Agent: ${user_agent}
    `;

    // Надсилання повідомлення до Telegram
    await axios.post(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        chat_id: TELEGRAM_CHAT_ID,
        text: message
      }
    );

    // Запис даних до таблиці BigQuery
    // await bigquery.dataset(datasetId).table(tableId).insert([requestData]);

    res.status(200).send("Data received and processed successfully");
  } catch (error) {
    console.error("Error processing data:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
