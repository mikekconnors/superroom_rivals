import json
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('rivals')

# Helper function to convert Decimal types to standard Python types
def decimal_default(obj):
    if isinstance(obj, Decimal):
        return float(obj)
    raise TypeError

def lambda_handler(event, context):
    try:
        # Log the event object to CloudWatch
        print("Received event:", json.dumps(event, indent=2))
        
        # Handle preflight OPTIONS request
        if event['httpMethod'] == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
                'body': json.dumps({'message': 'CORS preflight request successful'})
            }

        # Log the body as received
        print("body as received:", event['body'])
        body = json.loads(event['body'])
        name = body['name']
        type = body['type']

        # Log the parsed body
        print("Parsed body:", body)
        print("Name:", name)
        print("Type:", type)

        # Update the DynamoDB table
        if type == 'svp':
            update_expression = "set svp = if_not_exists(svp, :start) + :inc"
        elif type == 'mvp':
            update_expression = "set mvp = if_not_exists(mvp, :start) + :inc"
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Access-Control-Allow-Origin': '*',
                },
                'body': json.dumps({'message': 'Invalid type'})
            }

        table.update_item(
            Key={'name': name},
            UpdateExpression=update_expression,
            ExpressionAttributeValues={
                ':start': Decimal(0),
                ':inc': Decimal(1)
            },
            ReturnValues="UPDATED_NEW"
        )

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'message': 'Item updated successfully'})
        }

    except Exception as e:
        # Log the error message
        print("Error:", str(e))
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
            },
            'body': json.dumps({'error': str(e)})
        }
