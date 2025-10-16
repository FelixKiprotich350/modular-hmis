import { Module, DynamicModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  static forRoot(controllers: any[] = []): DynamicModule {
    return {
      module: AppModule,
      controllers: [AppController, ...controllers],
      providers: [AppService],
    };
  }
}