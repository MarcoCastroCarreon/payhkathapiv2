import { APIGatewayEvent } from 'aws-lambda';

interface AWSObject extends APIGatewayEvent {}

export interface IAWSRequest {
    aws: AWSObject
}