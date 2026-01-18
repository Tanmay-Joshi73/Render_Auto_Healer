import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { ConfigModule } from '@nestjs/config';
import { RenderModule } from './render/render.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './Auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MorganModule, MorganInterceptor } from "nest-morgan";
@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({isGlobal:true}),
    RenderModule,
    ServicesModule,
    DatabaseModule,
    MorganModule
  ],
  controllers: [AppController],
  providers: [AppService,{
    provide: APP_INTERCEPTOR,
    useClass: MorganInterceptor("combined"),
  }
    
  ],
})
export class AppModule {}
