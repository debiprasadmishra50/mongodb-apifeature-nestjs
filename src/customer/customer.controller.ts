import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Res,
    UseFilters,
    Query,
} from "@nestjs/common";
import { Response } from "express";
import { CustomerService } from "./customer.service";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import { HttpExceptionFilter } from "./filters/httpexception.filter";
import { ValidationPipe } from "./pipes/class-validation.pipe";

@Controller("customers")
@UseFilters(HttpExceptionFilter)
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    async create(@Body(ValidationPipe) createCustomerDto: CreateCustomerDto) {
        return this.customerService.createCustomer(createCustomerDto);
    }

    @Get()
    async findAll(@Query() query: any, @Res() res: Response) {
        const data = await this.customerService.findAllCustomers(query);

        res.status(200).json({
            status: "success",
            results: data.length,
            data,
        });
    }

    @Get(":id")
    async findOne(@Param("id") id: string) {
        return this.customerService.findOneCustomer(id);
    }

    @Patch(":id")
    async update(@Param("id") id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
        return this.customerService.updateCustomer(id, updateCustomerDto);
    }

    @Delete(":id")
    async remove(@Param("id") id: string) {
        return this.customerService.removeCustomer(id);
    }
}
