import { TestBed } from '@angular/core/testing';

import { TaskMockService } from './task-mock.service';

describe('TaskMockService', () => {
  let service: TaskMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
