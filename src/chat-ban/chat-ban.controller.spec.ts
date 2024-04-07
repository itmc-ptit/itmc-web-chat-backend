import { Test, TestingModule } from '@nestjs/testing';
import { ChatBanController } from './chat-ban.controller';
import { ChatBanService } from './chat-ban.service';

describe('ChatBanController', () => {
  let controller: ChatBanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChatBanController],
      providers: [ChatBanService],
    }).compile();

    controller = module.get<ChatBanController>(ChatBanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
