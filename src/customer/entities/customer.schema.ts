import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import * as mongoose from "mongoose";

export type CustomerDocument = Customer & mongoose.Document;

@Schema({ timestamps: true })
export class Customer {
    @Prop({ type: String, trim: true })
    firstName: string;

    @Prop({ type: String, trim: true })
    lastName: string;

    @Prop({ type: String, trim: true, unique: true })
    email: string;

    @Prop({ type: String, trim: true })
    phone: string;

    @Prop({ type: String, trim: true })
    address: string;

    @Prop({ type: String, trim: true })
    description: string;

    @Prop({ type: Date, default: Date.now() })
    createdAt: Date;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
