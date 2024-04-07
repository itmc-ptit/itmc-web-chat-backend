import { Test, TestingModule } from '@nestjs/testing';
import { UserToGroupController } from './user-to-group.controller';
import { UserToGroupService } from './user-to-group.service';

describe('UserToGroupController', () => {
  let controller: UserToGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserToGroupController],
      providers: [UserToGroupService],
    }).compile();

    controller = module.get<UserToGroupController>(UserToGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
