import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { LoggerMiddleware } from "./logger.middleware";
import { DatabaseModule } from "./database/database.module";
import { CustomerModule } from "./customer/customer.module";

@Module({
    imports: [DatabaseModule, CustomerModule],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes("/**");
    }
}
