import { Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoffeesModule } from './coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { IamModule } from './iam/iam.module';
import Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema:Joi.object({
        DATABASE_HOST:Joi.required(),
        DATABASE_PORT:Joi.number().default(5432),
        DATABASE_USER:Joi.required(),
        DATABASE_PASSWORD:Joi.required(),
        DATABASE_NAME:Joi.required(),
        JWT_SECRET:Joi.required(),
      })
    }),
    CoffeesModule,
    TypeOrmModule.forRootAsync({
      useFactory: ()=>({
        type:'postgres',
        host: process.env.DATABASE_HOST,
        port: Number(process.env.DATABASE_PORT),
        username:process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        autoLoadEntities:true,
        synchronize:true,
      }),
    }),
    UsersModule,
    IamModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
