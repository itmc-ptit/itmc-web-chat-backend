import { Test, TestingModule } from '@nestjs/testing';
import { UserToGroupService } from './user-to-group.service';

describe('UserToGroupService', () => {
  let service: UserToGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserToGroupService],
    }).compile();

    service = module.get<UserToGroupService>(UserToGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
