import { APIGatewayEvent } from 'aws-lambda';

interface AWSObject<T> extends APIGatewayEvent {
    body: T | any
}

export interface IAWSRequest<T> {
    aws: AWSObject<T>
}