# Lambda Compra - Microservicio

Este microservicio se encarga de procesar las órdenes de los usuarios y guardar el registro de la venta en la tabla `Compras` de DynamoDB. La inserción activa un evento en *DynamoDB Streams* que posteriormente será procesado por otro microservicio.

## Pipeline CI/CD
El archivo `.github/workflows/deploy.yml` se encarga de descargar las dependencias (`npm install`), generar el archivo ZIP y subir el código directamente a la función de Lambda sin pasar por Terraform.

## Secretos Requeridos:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
