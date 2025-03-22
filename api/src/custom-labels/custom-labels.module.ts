import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomLabelsController } from './custom-labels.controller';
import { CustomLabelsService } from './custom-labels.service';
import { CustomLabel, CustomLabelSchema } from './custom-label.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CustomLabel.name, schema: CustomLabelSchema },
    ]),
  ],
  controllers: [CustomLabelsController],
  providers: [CustomLabelsService],
  exports: [CustomLabelsService],
})
export class CustomLabelsModule {}
