import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CmsModule } from './modules/cms/cms.module';
import { AnnouncementModule } from './modules/announcements/announcement.module';
import { MockModule } from './mocks/mock.module';
import 'crypto';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('DB_HOST'),
          port: configService.get<number>('DB_PORT'),
          username: configService.get<string>('DB_USERNAME'),
          password: configService.get<string>('DB_PASSWORD'),
          database: configService.get<string>('DB_DATABASE'),
          entities: [],
          synchronize: configService.get<string>('NODE_ENV') !== 'production',
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };
      },
      inject: [ConfigService],
    }),
    CmsModule,
    AnnouncementModule,
    MockModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
