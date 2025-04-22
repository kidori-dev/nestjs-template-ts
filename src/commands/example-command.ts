import { Command, CommandRunner } from 'nest-commander';
import { randomStr } from '../utils/helper';
import { AppInfoService } from '../modules/app-info/app-info.service';
import { AssetLogTypeEnum, TransactionTypeEnum } from '../constants/enums';

@Command({ name: `example`, description: `테스트` })
export class ExampleCommand extends CommandRunner {
  constructor(private readonly appInfoService: AppInfoService) {
    super();
  }

  async run(): Promise<void> {

  }
}
