const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { randomUUID } = require("crypto");
const Sentry = require("@sentry/aws-serverless");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
Sentry.setTag("module", "compra");
Sentry.setTag("team", "backend");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = Sentry.wrapHandler(async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { user_id, product_id, cantidad, total } = body;
        
        if (!user_id || !product_id || !cantidad || !total) {
            return {
                statusCode: 400,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: "Faltan campos requeridos para la compra." })
            };
        }

        const purchaseId = randomUUID();
        
        const params = {
            TableName: process.env.TABLE_COMPRAS,
            Item: {
                purchase_id: purchaseId,
                user_id,
                product_id,
                cantidad,
                total,
                status: "COMPLETED",
                createdAt: new Date().toISOString()
            }
        };

        await docClient.send(new PutCommand(params));

        return {
            statusCode: 201,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ message: "Compra realizada con éxito.", purchase_id: purchaseId })
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ message: "Error interno del servidor." })
        };
    }
});
