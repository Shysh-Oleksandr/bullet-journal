import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CustomLabel, DEFAULT_LABELS, LabelFor } from './custom-label.model';
import { CreateCustomLabelDto } from './dto/create-custom-label.dto';
import { UpdateCustomLabelDto } from './dto/update-custom-label.dto';

@Injectable()
export class CustomLabelsService {
  constructor(
    @InjectModel(CustomLabel.name) private customLabelModel: Model<CustomLabel>,
  ) {}

  async create(
    createCustomLabelDto: CreateCustomLabelDto,
    userId: string,
  ): Promise<CustomLabel> {
    const newCustomLabel = new this.customLabelModel({
      ...createCustomLabelDto,
      user: new Types.ObjectId(userId),
    });

    return newCustomLabel.save();
  }

  async createDefaultLabels(userId: string): Promise<CustomLabel[]> {
    const defaultLabels = DEFAULT_LABELS.map((label) => ({
      ...label,
      user: new Types.ObjectId(userId),
    }));

    return this.customLabelModel.insertMany(defaultLabels);
  }

  async findAll(userId: string, labelFor?: LabelFor): Promise<CustomLabel[]> {
    const query = labelFor ? { user: userId, labelFor } : { user: userId };

    const labels = await this.customLabelModel.find(query).exec();

    // Sort by createdAt in descending order (newest first)
    // Using type assertion because Mongoose adds timestamps but TypeScript doesn't know about them
    return labels.sort((a, b) => {
      const aTime =
        (a as any).createdAt instanceof Date
          ? (a as any).createdAt.getTime()
          : 0;
      const bTime =
        (b as any).createdAt instanceof Date
          ? (b as any).createdAt.getTime()
          : 0;
      return bTime - aTime;
    });
  }

  async findOne(id: string): Promise<CustomLabel | null> {
    return this.customLabelModel.findById(id).exec();
  }

  async update(
    id: string,
    updateCustomLabelDto: UpdateCustomLabelDto,
  ): Promise<CustomLabel | null> {
    return this.customLabelModel
      .findByIdAndUpdate(id, updateCustomLabelDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.customLabelModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
