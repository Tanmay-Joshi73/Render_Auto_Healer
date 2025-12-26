import { ConfigurableModuleBuilder, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RegisterModule } from './register/register.module';
import { ConfigModule } from '@nestjs/config';
import { RenderModule } from './render/render.module';
@Module({
  imports: [RegisterModule,
    ConfigModule.forRoot({isGlobal:true}),
    RenderModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
