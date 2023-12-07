import { APIGatewayEvent } from 'aws-lambda';

interface AWSObject<Body, Query> extends APIGatewayEvent {
    body: Body | any,
    queryStringParameters: Query | any
}

export interface IAWSRequest<Body, Query> {
    aws: AWSObject<Body, Query>
}