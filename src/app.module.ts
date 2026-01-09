import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 
import { ConfigModule } from '@nestjs/config';
import { RenderModule } from './render/render.module';
import { ServicesModule } from './services/services.module';
import { AuthModule } from './Auth/auth.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [AuthModule,
    ConfigModule.forRoot({isGlobal:true}),
    RenderModule,
    ServicesModule,
    DatabaseModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
