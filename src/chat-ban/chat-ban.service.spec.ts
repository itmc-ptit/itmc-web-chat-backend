import { Test, TestingModule } from '@nestjs/testing';
import { ChatBanService } from './chat-ban.service';

describe('ChatBanService', () => {
  let service: ChatBanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChatBanService],
    }).compile();

    service = module.get<ChatBanService>(ChatBanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
