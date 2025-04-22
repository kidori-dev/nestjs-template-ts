import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { IsExist } from 'src/utils/validators/is-exists.validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';

@Module({
  imports: [],
  controllers: [ExampleController],
  providers: [IsExist, IsNotExist, ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
